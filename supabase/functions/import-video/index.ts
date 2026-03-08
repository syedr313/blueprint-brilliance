import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function parseUrl(url: string): { type: "video" | "playlist"; videoId?: string; playlistId?: string } | null {
  // Playlist URL
  const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  const videoMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  const plainMatch = url.match(/^([a-zA-Z0-9_-]{11})$/);

  if (playlistMatch) {
    return { type: "playlist", playlistId: playlistMatch[1], videoId: videoMatch?.[1] };
  }
  if (videoMatch) {
    return { type: "video", videoId: videoMatch[1] };
  }
  if (plainMatch) {
    return { type: "video", videoId: plainMatch[1] };
  }
  return null;
}

function parseXmlCaptions(xml: string): { text: string; start: number; dur: number }[] {
  const matches = xml.matchAll(/<text start="([^"]*)" dur="([^"]*)"[^>]*>([\s\S]*?)<\/text>/g);
  const segments: { text: string; start: number; dur: number }[] = [];
  for (const match of matches) {
    const text = match[3]
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n/g, " ")
      .replace(/<[^>]*>/g, "").trim();
    if (text) {
      segments.push({ text, start: parseFloat(match[1]) || 0, dur: parseFloat(match[2]) || 0 });
    }
  }
  return segments;
}

async function fetchVideoTitle(videoId: string): Promise<string> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (res.ok) {
      const data = await res.json();
      return data.title || "YouTube Video";
    }
  } catch {}
  return "YouTube Video";
}

async function fetchTranscriptSegments(videoId: string): Promise<{ segments: { text: string; start: number; dur: number }[]; trackKind: string; langCode: string } | null> {
  // Try manual captions first
  const langs = ["en", "en-US", "en-GB"];
  for (const lang of langs) {
    try {
      const url = `https://www.youtube.com/api/timedtext?lang=${lang}&v=${videoId}`;
      const res = await fetch(url);
      if (res.ok) {
        const xml = await res.text();
        if (xml.includes("<text")) {
          const segments = parseXmlCaptions(xml);
          if (segments.length > 0) return { segments, trackKind: "manual", langCode: lang };
        }
      }
    } catch {}
  }

  // Try ASR captions
  try {
    const url = `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}&kind=asr`;
    const res = await fetch(url);
    if (res.ok) {
      const xml = await res.text();
      if (xml.includes("<text")) {
        const segments = parseXmlCaptions(xml);
        if (segments.length > 0) return { segments, trackKind: "asr", langCode: "en" };
      }
    }
  } catch {}

  // Try caption list
  try {
    const listUrl = `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
    const listRes = await fetch(listUrl);
    if (listRes.ok) {
      const listXml = await listRes.text();
      const trackMatches = listXml.matchAll(/lang_code="([^"]+)"/g);
      for (const tm of trackMatches) {
        const langCode = tm[1];
        const capUrl = `https://www.youtube.com/api/timedtext?lang=${langCode}&v=${videoId}`;
        const capRes = await fetch(capUrl);
        if (capRes.ok) {
          const xml = await capRes.text();
          if (xml.includes("<text")) {
            const segments = parseXmlCaptions(xml);
            if (segments.length > 0) return { segments, trackKind: "unknown", langCode };
          }
        }
      }
    }
  } catch {}

  // Try Innertube
  try {
    const playerRes = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "com.google.android.youtube/19.09.37 (Linux; U; Android 11) gzip" },
      body: JSON.stringify({
        context: { client: { clientName: "ANDROID", clientVersion: "19.09.37", androidSdkVersion: 30, hl: "en", gl: "US" } },
        videoId,
      }),
    });
    const playerData = await playerRes.json();
    const tracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (tracks?.length) {
      const track = tracks.find((t: any) => t.languageCode === "en") || tracks[0];
      if (track?.baseUrl) {
        const capRes = await fetch(track.baseUrl);
        const xml = await capRes.text();
        if (xml.includes("<text")) {
          const segments = parseXmlCaptions(xml);
          if (segments.length > 0) return { segments, trackKind: track.kind || "unknown", langCode: track.languageCode || "en" };
        }
      }
    }
  } catch {}

  return null;
}

async function fetchPlaylistItems(playlistId: string): Promise<string[]> {
  // Use Innertube browse API to get playlist items (no API key needed)
  try {
    const res = await fetch("https://www.youtube.com/youtubei/v1/browse?prettyPrint=false", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: { client: { clientName: "WEB", clientVersion: "2.20240101.00.00", hl: "en", gl: "US" } },
        browseId: `VL${playlistId}`,
      }),
    });
    const data = await res.json();
    const contents = data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents || [];
    const videoIds: string[] = [];
    for (const item of contents) {
      const vid = item?.playlistVideoRenderer?.videoId;
      if (vid) videoIds.push(vid);
    }
    return videoIds;
  } catch (e) {
    console.error("Playlist fetch failed:", e);
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url) throw new Error("URL is required");

    const parsed = parseUrl(url.trim());
    if (!parsed) throw new Error("Invalid YouTube URL");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // Create study session
    const { data: session, error: sessionErr } = await sb.from("study_sessions").insert({
      title: "Processing...",
      session_type: parsed.type,
      playlist_id: parsed.playlistId || null,
      status: "extracting_transcript",
    }).select().single();
    if (sessionErr) throw sessionErr;

    // Get video IDs
    let videoIds: string[] = [];
    if (parsed.type === "playlist" && parsed.playlistId) {
      videoIds = await fetchPlaylistItems(parsed.playlistId);
      if (videoIds.length === 0 && parsed.videoId) videoIds = [parsed.videoId];
    } else if (parsed.videoId) {
      videoIds = [parsed.videoId];
    }

    if (videoIds.length === 0) {
      await sb.from("study_sessions").update({ status: "failed", title: "No videos found" }).eq("id", session.id);
      throw new Error("Could not find any videos");
    }

    // Process each video
    const processedVideos: any[] = [];
    let sessionTitle = "";

    for (let i = 0; i < videoIds.length; i++) {
      const vid = videoIds[i];
      const title = await fetchVideoTitle(vid);
      if (i === 0) sessionTitle = parsed.type === "playlist" ? `Playlist: ${title}` : title;

      // Insert video record
      const { data: videoRec, error: videoErr } = await sb.from("study_session_videos").insert({
        session_id: session.id,
        video_id: vid,
        title,
        thumbnail_url: `https://img.youtube.com/vi/${vid}/mqdefault.jpg`,
        position: i,
        status: "extracting",
      }).select().single();
      if (videoErr) { console.error("Video insert error:", videoErr); continue; }

      // Fetch transcript
      const transcriptData = await fetchTranscriptSegments(vid);
      if (transcriptData && transcriptData.segments.length > 0) {
        // Create track
        const { data: track, error: trackErr } = await sb.from("transcript_tracks").insert({
          video_id: videoRec.id,
          language_code: transcriptData.langCode,
          track_kind: transcriptData.trackKind,
        }).select().single();

        if (!trackErr && track) {
          // Merge small segments into readable chunks
          const mergedSegments = mergeSegments(transcriptData.segments);
          
          // Insert segments in batches
          const segmentRows = mergedSegments.map((seg, idx) => ({
            track_id: track.id,
            segment_index: idx,
            start_seconds: seg.start,
            duration_seconds: seg.dur,
            text: seg.text,
          }));

          for (let b = 0; b < segmentRows.length; b += 100) {
            const batch = segmentRows.slice(b, b + 100);
            await sb.from("transcript_segments").insert(batch);
          }

          await sb.from("study_session_videos").update({ status: "ready" }).eq("id", videoRec.id);
          
          // Auto-generate quiz
          const fullText = mergedSegments.map(s => s.text).join(" ");
          await generateAndStoreQuiz(sb, videoRec.id, title, fullText);
        }
      } else {
        await sb.from("study_session_videos").update({ status: "no_captions" }).eq("id", videoRec.id);
      }

      processedVideos.push({ id: videoRec.id, videoId: vid, title, hasTranscript: !!transcriptData });
    }

    // Update session
    await sb.from("study_sessions").update({
      title: sessionTitle,
      status: "ready",
    }).eq("id", session.id);

    return new Response(JSON.stringify({ sessionId: session.id, videos: processedVideos }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("import-video error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function mergeSegments(raw: { text: string; start: number; dur: number }[]): { text: string; start: number; dur: number }[] {
  const merged: { text: string; start: number; dur: number }[] = [];
  let current = { text: "", start: 0, dur: 0 };
  
  for (const seg of raw) {
    if (!current.text) {
      current = { ...seg };
    } else if (current.text.length + seg.text.length < 200) {
      current.text += " " + seg.text;
      current.dur = (seg.start + seg.dur) - current.start;
    } else {
      merged.push({ ...current });
      current = { ...seg };
    }
  }
  if (current.text) merged.push(current);
  return merged;
}

async function generateAndStoreQuiz(sb: any, videoDbId: string, title: string, transcript: string) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return;

  try {
    // Split into chunks for better quiz generation
    const words = transcript.split(/\s+/);
    const chunkSize = 2500;
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(" "));
    }

    const mainChunk = chunks[0] || transcript.slice(0, 12000);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a quiz generator. Create exactly 8 questions from the provided transcript. Questions MUST be about specific facts, concepts, examples, or explanations explicitly mentioned in the transcript. Include mixed types: multiple_choice, true_false, fill_blank.

Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "...",
      "type": "multiple_choice",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A",
      "explanation": "...",
      "difficulty": "easy|medium|hard",
      "transcript_reference_start": 0,
      "transcript_reference_end": 120
    }
  ]
}`
          },
          {
            role: "user",
            content: `Video title: "${title}"\n\nTranscript:\n${mainChunk}`
          }
        ],
      }),
    });

    if (!response.ok) return;

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return;

    const quiz = JSON.parse(jsonMatch[0]);

    await sb.from("transcript_quizzes").insert({
      video_id: videoDbId,
      quiz_mode: "quick",
      questions: quiz.questions || [],
    });
  } catch (e) {
    console.error("Quiz generation failed:", e);
  }
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function parseXmlCaptions(xml: string): string {
  const matches = xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g);
  const segments: string[] = [];
  for (const match of matches) {
    const text = match[1]
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n/g, " ")
      .replace(/<[^>]*>/g, "")
      .trim();
    if (text) segments.push(text);
  }
  return segments.join(" ");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId } = await req.json();

    if (!videoId) {
      return new Response(
        JSON.stringify({ error: "videoId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get title from oEmbed (always works, no auth needed)
    let title = "YouTube Video";
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        title = oembedData.title || title;
      }
    } catch (e) {
      console.error("oEmbed failed:", e);
    }

    let transcript = "";

    // Method 1: Direct timedtext API (works for many videos with captions)
    const langs = ["en", "en-US", "en-GB"];
    for (const lang of langs) {
      if (transcript) break;
      try {
        const url = `https://www.youtube.com/api/timedtext?lang=${lang}&v=${videoId}`;
        const res = await fetch(url);
        if (res.ok) {
          const xml = await res.text();
          if (xml.includes("<text")) {
            transcript = parseXmlCaptions(xml);
            console.log(`Got transcript via timedtext (${lang}), length: ${transcript.length}`);
          }
        }
      } catch (e) {
        console.error(`timedtext (${lang}) failed:`, e);
      }
    }

    // Method 2: Try auto-generated captions
    if (!transcript) {
      try {
        const url = `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}&kind=asr`;
        const res = await fetch(url);
        if (res.ok) {
          const xml = await res.text();
          if (xml.includes("<text")) {
            transcript = parseXmlCaptions(xml);
            console.log(`Got transcript via timedtext (asr), length: ${transcript.length}`);
          }
        }
      } catch (e) {
        console.error("timedtext (asr) failed:", e);
      }
    }

    // Method 3: Try fetching caption list then getting the first available
    if (!transcript) {
      try {
        const listUrl = `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
        const listRes = await fetch(listUrl);
        if (listRes.ok) {
          const listXml = await listRes.text();
          console.log("Caption list response:", listXml.slice(0, 500));
          // Parse available tracks
          const trackMatches = listXml.matchAll(/lang_code="([^"]+)"/g);
          for (const tm of trackMatches) {
            if (transcript) break;
            const langCode = tm[1];
            const capUrl = `https://www.youtube.com/api/timedtext?lang=${langCode}&v=${videoId}`;
            const capRes = await fetch(capUrl);
            if (capRes.ok) {
              const xml = await capRes.text();
              if (xml.includes("<text")) {
                transcript = parseXmlCaptions(xml);
                console.log(`Got transcript via list (${langCode}), length: ${transcript.length}`);
              }
            }
          }
        }
      } catch (e) {
        console.error("Caption list failed:", e);
      }
    }

    // Method 4: Innertube player API with WEB client
    if (!transcript) {
      try {
        const playerRes = await fetch(
          "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "com.google.android.youtube/19.09.37 (Linux; U; Android 11) gzip",
            },
            body: JSON.stringify({
              context: {
                client: {
                  clientName: "ANDROID",
                  clientVersion: "19.09.37",
                  androidSdkVersion: 30,
                  hl: "en",
                  gl: "US",
                },
              },
              videoId,
            }),
          }
        );
        const playerData = await playerRes.json();
        const tracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        console.log(`Innertube ANDROID tracks: ${tracks?.length || 0}`);
        if (tracks?.length) {
          const track = tracks.find((t: any) => t.languageCode === "en") || tracks[0];
          if (track?.baseUrl) {
            const capRes = await fetch(track.baseUrl);
            const xml = await capRes.text();
            if (xml.includes("<text")) {
              transcript = parseXmlCaptions(xml);
              console.log(`Got transcript via innertube, length: ${transcript.length}`);
            }
          }
        }
      } catch (e) {
        console.error("Innertube failed:", e);
      }
    }

    console.log(`Final result - title: "${title}", hasTranscript: ${!!transcript}, length: ${transcript.length}`);

    return new Response(
      JSON.stringify({
        transcript: transcript || null,
        title,
        hasTranscript: !!transcript,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("fetch-transcript error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

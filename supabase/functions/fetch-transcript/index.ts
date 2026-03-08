import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function fetchTranscriptFromPage(videoId: string): Promise<{ title: string; transcript: string | null }> {
  // Fetch the YouTube watch page
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const pageRes = await fetch(watchUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  const html = await pageRes.text();

  // Extract title
  let title = "";
  const titleMatch = html.match(/"title":"(.*?)"/);
  if (titleMatch) {
    title = JSON.parse(`"${titleMatch[1]}"`);
  } else {
    const ogMatch = html.match(/<meta name="title" content="(.*?)"/);
    if (ogMatch) title = ogMatch[1];
  }

  // Try to find captionTracks in the initial player response
  // The data is embedded in the page as ytInitialPlayerResponse or inside a script
  let transcript = "";

  // Method 1: Look for captionTracks in the page source
  const captionTracksMatch = html.match(/"captionTracks":(\[.*?\])/);
  if (captionTracksMatch) {
    try {
      const tracks = JSON.parse(captionTracksMatch[1]);
      const englishTrack =
        tracks.find((t: any) => t.languageCode === "en") ||
        tracks.find((t: any) => t.languageCode?.startsWith("en")) ||
        tracks[0];

      if (englishTrack?.baseUrl) {
        const decoded = englishTrack.baseUrl.replace(/\\u0026/g, "&");
        const captionRes = await fetch(decoded);
        const xml = await captionRes.text();
        transcript = parseXmlCaptions(xml);
      }
    } catch (e) {
      console.error("Method 1 (captionTracks) failed:", e);
    }
  }

  // Method 2: Look for timedtext URL pattern
  if (!transcript) {
    const timedtextMatch = html.match(/https:\/\/www\.youtube\.com\/api\/timedtext[^"\\]*/);
    if (timedtextMatch) {
      try {
        const url = timedtextMatch[0].replace(/\\u0026/g, "&");
        const captionRes = await fetch(url);
        const xml = await captionRes.text();
        transcript = parseXmlCaptions(xml);
      } catch (e) {
        console.error("Method 2 (timedtext URL) failed:", e);
      }
    }
  }

  // Method 3: Use innertube player API
  if (!transcript) {
    try {
      const playerRes = await fetch(
        "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            context: {
              client: {
                clientName: "ANDROID",
                clientVersion: "19.09.37",
                androidSdkVersion: 30,
                hl: "en",
              },
            },
            videoId,
          }),
        }
      );
      const playerData = await playerRes.json();
      if (!title && playerData?.videoDetails?.title) {
        title = playerData.videoDetails.title;
      }
      const tracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
      if (tracks?.length) {
        const track =
          tracks.find((t: any) => t.languageCode === "en") ||
          tracks.find((t: any) => t.languageCode?.startsWith("en")) ||
          tracks[0];
        if (track?.baseUrl) {
          const captionRes = await fetch(track.baseUrl);
          const xml = await captionRes.text();
          transcript = parseXmlCaptions(xml);
        }
      }
    } catch (e) {
      console.error("Method 3 (innertube ANDROID) failed:", e);
    }
  }

  return { title, transcript: transcript || null };
}

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

    const { title, transcript } = await fetchTranscriptFromPage(videoId);

    return new Response(
      JSON.stringify({
        transcript,
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

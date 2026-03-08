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

async function tryInnertubeClient(videoId: string, clientName: string, clientVersion: string, extra: Record<string, unknown> = {}): Promise<{ title: string; transcript: string; } | null> {
  try {
    const res = await fetch(
      "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName,
              clientVersion,
              ...extra,
            },
          },
          videoId,
        }),
      }
    );
    const data = await res.json();
    const title = data?.videoDetails?.title || "";
    const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    console.log(`[${clientName}] title: "${title}", tracks: ${tracks?.length || 0}`);

    if (tracks?.length) {
      const track =
        tracks.find((t: any) => t.languageCode === "en") ||
        tracks.find((t: any) => t.languageCode?.startsWith("en")) ||
        tracks[0];
      if (track?.baseUrl) {
        const captionRes = await fetch(track.baseUrl);
        const xml = await captionRes.text();
        const transcript = parseXmlCaptions(xml);
        if (transcript) return { title, transcript };
      }
    }
    return title ? { title, transcript: "" } : null;
  } catch (e) {
    console.error(`[${clientName}] error:`, e);
    return null;
  }
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

    let title = "";
    let transcript = "";

    // Try multiple innertube client types
    const clients = [
      { name: "WEB", version: "2.20240101.00.00", extra: { hl: "en" } },
      { name: "ANDROID", version: "19.09.37", extra: { androidSdkVersion: 30, hl: "en" } },
      { name: "IOS", version: "19.09.3", extra: { hl: "en" } },
    ];

    for (const c of clients) {
      const result = await tryInnertubeClient(videoId, c.name, c.version, c.extra);
      if (result) {
        if (!title && result.title) title = result.title;
        if (result.transcript) {
          transcript = result.transcript;
          break;
        }
      }
    }

    // Fallback: scrape the watch page for embedded caption data
    if (!transcript) {
      try {
        const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Cookie": "CONSENT=PENDING+999",
          },
        });
        const html = await pageRes.text();

        // Try to get title from page if we don't have it
        if (!title) {
          const titleMatch = html.match(/"title"\s*:\s*"((?:[^"\\]|\\.)*)"/);
          if (titleMatch) {
            try { title = JSON.parse(`"${titleMatch[1]}"`); } catch { title = titleMatch[1]; }
          }
        }

        // Look for playerCaptionsTracklistRenderer in the page
        const captionMatch = html.match(/"playerCaptionsTracklistRenderer"\s*:\s*\{[^}]*"captionTracks"\s*:\s*(\[[\s\S]*?\])/);
        if (captionMatch) {
          console.log("Found captionTracks in page HTML");
          const tracks = JSON.parse(captionMatch[1]);
          const track = tracks.find((t: any) => t.languageCode === "en") || tracks[0];
          if (track?.baseUrl) {
            const url = track.baseUrl.replace(/\\u0026/g, "&");
            const captionRes = await fetch(url);
            const xml = await captionRes.text();
            transcript = parseXmlCaptions(xml);
          }
        }
      } catch (e) {
        console.error("Page scrape fallback failed:", e);
      }
    }

    return new Response(
      JSON.stringify({
        transcript: transcript || null,
        title: title || "YouTube Video",
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

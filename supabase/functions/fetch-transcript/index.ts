import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    // Try to fetch captions from YouTube's timedtext API
    // This works for videos with auto-generated or manual captions
    const captionUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const pageResponse = await fetch(captionUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const pageHtml = await pageResponse.text();

    // Extract captions URL from the page
    const captionTrackMatch = pageHtml.match(/"captionTracks":\s*(\[.*?\])/);

    let transcript = "";

    if (captionTrackMatch) {
      try {
        const tracks = JSON.parse(captionTrackMatch[1]);
        const englishTrack =
          tracks.find((t: any) => t.languageCode === "en") || tracks[0];

        if (englishTrack?.baseUrl) {
          const captionResponse = await fetch(englishTrack.baseUrl);
          const captionXml = await captionResponse.text();

          // Parse XML captions to plain text
          const textMatches = captionXml.matchAll(/<text[^>]*>(.*?)<\/text>/gs);
          const segments: string[] = [];
          for (const match of textMatches) {
            const text = match[1]
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/<[^>]*>/g, "");
            segments.push(text);
          }
          transcript = segments.join(" ");
        }
      } catch (e) {
        console.error("Error parsing captions:", e);
      }
    }

    // Extract video title
    const titleMatch = pageHtml.match(/<title>(.*?)<\/title>/);
    const title = titleMatch
      ? titleMatch[1].replace(" - YouTube", "").trim()
      : "";

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

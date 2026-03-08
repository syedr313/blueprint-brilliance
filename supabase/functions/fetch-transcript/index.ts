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

    // Step 1: Use Innertube player API to get caption track URLs
    const playerResponse = await fetch(
      "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: {
            client: {
              clientName: "WEB",
              clientVersion: "2.20240101.00.00",
            },
          },
          videoId,
        }),
      }
    );

    const playerData = await playerResponse.json();

    const title =
      playerData?.videoDetails?.title || "";

    const captionTracks =
      playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    let transcript = "";

    if (captionTracks && captionTracks.length > 0) {
      // Prefer English, fallback to first track
      const englishTrack =
        captionTracks.find((t: any) => t.languageCode === "en") ||
        captionTracks.find((t: any) => t.languageCode?.startsWith("en")) ||
        captionTracks[0];

      if (englishTrack?.baseUrl) {
        // Fetch the XML captions
        const captionRes = await fetch(englishTrack.baseUrl);
        const captionXml = await captionRes.text();

        // Parse XML to plain text
        const textMatches = captionXml.matchAll(
          /<text start="([^"]*)" dur="([^"]*)"[^>]*>([\s\S]*?)<\/text>/g
        );
        const segments: string[] = [];
        for (const match of textMatches) {
          const text = match[3]
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/<[^>]*>/g, "")
            .trim();
          if (text) segments.push(text);
        }
        transcript = segments.join(" ");
      }
    }

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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { videoDbId, mode = "quick" } = await req.json();
    if (!videoDbId) throw new Error("videoDbId is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Get video info
    const { data: video } = await sb.from("study_session_videos").select("*").eq("id", videoDbId).single();
    if (!video) throw new Error("Video not found");

    // Get transcript
    const { data: tracks } = await sb.from("transcript_tracks").select("id").eq("video_id", videoDbId).eq("is_active", true);
    if (!tracks?.length) throw new Error("No transcript available");

    const { data: segments } = await sb.from("transcript_segments")
      .select("text, start_seconds, duration_seconds, segment_index")
      .eq("track_id", tracks[0].id)
      .order("segment_index", { ascending: true });

    if (!segments?.length) throw new Error("No transcript segments");

    const fullText = segments.map(s => s.text).join(" ");
    const questionCount = mode === "deep" ? 15 : 8;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a quiz generator. Create exactly ${questionCount} questions from the provided video transcript. Questions MUST test understanding of specific facts, concepts, and explanations from the transcript ONLY.

Include mixed types: multiple_choice, true_false, fill_blank.

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
          { role: "user", content: `Video: "${video.title}"\n\nTranscript:\n${fullText.slice(0, 15000)}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited. Try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Payment required." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse quiz");

    const quiz = JSON.parse(jsonMatch[0]);

    // Store quiz
    const { data: quizRec, error: quizErr } = await sb.from("transcript_quizzes").insert({
      video_id: videoDbId,
      quiz_mode: mode,
      questions: quiz.questions || [],
    }).select().single();

    if (quizErr) throw quizErr;

    return new Response(JSON.stringify({ quiz: quizRec }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-study-quiz error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

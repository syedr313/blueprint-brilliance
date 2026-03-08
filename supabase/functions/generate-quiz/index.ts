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
    const { videoTitle, transcript, timeRange } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const hasTranscript = !!transcript && transcript.trim().length > 50;

    const systemPrompt = hasTranscript
      ? `You are a quiz generator. Create exactly 5 multiple-choice questions based STRICTLY on the content discussed in the provided video transcript. Every question MUST be about specific facts, concepts, examples, or explanations explicitly mentioned in the transcript. Do NOT create generic textbook questions — only test what was actually said in this video.

Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation referencing what was said in the video"
    }
  ]
}`
      : `You are a quiz generator. The user is watching a video titled "${videoTitle}". Based on this title, determine the EXACT topic and create 5 detailed, specific multiple-choice questions about that subject matter.

For example:
- If the title mentions "Python", create questions about Python programming concepts (variables, loops, functions, data types, etc.)
- If it mentions "Machine Learning", ask about ML concepts
- If it mentions a specific framework or tool, ask about that

Questions must be educational, specific to the topic, and test real knowledge. Do NOT ask about YouTube, video production, or generic questions.

Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Clear explanation of the correct answer"
    }
  ]
}`;

    const userPrompt = hasTranscript
      ? `Here is the transcript of a video titled "${videoTitle || "Unknown"}":
${timeRange ? `(Time range: ${timeRange})\n` : ""}
---
${transcript.slice(0, 12000)}
---

Create 5 quiz questions based ONLY on what is discussed in this transcript.`
      : `Create 5 knowledge-testing quiz questions specifically about the topic of this video: "${videoTitle}". The questions should test real understanding of the subject matter covered in a video with this title. Make them educational and specific — not generic.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse quiz from AI response");
    }

    const quiz = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(quiz), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-quiz error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

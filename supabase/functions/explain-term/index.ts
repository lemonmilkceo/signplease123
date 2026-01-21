import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExplainInput {
  term: string;
  context?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { term, context }: ExplainInput = await req.json();

    if (!term) {
      return new Response(JSON.stringify({ error: "Term is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // OpenAI API 호출
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `당신은 친절한 노동법 전문가입니다. 
            아르바이트생이 이해할 수 있도록 쉬운 말로 설명해주세요.
            - 2-3문장으로 간결하게
            - 어려운 법률 용어는 피하고
            - 실제 예시를 들어 설명`,
          },
          {
            role: "user",
            content: context
              ? `근로계약서에서 "${term}"이라는 용어가 나왔어요. 맥락: ${context}. 이게 무슨 뜻인가요?`
              : `근로계약서에서 "${term}"이라는 용어가 나왔어요. 이게 무슨 뜻인가요?`,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    const aiResult = await openaiResponse.json();
    const explanation = aiResult.choices?.[0]?.message?.content || "설명을 생성할 수 없습니다.";

    return new Response(JSON.stringify({ term, explanation }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SupportInput {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] }: SupportInput = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
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
            content: `당신은 '싸인해주세요' 서비스의 AI 고객지원 담당자입니다.
            
            서비스 소개:
            - AI 기반 표준근로계약서 작성 및 전자서명 서비스
            - 사장님과 아르바이트생 모두 사용 가능
            - 크레딧으로 계약서 작성, AI 법률 검토 이용 가능
            
            답변 원칙:
            - 친절하고 명확하게 답변
            - 모르는 내용은 고객센터 연락 안내 (support@signplease.kr)
            - 법률 자문은 전문가 상담 권유`,
          },
          ...conversationHistory,
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const aiResult = await openaiResponse.json();
    const reply = aiResult.choices?.[0]?.message?.content || "죄송합니다. 답변을 생성할 수 없습니다.";

    return new Response(JSON.stringify({ reply }), {
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

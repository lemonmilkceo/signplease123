import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPreFlight, jsonResponse, errorResponse, ERROR_MESSAGES } from "../_shared/cors.ts";
import { rateLimiters, createRateLimitResponse } from "../_shared/rate-limiter.ts";

interface ExplainInput {
  term: string;
  context?: string;
  sessionId?: string;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return handleCorsPreFlight(origin);
  }

  try {
    const { term, context, sessionId }: ExplainInput = await req.json();

    if (!term?.trim()) {
      return errorResponse("용어를 입력해주세요.", 400, origin);
    }

    // Rate Limiting
    const identifier = sessionId || req.headers.get("x-forwarded-for") || "anonymous";
    const rateLimitResult = rateLimiters.general.check(identifier);
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult, corsHeaders);
    }

    // OpenAI API Key 확인
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY is not configured");
      return errorResponse("AI 서비스가 구성되지 않았습니다.", 500, origin);
    }

    // OpenAI API 호출
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
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

    // OpenAI API 에러 핸들링
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error("OpenAI API Error:", openaiResponse.status, errorData);
      
      if (openaiResponse.status === 429) {
        return errorResponse(ERROR_MESSAGES.AI_RATE_LIMITED, 503, origin);
      }
      
      return errorResponse(ERROR_MESSAGES.AI_ERROR, 500, origin);
    }

    const aiResult = await openaiResponse.json();
    const explanation = aiResult.choices?.[0]?.message?.content || "설명을 생성할 수 없습니다.";

    return jsonResponse({ term, explanation }, 200, origin);
  } catch (error) {
    console.error("Explain term error:", error);
    return errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500, origin);
  }
});

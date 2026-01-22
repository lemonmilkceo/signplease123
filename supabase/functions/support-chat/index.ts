import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPreFlight, jsonResponse, errorResponse, ERROR_MESSAGES } from "../_shared/cors.ts";
import { rateLimiters, createRateLimitResponse } from "../_shared/rate-limiter.ts";

interface SupportInput {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  sessionId?: string;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return handleCorsPreFlight(origin);
  }

  try {
    const { message, conversationHistory = [], sessionId }: SupportInput = await req.json();

    if (!message?.trim()) {
      return errorResponse("메시지를 입력해주세요.", 400, origin);
    }

    // Rate Limiting (sessionId 또는 IP 기반)
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
          ...conversationHistory.slice(-10), // 최근 10개 대화만 포함
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
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
    const reply = aiResult.choices?.[0]?.message?.content || "죄송합니다. 답변을 생성할 수 없습니다.";

    return jsonResponse({ reply }, 200, origin);
  } catch (error) {
    console.error("Support chat error:", error);
    return errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500, origin);
  }
});

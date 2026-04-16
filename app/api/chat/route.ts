import { openai } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { buildSystemPrompt } from "@/lib/prompt";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, role, tone, length, modelType, isQuickAction } =
    await req.json();

  const systemPrompt = buildSystemPrompt(role, tone, length, isQuickAction);

  let result;

  if (modelType === "/api/free") {
    const normalizedMessages = messages.map((msg: any) => {
      let text = "";
      if (Array.isArray(msg.parts)) {
        text = msg.parts.map((p: any) => p.text || "").join("");
      } else if (typeof msg.content === "string") {
        text = msg.content;
      } else if (Array.isArray(msg.content)) {
        text = msg.content.map((p: any) => p.text || "").join("");
      }
      return {
        role: msg.role === "assistant" ? "assistant" : "user",
        content: text,
      };
    });

    if (
      normalizedMessages.length > 0 &&
      normalizedMessages[0].role === "user"
    ) {
      normalizedMessages[0].content = `[系统设定：${systemPrompt}]\n\n${normalizedMessages[0].content}`;
    }

    result = streamText({
      model: openrouter.chat("openai/gpt-oss-20b:free"),
      messages: normalizedMessages,
    });
  } else {
    result = streamText({
      model: openai("gpt-5-nano"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });
  }

  return result.toUIMessageStreamResponse();
}

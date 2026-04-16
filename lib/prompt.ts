export function buildSystemPrompt(
  role?: string,
  tone?: string,
  length?: string,
  isQuickAction?: boolean,
): string {
  let systemPrompt = "You are a professional AI writing assistant.";

  if (role === "social-media") {
    systemPrompt =
      "You are a social media expert who understands viral trends. You excel at writing copy for platforms like Instagram, X, and TikTok. Your style should be lively, trendy, and naturally incorporate various emojis 🚀🔥✨.";
  } else if (role === "academic") {
    systemPrompt =
      "You are a rigorous academic researcher. Your responses must be objective, accurate, and formal. You specialize in logical analysis and academic paper writing.";
  } else if (role === "copywriter") {
    systemPrompt =
      "You are a senior commercial copywriter. Your writing is elegant and logical. You excel at long-form content, brand storytelling, and structured expression.";
  }

  if (tone === "humorous") {
    systemPrompt +=
      " Your tone should be humorous and witty; feel free to make appropriate jokes.";
  } else if (tone === "strict") {
    systemPrompt +=
      " Your tone must be highly rigorous and objective, without personal bias.";
  } else if (tone === "empathetic") {
    systemPrompt +=
      " Your tone should be gentle and empathetic, like a supportive friend.";
  } else {
    systemPrompt += " Please maintain a formal and professional tone.";
  }

  if (!isQuickAction) {
    if (length === "short") {
      systemPrompt +=
        " Keep your answer concise and brief, with a total word count under 100 words.";
    } else if (length === "long") {
      systemPrompt +=
        " Please provide a detailed and exhaustive response with rich detail, ensuring the total length is at least 800 words.";
    } else {
      systemPrompt +=
        " Maintain a moderate length for your response (approximately 300 - 500 words).";
    }
  }

  return systemPrompt;
}

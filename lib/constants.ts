export const MODEL_OPTIONS = [
  { value: "/api/free", label: "Free model (gpt-oss-20b)" },
  { value: "/api/chat", label: "ChatGPT-5-nano" },
];

export const ROLE_OPTIONS = [
  { value: "copywriter", label: "Copywriter" },
  { value: "social-media", label: "Social Media Writer" },
  { value: "academic", label: "Academic Writer" },
];

export const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "humorous", label: "Humorous" },
  { value: "strict", label: "Strict" },
  { value: "empathetic", label: "Empathetic" },
];

export const LENGTH_OPTIONS = [
  { value: "short", label: "Short" }, // SHORE
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

export const QUICK_ACTIONS = [
  {
    label: "Expand",
    promptTemplate: "Please expand the following text:\n\n{text}",
  },
  {
    label: "Summary",
    promptTemplate: "Please summarise the following text:\n\n{text}",
  },
  {
    label: "Polish",
    promptTemplate: "Please polish the following text:\n\n{text}",
  },
];

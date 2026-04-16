# AI Writing Assistant

A modern web application built with Next.js designed to assist users in generating, refining, and managing written content using advanced AI models.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/)
- **Components:** [Radix UI](https://www.radix-ui.com/) / [shadcn/ui](https://ui.shadcn.com/)

## Architecture

The project follows a modular architecture optimized for the Next.js App Router:

- **Server Components:** Used for data fetching and initial rendering to minimize client-side JavaScript.
- **Client Components:** Utilized for interactive elements like the rich text editor and real-time AI streaming controls.
- **API Routes:** Edge-runtime optimized routes located in `/app/api` for handling AI model interactions.
- **Shared State:** Managed via React Hooks and the Vercel AI SDK's built-in state management for chat and completion streams.

## AI Implementation

The application leverages the **Vercel AI SDK** to provide a unified interface for multiple LLMs:

- **Streaming:** Implements `streamText` and `useChat` to provide real-time feedback to users.
- **Multi-Model Support:** Integrated with OpenAI (GPT-4o) and Anthropic (Claude 3.5 Sonnet) via the `ai` provider pattern.
- **Prompt Engineering:** System prompts are centralized in `/lib/ai/prompts.ts` to ensure consistent tone and style adjustments.
- **Tools/Function Calling:** Utilizes AI SDK tools for structured data tasks like grammar checking and SEO analysis.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/ai-writing-assistant.git
   cd ai-writing-assistant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file and add your API keys:
   
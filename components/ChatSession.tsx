import { useChat } from "@ai-sdk/react";
import { Button, Input } from "@base-ui/react";
import { useState, useRef, useEffect, ChangeEvent, useMemo } from "react";
import { Card } from "./ui/card";
import { DefaultChatTransport } from "ai";
import { MessageBubble } from "./MessageBubble";
interface ChatSessionProps {
  sessionId: string;
  role: string;
  tone: string;
  length: string;
  modelType: string;
  onTitleGeneration: (sessionId: string, firstUserMessage: string) => void;
}

function ChatSession({
  sessionId,
  role,
  tone,
  length,
  modelType,
  onTitleGeneration,
}: ChatSessionProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
      }),
    [],
  );

  const { messages, setMessages, sendMessage, status, error, stop } = useChat({
    id: sessionId,
    transport,
    onError: (err) => {
      console.error("Chat API Error:", err);
    },
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_${sessionId}`);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to load conversation history", e);
      }
    }
  }, [sessionId, setMessages]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (messages.length > 0) {
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
    } else {
      localStorage.removeItem(`chat_${sessionId}`);
    }
  }, [messages, sessionId]);

  const handleReload = () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");
    if (lastUserMessage) {
      const textPart = lastUserMessage.parts?.find((p) => p.type === "text");
      if (textPart && textPart.text) {
        sendMessage(
          { text: textPart.text },
          { body: { role, tone, length, modelType } },
        );
      }
    }
  };

  const handleQuickAction = (aiContent: string, promptTemplate: string) => {
    const newPrompt = promptTemplate.replace("{text}", aiContent);
    sendMessage(
      { text: newPrompt },
      { body: { role, tone, length, modelType, isQuickAction: true } },
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput) {
      if (messages.length === 0) {
        onTitleGeneration(sessionId, trimmedInput);
      }
      sendMessage(
        { text: trimmedInput },
        { body: { role, tone, length, modelType } },
      );
      setInput("");
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure to clear the conversation?")) {
      setMessages([]);
    }
  };

  return (
    <section className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="text-center text-sm text-zinc-500 mt-10">
              Welcome to AI Writting Assistant, what do you want to write today?
            </div>
          )}
          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;
            return (
              <MessageBubble
                key={message.id}
                message={message}
                isLastMessage={isLastMessage}
                status={status}
                copiedId={copiedId}
                handleQuickAction={handleQuickAction}
                handleCopy={handleCopy}
                handleReload={handleReload}
              />
            );
          })}

          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 text-sm bg-white border dark:bg-zinc-900 dark:border-zinc-800 text-zinc-500 animate-pulse">
                AI is thinking...
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center mt-2">
              <div className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-900/50">
                <p className="mb-3">
                  Error: {error.message || "Network time-out"}
                </p>
                <Button
                  onClick={handleReload}
                  className="bg-white dark:bg-zinc-950 hover:bg-zinc-100"
                >
                  Re-generate
                </Button>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white dark:bg-zinc-900">
          <form className="flex gap-2" onSubmit={(e) => handleSubmit(e)}>
            <Button
              className="rounded-lg px-3 py-1 cursor-pointer bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors"
              type="button"
              onClick={handleClear}
              disabled={messages.length === 0 || status !== "ready"}
            >
              Clear the conversation
            </Button>
            <Input
              className="flex-1 px-2"
              placeholder="Type something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== "ready"}
            />
            {status === "ready" || status === "error" ? (
              <Button
                className="rounded-lg px-2 py-1 cursor-pointer bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
                type="submit"
                disabled={!input.trim()} 
              >
                Send
              </Button>
            ) : (
              <Button
                className="rounded-lg px-2 py-1 cursor-pointer bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
                type="button"
                onClick={() => stop()}
              >
                Stop
              </Button>
            )}
          </form>
        </div>
      </Card>
    </section>
  );
}
export default ChatSession;

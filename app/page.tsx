"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatSession from "@/components/ChatSession";
import { getInitialSetting } from "@/utils/setting";
import { SettingsPanel } from "@/components/SettingsPanel";
import { SessionList } from "@/components/SessionList";

interface Session {
  id: string;
  name: string;
}

export default function Home() {
  const [role, setRole] = useState("copywriter");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("short");
  const [modelType, setModelType] = useState("/api/free");
  const [isMounted, setIsMounted] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    setRole(getInitialSetting("role", "copywriter"));
    setTone(getInitialSetting("tone", "professional"));
    setLength(getInitialSetting("length", "short"));
    setModelType(getInitialSetting("modelType", "/api/free"));

    const savedSessions = localStorage.getItem("ai-sessions");
    const savedActiveId = localStorage.getItem("ai-active-session-id");

    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      setSessions(parsedSessions);
      const activeExists = parsedSessions.some(
        (s: Session) => s.id === savedActiveId,
      );
      setActiveSessionId(
        activeExists ? savedActiveId : (parsedSessions[0]?.id ?? null),
      );
    } else {
      const newId = uuidv4();
      const newSession = { id: newId, name: "New conversation" };
      setSessions([newSession]);
      setActiveSessionId(newId);
    }

    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const settings = { role, tone, length, modelType };
      localStorage.setItem("ai-chat-settings", JSON.stringify(settings));

      localStorage.setItem("ai-sessions", JSON.stringify(sessions));
      if (activeSessionId) {
        localStorage.setItem("ai-active-session-id", activeSessionId);
      }
    }
  }, [role, tone, length, modelType, sessions, activeSessionId, isMounted]);

  const handleNewChat = () => {
    const newId = uuidv4();
    const newSession = { id: newId, name: "New conversation" };
    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newId);
  };

  const handleDeleteChat = (idToDelete: string) => {
    localStorage.removeItem(`chat_${idToDelete}`);
    const newSessions = sessions.filter((s) => s.id !== idToDelete);
    setSessions(newSessions);
    if (activeSessionId === idToDelete) {
      setActiveSessionId(newSessions[newSessions.length - 1]?.id ?? null);
    }
  };

  const handleTitleGeneration = async (
    sessionId: string,
    firstUserMessage: string,
  ) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session && session.name === "New conversation") {
      try {
        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: firstUserMessage }),
        });
        if (!response.ok) throw new Error("Failed to fetch summary");
        const { title } = await response.json();
        if (title) {
          setSessions((prev) =>
            prev.map((s) => (s.id === sessionId ? { ...s, name: title } : s)),
          );
        }
      } catch (error) {
        console.error("Could not generate title:", error);
      }
    }
  };

  return (
    <main className="flex h-screen bg-zinc-50 dark:bg-zinc-950 p-4">
      <aside
        className={`w-80 mr-4 flex flex-col gap-4 transition-opacity duration-300 ${
          isMounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <SessionList
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          onSwitchChat={setActiveSessionId}
          onDeleteChat={handleDeleteChat}
        />
        <SettingsPanel
          {...{
            role,
            setRole,
            tone,
            setTone,
            length,
            setLength,
            modelType,
            setModelType,
            isMounted,
          }}
        />
      </aside>
      {activeSessionId && (
        <ChatSession
          key={activeSessionId}
          sessionId={activeSessionId}
          onTitleGeneration={handleTitleGeneration}
          {...{ role, tone, length, modelType }}
        />
      )}
    </main>
  );
}

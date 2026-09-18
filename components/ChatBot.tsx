"use client";

import { useEffect, useRef, useState } from "react";
import { chatTopics } from "@/data/chatbot";
import { matchChatTopic } from "@/lib/matchChatTopic";
import { site } from "@/data/site";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
}

const SUGGESTIONS = chatTopics.filter((t) => t.suggestion).map((t) => t.suggestion as string);
const GREETING = `Hi! Ask me anything about ${site.name}'s background, skills, or projects.`;
const FALLBACK_NOTICE =
  "(The AI assistant is unavailable right now, so this reply comes from a simpler rule-based fallback.)";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

/** Reads a fetch Response body as a stream, calling onChunk with each decoded text piece. */
async function streamText(response: Response, onChunk: (chunk: string) => void): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}

function fallbackReply(trimmed: string, warnFirst: boolean): string {
  const answer = matchChatTopic(trimmed);
  return warnFirst ? `${FALLBACK_NOTICE}\n\n${answer}` : answer;
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: nextId(), role: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const hasWarnedFallback = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const history = [...messages, { id: nextId(), role: "user" as const, text: trimmed }];
    setMessages(history);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.role === "bot" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });

      if (!res.ok || !res.body) throw new Error(`chat request failed: ${res.status}`);

      const botId = nextId();
      let firstChunk = true;
      await streamText(res, (chunk) => {
        setTyping(false);
        setMessages((prev) =>
          firstChunk
            ? [...prev, { id: botId, role: "bot", text: chunk }]
            : prev.map((m) => (m.id === botId ? { ...m, text: m.text + chunk } : m))
        );
        firstChunk = false;
      });
      if (firstChunk) throw new Error("empty stream");
    } catch {
      const warnFirst = !hasWarnedFallback.current;
      hasWarnedFallback.current = true;
      const answer = fallbackReply(trimmed, warnFirst);
      setMessages((prev) => [...prev, { id: nextId(), role: "bot", text: answer }]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Ask about Vijayaraghavan K"
          className="flex h-[440px] w-[320px] max-w-[calc(100vw-2.5rem)] flex-col border border-line/20 bg-surface shadow-xl sm:w-[350px]"
        >
          <div className="flex items-center justify-between border-b border-line/15 bg-surface-deep px-4 py-3">
            <div>
              <p className="font-mono text-[11px] tracking-wide text-muted">AI ASSISTANT</p>
              <p className="text-sm font-semibold text-ink">Ask about Vijay</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat" 
              className="cursor-pointer border border-line/15 px-2 py-1 font-mono text-xs text-muted hover:text-ink"
            >
              Close
            </button>
          </div>

          <div
            ref={scrollRef}
            aria-live="polite"
            className="flex-1 space-y-2.5 overflow-y-auto px-4 py-3.5"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] whitespace-pre-line px-3 py-2 text-[13px] leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto border border-accent/40 bg-accent/10 text-ink"
                    : "border border-line/15 text-ink-dim"
                }`}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="max-w-[60%] border border-line/15 px-3 py-2 text-[13px] text-muted">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted [animation-delay:300ms]" />
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto border-t border-line/15 px-3 py-2.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="cursor-pointer shrink-0 whitespace-nowrap border border-line/15 px-2.5 py-1 font-mono text-[10.5px] text-muted hover:border-accent hover:text-accent-bright"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-line/15 p-2.5"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 border border-line/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="cursor-pointer border border-accent px-3.5 py-2 font-mono text-xs text-accent-bright hover:bg-accent hover:text-on-accent"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close FAQ chat" : "Open FAQ chat"}
        aria-expanded={open}
        className="cursor-pointer flex h-13 w-13 items-center justify-center border border-accent bg-surface text-accent-bright shadow-lg transition-colors hover:bg-accent hover:text-on-accent"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 5.5h16v10H9.5L5 19v-3.5H4v-10Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M8 9.5h8M8 12.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

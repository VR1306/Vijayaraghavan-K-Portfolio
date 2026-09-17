import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/portfolioContext";
import { getResumeBase64 } from "@/lib/resumeDocument";

export const runtime = "nodejs";

const MODEL = "claude-haiku-4-5";
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 600;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 20;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Best-effort, in-memory per-instance limiter — no database, matching the
// site's "no server-side persistence" principle. Resets on cold start and
// isn't shared across serverless instances; it's a courtesy brake against
// accidental loops, not a hard abuse defense.
const rateLimitBuckets = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitBuckets.set(key, { count: 1, windowStart: now });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/**
 * The client seeds a static greeting as the first "bot" turn in the UI, but
 * the Anthropic API requires the conversation to start on a user turn — drop
 * any leading assistant messages, then attach the résumé PDF to the first
 * real user message so it's grounded in the actual document, not a
 * hand-duplicated summary of it.
 */
function toClaudeMessages(messages: ChatMessage[], resumeBase64: string): Anthropic.MessageParam[] {
  const trimmed = [...messages];
  while (trimmed.length > 0 && trimmed[0].role === "assistant") trimmed.shift();

  return trimmed.map((m, i): Anthropic.MessageParam => {
    if (i !== 0) return { role: m.role, content: m.content };
    return {
      role: "user",
      content: [
        {
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: resumeBase64 },
          cache_control: { type: "ephemeral" },
        },
        { type: "text", text: m.content },
      ],
    };
  });
}

function isValidHistory(messages: unknown): messages is ChatMessage[] {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return false;
  }
  if (messages[messages.length - 1]?.role !== "user") return false;

  return messages.every(
    (m): m is ChatMessage =>
      typeof m === "object" &&
      m !== null &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length > 0 &&
      m.content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ok: false, error: "AI chat is not configured." }, { status: 503 });
  }

  if (isRateLimited(clientKey(request))) {
    return NextResponse.json({ ok: false, error: "Too many messages — please slow down." }, { status: 429 });
  }

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!isValidHistory(body.messages)) {
    return NextResponse.json({ ok: false, error: "Invalid message history." }, { status: 400 });
  }

  let resumeBase64: string;
  try {
    resumeBase64 = getResumeBase64();
  } catch (err) {
    console.error("[api/chat] couldn't read résumé:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "AI chat is not configured." }, { status: 503 });
  }

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const claudeStream = client.messages.stream({
        model: MODEL,
        max_tokens: 500,
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        messages: toClaudeMessages(body.messages as ChatMessage[], resumeBase64),
      });

      claudeStream.on("text", (text) => {
        controller.enqueue(encoder.encode(text));
      });

      try {
        await claudeStream.finalMessage();
      } catch (err) {
        console.error("[api/chat] stream failed:", err instanceof Error ? err.message : err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

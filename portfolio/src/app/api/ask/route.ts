import { NextResponse } from "next/server"

import { buildAnkitContext } from "@/lib/ankit-context"

export const runtime = "nodejs"

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
// Free-tier models are individually flaky (429s), so we fall through a list
// until one answers. An explicit OPENROUTER_MODEL is tried first.
const MODELS = [
  process.env.OPENROUTER_MODEL,
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-120b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
].filter((m): m is string => Boolean(m))
const MAX_QUESTION_LENGTH = 500

// ponytail: in-memory per-IP limiter, resets on cold start; swap for Upstash if
// abuse becomes real. 10 questions / minute is plenty for a portfolio.
const RATE_LIMIT = 10
const WINDOW_MS = 60_000
const hits = new Map<string, number[]>()

// Build the (large) context once per server instance instead of every request.
let contextCache: string | null = null
function getContext(): string {
  return (contextCache ??= buildAnkitContext())
}

// Response cache: identical questions skip the model entirely — faster, and it
// sidesteps the free-tier rate limits for popular questions. ponytail:
// in-memory, per-instance, 1h TTL, FIFO-evicted at 300 entries.
const ANSWER_TTL_MS = 60 * 60_000
const MAX_CACHE = 300
const answerCache = new Map<string, { answer: string; expires: number }>()

function normalizeQuestion(q: string): string {
  return q
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[?.!\s]+$/g, "")
    .trim()
}

function getCachedAnswer(q: string): string | null {
  const hit = answerCache.get(normalizeQuestion(q))
  if (hit && hit.expires > Date.now()) return hit.answer
  return null
}

function cacheAnswer(q: string, answer: string): void {
  if (answerCache.size >= MAX_CACHE) {
    const oldest = answerCache.keys().next().value
    if (oldest) answerCache.delete(oldest)
  }
  answerCache.set(normalizeQuestion(q), {
    answer,
    expires: Date.now() + ANSWER_TTL_MS,
  })
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_LIMIT
}

const SYSTEM_PROMPT = (context: string) =>
  `You are the terminal assistant on Ankit Kiran's portfolio site. Visitors type questions to learn about Ankit.

Rules:
- Answer ONLY from the CONTEXT below. Never invent facts, employers, dates, or contact details.
- Refer to him as "Ankit" in the third person.
- Keep answers short and terminal-friendly: plain text, no markdown, no bullet symbols, under 70 words.
- If the answer isn't in the context, say you only know about Ankit's work and experience.
- Be direct and a little dry, like a CLI. No filler greetings.
- Emphasis: lead with his current AI work at Simbian AI and his frontend work at CRED. Mention WootzApp and Google Summer of Code briefly, and only go into detail on them if the visitor asks specifically.

CONTEXT:
${context}`

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "terminal offline: assistant not configured" },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 })
  }

  const question =
    body && typeof (body as { question?: unknown }).question === "string"
      ? (body as { question: string }).question.trim()
      : ""

  if (!question) {
    return NextResponse.json({ error: "empty question" }, { status: 400 })
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json(
      { error: `question too long (max ${MAX_QUESTION_LENGTH} chars)` },
      { status: 400 }
    )
  }

  // Cache hits are free (no model call) — serve them before rate limiting.
  const cached = getCachedAnswer(question)
  if (cached) return NextResponse.json({ answer: cached, cached: true })

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous"
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "rate limit: slow down a moment" },
      { status: 429 }
    )
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT(getContext()) },
    { role: "user", content: question },
  ]

  for (const model of MODELS) {
    try {
      const upstream = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "https://ankitkiran.vercel.app",
          "X-Title": "Ankit Kiran Portfolio",
        },
        body: JSON.stringify({
          model,
          max_tokens: 300,
          temperature: 0.5,
          messages,
        }),
      })

      if (!upstream.ok) continue // rate-limited / unavailable: try the next model

      const data = (await upstream.json()) as {
        choices?: { message?: { content?: string } }[]
      }
      const answer: string | undefined = data?.choices?.[0]?.message?.content
        ?.trim()
        .replace(/^"|"$/g, "")

      if (answer) {
        cacheAnswer(question, answer)
        return NextResponse.json({ answer })
      }
    } catch {
      // network hiccup on this model: fall through to the next
    }
  }

  return NextResponse.json(
    { error: "all models busy: try again in a moment" },
    { status: 502 }
  )
}

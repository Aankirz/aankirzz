"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowUpIcon, XIcon } from "lucide-react"

import { USER } from "@/features/portfolio/data/user"

type Entry = {
  question: string
  answer: string
  error?: boolean
  pending?: boolean
}

const SUGGESTIONS = [
  "What did Ankit build at Simbian?",
  "Tell me about the Chromium work",
  "What's his strongest project?",
  "Is he open to new roles?",
]

const caretStyle = { animation: "caret-blink 1.1s steps(1, end) infinite" }

export function AiSidebar() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<Entry[]>([])
  const [busy, setBusy] = useState(false)
  const reduce = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [history, open])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  async function ask(question: string) {
    const q = question.trim()
    if (!q || busy) return
    setInput("")
    setBusy(true)
    setHistory((h) => [...h, { question: q, answer: "", pending: true }])
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      })
      const data = (await res.json()) as { answer?: string; error?: string }
      const answer = res.ok
        ? data.answer ?? "no response"
        : data.error ?? "something went wrong"
      setHistory((h) => replaceLast(h, { question: q, answer, error: !res.ok }))
    } catch {
      setHistory((h) =>
        replaceLast(h, {
          question: q,
          answer: "network error. try again.",
          error: true,
        })
      )
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  const panelMotion = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const },
      }

  return (
    <>
      {/* Prominent trigger with Ankit's face */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open Ankit's AI assistant"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="group fixed right-4 bottom-[calc(--spacing(4)+env(safe-area-inset-bottom,0))] z-60 flex items-center gap-2.5 rounded-xl border border-line bg-background/95 py-1.5 pr-4 pl-1.5 shadow-lg ring-offset-background backdrop-blur transition-colors hover:border-link focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="relative shrink-0">
              <img
                src={USER.avatar}
                alt=""
                className="size-9 rounded-full object-cover ring-2 ring-link/50"
              />
              <span className="absolute -right-px -bottom-px flex size-2.5">
                <span
                  className="absolute inline-flex size-full rounded-full bg-link opacity-60 motion-safe:animate-ping"
                  aria-hidden
                />
                <span className="relative inline-flex size-2.5 rounded-full bg-link ring-2 ring-background" />
              </span>
            </span>
            <span className="flex flex-col items-start text-left leading-tight">
              <span className="text-sm font-medium text-foreground">
                Ask my AI
              </span>
              <span className="font-mono text-[0.7rem] text-muted-foreground">
                anything about Ankit
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Full-height AI sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
              aria-hidden
            />

            <motion.aside
              {...panelMotion}
              role="dialog"
              aria-label="Ankit's AI assistant"
              className="fixed inset-y-0 right-0 z-60 flex h-dvh w-[min(420px,100vw)] flex-col border-l border-line bg-background shadow-2xl"
            >
              {/* header */}
              <header className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-3">
                <span className="relative shrink-0">
                  <img
                    src={USER.avatar}
                    alt={USER.displayName}
                    className="size-9 rounded-full object-cover ring-2 ring-link/50"
                  />
                  <span className="absolute -right-px -bottom-px size-2.5 rounded-full bg-link ring-2 ring-background" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Ankit&apos;s AI
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    ask anything about Ankit
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close assistant"
                  className="ml-auto rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none"
                >
                  <XIcon className="size-4.5" />
                </button>
              </header>

              {/* conversation */}
              <div
                ref={scrollRef}
                className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 text-sm"
              >
                {history.length === 0 ? (
                  <div className="flex flex-col gap-4">
                    <Bubble assistant avatar={USER.avatar}>
                      Hi, I&apos;m Ankit&apos;s AI. Ask me about his work,
                      experience, or projects.
                    </Bubble>
                    <div className="flex flex-col gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => ask(s)}
                          className="rounded-lg border border-line px-3 py-2 text-left font-mono text-xs text-muted-foreground transition-colors hover:border-link hover:text-link focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none"
                        >
                          <span className="mr-1.5 text-link">❯</span>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  history.map((entry, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <div className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-muted px-3 py-2 break-words text-foreground">
                        {entry.question}
                      </div>
                      {entry.pending ? (
                        <Bubble assistant avatar={USER.avatar}>
                          <span className="text-muted-foreground">
                            thinking
                            <span
                              className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-muted-foreground"
                              style={caretStyle}
                              aria-hidden
                            />
                          </span>
                        </Bubble>
                      ) : (
                        <Bubble assistant avatar={USER.avatar} error={entry.error}>
                          {entry.answer}
                        </Bubble>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  ask(input)
                }}
                className="flex shrink-0 items-center gap-2 border-t border-line p-3"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={500}
                  disabled={busy}
                  placeholder="Ask me anything…"
                  aria-label="Ask a question about Ankit"
                  spellCheck={false}
                  autoComplete="off"
                  className="h-10 w-full rounded-lg border border-line bg-muted/40 px-4 text-sm text-foreground caret-link outline-none placeholder:text-muted-foreground/70 focus-visible:border-link disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send"
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-link text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:opacity-40"
                >
                  <ArrowUpIcon className="size-5" />
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function Bubble({
  children,
  avatar,
  error,
}: {
  children: React.ReactNode
  assistant: true
  avatar: string
  error?: boolean
}) {
  return (
    <div className="flex max-w-[90%] items-start gap-2">
      <img
        src={avatar}
        alt=""
        className="mt-0.5 size-6 shrink-0 rounded-full object-cover ring-1 ring-line"
      />
      <div
        className={
          error
            ? "rounded-lg rounded-bl-sm bg-destructive/10 px-3 py-2 text-destructive"
            : "rounded-lg rounded-bl-sm bg-muted/50 px-3 py-2 leading-relaxed text-foreground"
        }
      >
        {children}
      </div>
    </div>
  )
}

function replaceLast(list: Entry[], entry: Entry): Entry[] {
  return [...list.slice(0, -1), entry]
}

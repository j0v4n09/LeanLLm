"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeMinus, Sparkles, Wand2, X } from "lucide-react";

import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";

type DiffToken = {
  text: string;
  kind?: "remove" | "add" | "neutral";
};

type Pane = {
  title: string;
  eyebrow: string;
  description: string;
  tone: "raw" | "optimized";
  tokens: DiffToken[];
};

function DiffPane({ pane }: { pane: Pane }) {
  const badgeClasses =
    pane.tone === "raw"
      ? "border-red-400/25 bg-red-500/10 text-red-100"
      : "border-emerald-400/25 bg-emerald-500/10 text-emerald-100";

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40 p-5">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_28%)]" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{pane.eyebrow}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{pane.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{pane.description}</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${badgeClasses}`}>
            {pane.tone === "raw" ? "Verbose" : "Lean"}
          </span>
        </div>

        <div className="mt-6 rounded-[1.35rem] border border-white/10 bg-zinc-950/80 p-4">
          <p className="text-sm leading-8 text-zinc-100">
            {pane.tokens.map((token, index) => {
              const tokenClass =
                token.kind === "remove"
                  ? "rounded-md bg-red-500/12 px-2 py-1 text-red-100 line-through decoration-red-300/80"
                  : token.kind === "add"
                    ? "rounded-md bg-emerald-500/14 px-2 py-1 text-emerald-100"
                    : "";

              return (
                <React.Fragment key={`${token.text}-${index}`}>
                  <span className={tokenClass}>{token.text}</span>
                  {index < pane.tokens.length - 1 ? " " : null}
                </React.Fragment>
              );
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export function OptimizationDiff({
  open,
  userInput,
  optimizedPrompt,
  tokenSavings,
  onClose,
  onApplyDiet,
}: {
  open: boolean;
  userInput: string;
  optimizedPrompt: string;
  tokenSavings: number;
  onClose: () => void;
  onApplyDiet: () => void;
}) {
  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  const panes: Pane[] = [
    {
      eyebrow: "User Input",
      title: "Original request",
      description: "Filler language and open-ended scope make the prompt expensive to route.",
      tone: "raw",
      tokens: [
        { text: "Please,", kind: "remove" },
        { text: "could", kind: "remove" },
        { text: "you", kind: "remove" },
        { text: "help", kind: "remove" },
        { text: "me", kind: "remove" },
        { text: "analyze" },
        { text: "this" },
        { text: "40-page" },
        { text: "customer" },
        { text: "support" },
        { text: "export" },
        { text: "and" },
        { text: "summarize" },
        { text: "trends," },
        { text: "key" },
        { text: "failures," },
        { text: "and" },
        { text: "agent" },
        { text: "coaching" },
        { text: "opportunities." },
      ],
    },
    {
      eyebrow: "Optimized for Efficiency",
      title: "LeanLLM minified",
      description: "Filler is stripped, constraints are added, and the output contract becomes machine-ready.",
      tone: "optimized",
      tokens: [
        { text: "Analyze" },
        { text: "top" },
        { text: "5" },
        { text: "support" },
        { text: "failure" },
        { text: "patterns." },
        { text: "Return", kind: "add" },
        { text: "volume", kind: "add" },
        { text: "by", kind: "add" },
        { text: "theme,", kind: "add" },
        { text: "one", kind: "add" },
        { text: "coaching", kind: "add" },
        { text: "recommendation", kind: "add" },
        { text: "per", kind: "add" },
        { text: "pattern,", kind: "add" },
        { text: "and", kind: "add" },
        { text: "Output:", kind: "add" },
        { text: "JSON", kind: "add" },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close optimization diff"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/90 shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
          >
            <div className="pointer-events-none absolute inset-0 opacity-80">
              <EtheralShadow
                color="rgba(16, 185, 129, 0.22)"
                animation={{ scale: 78, speed: 78 }}
                noise={{ opacity: 0.22, scale: 1.1 }}
                sizing="fill"
              />
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_58%)]" />

            <div className="relative p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    Optimization Diff
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    LeanLLM minified the prompt before routing.
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
                    The optimizer removed filler phrasing like "Please" and "Could you help me"
                    while adding structural output constraints for faster, cheaper inference.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-zinc-200 transition hover:bg-white/10"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-100">
                  <BadgeMinus className="h-4 w-4" />
                  -{tokenSavings}% Tokens
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-zinc-300">
                  Output contract added: <span className="text-white">JSON</span>
                </div>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {panes.map((pane) => (
                  <DiffPane key={pane.title} pane={pane} />
                ))}
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                <div className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Full Input</p>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-300">{userInput}</p>
                </div>

                <div className="rounded-[1.75rem] border border-emerald-400/20 bg-emerald-500/8 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/80">Optimized for Efficiency</p>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-100">{optimizedPrompt}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
                >
                  Keep Original
                </button>
                <button
                  type="button"
                  onClick={onApplyDiet}
                  className="rounded-2xl border border-white/20 bg-gradient-to-b from-white via-white/90 to-white/10 px-5 py-3 text-sm font-semibold text-black shadow-[0_10px_50px_rgba(255,255,255,0.16)] transition hover:scale-[1.02]"
                >
                  <span className="inline-flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Apply Diet
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

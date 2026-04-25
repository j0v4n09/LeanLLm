"use client";

import * as React from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";

import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";
import { GlowCard } from "@/components/ui/glow-card";
import { LeanLlmDashboardOverview } from "@/components/ui/saa-s-template";
import { cn } from "@/lib/utils";

const defaultPrompt =
  "Please help me review this support export, figure out the main issues, summarize everything clearly, and give me a response plan for each customer segment.";

const optimizedPrompt =
  "Summarize the top 5 support issues by volume, group by customer segment, and return one response plan per segment. Output: JSON.";

function FloatingBadge({
  label,
  glowColor,
  className,
}: {
  label: string;
  glowColor: "green" | "blue" | "orange";
  className: string;
}) {
  return (
    <div className={cn("absolute hidden lg:block", className)}>
      <GlowCard glowColor={glowColor} customSize className="w-[210px] rounded-2xl p-0">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm font-medium tracking-tight text-white">
          {label}
        </div>
      </GlowCard>
    </div>
  );
}

export function LandingHero() {
  const [prompt, setPrompt] = React.useState(defaultPrompt);
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const [showOptimized, setShowOptimized] = React.useState(false);
  const reduceMotion = useReducedMotion();
  const timeoutRef = React.useRef<number | null>(null);
  const heroRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.55, 0.9], [1, 0.75, 0.08]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const dashboardY = useTransform(scrollYProgress, [0.25, 1], [220, 0]);
  const dashboardOpacity = useTransform(scrollYProgress, [0.25, 0.7, 1], [0.15, 0.7, 1]);

  const smoothDashboardY = useSpring(dashboardY, { stiffness: 110, damping: 24, mass: 0.6 });
  const smoothDashboardOpacity = useSpring(dashboardOpacity, { stiffness: 110, damping: 24, mass: 0.6 });

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const optimizePrompt = React.useCallback(() => {
    if (isOptimizing) return;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setIsOptimizing(true);
    setShowOptimized(false);

    timeoutRef.current = window.setTimeout(() => {
      setPrompt(optimizedPrompt);
      setIsOptimizing(false);
      setShowOptimized(true);
    }, 950);
  }, [isOptimizing]);

  return (
    <div className="relative">
      <motion.section
        ref={heroRef}
        style={reduceMotion ? undefined : { opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative isolate min-h-[145vh] overflow-hidden"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 bg-zinc-950" />
          <div className="absolute inset-0 opacity-80">
            <EtheralShadow
              color="rgba(16, 185, 129, 0.18)"
              animation={{ scale: 88, speed: 22 }}
              noise={{ opacity: 0.18, scale: 1.05 }}
              sizing="fill"
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_28%),linear-gradient(180deg,rgba(9,9,11,0.1),rgba(9,9,11,0.95))]" />

          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="relative mx-auto w-full max-w-4xl text-center">
              <FloatingBadge label="64% Token Reduction" glowColor="green" className="-left-10 top-14" />
              <FloatingBadge label="Cached in 12ms" glowColor="blue" className="-right-14 top-28" />
              <FloatingBadge label="Routed: Llama-3" glowColor="orange" className="left-8 bottom-16" />

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-zinc-300 backdrop-blur-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                LeanLLM
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-8 text-balance text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl"
              >
                <span className="bg-gradient-to-b from-white via-white to-emerald-400 bg-clip-text text-transparent">
                  Put your LLMs on a Token Diet.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300 sm:text-xl"
              >
                The automated gauntlet that compresses prompts, semantic caches responses, and slashes
                API costs by 80%.
              </motion.p>

              <motion.div
                layout
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mx-auto mt-10 max-w-3xl"
              >
                <motion.div
                  layout
                  className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 text-left sm:px-5">
                    <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-400 sm:block">
                      Quick Try
                    </div>
                    <div className="text-sm text-zinc-500">Paste a messy request and compress it instantly.</div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <motion.div layout className="relative rounded-[1.35rem] border border-white/10 bg-zinc-950/80">
                      <textarea
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        placeholder="Try a long, rambling prompt..."
                        className="min-h-[120px] w-full resize-none bg-transparent px-5 py-5 pr-20 text-base leading-7 text-zinc-100 outline-none placeholder:text-zinc-500"
                      />

                      <button
                        type="button"
                        onClick={optimizePrompt}
                        disabled={isOptimizing}
                        className="absolute bottom-4 right-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:scale-105 hover:bg-white/15 disabled:cursor-wait"
                        aria-label="Optimize prompt"
                      >
                        <Wand2 className={cn("h-5 w-5", isOptimizing && "animate-pulse")} />
                      </button>

                      {isOptimizing ? (
                        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.35rem]">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent [animation:shimmer_1.2s_linear_infinite]" />
                        </div>
                      ) : null}
                    </motion.div>

                    <AnimatePresence initial={false}>
                      {showOptimized ? (
                        <motion.div
                          layout
                          initial={{ opacity: 0, height: 0, y: 10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 rounded-[1.35rem] border border-emerald-400/20 bg-emerald-500/10 p-5 text-left">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">
                                  Optimized Prompt
                                </p>
                                <p className="mt-3 text-base leading-7 text-zinc-100">{optimizedPrompt}</p>
                              </div>
                              <div className="rounded-full border border-emerald-400/20 bg-black/20 px-3 py-2 text-sm text-emerald-100">
                                -64% tokens
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 flex items-center justify-center"
              >
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-5 py-3 text-sm text-zinc-200 transition hover:bg-white/10"
                >
                  Open Playground
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        style={reduceMotion ? undefined : { y: smoothDashboardY, opacity: smoothDashboardOpacity }}
        className="relative z-10 -mt-[22vh] rounded-t-[2rem] border-t border-white/10 bg-zinc-950 px-4 pb-10 pt-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Dashboard</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                From quick try to daily control.
              </h2>
            </div>
            <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 sm:block">
              Scroll to compare the full operating view
            </div>
          </div>

          <LeanLlmDashboardOverview />
        </div>
      </motion.section>
    </div>
  );
}

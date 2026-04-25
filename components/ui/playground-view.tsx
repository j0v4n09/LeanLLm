"use client";

import * as React from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { ArrowRight, BarChart3, Clock3, DatabaseZap, Sparkles, Wand2 } from "lucide-react";

import { GlowCard } from "@/components/ui/glow-card";
import { OptimizationDiff } from "@/components/ui/optimization-diff";
import { cn } from "@/lib/utils";

type MetricCard = {
  label: string;
  raw: number;
  optimized: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

const metrics: MetricCard[] = [
  { label: "Cost", raw: 0.05, optimized: 0.009, prefix: "$", decimals: 3 },
  { label: "Latency", raw: 3.1, optimized: 0.3, suffix: "s", decimals: 1 },
  { label: "Tokens", raw: 1400, optimized: 210, decimals: 0 },
];

const defaultPrompt =
  "Please, could you help me analyze this 40-page customer support export and summarize trends, key failures, and agent coaching opportunities? Include a detailed breakdown for every ticket and generate a response template for the top issues.";

const optimizedPrompt =
  "Analyze top 5 support failure patterns. Quantify ticket volume by theme, include one coaching recommendation per pattern, and generate one reusable response template. Output: JSON.";

type CacheRun = {
  prompt: string;
  cached: boolean;
  similarityScore: number | null;
  cacheStatus: string;
  response: string;
  createdAt: string;
};

function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  start,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  start: boolean;
}) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!start) {
      setDisplay(0);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(latest),
    });

    return () => controls.stop();
  }, [start, value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

function ComparisonCard({
  title,
  tone,
  subtitle,
  metrics: cardMetrics,
  startCounters,
}: {
  title: string;
  tone: "red" | "emerald";
  subtitle: string;
  metrics: { label: string; value: number; prefix?: string; suffix?: string; decimals?: number }[];
  startCounters: boolean;
}) {
  const borderTone = tone === "red" ? "border-red-400/20" : "border-emerald-400/20";
  const badgeTone =
    tone === "red"
      ? "bg-red-500/10 text-red-200 border-red-400/20"
      : "bg-emerald-500/10 text-emerald-200 border-emerald-400/20";

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <GlowCard
        glowColor={tone === "red" ? "red" : "green"}
        customSize
        className={cn("h-full min-h-[360px] w-full rounded-[2rem] p-0", borderTone)}
      >
        <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_22%)]" />
        <div className="relative flex h-full flex-col p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">{title}</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{subtitle}</h3>
            </div>
            <span className={cn("rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]", badgeTone)}>
              {tone === "red" ? "Baseline" : "Optimized"}
            </span>
          </div>

          <div className="mt-8 grid gap-3">
            {cardMetrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4"
              >
                <span className="text-sm text-zinc-400">{metric.label}</span>
                <span className="text-2xl font-semibold tracking-tight text-white">
                  <CountUp
                    value={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    decimals={metric.decimals}
                    start={startCounters}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}

export function PlaygroundView() {
  const [activeView, setActiveView] = React.useState<"playground" | "analytics">("playground");
  const [prompt, setPrompt] = React.useState(defaultPrompt);
  const [previewText, setPreviewText] = React.useState(defaultPrompt);
  const [isRefining, setIsRefining] = React.useState(false);
  const [hasCompared, setHasCompared] = React.useState(false);
  const [showDiff, setShowDiff] = React.useState(false);
  const [isCacheLoading, setIsCacheLoading] = React.useState(false);
  const [cacheError, setCacheError] = React.useState<string | null>(null);
  const [cacheResult, setCacheResult] = React.useState<{
    response: string;
    cached: boolean;
    similarityScore: number | null;
    cacheStatus: string;
  } | null>(null);
  const [cacheHistory, setCacheHistory] = React.useState<CacheRun[]>([]);
  const timeoutRef = React.useRef<number | null>(null);

  const tokenSavings = Math.round(((metrics[2].raw - metrics[2].optimized) / metrics[2].raw) * 100);
  const cacheApiUrl = process.env.NEXT_PUBLIC_CACHE_API_URL ?? "http://127.0.0.1:8000";
  const totalRuns = cacheHistory.length;
  const hitCount = cacheHistory.filter((entry) => entry.cached).length;
  const bypassCount = cacheHistory.filter((entry) => entry.cacheStatus === "bypassed").length;
  const avgSimilarity =
    cacheHistory.filter((entry) => entry.similarityScore !== null).length > 0
      ? cacheHistory
          .filter((entry): entry is CacheRun & { similarityScore: number } => entry.similarityScore !== null)
          .reduce((sum, entry) => sum + entry.similarityScore, 0) /
        cacheHistory.filter((entry) => entry.similarityScore !== null).length
      : null;
  const hitRate = totalRuns > 0 ? Math.round((hitCount / totalRuns) * 100) : 0;

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const runComparison = React.useCallback(() => {
    if (isRefining) return;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setHasCompared(false);
    setIsRefining(true);
    setPreviewText(prompt);
    setShowDiff(false);

    timeoutRef.current = window.setTimeout(() => {
      setPreviewText(optimizedPrompt);
      setIsRefining(false);
      setHasCompared(true);
      setShowDiff(true);
    }, 1600);
  }, [isRefining, prompt]);

  const applyDiet = React.useCallback(() => {
    setPrompt(optimizedPrompt);
    setPreviewText(optimizedPrompt);
    setShowDiff(false);
    setHasCompared(true);
  }, []);

  const runSemanticCache = React.useCallback(async () => {
    setIsCacheLoading(true);
    setCacheError(null);

    try {
      const response = await fetch(`${cacheApiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          system_prompt: "You are a helpful assistant.",
        }),
      });

      if (!response.ok) {
        throw new Error(`Cache API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as {
        response: string;
        cached: boolean;
        similarity_score?: number | null;
        cache_status: string;
      };

      setCacheResult({
        response: data.response,
        cached: data.cached,
        similarityScore: data.similarity_score ?? null,
        cacheStatus: data.cache_status,
      });
      setCacheHistory((current) => [
        {
          prompt,
          response: data.response,
          cached: data.cached,
          similarityScore: data.similarity_score ?? null,
          cacheStatus: data.cache_status,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ].slice(0, 6));
    } catch (error) {
      setCacheError(error instanceof Error ? error.message : "Unable to reach the cache service.");
      setCacheResult(null);
    } finally {
      setIsCacheLoading(false);
    }
  }, [cacheApiUrl, prompt]);

  return (
    <div className="space-y-6">
      <OptimizationDiff
        open={showDiff}
        userInput={prompt}
        optimizedPrompt={optimizedPrompt}
        tokenSavings={tokenSavings}
        onClose={() => setShowDiff(false)}
        onApplyDiet={applyDiet}
      />

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">Playground</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Show the before-and-after of every request.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                Refine a prompt, then run it through the semantic cache to show what gets reused and when.
              </p>
            </div>

            <div className="inline-flex w-full rounded-2xl border border-white/10 bg-black/30 p-1 sm:w-auto">
              {[
                { id: "playground", label: "Playground", icon: Wand2 },
                { id: "analytics", label: "Analytics", icon: BarChart3 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveView(tab.id as "playground" | "analytics")}
                    className={cn(
                      "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm transition sm:flex-none",
                      active ? "bg-white text-black" : "text-zinc-400 hover:text-zinc-100",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeView === "playground" ? (
              <motion.div
                key="playground"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <div className="relative mt-10">
                  <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.22),transparent_58%)] blur-2xl" />
                  <div className="relative overflow-hidden rounded-[2rem] border border-emerald-400/25 bg-black/60 p-3 shadow-[0_0_0_1px_rgba(16,185,129,0.1),0_24px_120px_rgba(16,185,129,0.18)]">
                    <div className="relative rounded-[1.4rem] border border-white/10 bg-zinc-950/90">
                      <textarea
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        placeholder="Paste a raw prompt to compare optimization results..."
                        className="min-h-[220px] w-full resize-none bg-transparent px-6 py-6 pr-20 text-base leading-7 text-zinc-100 outline-none placeholder:text-zinc-500"
                      />

                      <button
                        type="button"
                        onClick={runComparison}
                        disabled={isRefining}
                        className="absolute bottom-5 right-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-500/10 text-emerald-200 transition hover:scale-105 hover:bg-emerald-500/20 disabled:cursor-wait disabled:opacity-80"
                        aria-label="Refine prompt"
                      >
                        <Wand2 className={cn("h-5 w-5", isRefining && "animate-pulse")} />
                      </button>

                      {isRefining ? (
                        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.4rem]">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent [animation:shimmer_1.2s_linear_infinite]" />
                          <div className="absolute inset-0 bg-emerald-500/5" />
                          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
                            <Sparkles className="h-3.5 w-3.5" />
                            Refining
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-zinc-500">
                    Ask something close to a previous question and the cache can return that earlier answer.
                  </div>
                  <button
                    type="button"
                    onClick={runSemanticCache}
                    disabled={isCacheLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.08] disabled:cursor-wait disabled:opacity-70"
                  >
                    <DatabaseZap className={cn("h-4 w-4 text-emerald-300", isCacheLoading && "animate-pulse")} />
                    {isCacheLoading ? "Checking semantic cache..." : "Run through semantic cache"}
                  </button>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">Cached Response Demo</p>
                      <p className="mt-2 text-sm text-zinc-400">
                        This will return a prior answer when Pinecone finds a close enough match.
                      </p>
                    </div>
                    {cacheResult ? (
                      <div
                        className={cn(
                          "rounded-full border px-3 py-2 text-sm",
                          cacheResult.cached
                            ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                            : "border-sky-400/20 bg-sky-500/10 text-sky-100",
                        )}
                      >
                        {cacheResult.cached ? "Cache hit" : "Fresh response"}
                        {cacheResult.similarityScore !== null ? ` • score ${cacheResult.similarityScore.toFixed(3)}` : ""}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-zinc-950/70 p-4">
                    {cacheError ? (
                      <p className="text-sm leading-7 text-red-300">{cacheError}</p>
                    ) : cacheResult ? (
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                          Status: {cacheResult.cacheStatus}
                        </p>
                        <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">{cacheResult.response}</p>
                      </div>
                    ) : (
                      <p className="text-sm leading-7 text-zinc-500">
                        No cached result yet. Ask a question, then ask a similar one again to show the reuse path.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mt-10 space-y-6"
              >
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: "Hit Rate",
                      value: `${hitRate}%`,
                      detail: `${hitCount}/${totalRuns || 0} cache hits`,
                      glowColor: "green" as const,
                    },
                    {
                      label: "Bypass Count",
                      value: String(bypassCount),
                      detail: "Falls back to the LLM if Pinecone is unavailable",
                      glowColor: "orange" as const,
                    },
                    {
                      label: "Avg. Similarity",
                      value: avgSimilarity !== null ? avgSimilarity.toFixed(3) : "--",
                      detail: "Across recent semantic lookups",
                      glowColor: "blue" as const,
                    },
                    {
                      label: "Latest Path",
                      value: cacheResult?.cached ? "Cache" : cacheResult ? "LLM" : "--",
                      detail: cacheResult ? cacheResult.cacheStatus : "No runs yet",
                      glowColor: "purple" as const,
                    },
                  ].map((card) => (
                    <GlowCard key={card.label} glowColor={card.glowColor} customSize className="w-full rounded-[1.75rem] p-0">
                      <div className="rounded-[1.75rem] bg-zinc-950/80 p-5">
                        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{card.label}</p>
                        <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{card.value}</p>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">{card.detail}</p>
                      </div>
                    </GlowCard>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[1.75rem] border border-white/10 bg-black/30 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">Recent Matches</p>
                        <p className="mt-2 text-sm text-zinc-400">The latest prompts checked against the semantic cache.</p>
                      </div>
                      <Clock3 className="h-4 w-4 text-zinc-500" />
                    </div>

                    <div className="mt-5 space-y-3">
                      {cacheHistory.length > 0 ? (
                        cacheHistory.map((entry, index) => (
                          <div
                            key={`${entry.createdAt}-${index}`}
                            className="rounded-[1.25rem] border border-white/10 bg-zinc-950/70 p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="line-clamp-2 text-sm leading-6 text-zinc-200">{entry.prompt}</p>
                              <span
                                className={cn(
                                  "rounded-full border px-3 py-1 text-xs",
                                  entry.cached
                                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                                    : "border-sky-400/20 bg-sky-500/10 text-sky-100",
                                )}
                              >
                                {entry.cached ? "Cache hit" : entry.cacheStatus}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
                              <span>Similarity: {entry.similarityScore !== null ? entry.similarityScore.toFixed(3) : "--"}</span>
                              <span>{new Date(entry.createdAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[1.25rem] border border-white/10 bg-zinc-950/70 p-4 text-sm text-zinc-500">
                          No semantic lookups yet. Run the cache flow in the Playground tab to populate this panel.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5">
                    <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">Demo Notes</p>
                    <div className="mt-5 space-y-3 text-sm leading-7 text-zinc-300">
                      <p>Ask the same question twice to show an exact hit.</p>
                      <p>Ask a semantically similar question next to show reuse of the earlier response.</p>
                      <p>If Pinecone is down, the backend bypasses the cache and the UI still returns a fresh answer.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_auto_1.15fr] xl:items-start">
        <ComparisonCard
          title="Before"
          tone="red"
          subtitle="Raw request"
          startCounters={hasCompared}
          metrics={metrics.map((metric) => ({
            label: metric.label,
            value: metric.raw,
            prefix: metric.prefix,
            suffix: metric.suffix,
            decimals: metric.decimals,
          }))}
        />

        <div className="flex justify-center xl:pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: hasCompared ? 1 : 0.55, scale: hasCompared ? 1 : 0.95 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300"
          >
            <ArrowRight className="h-4 w-4 text-emerald-300" />
            -{tokenSavings}% tokens
          </motion.div>
        </div>

        <ComparisonCard
          title="After"
          tone="emerald"
          subtitle="LeanLLM refined"
          startCounters={hasCompared}
          metrics={metrics.map((metric) => ({
            label: metric.label,
            value: metric.optimized,
            prefix: metric.prefix,
            suffix: metric.suffix,
            decimals: metric.decimals,
          }))}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-red-300/80">Raw Prompt</p>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-300">{prompt}</p>
        </div>

        <div className="rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">LeanLLM Refined</p>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-200">{previewText}</p>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, LineChart, Menu, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Playground", href: "/playground" },
  { label: "Token Logs", href: "/token-logs" },
  { label: "Settings", href: "/settings" },
];

const liveMetrics = [
  { label: "Cost saved", value: "$48,240", sub: "month to date", accent: "text-emerald-400" },
  { label: "Token reduction", value: "72%", sub: "avg compression", accent: "text-sky-400" },
  { label: "Cache hit rate", value: "61.8%", sub: "rolling 7-day", accent: "text-fuchsia-400" },
  { label: "Routing accuracy", value: "99.2%", sub: "policy match", accent: "text-amber-400" },
];

// Sparkline data pairs [standard, lean]
const sparkPoints = [
  [3200, 980], [3560, 1080], [3340, 1010], [3740, 1160],
  [3480, 980], [3920, 1210], [3660, 1100], [4050, 1190],
];

function LivePreview() {
  const W = 640;
  const H = 72;
  const max = Math.max(...sparkPoints.flat());
  const toXY = (v: number, i: number) =>
    `${(i / (sparkPoints.length - 1)) * W},${H - (v / max) * H}`;

  const standardPts = sparkPoints.map(([s], i) => toXY(s, i)).join(" ");
  const leanPts = sparkPoints.map(([, l], i) => toXY(l, i)).join(" ");

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
            Live · April 2026
          </span>
        </div>
        <span className="font-mono text-[11px] text-zinc-600">281k req today</span>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-px bg-white/[0.06] md:grid-cols-4">
        {liveMetrics.map((m) => (
          <div key={m.label} className="bg-zinc-900/80 px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              {m.label}
            </p>
            <p className={`mt-1.5 font-mono text-2xl font-semibold tabular-nums ${m.accent}`}>
              {m.value}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-600">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div className="border-t border-white/[0.07] px-5 py-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-14 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="heroLeanFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(52,211,153,0.25)" />
              <stop offset="100%" stopColor="rgba(52,211,153,0.01)" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={standardPts}
          />
          <polygon
            fill="url(#heroLeanFill)"
            points={`0,${H} ${leanPts} ${W},${H}`}
          />
          <polyline
            fill="none"
            stroke="rgb(52,211,153)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={leanPts}
          />
        </svg>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-600">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-px w-4 bg-white/30" /> Standard
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-px w-4 bg-emerald-400" /> LeanLLM
            </span>
          </div>
          <span className="font-mono text-[10px] text-emerald-500">↓ 72% avg cost reduction</span>
        </div>
      </div>
    </div>
  );
}

export function LeanLLMHero() {
  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Navbar */}
      <header className="relative pt-4">
        <nav className="flex items-center justify-between rounded-[1.25rem] border border-white/10 bg-black/55 px-4 py-3 shadow-lg backdrop-blur-xl">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center gap-3 text-base font-semibold tracking-tight text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-emerald-300">
                <LineChart className="h-4 w-4" />
              </span>
              LeanLLM
            </Link>
            <div className="hidden items-center space-x-6 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              className="hidden h-8 rounded-full px-3 text-sm font-normal text-zinc-400 hover:text-zinc-100 md:inline-flex"
            >
              Sign in
            </Button>
            <Button className="hidden h-8 rounded-full bg-white px-3 text-sm font-normal text-black hover:bg-white/90 md:inline-flex">
              Get access
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-zinc-300 md:hidden"
                >
                  <Menu className="h-[15px] w-[15px]" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[260px] border-white/10 bg-zinc-950 text-white sm:w-[320px]"
              >
                <nav className="mt-8 flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    className="justify-start rounded-full px-3 text-zinc-400 hover:text-zinc-100"
                  >
                    Sign in
                  </Button>
                  <Button className="rounded-full bg-white text-black hover:bg-white/90">
                    Get access
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative mx-auto px-2">
        <section className="w-full py-14 md:py-24 lg:py-28">
          <motion.div
            className="flex flex-col items-center space-y-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300">
                <Zap className="h-3 w-3" />
                Now in beta — join the waitlist
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Stop overpaying for tokens{" "}
              <span className="text-zinc-500">you don&apos;t need.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              className="mx-auto max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              LeanLLM routes, compresses, and caches your LLM traffic — so the same
              quality output costs a fraction of what you&apos;re spending now.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button
                asChild
                className="h-10 rounded-xl bg-white px-5 text-sm font-medium text-black hover:bg-white/90"
              >
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-xl border-white/10 bg-white/5 px-5 text-sm font-medium text-white hover:bg-white/10"
              >
                <Link href="/playground">Try the playground</Link>
              </Button>
            </motion.div>

            {/* Live preview — replaces the static screenshot */}
            <motion.div
              className="w-full pt-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
            >
              <LivePreview />
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
import {
  ArrowUpRight,
  Binary,
  CircleDollarSign,
  Gauge,
  Layers3,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";

import { GlowCard } from "@/components/ui/glow-card";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total Saved",
    value: "$48,240",
    detail: "Month to date",
    delta: "+18.4%",
    glowColor: "green" as const,
    icon: CircleDollarSign,
    positive: true,
  },
  {
    label: "Token Reduction",
    value: "72%",
    detail: "Average compression",
    delta: "−1.2ms / req",
    glowColor: "blue" as const,
    icon: Binary,
    positive: true,
  },
  {
    label: "Cache Hit Rate",
    value: "61.8%",
    detail: "Rolling 7-day window",
    delta: "+7.1%",
    glowColor: "purple" as const,
    icon: Layers3,
    positive: true,
  },
  {
    label: "Routing Accuracy",
    value: "99.2%",
    detail: "Policy match confidence",
    delta: "Stable",
    glowColor: "orange" as const,
    icon: ShieldCheck,
    positive: null,
  },
];

const chartData = [
  { day: "Apr 01", standard: 3200, lean: 980 },
  { day: "Apr 05", standard: 3560, lean: 1080 },
  { day: "Apr 09", standard: 3340, lean: 1010 },
  { day: "Apr 13", standard: 3740, lean: 1160 },
  { day: "Apr 17", standard: 3480, lean: 980 },
  { day: "Apr 21", standard: 3920, lean: 1210 },
  { day: "Apr 25", standard: 3660, lean: 1100 },
  { day: "Apr 30", standard: 4050, lean: 1190 },
];

const routeRows = [
  {
    model: "Llama-3-Small",
    share: "80%",
    tasks: "Search, tagging, summaries",
    complexity: "Low",
    tone: "bg-emerald-400",
  },
  {
    model: "GPT-4o",
    share: "20%",
    tasks: "Reasoning, edge cases",
    complexity: "High",
    tone: "bg-sky-400",
  },
  {
    model: "Claude 3.5 Sonnet",
    share: "12%",
    tasks: "Long-form synthesis",
    complexity: "Medium",
    tone: "bg-fuchsia-400",
  },
];

// ─── Stat Card ──────────────────────────────────────────────────────────────

function QuantStatCard({
  label,
  value,
  detail,
  delta,
  glowColor,
  icon: Icon,
  positive,
}: (typeof stats)[number]) {
  const deltaColor =
    positive === true
      ? "text-emerald-300"
      : positive === false
        ? "text-red-400"
        : "text-zinc-400";

  return (
    <GlowCard glowColor={glowColor} customSize className="h-full w-full rounded-2xl p-0">
      <div className="relative flex h-full min-h-[180px] flex-col rounded-2xl bg-zinc-950/80 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-zinc-200">
            <Icon className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-[11px]",
              deltaColor
            )}
          >
            {positive === true && <ArrowUpRight className="h-3 w-3" />}
            {delta}
          </span>
        </div>

        <div className="mt-auto pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</p>
          <p className="mt-2 font-mono text-4xl font-semibold tabular-nums tracking-tight text-white">
            {value}
          </p>
          <p className="mt-1.5 text-sm text-zinc-500">{detail}</p>
        </div>
      </div>
    </GlowCard>
  );
}

// ─── Cost Chart ─────────────────────────────────────────────────────────────

function CostChart() {
  const W = 760;
  const H = 280;
  const padX = 30;
  const padY = 24;
  const maxValue = Math.max(...chartData.flatMap((p) => [p.standard, p.lean]));

  const toPoint = (value: number, index: number) => {
    const x = padX + (index * (W - padX * 2)) / (chartData.length - 1);
    const y = H - padY - (value / maxValue) * (H - padY * 2);
    return { x, y, s: `${x},${y}` };
  };

  const standardPts = chartData.map((p, i) => toPoint(p.standard, i));
  const leanPts = chartData.map((p, i) => toPoint(p.lean, i));

  const standardLine = standardPts.map((p) => p.s).join(" ");
  const leanLine = leanPts.map((p) => p.s).join(" ");

  // Y-axis labels
  const yLabels = [1000, 2000, 3000, 4000].map((v) => ({
    v,
    y: H - padY - (v / maxValue) * (H - padY * 2),
    label: `$${(v / 100).toFixed(0)}`,
  }));

  return (
    <section className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            Cost Trend
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
            Standard vs. optimized cost — April 2026
          </h3>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-zinc-400">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-zinc-400" />
            Standard
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            LeanLLM
          </span>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.07] bg-black/25 px-4 pb-4 pt-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-[260px] w-full"
          aria-label="Cost comparison chart"
        >
          <defs>
            <linearGradient id="leanFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(52,211,153,0.3)" />
              <stop offset="100%" stopColor="rgba(52,211,153,0.01)" />
            </linearGradient>
          </defs>

          {/* Grid lines + Y labels */}
          {yLabels.map(({ v, y, label }) => (
            <g key={v}>
              <line
                x1={padX}
                y1={y}
                x2={W - padX}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 6"
              />
              <text
                x={padX - 6}
                y={y + 4}
                fill="rgba(113,113,122,0.8)"
                fontSize="10"
                textAnchor="end"
                fontFamily="monospace"
              >
                {label}
              </text>
            </g>
          ))}

          {/* Standard line */}
          <polyline
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={standardLine}
          />

          {/* Lean fill + line */}
          <polygon
            fill="url(#leanFill)"
            points={`${padX},${H - padY} ${leanLine} ${W - padX},${H - padY}`}
          />
          <polyline
            fill="none"
            stroke="rgb(52,211,153)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={leanLine}
          />

          {/* Points + x-axis labels */}
          {chartData.map((point, index) => {
            const sp = standardPts[index];
            const lp = leanPts[index];
            return (
              <g key={point.day}>
                <circle cx={sp.x} cy={sp.y} r="3.5" fill="rgba(255,255,255,0.8)" />
                <circle cx={lp.x} cy={lp.y} r="3.5" fill="rgb(52,211,153)" />
                {/* Only show every other label to avoid crowding */}
                {index % 2 === 0 && (
                  <text
                    x={sp.x}
                    y={H - 6}
                    fill="rgba(113,113,122,0.7)"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {point.day}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

// ─── Routing Table ───────────────────────────────────────────────────────────

function RoutingTable() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            Routing Mix
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
            Model allocation by task complexity
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-zinc-400">
          <Gauge className="h-3.5 w-3.5 text-emerald-400" />
          Live policy
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.07]">
        <div className="grid grid-cols-[1.4fr_0.6fr_1.4fr_0.8fr] gap-4 bg-white/[0.03] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          <span>Model</span>
          <span>Share</span>
          <span>Task Profile</span>
          <span>Complexity</span>
        </div>

        {routeRows.map((row, index) => (
          <div
            key={`${row.model}-${index}`}
            className="grid grid-cols-[1.4fr_0.6fr_1.4fr_0.8fr] gap-4 border-t border-white/[0.06] bg-black/15 px-5 py-4 text-sm text-zinc-300 transition-colors hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-3">
              <span className={cn("h-2 w-2 shrink-0 rounded-full", row.tone)} />
              <span className="font-medium text-white">{row.model}</span>
            </div>
            <span className="font-mono font-medium text-white">{row.share}</span>
            <span className="text-zinc-400">{row.tasks}</span>
            <span className="text-zinc-500">{row.complexity}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Side Panel ──────────────────────────────────────────────────────────────

function SidePanel() {
  const snapshots: [string, string, string][] = [
    ["Requests", "8.4M", "+12%"],
    ["Median latency", "182ms", "−26ms"],
    ["Cache reused", "1.9M", "+9%"],
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
          Session Summary
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">This month at a glance</h3>
        <div className="mt-5 space-y-2.5">
          {snapshots.map(([label, value, delta]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/30 px-4 py-3.5"
            >
              <div>
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-white">
                  {value}
                </p>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-300">
                {delta}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.06] p-5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            Policy Health
          </p>
          <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <h3 className="mt-2 text-lg font-semibold text-white">
          Guardrails and thresholds stable
        </h3>
        <div className="mt-5 space-y-2">
          {[
            "Budget thresholds enforced",
            "Fallback paths available",
            "Cache invalidation within target",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/25 px-4 py-3 text-sm"
            >
              <span className="text-zinc-300">{item}</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
          ))}
        </div>
      </section>

      {/* Spend summary callout */}
      <section className="rounded-2xl border border-white/[0.07] bg-black/20 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-600">
          Quick Figures
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/[0.06] bg-zinc-900/50 p-3.5">
            <p className="text-xs text-zinc-500">30D avoided</p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-white">$48.2k</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-zinc-900/50 p-3.5">
            <p className="text-xs text-zinc-500">Daily volume</p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-white">281k</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Dashboard Header ────────────────────────────────────────────────────────

function DashboardHeader() {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          LeanLLM · Overview
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">Dashboard</h2>
      </div>
      <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        April 2026 · Updated just now
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function LeanLlmDashboardOverview() {
  return (
    <div className="space-y-6">
      <DashboardHeader />

      {/* Stats grid */}
      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {stats.map((stat) => (
          <QuantStatCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* Chart + table + side panel */}
      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <CostChart />
          <RoutingTable />
        </div>
        <SidePanel />
      </section>
    </div>
  );
}
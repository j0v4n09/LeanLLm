import {
  ArrowUpRight,
  Binary,
  CircleDollarSign,
  Gauge,
  Layers3,
  ShieldCheck,
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
  },
  {
    label: "Token Reduction",
    value: "72%",
    detail: "Average compression",
    delta: "-1.2ms/request",
    glowColor: "blue" as const,
    icon: Binary,
  },
  {
    label: "Cache Hit Rate",
    value: "61.8%",
    detail: "Rolling 7-day window",
    delta: "+7.1%",
    glowColor: "purple" as const,
    icon: Layers3,
  },
  {
    label: "Routing Accuracy",
    value: "99.2%",
    detail: "Policy match confidence",
    delta: "Stable",
    glowColor: "orange" as const,
    icon: ShieldCheck,
  },
];

const chartData = [
  { day: "01", standard: 3200, lean: 980 },
  { day: "05", standard: 3560, lean: 1080 },
  { day: "09", standard: 3340, lean: 1010 },
  { day: "13", standard: 3740, lean: 1160 },
  { day: "17", standard: 3480, lean: 980 },
  { day: "21", standard: 3920, lean: 1210 },
  { day: "25", standard: 3660, lean: 1100 },
  { day: "30", standard: 4050, lean: 1190 },
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

function QuantStatCard({
  label,
  value,
  detail,
  delta,
  glowColor,
  icon: Icon,
}: (typeof stats)[number]) {
  return (
    <GlowCard glowColor={glowColor} customSize className="h-full w-full rounded-2xl p-0">
      <div className="relative flex h-full min-h-[190px] flex-col rounded-2xl bg-zinc-950/80 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-zinc-200">
            <Icon className="h-5 w-5" />
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-300" />
            {delta}
          </div>
        </div>

        <div className="mt-10">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-sm text-zinc-400">{detail}</p>
        </div>
      </div>
    </GlowCard>
  );
}

function CostChart() {
  const width = 760;
  const height = 290;
  const padding = 26;
  const maxValue = Math.max(...chartData.flatMap((point) => [point.standard, point.lean]));

  const toPoint = (value: number, index: number) => {
    const x = padding + (index * (width - padding * 2)) / (chartData.length - 1);
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  };

  const standardLine = chartData.map((point, index) => toPoint(point.standard, index)).join(" ");
  const leanLine = chartData.map((point, index) => toPoint(point.lean, index)).join(" ");

  return (
    <section className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Cost Trend</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Standard cost vs optimized cost
          </h3>
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            Standard Cost
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            LeanLLM Cost
          </span>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[290px] w-full" aria-label="Cost comparison chart">
          <defs>
            <linearGradient id="leanFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(52,211,153,0.35)" />
              <stop offset="100%" stopColor="rgba(52,211,153,0.02)" />
            </linearGradient>
          </defs>

          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const y = height - padding - ratio * (height - padding * 2);
            return (
              <line
                key={ratio}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 8"
              />
            );
          })}

          <polyline
            fill="none"
            stroke="rgba(255,255,255,0.75)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={standardLine}
          />

          <polyline
            fill="none"
            stroke="rgb(74, 222, 128)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={leanLine}
          />

          <polygon
            fill="url(#leanFill)"
            points={`${padding},${height - padding} ${leanLine} ${width - padding},${height - padding}`}
          />

          {chartData.map((point, index) => {
            const [sx, sy] = toPoint(point.standard, index).split(",");
            const [lx, ly] = toPoint(point.lean, index).split(",");
            return (
              <g key={point.day}>
                <circle cx={sx} cy={sy} r="4" fill="rgba(255,255,255,0.9)" />
                <circle cx={lx} cy={ly} r="4" fill="rgb(74, 222, 128)" />
                <text x={sx} y={height - 6} fill="rgba(161,161,170,0.9)" fontSize="12" textAnchor="middle">
                  {point.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

function RoutingTable() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Routing Mix</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">Model allocation by task complexity</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300">
          <Gauge className="h-4 w-4 text-emerald-300" />
          Live policy
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[1.2fr_0.7fr_1.2fr_0.8fr] gap-4 bg-white/[0.04] px-5 py-4 text-xs uppercase tracking-[0.2em] text-zinc-500">
          <span>Model</span>
          <span>Share</span>
          <span>Task Profile</span>
          <span>Complexity</span>
        </div>

        {routeRows.map((row, index) => (
          <div
            key={`${row.model}-${index}`}
            className="grid grid-cols-[1.2fr_0.7fr_1.2fr_0.8fr] gap-4 border-t border-white/10 bg-black/20 px-5 py-5 text-sm text-zinc-300"
          >
            <div className="flex items-center gap-3">
              <span className={cn("h-2.5 w-2.5 rounded-full", row.tone)} />
              <span className="font-medium text-white">{row.model}</span>
            </div>
            <span className="font-medium text-white">{row.share}</span>
            <span>{row.tasks}</span>
            <span className="text-zinc-400">{row.complexity}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SidePanel() {
  const snapshots = [
    ["Requests", "8.4M", "+12%"],
    ["Median latency", "182ms", "-26ms"],
    ["Cache reused", "1.9M", "+9%"],
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Session Summary</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">This month at a glance</h3>
        <div className="mt-6 space-y-4">
          {snapshots.map(([label, value, delta]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl bg-black/30 px-4 py-4">
              <div>
                <p className="text-sm text-zinc-400">{label}</p>
                <p className="mt-1 text-xl font-semibold text-white">{value}</p>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                {delta}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Policy Health</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Guardrails and thresholds are stable</h3>
        <div className="mt-6 space-y-3">
          {[
            "Budget thresholds enforced",
            "Fallback paths available",
            "Cache invalidation within target",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300"
            >
              <span>{item}</span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function LeanLlmDashboardOverview() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 sm:p-8">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Overview</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Cost discipline, routing quality, and speed in one view.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              A cleaner read on what the system is saving, where requests are going, and how efficiently
              the stack is performing day to day.
            </p>
          </div>

          <div className="grid w-full max-w-md grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-zinc-500">30D spend avoided</p>
              <p className="mt-2 text-3xl font-semibold text-white">$48.2k</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-zinc-500">Daily volume</p>
              <p className="mt-2 text-3xl font-semibold text-white">281k</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {stats.map((stat) => (
          <QuantStatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <CostChart />
          <RoutingTable />
        </div>
        <SidePanel />
      </section>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Braces, LayoutDashboard, Menu, Settings, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Playground", href: "/playground", icon: Wand2 },
  { label: "Token Logs", href: "/token-logs", icon: Braces },
  { label: "Settings", href: "/settings", icon: Settings },
];

const pageMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  "/dashboard": {
    eyebrow: "Overview",
    title: "Operational dashboard",
    description: "Track savings, routing quality, and performance from one place.",
  },
  "/playground": {
    eyebrow: "Playground",
    title: "Request comparison",
    description: "Compare the original request with the optimized version side by side.",
  },
  "/token-logs": {
    eyebrow: "Token Logs",
    title: "Usage visibility",
    description: "Inspect token flow, cache behavior, and compression savings across requests.",
  },
  "/settings": {
    eyebrow: "Settings",
    title: "Runtime controls",
    description: "Tune routing policies, safeguards, and budget thresholds.",
  },
};

function StatusPill() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-50">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
      </span>
      <span className="font-medium">Network Status: Optimized</span>
    </div>
  );
}

function TopNavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
              active
                ? "border-emerald-400/30 bg-emerald-500/10 text-white"
                : "border-transparent text-zinc-300 hover:border-white/10 hover:bg-white/8 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? pageMeta["/dashboard"];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="relative isolate min-h-screen overflow-hidden bg-lean-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_24%),linear-gradient(to_bottom,rgba(24,24,27,0.2),rgba(9,9,11,0.95))]" />
        <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8">
          <header className="glass-panel sticky top-4 z-40 rounded-[1.75rem] px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-emerald-300">
                    <BarChart3 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold tracking-tight text-white">LeanLLM</p>
                    <p className="text-sm text-zinc-500">Performance workspace</p>
                  </div>
                </Link>

                <Separator orientation="vertical" className="hidden h-8 lg:block" />
                <div className="hidden lg:block">
                  <TopNavLinks />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden xl:block">
                  <StatusPill />
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 lg:hidden"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Open navigation</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="border-white/10 bg-zinc-950 text-white">
                    <div className="mt-8 space-y-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Navigation</p>
                        <div className="mt-4 space-y-2">
                          {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href;
                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
                                  active
                                    ? "border-emerald-400/30 bg-emerald-500/10 text-white"
                                    : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                                {item.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                      <StatusPill />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>

          <section className="px-1 pb-8 pt-6 sm:px-0">
            <div className="mb-6 rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-5 py-5 sm:px-6">
              <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">{meta.eyebrow}</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{meta.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">{meta.description}</p>
            </div>

            {children}
          </section>
        </div>
      </div>
    </main>
  );
}

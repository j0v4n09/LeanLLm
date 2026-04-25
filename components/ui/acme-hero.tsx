"use client";

import Link from "next/link";
import { FingerprintIcon, LineChart, Menu, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Playground", href: "/playground" },
  { label: "Token Logs", href: "/token-logs" },
  { label: "Settings", href: "/settings" },
];

export function AcmeHero() {
  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <header className="relative pt-4">
        <nav className="flex items-center justify-between rounded-[1.25rem] border border-white/10 bg-black/55 px-4 py-3 shadow-lg backdrop-blur-xl">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-3 text-base font-semibold tracking-tight text-white">
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
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full text-zinc-300">
              <Sun className="h-[15px] w-[15px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[15px] w-[15px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Separator orientation="vertical" className="hidden h-6 md:block" />
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
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-zinc-300 md:hidden">
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
                  <Button variant="ghost" className="justify-start rounded-full px-3 text-zinc-400 hover:text-zinc-100">
                    Sign in
                  </Button>
                  <Button className="rounded-full bg-white text-black hover:bg-white/90">Get access</Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <main className="relative mx-auto px-2">
        <section className="w-full py-14 md:py-24 lg:py-28 xl:py-32">
          <motion.div
            className="flex flex-col items-center space-y-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Routing, caching, and cost control in one elegant layer.
            </motion.h1>
            <motion.p
              className="mx-auto max-w-2xl text-base text-zinc-400 sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Keep prompts lean, responses fast, and spend predictable with a workflow that feels
              more like a product than an experiment.
            </motion.p>
            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button className="rounded-xl bg-white text-black hover:bg-white/90">
                Explore Dashboard
                <span className="ml-2 hidden space-x-1 sm:inline-flex">
                  <FingerprintIcon className="h-5 w-5" />
                </span>
              </Button>
              <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                <span className="mr-2 hidden space-x-1 sm:inline-flex">
                  <span className="flex h-5 w-5 items-center justify-center rounded-sm border border-white/10 text-xs">⌘</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-sm border border-white/10 text-xs">K</span>
                </span>
                Try Playground
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-col items-center space-y-3 pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-emerald-300 transition-colors hover:text-emerald-200">Prompt Compression</span>
                <span className="text-zinc-500">Semantic Cache</span>
                <span className="text-sky-300 transition-colors hover:text-sky-200">Routing Policies</span>
              </div>
              <p className="text-sm text-zinc-500">A cleaner starting point for the rest of the product surface.</p>
            </motion.div>

            <motion.div
              className="w-full rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="relative w-full overflow-hidden rounded-[1.5rem] border border-white/10 shadow-2xl">
                <img
                  src="https://ui.shadcn.com/examples/dashboard-dark.png"
                  alt="Analytics dashboard preview"
                  className="block h-full w-full rounded-[1.5rem] object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-zinc-950 to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

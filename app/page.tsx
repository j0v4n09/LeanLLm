import { AcmeHero } from "@/components/ui/acme-hero";
import { LeanLlmDashboardOverview } from "@/components/ui/saa-s-template";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="relative overflow-hidden bg-lean-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_24%),linear-gradient(to_bottom,rgba(24,24,27,0.15),rgba(9,9,11,0.96))]" />
        <div className="relative py-4">
          <AcmeHero />
          <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl sm:p-8">
              <LeanLlmDashboardOverview />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

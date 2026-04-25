export default function SettingsPage() {
  const settings = [
    ["Auto-refine inbound prompts", "Enabled"],
    ["Fallback provider chain", "Claude -> GPT -> Llama"],
    ["Latency budget threshold", "400ms"],
    ["Cost ceiling per request", "$0.012"],
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">Settings</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Middleware policies that stay under control.
        </h2>
        <p className="mt-4 text-base leading-7 text-zinc-400">
          Adjust the defaults that shape request refinement, provider routing, and runtime spend.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {settings.map(([label, value]) => (
          <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="mt-3 text-xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

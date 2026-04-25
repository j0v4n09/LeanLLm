export default function TokenLogsPage() {
  const rows = [
    ["Input Tokens", "1,482,220", "+12% vs last week"],
    ["Cache Hits", "640,440", "43.2% hit rate"],
    ["Compressed Tokens", "411,102", "Saved before provider dispatch"],
    ["Guardrail Rewrites", "82,410", "Safety and format normalization"],
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">Token Logs</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Token flow with operational context.
        </h2>
        <p className="mt-4 text-base leading-7 text-zinc-400">
          Track where LeanLLM removes waste before the request ever reaches a provider.
        </p>
      </div>

      <div className="mt-8 grid gap-4">
        {rows.map(([label, value, detail]) => (
          <div
            key={label}
            className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-black/30 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm text-zinc-400">{label}</p>
              <p className="mt-1 text-sm text-zinc-500">{detail}</p>
            </div>
            <p className="text-2xl font-semibold tracking-tight text-white">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

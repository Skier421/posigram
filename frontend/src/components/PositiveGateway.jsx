import { useEffect, useState } from "react";

const gatewayOptions = [
  "I am strong and ready for today.",
  "I am kind to myself and others.",
  "I am growing through every moment.",
  "I am capable of gentle progress.",
  "I choose care over comparison.",
  "I am worthy of rest and support.",
];

export default function PositiveGateway({ onUnlock }) {
  const [statement, setStatement] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!shake) return;
    const timeout = window.setTimeout(() => setShake(false), 400);
    return () => window.clearTimeout(timeout);
  }, [shake]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (statement) {
      setError("");
      onUnlock();
      return;
    }

    setError("Please choose one of the positive statements to unlock your feed.");
    setShake(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 text-white shadow-2xl shadow-slate-950/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.24),_transparent_28%)]" />
        <div className="relative p-8 sm:p-12">
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/10 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">Positive Mindset Gateway</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">Choose a warm truth to unlock your day.</h2>
            <p className="mt-4 max-w-2xl text-slate-200/90">
              This is your daily reminder that care begins from within. Select a true and empowering statement.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.24em] text-slate-200">
                Pick your statement
              </label>
              <select
                value={statement}
                onChange={(event) => setStatement(event.target.value)}
                className={`mt-4 w-full rounded-3xl border px-5 py-4 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-300/40 ${
                  shake ? "animate-shake border-rose-400 bg-rose-50/80" : "border-white/20 bg-white/90"
                }`}
              >
                <option value="">Select a gentle affirmation</option>
                {gatewayOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-sm text-rose-200">{error}</p>}
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Unlock my feed
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

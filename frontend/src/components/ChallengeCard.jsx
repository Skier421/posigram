export default function ChallengeCard({ challenge, onComplete }) {
  if (!challenge) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-slate-500">No active challenge is available right now.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-600">
            Today’s challenge
          </p>
          <h2 className="mt-3 text-3xl font-semibold">{challenge.title}</h2>
          <p className="mt-4 text-slate-600">{challenge.description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Mark complete
      </button>
    </div>
  );
}

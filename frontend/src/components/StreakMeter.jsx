export default function StreakMeter({ streakCount }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Kindness streak</p>
      <p className="mt-3 text-4xl font-semibold text-emerald-700">{streakCount || 0}</p>
      <p className="mt-2 text-slate-600">days of daily reflection in a row</p>
    </div>
  );
}

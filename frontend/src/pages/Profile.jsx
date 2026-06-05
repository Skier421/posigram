export default function Profile() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Your Profile</h1>
        <p className="mt-4 text-slate-600">
          Track your streaks, review your history, and celebrate the kindness you’ve shared.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Streak Achievements</h2>
            <p className="mt-3 text-slate-600">You are currently on a 5-day kindness streak.</p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent wins</h2>
            <p className="mt-3 text-slate-600">You completed today’s reflection and unlocked a Joy Drop.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

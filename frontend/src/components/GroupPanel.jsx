export default function GroupPanel({ group }) {
  if (!group) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">No active Empathy Pod</h2>
        <p className="mt-3 text-slate-600">
          Create or join a Pod to share your challenge completions with close friends.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Empathy Pod</p>
          <h2 className="mt-2 text-xl font-semibold">{group.name}</h2>
        </div>
      </div>

      <p className="mt-4 text-slate-600">{group.description}</p>

      <div className="mt-6 space-y-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Owner</p>
          <p className="mt-1 font-medium">{group.owner_name}</p>
        </div>
      </div>
    </div>
  );
}

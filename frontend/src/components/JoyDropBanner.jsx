export default function JoyDropBanner({ joyDrop }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-600 p-3 text-white">✨</div>
        <div>
          <p className="text-sm font-semibold text-emerald-800">Joy Drop</p>
          <p className="mt-2 text-slate-700">
            {joyDrop?.unlocked
              ? "Your encouragement reward is ready."
              : "Complete your action to receive a Joy Drop."}
          </p>
        </div>
      </div>
    </div>
  );
}

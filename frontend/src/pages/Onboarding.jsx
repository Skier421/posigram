import { useState } from "react";
import { useNavigate } from "react-router-dom";

const focusOptions = [
  { id: "positivity", label: "Build Self-Positivity", description: "Find kinder ways to talk to yourself every day." },
  { id: "friendships", label: "Strengthen Friendships", description: "Create gentle moments of connection with people you care about." },
  { id: "gratitude", label: "Practice Daily Gratitude", description: "Notice the little good things that brighten your day." },
];

const joyTags = ["Nature", "Music", "Words of Affirmation", "Helping Others", "Mindful Movement", "Art & Creativity"];

export default function Onboarding({ pendingUser, onFinish }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [focus, setFocus] = useState(null);
  const [tags, setTags] = useState([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const nextStep = () => setStep((value) => Math.min(4, value + 1));
  const prevStep = () => setStep((value) => Math.max(1, value - 1));

  const toggleTag = (tag) => {
    setTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  };

  const completeOnboarding = () => {
    if (step === 4 && !password.trim()) {
      setError("Create a password to finish your account.");
      return;
    }

    if (step === 4) {
      onFinish({ focus, tags, password, remember: pendingUser?.remember });
      navigate("/");
      return;
    }

    setStep((value) => Math.min(4, value + 1));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
            Step {step} of 4
          </span>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Welcome, {pendingUser?.firstName || "friend"}.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            We’ll take you through a warm onboarding flow before your account is finalized.
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-2xl font-semibold text-slate-900">A softer social experience</h2>
              <p className="mt-3 text-slate-600">
                Instead of noise and comparison, you’ll get warm daily challenges, private support from your Empathy Pod, and joyful reminders that kindness is progress.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">Daily Comfort</h3>
                <p className="mt-3 text-slate-600">A single meaningful challenge every day, not an endless feed.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">Support, not scales</h3>
                <p className="mt-3 text-slate-600">Only supportive reactions and group care, no likes or vanity counts.</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Choose your focus</h2>
              <p className="mt-3 text-slate-600">This helps us tailor your daily challenge energy.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {focusOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFocus(option.id)}
                  className={`rounded-3xl border p-5 text-left transition duration-200 ${
                    focus === option.id
                      ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100/40 ring-2 ring-indigo-200"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{option.id}</p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{option.label}</h3>
                  <p className="mt-2 text-slate-600">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">What brings you joy?</h2>
              <p className="mt-3 text-slate-600">Pick a few things that feel grounding and uplifting.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {joyTags.map((tag) => {
                const active = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-4 py-2 text-sm transition duration-200 ${
                      active
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-200/70"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Create your account</h2>
              <p className="mt-3 text-slate-600">
                Choose a password below so your account is ready once your onboarding is complete.
              </p>
            </div>
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <label className="block text-sm font-semibold text-slate-700">Create a password</label>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                placeholder="Choose a secure password"
              />
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={completeOnboarding}
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {step < 4 ? "Continue" : "Finish and create account"}
          </button>
        </div>
      </div>
    </div>
  );
}

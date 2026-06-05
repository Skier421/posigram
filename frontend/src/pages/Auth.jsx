import { useEffect, useState } from 'react';

export default function Auth({ onLoginSuccess }) {
  const [mode, setMode] = useState('create');
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const invite = new URLSearchParams(window.location.search).get('invitePod');
    if (invite) {
      localStorage.setItem('mcc_invite_pod', invite);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = firstName.trim();
    if (!trimmedName) {
      setError('Enter your first name to continue.');
      return;
    }

    setError('');
    onLoginSuccess(trimmedName, mode === 'create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#020205] via-[#0b0f2b] to-[#050212] text-slate-100 flex items-center justify-center relative overflow-hidden">
      {/* Ambient nebula glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,rgba(167,139,250,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.08),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.05),transparent_50%)] pointer-events-none" />
      

      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40 animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's'
            }}
          />
        ))}
      </div>
      
      <div className="relative mx-auto w-full max-w-md px-6 py-10 z-10">
        <div className="space-y-8">
          {/* Header */}
          <section className="text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-purple-300 font-bold">✨ Welcome to Your Orbit</p>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 bg-clip-text text-transparent leading-tight">
              {mode === 'create' ? 'Start your journey' : 'Welcome back'}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              {mode === 'create' 
                ? 'Celebrate your kindness daily. Build your streak. Connect with friends who get it.'
                : 'Your reflections are waiting for you.'}
            </p>
          </section>

          {/* Form Card */}
          <section className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8 space-y-6">
            {/* Mode toggle */}
            <div className="flex gap-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 p-1.5">
              <button
                type="button"
                onClick={() => setMode('create')}
                className={`flex-1 rounded-full px-5 py-3 text-xs font-bold transition transform ${
                  mode === 'create'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_4px_14px_0_rgba(124,58,237,0.4)]'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                New Account
              </button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 rounded-full px-5 py-3 text-xs font-bold transition transform ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_4px_14px_0_rgba(124,58,237,0.4)]'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">What's your name? 👋</label>
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Tell us your name"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md px-5 py-4 text-slate-100 placeholder-slate-400 outline-none transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)] text-base"
                />
              </div>

              {error ? <p className="text-sm font-semibold text-pink-400 flex items-center gap-2">⚠️ {error}</p> : null}

              <button
                type="submit"
                className="w-full rounded-full px-6 py-4 text-base font-bold text-white transition transform shadow-[0_4px_14px_0_rgba(124,58,237,0.4)] bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 hover:scale-105 active:scale-95"
              >
                {mode === 'create' ? '✨ Create Account' : 'Sign In'}
              </button>
            </form>

            <p className="text-xs text-slate-400 text-center leading-relaxed">
              {mode === 'create'
                ? "No email, no noise. Just your name and you're ready to go."
                : "Same name = same account. Your reflections are waiting."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

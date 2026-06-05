import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const positiveNews = [
  {
    title: 'Community gardens bring neighbors together in São Paulo',
    source: 'Global Green',
    country: 'Brazil',
    summary: 'Volunteers transformed vacant lots into small gardens, sharing food and weekly potlucks to strengthen local ties.',
  },
  {
    title: 'Students write letters to isolated elders in Tokyo',
    source: 'Kindness Weekly',
    country: 'Japan',
    summary: 'A school program bridges generations through hand-written notes and regular visits, reducing loneliness.',
  },
  {
    title: 'Clean-water project restores a river community in Kenya',
    source: 'Bright Future News',
    country: 'Kenya',
    summary: 'A small solar-powered pump now provides clean water for hundreds of families and creates time for learning.',
  },
];

const defaultPodName = 'Empathy Circle';
const joyMessages = [
  {
    text: 'Your thoughtful kindness just made someone feel more seen today.',
  },
  {
    text: 'That quiet act of care is the kind of kindness people remember.',
  },
  {
    text: 'You just strengthened someone’s day with a gentle, steady moment of support.',
  },
];

export default function Feed({ user, logOut }) {
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [inPod, setInPod] = useState(false);
  const [podName, setPodName] = useState('');
  const [pendingPodName, setPendingPodName] = useState(defaultPodName);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [joyDrop, setJoyDrop] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState('');
  const [sessionMessage, setSessionMessage] = useState('Choose a technique and duration to begin.');
  const userKey = (key) => `mcc_${user}_${key}`;

  const [streakCount, setStreakCount] = useState(() => {
    const stored = parseInt(localStorage.getItem(userKey('streak')) || '0', 10);
    return Number.isNaN(stored) || stored < 0 ? 0 : stored;
  });
  const [hoursLeft, setHoursLeft] = useState(0);
  const [dailyInsight, setDailyInsight] = useState('');
  const [history, setHistory] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(userKey('history')) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const storedJoinedPod = localStorage.getItem(userKey('joined_pod')) === 'true';
    if (storedJoinedPod) {
      setInPod(true);
      setPodName(localStorage.getItem(userKey('pod_name')) || defaultPodName);
      setShareLink(localStorage.getItem(userKey('share_link')) || '');
    }

    const params = new URLSearchParams(window.location.search);
    const invitePodId = params.get('invitePod');
    if (invitePodId) {
      // If the user lands on an invite link while signed in, join them to the pod safely
      const storedInvites = JSON.parse(localStorage.getItem('mcc_pod_invites') || '{}');
      const podTitle = storedInvites[invitePodId] || defaultPodName;
      const link = `${window.location.origin}${window.location.pathname}?invitePod=${encodeURIComponent(invitePodId)}`;

      // add current user to members list without changing active identity
      const activeUser = user || localStorage.getItem('mcc_user');
      if (activeUser) {
        const membersKey = `mcc_pod_members_${invitePodId}`;
        const existing = JSON.parse(localStorage.getItem(membersKey) || '[]');
        if (!existing.includes(activeUser)) {
          localStorage.setItem(membersKey, JSON.stringify([...existing, activeUser]));
        }

        // mark this user as joined for their account keys
        localStorage.setItem(`mcc_${activeUser}_joined_pod`, 'true');
        localStorage.setItem(`mcc_${activeUser}_pod_name`, podTitle);
        localStorage.setItem(`mcc_${activeUser}_share_link`, link);
      }

      setInPod(true);
      setPodName(podTitle);
      setShareLink(link);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    const pendingInvite = localStorage.getItem('mcc_invite_pod');
    if (pendingInvite) {
      const storedInvites = JSON.parse(localStorage.getItem('mcc_pod_invites') || '{}');
      const podTitle = storedInvites[pendingInvite] || defaultPodName;
      const link = `${window.location.origin}${window.location.pathname}?invitePod=${encodeURIComponent(pendingInvite)}`;
      setInPod(true);
      setPodName(podTitle);
      setShareLink(link);
      localStorage.removeItem('mcc_invite_pod');
    }
  }, [user]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const refs = JSON.parse(localStorage.getItem(userKey('reflections')) || '{}');
      if (refs && refs[today]) {
        setReflection(refs[today]);
        setSubmitted(true);
      }
    } catch (e) {
      // noop
    }
  }, [user]);

  useEffect(() => {
    const computeHoursLeft = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
    };

    setHoursLeft(computeHoursLeft());
    const timer = window.setInterval(() => {
      setHoursLeft(computeHoursLeft());
    }, 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const weekProgress = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dayCode = date.toISOString().slice(0, 10);
    return { date: dayCode, done: history.includes(dayCode) };
  });

  const meditationTechniques = [
    {
      label: 'Box Breathing (4-4-4-4)',
      description: 'Slow your breath in a steady rhythm: inhale, hold, exhale, hold. Return your focus to the cycle each time your mind wanders.',
    },
    {
      label: '5-4-3-2-1 Grounding Method',
      description: 'Name five things you see, four things you can touch, three sounds you hear, two smells, and one thing you can taste.',
    },
    {
      label: 'Loving-Kindness (Metta) Reflection',
      description: 'Silently wish well to yourself, someone you care about, a stranger, and someone you find difficult, in gentle, kind phrases.',
    },
  ];

  const durationOptions = [
    { label: '1 Min', seconds: 60 },
    { label: '3 Min', seconds: 180 },
    { label: '5 Min', seconds: 300 },
  ];

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${minutes}:${remainder.toString().padStart(2, '0')}`;
  };

  const getJoyDrop = () => joyMessages[Math.floor(Math.random() * joyMessages.length)];

  const handleTechniqueSelect = (technique) => {
    setSelectedTechnique(technique.label);
    setSessionMessage(technique.description);
    setTimerActive(false);
    setTimeLeft(0);
  };

  const startSession = (seconds) => {
    if (!selectedTechnique) {
      setSessionMessage('Choose a technique first, then start your moment.');
      return;
    }

    setTimeLeft(seconds);
    setTimerActive(true);
    setSessionMessage('Focus on the breath and notice the pause between each inhale and exhale.');
  };

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const tick = window.setTimeout(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(tick);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (timerActive && timeLeft === 0) {
      setTimerActive(false);
      setSessionMessage('Sanctuary moment complete — return with calm energy.');
    }
  }, [timerActive, timeLeft]);

  const handleSubmit = () => {
    if (!reflection.trim()) return;

    const today = new Date().toISOString().slice(0, 10);
    let rawReflections = {};
    try {
      rawReflections = JSON.parse(localStorage.getItem(userKey('reflections')) || '{}');
    } catch (e) {
      rawReflections = {};
    }

    const alreadyHasToday = Boolean(rawReflections[today]);
    rawReflections[today] = reflection.trim();
    localStorage.setItem(userKey('reflections'), JSON.stringify(rawReflections));
    localStorage.setItem(userKey('submitted'), today);
    localStorage.setItem(userKey('last_completed'), today);

    const nextStreak = alreadyHasToday ? streakCount : streakCount + 1;
    setStreakCount(nextStreak);
    localStorage.setItem(userKey('streak'), String(nextStreak));

    const pickedJoyDrop = getJoyDrop();
    setJoyDrop(pickedJoyDrop);
    setSubmitted(true);
    setDailyInsight('Great work today — keep the ripple of kindness going!');

    setHistory((prev) => {
      const next = prev.includes(today) ? prev : [...prev, today];
      const trimmed = next.slice(-60);
      localStorage.setItem(userKey('history'), JSON.stringify(trimmed));
      return trimmed;
    });

    confetti({
      particleCount: 180,
      spread: 120,
      origin: { y: 0.6 },
      colors: ['#ffd166', '#ff6b6b', '#9b5de5'],
    });
  };

  const handleConfirmJoinPod = () => {
    if (!pendingPodName.trim()) return;

    const inviteId = `pod-${Math.random().toString(36).slice(2, 10)}`;
    const link = `${window.location.origin}${window.location.pathname}?invitePod=${encodeURIComponent(inviteId)}`;
    let storedInvites = {};
    try {
      storedInvites = JSON.parse(localStorage.getItem('mcc_pod_invites') || '{}');
    } catch (e) {
      storedInvites = {};
    }

    localStorage.setItem(
      'mcc_pod_invites',
      JSON.stringify({
        ...storedInvites,
        [inviteId]: pendingPodName.trim(),
      })
    );

    const currentUser = localStorage.getItem('mcc_user');
    const membersKey = `mcc_pod_members_${inviteId}`;
    const existing = JSON.parse(localStorage.getItem(membersKey) || '[]');
    if (currentUser && !existing.includes(currentUser)) {
      localStorage.setItem(membersKey, JSON.stringify([...existing, currentUser]));
    }

    localStorage.setItem(userKey('joined_pod'), 'true');
    localStorage.setItem(userKey('pod_name'), pendingPodName.trim());
    localStorage.setItem(userKey('share_link'), link);
    localStorage.setItem(userKey('invite_pod'), inviteId);

    setInPod(true);
    setPodName(pendingPodName.trim());
    setShareLink(link);
    setShowJoinModal(false);

    confetti({
      particleCount: 180,
      spread: 110,
      origin: { y: 0.5 },
      colors: ['#fb923c', '#f59e0b', '#f43f5e'],
    });
  };

  const handleCopyLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      setCopiedLink(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#020205] via-[#0b0f2b] to-[#050212] text-slate-100 flex flex-col gap-10 p-6 md:p-12 max-w-7xl mx-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />
      <section className="relative z-10 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">Hey {user}, you're glowing ✨</h1>
            <p className="mt-3 text-lg text-slate-300">Your kindness ripples further than you know.</p>
          </div>
          <button
            onClick={logOut}
            className="rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:border-white/30 active:scale-95 transform"
          >
            Sign out
          </button>
        </div>
      </section>

      <section className="relative z-10 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-purple-300 font-bold">Space Workspace</p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-100">Choose your lane</h2>
          </div>
          <div className="flex rounded-full bg-slate-900/40 p-1 text-sm text-slate-300">
            <button
              type="button"
              onClick={() => setActiveTab('feed')}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === 'feed' ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)]' : 'hover:bg-white/10'
              }`}
            >
              Feed
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('meditation')}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === 'meditation' ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)]' : 'hover:bg-white/10'
              }`}
            >
              Meditation
            </button>
          </div>
        </div>
      </section>

      {activeTab === 'feed' ? (
        <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-[2.2fr_1fr]">
          <main className="space-y-10">
          <section className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-purple-300 font-bold">🔥 Your Flame</p>
                <h2 className="mt-3 text-3xl font-extrabold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">On fire! Keep it alive.</h2>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-8 text-center ring-4 ring-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                <p className="text-xs uppercase tracking-[0.35em] text-amber-200 font-bold">🌟 Current Streak</p>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <p className="text-5xl font-extrabold text-amber-100">{streakCount}</p>
                  <span className="fire" aria-hidden="true">
                    <svg viewBox="0 0 64 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="g1" x1="0" x2="1">
                          <stop offset="0%" stopColor="#ffd166" />
                          <stop offset="50%" stopColor="#ff6b6b" />
                          <stop offset="100%" stopColor="#ff3b94" />
                        </linearGradient>
                      </defs>
                      <path d="M32 2 C22 18 18 28 18 40 C18 60 30 72 32 88 C34 72 46 60 46 40 C46 28 38 18 32 2 Z" fill="url(#g1)" opacity="0.98"/>
                      <path d="M32 22 C28 32 30 38 30 48 C30 60 36 66 32 80 C36 66 40 60 40 48 C40 38 36 32 32 22 Z" fill="#ffffff22"/>
                    </svg>
                  </span>
                </div>
                <p className="mt-2 text-xs text-amber-300 font-semibold">days of kindness</p>
              </div>
            </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-1">
              <div className="rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-purple-300 font-bold">⏱️ Time Left</p>
                  <p className="mt-4 text-lg text-slate-100 font-semibold">{hoursLeft}h to capture today</p>
                </div>
                {/* removed the 'Your Vibe' card per request */}
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-purple-300 font-bold">📝 Today's Moment</p>
                <h3 className="mt-2 text-3xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">What did you do?</h3>
              </div>
              <button
                onClick={() => setShowJoinModal(true)}
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 px-6 py-3 text-sm font-bold text-white transition transform hover:scale-105 active:scale-95 shadow-[0_4px_14px_0_rgba(124,58,237,0.4)]"
              >
                {inPod ? '➕ New Pod' : '👥 Join Pod'}
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <textarea
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                rows={6}
                placeholder="Tell us your moment of kindness…"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md px-5 py-4 text-slate-100 placeholder-slate-400 outline-none transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={handleSubmit}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 px-8 py-3 text-sm font-bold text-white transition transform hover:scale-105 active:scale-95 shadow-[0_4px_14px_0_rgba(124,58,237,0.4)]"
                >
                  {submitted ? '✨ Update' : 'Share'}
                </button>
                <p className="text-xs text-slate-400 italic">Your streak grows with every reflection.</p>
              </div>
            </div>

            {submitted ? (
              <div className="mt-8 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-md p-6 text-slate-100">
                <p className="text-sm uppercase tracking-[0.35em] text-purple-300 font-bold">🎉 Shared!</p>
                <p className="mt-3 text-lg font-bold text-purple-200">You crushed today's reflection.</p>
                <p className="mt-2 text-slate-200 italic">"{reflection}"</p>
                {joyDrop ? <p className="mt-4 text-base text-pink-200 font-semibold">💭 {joyDrop.text}</p> : null}
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-purple-300 font-bold">🌍 Good Vibes Only</p>
            <h3 className="mt-3 text-3xl font-extrabold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">Kindness around the world</h3>
            <div className="mt-6 space-y-4">
              {positiveNews.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md p-5 hover:border-white/20 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] transition">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-purple-300 font-bold">{item.source}</p>
                      <h4 className="mt-2 text-base font-bold text-slate-100">{item.title}</h4>
                    </div>
                    <span className="rounded-full bg-gradient-to-r from-amber-500/30 to-orange-500/30 px-3 py-1 text-xs font-bold text-amber-200">{item.country}</span>
                  </div>
                  <p className="mt-3 text-slate-300 text-sm">{item.summary}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-8">
          <section className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-pink-300 font-bold">👥 Your Circle</p>
                <h3 className="mt-2 text-xl font-extrabold text-slate-100">{inPod ? podName : 'Solo journey'}</h3>
              </div>
              <button
                onClick={() => setShowJoinModal(true)}
                className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-5 py-2 text-sm font-bold text-white transition transform hover:scale-110 active:scale-95 shadow-[0_4px_14px_0_rgba(236,72,153,0.4)]"
              >
                {inPod ? '⚙️' : '➕'}
              </button>
            </div>
            <p className="mt-4 text-slate-400 text-sm">Bring friends into your orbit and lift each other higher.</p>
            {shareLink ? (
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-md p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-purple-300 font-bold">🔗 Invite Link</p>
                <p className="mt-3 break-all text-slate-200 text-xs font-mono">{shareLink}</p>
                <button
                  onClick={handleCopyLink}
                  className="mt-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-5 py-2 text-sm font-bold text-white transition transform hover:scale-105 active:scale-95 shadow-[0_4px_14px_0_rgba(168,85,247,0.4)]"
                >
                  {copiedLink ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl bg-indigo-950/40 backdrop-blur-xl border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)] p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-purple-300 font-bold">⭐ Your Week</p>
            <div className="mt-5 grid grid-cols-7 gap-2">
              {weekProgress.map((item) => (
                <div
                  key={item.date}
                  title={item.date}
                  className={`h-8 rounded-lg flex items-center justify-center text-lg transition transform ${
                    item.done
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] scale-110 cursor-pointer hover:scale-125'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer'
                  }`}
                >
                  {item.done ? '✨' : '○'}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400 font-semibold">Every day shines brighter. Keep your constellation alive.</p>
          </section>
        </aside>
      </div>
      ) : (
        <section className="relative z-10 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-purple-300 font-bold">🧘 Mindfulness Workspace</p>
              <h2 className="mt-2 text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">Settle into a clear, calm practice</h2>
              <p className="mt-4 text-slate-300 max-w-2xl">Pick a grounded technique, then choose a short timer to anchor your attention. This is a simple, practical space to return to breath and presence.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-6 text-center">
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-purple-400/30 bg-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                  <div className="absolute inset-0 rounded-full border border-purple-300/20 animate-[pulse_4s_ease-in-out_infinite]" />
                  <span className="relative text-3xl font-bold text-white">{formatTimer(timeLeft)}</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">{timerActive ? 'Breathing quietly — stay with the moment.' : sessionMessage}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-1">
            <div className="grid gap-4 lg:grid-cols-3">
              {meditationTechniques.map((technique) => (
                <button
                  key={technique.label}
                  type="button"
                  onClick={() => handleTechniqueSelect(technique)}
                  className={`rounded-3xl border p-6 text-left transition ${
                    selectedTechnique === technique.label
                      ? 'border-purple-400/60 bg-purple-500/10 shadow-[0_10px_30px_rgba(124,58,237,0.25)]'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <p className="text-sm uppercase tracking-[0.35em] text-purple-300 font-bold">{technique.label}</p>
                  <p className="mt-3 text-base text-slate-100">{technique.description}</p>
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-purple-300 font-bold">⏳ Pick a duration</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {durationOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => startSession(option.seconds)}
                    className="rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-purple-400/50 hover:bg-purple-500/10"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => startSession(180)}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-3 text-sm font-bold text-white transition hover:from-purple-600 hover:to-indigo-600"
              >
                Start a 3-minute reset
              </button>
            </div>
          </div>
        </section>
      )}

      {showJoinModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-xl">
          <div className="w-full max-w-2xl rounded-3xl bg-white/[0.05] backdrop-blur-xl border border-white/10 p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] animate-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-purple-300 font-bold">👥 Create Your Pod</p>
                <h3 className="mt-2 text-3xl font-extrabold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Bring your circle together</h3>
              </div>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-slate-300 hover:text-white transition text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2">Pod name 🎯</label>
                <input
                  value={pendingPodName}
                  onChange={(event) => setPendingPodName(event.target.value)}
                  placeholder="e.g., Daily Dreamers, Rise & Shine Crew"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md px-5 py-3 text-slate-100 placeholder-slate-400 outline-none transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-7 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:border-white/30 active:scale-95 transform"
                >
                  Nevermind
                </button>
                <button
                  onClick={handleConfirmJoinPod}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 px-7 py-3 text-sm font-bold text-white transition transform hover:scale-105 active:scale-95 shadow-[0_4px_14px_0_rgba(124,58,237,0.4)]"
                >
                  Create Pod
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

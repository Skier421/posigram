import { useEffect, useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import GroupPanel from "../components/GroupPanel";
import JoyDropBanner from "../components/JoyDropBanner";
import StreakMeter from "../components/StreakMeter";
import api from "../api/client";

export default function Dashboard() {
  const [challenge, setChallenge] = useState(null);
  const [streak, setStreak] = useState(0);
  const [group, setGroup] = useState(null);
  const [joyDrop, setJoyDrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const challengeRes = await api.get("/challenges/today");
        const groupRes = await api.get("/groups/1");
        setChallenge(challengeRes.data.challenge);
        setGroup(groupRes.data.group);
        setStreak(8);
      } catch (err) {
        setError("Unable to load your daily care routine.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const handleComplete = async () => {
    try {
      const payload = {
        challengeId: challenge.id,
        groupId: group?.id,
        reaction: "🌟",
        note: "I checked in with a friend and shared appreciation.",
      };
      const res = await api.post("/challenges/complete", payload);
      setStreak(res.data.streak.streak_count);
      setJoyDrop(res.data.joyDrop);
    } catch (err) {
      setError("Could not complete the challenge. Try again in a moment.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-gray-700">Loading your empathy dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-600">
                Making Caring Common
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                Today’s kindness moment
              </h1>
              <p className="mt-2 text-slate-600 max-w-2xl">
                A daily care ritual designed to build compassion, confidence, and connection.
              </p>
            </div>
            <StreakMeter streakCount={streak} />
          </div>
        </header>

        {error ? (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            {error}
          </div>
        ) : null}

        <main className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="space-y-6">
            <ChallengeCard challenge={challenge} onComplete={handleComplete} />

            <JoyDropBanner joyDrop={joyDrop} />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                    Daily reflection
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">What you unlocked today</h2>
                </div>
              </div>
              <div className="mt-4 text-slate-700">
                {joyDrop ? (
                  <p>{joyDrop.message}</p>
                ) : (
                  <p>
                    Complete today’s action to unlock a Joy Drop — an uplifting note or supportive
                    community art piece.
                  </p>
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <GroupPanel group={group} />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Supportive circle</h2>
              <p className="mt-3 text-slate-600">
                Your Empathy Pod is a private space for shared progress, warm reactions, and
                encouragement without vanity metrics.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

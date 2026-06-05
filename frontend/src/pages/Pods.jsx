import { useEffect, useState } from "react";

function createInviteCode() {
  return `POD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function Pods() {
  const [pods, setPods] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("mcc_pods") || "[]");
    setPods(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("mcc_pods", JSON.stringify(pods));
  }, [pods]);

  const handleCreatePod = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setMessage("Please enter a name for your pod.");
      return;
    }

    const newPod = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim() || "A gentle space for your group to share support.",
      inviteCode: createInviteCode(),
      members: [],
    };

    setPods((current) => [newPod, ...current]);
    setName("");
    setDescription("");
    setMessage(`Pod created. Share this invite code: ${newPod.inviteCode}`);
  };

  const handleJoinPod = (event) => {
    event.preventDefault();
    const foundPod = pods.find((pod) => pod.inviteCode === joinCode.trim().toUpperCase());
    if (!foundPod) {
      setMessage("No pod found for that code. Check it and try again.");
      return;
    }

    setMessage(`You can join ${foundPod.name} using the invite code above.`);
    setJoinCode("");
  };

  const copyInvite = async (code) => {
    await navigator.clipboard.writeText(code);
    setMessage(`Invite code ${code} copied to clipboard.`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Empathy Pods</h1>
            <p className="mt-4 text-slate-600">
              Create a supportive circle, invite people with a simple code, and keep your pod warm and private.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Pod invitations</p>
            <p className="mt-3 text-slate-700">
              Share the invite code with friends and encourage kind check-ins together.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <section className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
            <h2 className="text-2xl font-semibold text-slate-900">Create a new pod</h2>
            <form onSubmit={handleCreatePod} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Pod name</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                  placeholder="Gentle Growth Circle"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                  rows={3}
                  placeholder="A safe space for kind support and daily check-ins."
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Create pod
              </button>
            </form>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Join with an invite code</h3>
              <form onSubmit={handleJoinPod} className="mt-4 space-y-4">
                <input
                  value={joinCode}
                  onChange={(event) => setJoinCode(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                  placeholder="Enter a pod invite code"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Join pod
                </button>
              </form>
            </div>
            {message ? <p className="text-sm text-slate-700">{message}</p> : null}
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Your pods</h2>
              <p className="mt-3 text-slate-600">Every pod you create is saved locally and can be shared with an invite code.</p>
              <div className="mt-6 space-y-4">
                {pods.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
                    No pods yet. Create one and invite someone you trust.
                  </div>
                ) : (
                  pods.map((pod) => (
                    <div key={pod.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{pod.name}</h3>
                          <p className="mt-2 text-slate-600">{pod.description}</p>
                        </div>
                      </div>
                      <div className="mt-5 rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-semibold text-slate-900">Invite code</span>
                          <button
                            type="button"
                            onClick={() => copyInvite(pod.inviteCode)}
                            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="mt-2 break-all text-slate-700">{pod.inviteCode}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

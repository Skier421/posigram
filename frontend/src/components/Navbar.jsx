import { NavLink } from "react-router-dom";

const links = [
  { href: "/", label: "Feed" },
  { href: "/pods", label: "Pods" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar({ user, gatewayCompleted, onSignOut }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Making Caring Common</p>
          <p className="text-xl font-semibold text-slate-900">Gentle habits, warm connections</p>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden gap-3 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={onSignOut}
            className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 md:inline-flex"
          >
            Sign out
          </button>

          <div className="flex items-center gap-3">
            <div className={`relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white ${
              gatewayCompleted ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-white animate-pulse" : ""
            }`}>
              {user?.firstName?.charAt(0).toUpperCase() || "M"}
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">Hi, {user?.firstName || "Friend"}</p>
              <p className="text-xs text-slate-500">Ready for your next kindness moment</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

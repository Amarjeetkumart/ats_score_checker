import { useNavigate } from "react-router-dom";

import { authSelectors, useAuthStore } from "../../store/auth";

export const Header = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const handleLogout = () => {
    authSelectors.clear();
    navigate("/login", { replace: true });
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">ATS Resume Score Checker</p>
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user?.full_name ?? user?.email}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-primary-500 hover:text-primary-300"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

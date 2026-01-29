import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const AppShell = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

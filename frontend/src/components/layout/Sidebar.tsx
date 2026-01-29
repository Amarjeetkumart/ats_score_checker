import { NavLink } from "react-router-dom";
import clsx from "clsx";

const navigation = [
  { name: "Overview", to: "/dashboard" },
  { name: "Resumes", to: "/resumes" }
];

export const Sidebar = () => {
  return (
    <aside className="hidden w-64 border-r border-slate-800 bg-slate-900/70 pt-8 lg:block">
      <div className="px-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Navigation</h2>
        <nav className="mt-6 flex flex-col gap-2">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-primary-500/10 text-primary-300"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

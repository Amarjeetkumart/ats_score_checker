import { ResumeList } from "../components/resume/ResumeList";
import { useAuthStore } from "../store/auth";

export const ResumesPage = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-white">Stored resumes</h1>
        <p className="text-sm text-slate-400">Manage previously scored resumes.</p>
      </header>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-card">
        <ResumeList ownerId={user.id} />
      </div>
    </section>
  );
};

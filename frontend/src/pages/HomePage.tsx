import { Link } from "react-router-dom";

const features = [
  {
    title: "Instant ATS Scoring",
    description: "Upload your resume and get recruiter-ready insights within seconds."
  },
  {
    title: "Keyword Intelligence",
    description: "Compare your resume against any job description and patch the gaps faster."
  },
  {
    title: "Formatting Guidance",
    description: "Follow actionable suggestions to keep applicant tracking systems happy."
  }
];

export const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-8rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -left-40 top-40 h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-40 top-64 h-[30rem] w-[30rem] rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <header className="relative">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-center justify-center gap-12 px-6 py-20 text-center text-slate-100">
          <img
            src="/ats.png"
            alt="ATS Resume Score Checker"
            className="h-28 w-auto drop-shadow-[0_35px_35px_rgba(59,130,246,0.25)]"
          />
          <div className="space-y-6">
            <span className="rounded-full border border-primary-400/30 bg-primary-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-primary-200">
              Smarter Resume Optimization
            </span>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Stand out with an ATS-friendly resume that recruiters love.
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              Upload your resume, benchmark it against real job descriptions, and get data-backed recommendations that move you to the top of the shortlist.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="w-full rounded-lg bg-primary-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-400 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300 sm:w-auto"
              >
                Create Your Free Account
              </Link>
              <Link
                to="/login"
                className="w-full rounded-lg border border-slate-700 px-6 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-primary-400 hover:text-primary-200 sm:w-auto"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/50 backdrop-blur">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-500/15 via-slate-900/80 to-slate-950/80" />
            <div className="relative grid gap-10 p-10 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="space-y-3 text-left">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/15 text-primary-200">
                    <span className="text-lg">*</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100">{feature.title}</h3>
                  <p className="text-sm text-slate-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-lg">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-500/10 via-slate-900/80 to-slate-950/80" />
            <div className="relative space-y-4 text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-100">How it works</h2>
              <ol className="space-y-4 text-sm text-slate-300">
                <li>
                  <span className="font-semibold text-primary-200">1.</span> Upload your resume or link a cloud document.
                </li>
                <li>
                  <span className="font-semibold text-primary-200">2.</span> Paste the job description you are targeting.
                </li>
                <li>
                  <span className="font-semibold text-primary-200">3.</span> Receive tailored optimization tips and an ATS readiness score.
                </li>
              </ol>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-200 transition hover:text-primary-100"
              >
                Start optimizing now {"->"}
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-lg">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/10 via-slate-900/80 to-slate-950/80" />
            <div className="relative space-y-6 text-slate-200">
              <h2 className="text-2xl font-semibold">Why job seekers choose us</h2>
              <ul className="space-y-4 text-sm text-slate-300">
                <li>• AI-powered scoring tuned for modern Applicant Tracking Systems.</li>
                <li>• Actionable keyword coverage analysis to match every posting.</li>
                <li>• Secure storage and one-click export for recruiter-ready resumes.</li>
              </ul>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-200 transition hover:text-primary-100"
              >
                Log in to continue {"->"}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;

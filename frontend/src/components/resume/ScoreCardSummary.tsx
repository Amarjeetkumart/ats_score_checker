import type { ResumeScoreResponse } from "../../types/resume";

const toPercent = (value: number) => `${Math.round(value * 100)}%`;

type ScoreCardSummaryProps = {
  result: ResumeScoreResponse | null;
};

export const ScoreCardSummary = ({ result }: ScoreCardSummaryProps) => {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-6 text-center text-sm text-slate-400">
        Submit a resume to view ATS scoring insights.
      </div>
    );
  }

  const { score_card: scoreCard, resume } = result;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-card">
        <p className="text-xs uppercase tracking-wider text-slate-400">Overall Score</p>
        <p className="mt-2 text-4xl font-bold text-white">{toPercent(scoreCard.overall_score)}</p>
        <p className="mt-4 text-sm text-slate-300">
          {resume.file_url} scored {toPercent(scoreCard.ats_score)} against the selected job profile.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-slate-400">Keywords</p>
            <p className="text-lg font-semibold text-primary-300">{toPercent(scoreCard.keyword_match)}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-slate-400">Formatting</p>
            <p className="text-lg font-semibold text-primary-300">{toPercent(scoreCard.formatting_score)}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-slate-400">ATS score</p>
            <p className="text-lg font-semibold text-primary-300">{toPercent(scoreCard.ats_score)}</p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-card">
        <p className="text-xs uppercase tracking-wider text-slate-400">Recommendations</p>
        <ul className="mt-4 space-y-3 text-sm">
          {scoreCard.recommendations.map((recommendation) => (
            <li key={recommendation} className="rounded-md border border-slate-800 bg-slate-900/80 px-4 py-3 text-slate-200">
              {recommendation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

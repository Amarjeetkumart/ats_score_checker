import type { AnalyticsSummary } from "../../types/analytics";
import { analyticsService } from "../../services/analytics";
import { useQuery } from "../shared/useQuery";

type AnalyticsPanelProps = {
  ownerId: number;
  refreshKey?: number;
};

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export const AnalyticsPanel = ({ ownerId, refreshKey = 0 }: AnalyticsPanelProps) => {
  const { data, isLoading, error } = useQuery(["analytics", ownerId, refreshKey], () =>
    analyticsService.summary(ownerId)
  );

  if (isLoading) {
    return <p className="text-sm text-slate-400">Loading analytics...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-400">
        Unable to load analytics: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-card">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Analytics</p>
          <h2 className="text-lg font-semibold text-white">Resume Performance</h2>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-slate-400">Total resumes</p>
            <p className="text-lg font-semibold text-primary-300">{data.total_resumes}</p>
          </div>
          <div>
            <p className="text-slate-400">Avg. score</p>
            <p className="text-lg font-semibold text-primary-300">{formatPercent(data.average_score)}</p>
          </div>
        </div>
      </header>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <KeywordList keywords={data.keywords} />
        <ScoreTrend trend={data.score_trends} />
      </div>
    </section>
  );
};

type KeywordListProps = {
  keywords: AnalyticsSummary["keywords"];
};

const KeywordList = ({ keywords }: KeywordListProps) => {
  if (!keywords.length) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
        Keywords will appear once you upload resumes.
      </div>
    );
  }
  return (
    <div>
      <p className="text-sm font-semibold text-white">Top keywords</p>
      <ul className="mt-3 space-y-2">
        {keywords.map((keyword) => (
          <li key={keyword.keyword} className="flex items-center justify-between text-sm">
            <span className="text-slate-300">{keyword.keyword}</span>
            <span className="rounded-md bg-primary-500/10 px-3 py-1 text-primary-200">
              {keyword.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

type ScoreTrendProps = {
  trend: AnalyticsSummary["score_trends"];
};

const ScoreTrend = ({ trend }: ScoreTrendProps) => {
  if (!trend.length) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
        Generate ATS scores to view trend history.
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold text-white">Score trend</p>
      <ul className="mt-3 space-y-3">
        {trend.map((point) => (
          <li key={point.date} className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{new Date(point.date).toLocaleDateString()}</span>
              <span>{point.submissions} submissions</span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-slate-800">
              <div
                className="h-full rounded bg-primary-500"
                style={{ width: `${Math.min(point.average_score, 1) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

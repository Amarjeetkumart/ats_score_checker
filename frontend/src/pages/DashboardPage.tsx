import { useState } from "react";

import { ResumeUploadForm } from "../components/resume/ResumeUploadForm";
import { ScoreCardSummary } from "../components/resume/ScoreCardSummary";
import { AnalyticsPanel } from "../components/analytics/AnalyticsPanel";
import type { ResumeScoreResponse } from "../types/resume";
import { useAuthStore } from "../store/auth";

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const [result, setResult] = useState<ResumeScoreResponse | null>(null);
  const [analyticsKey, setAnalyticsKey] = useState(0);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-white">Upload & Score</h2>
        <p className="text-sm text-slate-400">Upload resume data to generate ATS insights instantly.</p>
        <div className="mt-4">
          <ResumeUploadForm
            ownerId={user.id}
            onScored={(response) => {
              setResult(response);
              setAnalyticsKey((value) => value + 1);
            }}
          />
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Insights</h2>
        <ScoreCardSummary result={result} />
      </section>
      <AnalyticsPanel ownerId={user.id} refreshKey={analyticsKey} />
    </div>
  );
};

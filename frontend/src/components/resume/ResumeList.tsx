import { useMemo } from "react";

import { resumeService } from "../../services/resume";
import { useQuery } from "../shared/useQuery";

type ResumeListProps = {
  ownerId: number;
  onRemoved?: () => void;
};

export const ResumeList = ({ ownerId, onRemoved }: ResumeListProps) => {
  const { data, isLoading, error, refetch } = useQuery(["resumes", ownerId], () =>
    resumeService.list(ownerId)
  );

  const resumes = useMemo(() => data ?? [], [data]);

  const handleDelete = async (id: number) => {
    await resumeService.remove(id);
    await refetch();
    onRemoved?.();
  };

  if (isLoading) {
    return <p className="text-sm text-slate-400">Loading resumes...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-400">
        Failed to load resumes: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (!resumes.length) {
    return <p className="text-sm text-slate-400">No resumes uploaded yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {resumes.map((resume) => (
        <li
          key={resume.id}
          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
        >
          <div>
            <p className="text-sm font-semibold text-white">Resume #{resume.id}</p>
            <p className="text-xs text-slate-400">Uploaded {new Date(resume.created_at).toLocaleString()}</p>
          </div>
          <button
            onClick={() => handleDelete(resume.id)}
            className="rounded-md border border-red-500/40 px-3 py-1 text-xs font-medium text-red-300 transition hover:border-red-500 hover:text-red-200"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};

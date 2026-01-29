import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resumeService } from "../../services/resume";
import type { ResumeScoreResponse } from "../../types/resume";
import type { ResumeFormValues } from "../../validation/resume";
import { resumeSchema } from "../../validation/resume";

const toList = (value?: string) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

type ResumeUploadFormProps = {
  ownerId: number;
  onScored: (response: ResumeScoreResponse) => void;
};

export const ResumeUploadForm = ({ ownerId, onScored }: ResumeUploadFormProps) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const defaultValues: ResumeFormValues = {
    file_url: "",
    parsed_text: "",
    extracted_skills: "",
    extracted_keywords: "",
    job_role_title: "",
    job_company_name: "",
    job_canonical_text: "",
    job_required_skills: "",
    job_preferred_skills: ""
  };
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues
  });

  const onSubmit = handleSubmit(async (values) => {
    setApiError(null);
    clearErrors("file_url");
    let resolvedUrl = values.file_url?.trim();

    if (!resolvedUrl && !selectedFile) {
      setError("file_url", {
        type: "manual",
        message: "Provide a resume URL or upload a file"
      });
      return;
    }
    try {
      if (!resolvedUrl && selectedFile) {
        setUploading(true);
        const { file_url } = await resumeService.upload(selectedFile);
        resolvedUrl = file_url;
      }

      if (!resolvedUrl) {
        setError("file_url", {
          type: "manual",
          message: "Provide a resume URL or upload a file"
        });
        return;
      }

      const payload = {
        resume: {
          owner_id: ownerId,
          file_url: resolvedUrl,
          parsed_text: values.parsed_text || undefined,
          extracted_skills:
            typeof values.extracted_skills === "string"
              ? toList(values.extracted_skills)
              : values.extracted_skills,
          extracted_keywords:
            typeof values.extracted_keywords === "string"
              ? toList(values.extracted_keywords)
              : values.extracted_keywords
        },
        job_description: {
          role_title: values.job_role_title,
          company_name: values.job_company_name || undefined,
          canonical_text: values.job_canonical_text || undefined,
          required_skills:
            typeof values.job_required_skills === "string"
              ? toList(values.job_required_skills)
              : values.job_required_skills,
          preferred_skills:
            typeof values.job_preferred_skills === "string"
              ? toList(values.job_preferred_skills)
              : values.job_preferred_skills ?? []
        }
      };
      const response = await resumeService.score(payload);
      onScored(response);
      reset(defaultValues);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to score resume");
    } finally {
      setUploading(false);
    }
  });

  const fileUrlRegister = register("file_url");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      setValue("file_url", "");
      clearErrors("file_url");
    } else {
      setSelectedFile(null);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-card">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Resume Details
            </h2>
            <label className="block text-sm font-medium text-slate-200">
              Resume file URL
              <input
                type="url"
                {...fileUrlRegister}
                onChange={(event) => {
                  fileUrlRegister.onChange(event);
                  clearErrors("file_url");
                  if (selectedFile) {
                    removeSelectedFile();
                  }
                }}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                placeholder="https://..."
              />
              {errors.file_url && <p className="mt-1 text-xs text-red-400">{errors.file_url.message}</p>}
            </label>
            <div className="rounded-md border border-dashed border-slate-700 bg-slate-950/50 p-4 text-sm text-slate-200">
              <p className="font-medium">Or upload a resume (PDF or DOC)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="mt-3 w-full cursor-pointer text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-primary-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-400"
              />
              {selectedFile && (
                <div className="mt-3 flex items-center justify-between rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-200">
                  <span className="truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="ml-3 rounded border border-slate-600 px-2 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-800"
                  >
                    Remove
                  </button>
                </div>
              )}
              {errors.file_url && (
                <p className="mt-2 text-xs text-red-400">{errors.file_url.message}</p>
              )}
            </div>
            <label className="block text-sm font-medium text-slate-200">
              Parsed text
              <textarea
                {...register("parsed_text")}
                className="mt-2 h-32 w-full rounded-md border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                placeholder="Copy and paste extracted resume text"
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Key skills (comma separated)
              <input
                type="text"
                {...register("extracted_skills")}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                placeholder="React, TypeScript, AWS"
              />
              {errors.extracted_skills && (
                <p className="mt-1 text-xs text-red-400">{errors.extracted_skills.message}</p>
              )}
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Keywords (comma separated)
              <input
                type="text"
                {...register("extracted_keywords")}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                placeholder="Leadership, Agile, Microservices"
              />
              {errors.extracted_keywords && (
                <p className="mt-1 text-xs text-red-400">{errors.extracted_keywords.message}</p>
              )}
            </label>
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Job Description
            </h2>
            <label className="block text-sm font-medium text-slate-200">
              Role title
              <input
                type="text"
                {...register("job_role_title")}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                placeholder="Senior Frontend Engineer"
              />
              {errors.job_role_title && (
                <p className="mt-1 text-xs text-red-400">{errors.job_role_title.message}</p>
              )}
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Company name
              <input
                type="text"
                {...register("job_company_name")}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                placeholder="Acme Corp"
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Job description text
              <textarea
                {...register("job_canonical_text")}
                className="mt-2 h-32 w-full rounded-md border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                placeholder="Paste core responsibilities and requirements"
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Required skills (comma separated)
              <input
                type="text"
                {...register("job_required_skills")}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                placeholder="React, GraphQL"
              />
              {errors.job_required_skills && (
                <p className="mt-1 text-xs text-red-400">{errors.job_required_skills.message}</p>
              )}
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Preferred skills (comma separated)
              <input
                type="text"
                {...register("job_preferred_skills")}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                placeholder="Storybook, Cypress"
              />
            </label>
          </div>
        </div>
        {apiError && <p className="mt-4 text-sm text-red-400">{apiError}</p>}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Scoring..." : uploading ? "Uploading..." : "Score Resume"}
          </button>
        </div>
      </div>
    </form>
  );
};

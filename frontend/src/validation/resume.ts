import { z } from "zod";

const urlRegex = /^(https?:\/\/|s3:\/\/|gs:\/\/).+/i;

const fileUrlSchema = z
  .union([
    z.string().trim().length(0),
    z.string().trim().max(512, "Provide a shorter URL").regex(urlRegex, "Provide a valid file URL (http, s3, or gs)")
  ])
  .transform((value) => value.trim());

export const resumeSchema = z.object({
  file_url: fileUrlSchema,
  parsed_text: z.string().optional().or(z.literal("")),
  extracted_skills: z.union([
    z.string().min(1, "Add at least one skill"),
    z.array(z.string().min(1))
  ]),
  extracted_keywords: z.union([
    z.string().min(1, "Add at least one keyword"),
    z.array(z.string().min(1))
  ]),
  job_role_title: z.string().min(2, "Job title is required"),
  job_company_name: z.string().optional().or(z.literal("")),
  job_canonical_text: z.string().optional().or(z.literal("")),
  job_required_skills: z.union([
    z.string().min(1, "List required skills"),
    z.array(z.string().min(1))
  ]),
  job_preferred_skills: z.union([z.string(), z.array(z.string().min(1))]).optional()
});

export type ResumeFormValues = z.infer<typeof resumeSchema>;

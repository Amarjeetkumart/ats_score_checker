export type Resume = {
  id: number;
  owner_id: number;
  file_url: string;
  parsed_text?: string | null;
  extracted_skills: string[];
  extracted_keywords: string[];
  created_at: string;
  updated_at: string;
};

export type JobDescription = {
  role_title: string;
  company_name?: string | null;
  canonical_text?: string | null;
  required_skills: string[];
  preferred_skills: string[];
};

export type ScoreCard = {
  resume_id: number;
  job_description_id: number | null;
  ats_score: number;
  keyword_match: number;
  formatting_score: number;
  overall_score: number;
  recommendations: string[];
};

export type ResumeScoreRequest = {
  resume: {
    owner_id: number;
    file_url: string;
    parsed_text?: string | null;
    extracted_skills: string[];
    extracted_keywords: string[];
  };
  job_description?: JobDescription | null;
};

export type ResumeScoreResponse = {
  resume: Resume;
  score_card: ScoreCard;
};

export type ResumeUploadResponse = {
  file_url: string;
};


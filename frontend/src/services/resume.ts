import { apiClient } from "./api";
import type {
  Resume,
  ResumeScoreRequest,
  ResumeScoreResponse,
  ResumeUploadResponse
} from "../types/resume";

export const resumeService = {
  async score(payload: ResumeScoreRequest) {
    const { data } = await apiClient.post<ResumeScoreResponse>("/resumes/score", payload);
    return data;
  },
  async list(ownerId: number) {
    const { data } = await apiClient.get<Resume[]>("/resumes", {
      params: { owner_id: ownerId }
    });
    return data;
  },
  async upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<ResumeUploadResponse>("/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },
  async remove(resumeId: number) {
    await apiClient.delete(`/resumes/${resumeId}`);
  }
};

import { apiClient } from "./api";
import type { AnalyticsSummary } from "../types/analytics";

export const analyticsService = {
  async summary(ownerId: number) {
    const { data } = await apiClient.get<AnalyticsSummary>("/analytics/summary", {
      params: { owner_id: ownerId }
    });
    return data;
  }
};

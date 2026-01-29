import { apiClient } from "./api";
import type { LoginRequest, LoginResponse, RegisterRequest, RefreshResponse } from "../types/auth";
import type { User } from "../types/user";

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
    return data;
  },
  async register(payload: RegisterRequest) {
    const { data } = await apiClient.post<User>("/auth/register", payload);
    return data;
  },
  async refresh(token: string) {
    const { data } = await apiClient.post<RefreshResponse>("/auth/refresh", {
      refresh_token: token
    });
    return data;
  }
};

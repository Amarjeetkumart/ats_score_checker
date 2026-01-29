import axios from "axios";

import { authSelectors, useAuthStore } from "../store/auth";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}`;

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/$/, "")}/api/v1`,
  withCredentials: false
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use((config) => {
  const token = authSelectors.accessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (!originalRequest.headers) {
                originalRequest.headers = {};
              }
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = authSelectors.refreshToken();
        if (!refreshToken) {
          throw new Error("Missing refresh token");
        }
        const { data } = await apiClient.post<{ access_token: string; refresh_token: string }>(
          "/auth/refresh",
          {
            refresh_token: refreshToken
          }
        );
        useAuthStore.getState().updateAccessToken(data.access_token);
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        processQueue(null, data.access_token);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authSelectors.clear();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

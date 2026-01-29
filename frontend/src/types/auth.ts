import type { User } from "./user";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  full_name?: string | null;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
};

export type RefreshResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

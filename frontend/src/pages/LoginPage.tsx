import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";

import { authService } from "../services/auth";
import { authSelectors } from "../store/auth";
import type { LoginFormValues } from "../validation/auth";
import { loginSchema } from "../validation/auth";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const response = await authService.login(values);
      authSelectors.setSession({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        user: response.user
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-card">
        <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in to continue scoring resumes.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-200">
              Email address
              <input
                type="email"
                {...register("email")}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </label>
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-200">
              Password
              <input
                type="password"
                {...register("password")}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </label>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">
          Need an account? <Link to="/register" className="text-primary-300 hover:text-primary-200">Create one</Link>
        </p>
      </div>
    </div>
  );
};

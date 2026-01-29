import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { authService } from "../services/auth";
import type { RegisterFormValues } from "../validation/auth";
import { registerSchema } from "../validation/auth";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await authService.register({
        email: values.email,
        password: values.password,
        full_name: values.full_name
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register");
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-card">
        <h1 className="text-2xl font-semibold text-white">Create an account</h1>
        <p className="mt-2 text-sm text-slate-400">Sign up to monitor resume readiness.</p>
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
              Full name
              <input
                type="text"
                {...register("full_name")}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </label>
            {errors.full_name && <p className="mt-1 text-xs text-red-400">{errors.full_name.message}</p>}
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
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">
          Already registered? <Link to="/login" className="text-primary-300 hover:text-primary-200">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

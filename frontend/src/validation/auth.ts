import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const registerSchema = loginSchema.extend({
  full_name: z
    .string()
    .min(2, "Provide your full name")
    .max(255, "Name is too long")
    .optional()
    .or(z.literal(""))
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().optional(),
  school: z.object({
    name: z.string().min(2, "School name is required"),
    type: z.string().min(1, "School type is required"),
    board: z.string().min(1, "Board is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
    udiseNumber: z.string().min(1, "UDISE number is required"),
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

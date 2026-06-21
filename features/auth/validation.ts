import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter email") // ✅ handles empty
    .email("Invalid email address"), // ✅ handles format

  password: z
    .string()
    .min(1, "Please enter password")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Please enter full name")
    .min(2, "Full name must be at least 2 characters"),

  email: z.string().min(1, "Please enter email").email("Invalid email address"),

  password: z
    .string()
    .min(1, "Please enter password")
    .min(6, "Password must be at least 6 characters"),

  phoneNumber: z.string().optional(),

  school: z.object({
    name: z
      .string()
      .min(1, "Please enter school name")
      .min(2, "School name must be at least 2 characters"),

    type: z.string().min(1, "Please enter school type"),

    board: z.string().min(1, "Please enter board"),

    city: z.string().min(1, "Please enter city"),

    state: z.string().min(1, "Please enter state"),

    website: z.string().url("Invalid website URL").optional().or(z.literal("")),

    udiseNumber: z.string().min(1, "Please enter UDISE number"),
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

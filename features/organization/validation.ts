import { z } from "zod";

export const addRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Role name is required")
    .max(100, "Role name cannot exceed 100 characters"),

  portalType: z.enum(["ADMIN", "STAFF", "TEACHER", "STUDENT"], {
    message: "Please select a valid portal type",
  }),
});

export const addMemberSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be at most 100 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),

  portalType: z.enum(["ADMIN", "STAFF", "TEACHER", "STUDENT"], {
    error: "Portal type is required",
  }),

  roleName: z.string().min(1, "Role is required"),
});

export type AddMemberFormData = z.infer<typeof addMemberSchema>;
export type AddRoleFormData = z.infer<typeof addRoleSchema>;

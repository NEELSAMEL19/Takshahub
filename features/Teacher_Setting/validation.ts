import { z } from "zod";

// Base object schema — has .shape and .omit(), no refinements attached
export const updateProfileBaseSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be at most 100 characters")
    .optional(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .optional(),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number")
    .optional(),

  currentPassword: z.string().min(1, "Current password is required").optional(),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .optional(),
});

// Refined version — only for full-object parsing, NOT for .shape/.omit()
export const updateProfileSchema = updateProfileBaseSchema.refine(
  (data) => !data.newPassword || !!data.currentPassword,
  {
    message: "Current password is required to set a new password",
    path: ["currentPassword"],
  },
);

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

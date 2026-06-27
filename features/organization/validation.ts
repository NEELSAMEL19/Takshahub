import { z } from "zod";

export const addRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Role name is required")
    .max(100, "Role name cannot exceed 100 characters"),

  portalType: z.enum(["STAFF", "TEACHER", "STUDENT"], {
    message: "Please select a valid portal type",
  }),
});

export type AddRoleFormData = z.infer<typeof addRoleSchema>;

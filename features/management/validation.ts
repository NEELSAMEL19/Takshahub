import { z } from "zod";

export const addClassSchema = z.object({
  className: z
    .string()
    .trim()
    .min(1, "Class name is required")
    .max(100, "Class name must be at most 100 characters"),

  sections: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Section name cannot be empty")
        .max(20, "Section name must be at most 20 characters"),
    )
    .min(1, "At least one section is required")
    .max(50, "Cannot add more than 50 sections")
    .refine(
      (sections) =>
        new Set(sections.map((s) => s.toUpperCase())).size === sections.length,
      { message: "Duplicate sections are not allowed" },
    ),
});

export type AddClassFormData = z.infer<typeof addClassSchema>;

import { z } from "zod";

export const addAcademicYearSchema = z
  .object({
    label: z
      .string()
      .trim()
      .min(1, "Label is required.")
      .max(20, "Label must be under 20 characters."),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date is required."),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date is required."),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "Start date must be before end date.",
    path: ["endDate"],
  });

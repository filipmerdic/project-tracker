import { z } from "zod";

export const projectStatusOptions = [
  "Research",
  "Copywriting",
  "Design",
  "Development",
] as const;

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required"),
  status: z.enum(projectStatusOptions, {
    required_error: "Please select a project status",
  }),
  finalDeadline: z.date({
    required_error: "Final deadline is required",
  }),
  nextPhaseDate: z.date({
    required_error: "Next phase date is required",
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Project = z.infer<typeof projectSchema>; 
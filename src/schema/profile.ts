import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
});

export type EditProfileType = z.infer<typeof editProfileSchema>;

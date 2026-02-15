import type z from "zod";
import { signupSchema } from "./signup";

export const loginSchema = signupSchema.pick({
  email: true,
  password: true,
});

export type TLoginData = z.infer<typeof loginSchema>;

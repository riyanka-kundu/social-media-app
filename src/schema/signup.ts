import * as z from "zod";

export const signupSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter the valid email"),
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be  at least 3 character long "),
  password: z
    .string({ required_error: "Password is required" })
    .min(3, "Password should be at least 8 characters ")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
});

export type TSignUpData= z.infer<typeof signupSchema>
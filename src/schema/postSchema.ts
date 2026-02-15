import z from "zod";

export const CreatePostSchema = z.object({
  title: z
    .string({ message: "title must be string" })
    .min(3, { message: "title is too short" })
    .max(40, { message: "title should not exceed 40 characters" }),
  body: z
    .string({ message: "Description must be string" })
    .min(5, { message: "Description is too short" })
    .max(100, { message: "Description should not exceed 40 characters" }),
  tags: z
    .array(
      z
        .string({ message: "tags must be string" })
        .min(3, { message: "tags is too short" })
        .max(100, { message: "tags should not exceed 40 characters" })
    )
    .min(1, { message: "at least one tag is required" }),

  images: z
    .array(z.instanceof(File).refine((file) => file.type.startsWith("image/")))
    .min(1, { message: "At least one image required" })
    .optional(),
});

export type CreatePostType = z.infer<typeof CreatePostSchema>;
export const EditPostSchema = z.object({
  title: z
    .string({ message: "title must be string" })
    .min(3, { message: "title is too short" })
    .max(40, { message: "title should not exceed 40 characters" })
    .optional(),
  body: z
    .string({ message: "Description must be string" })
    .min(5, { message: "Description is too short" })
    .max(100, { message: "Description should not exceed 100 characters" })
    .optional(),
  tags: z
    .array(
      z
        .string({ message: "tags must be string" })
        .min(3, { message: "tag is too short" })
        .max(100, { message: "tag should not exceed 100 characters" })
    )
    .optional(), // Remove .min(1) constraint for editing
  images: z
    .array(
      z.instanceof(File).refine((file) => file.type.startsWith("image/"), {
        message: "Only image files are allowed",
      })
    )
    .optional(), // Remove .min(1) constraint for editing
});

export type EditPostType = z.infer<typeof EditPostSchema>;
//z.infer is a helper type from Zod that automatically generates a TypeScript type from a Zod schema

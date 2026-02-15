import { useCreatePost } from "@/hooks/post";
import { useRef } from "react";
import { CreatePostSchema, type CreatePostType } from "../schema/postSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";

const CreatePost = () => {
  const { mutate, isPending, error } = useCreatePost();
  const tagRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CreatePostType>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: "",
      body: "",
      images: [],
      tags: [],
    },
  });

  function onSubmit(values: CreatePostType) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("body", values.body);

    values?.images?.forEach((file) => formData.append("images", file));
    values?.tags?.forEach((tag) => formData.append("tags", tag.trim()));

    mutate(formData);
  }

  const { watch, setValue, handleSubmit } = form;
  const tags = watch("tags");
  const images = watch("images");

  const addTags = () => {
    const input = tagRef.current?.value.trim();
    if (!input) return;

    const newTags = input
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag && !tags.includes(tag));

    setValue("tags", [...tags, ...newTags]);
    tagRef.current!.value = "";
  };

  const removeImage = (index: number) => {
    const current = form.getValues("images") || [];
    setValue(
      "images",
      current.filter((_, i) => i !== index),
    );
  };

  const removeTag = (index: number) => {
    const current = form.getValues("tags") || [];
    setValue(
      "tags",
      current.filter((_, i) => i !== index),
    );
  };

  if (!isPending && error)
    return <p className="text-center text-red-500">No Post Created</p>;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold">Create New Post</h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Post title"
                      className="focus-visible:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Body */}
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Write something..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  ref={tagRef}
                  placeholder="react, nextjs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTags();
                    }
                  }}
                  onBlur={addTags}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(i)}
                      className="text-xs text-muted-foreground hover:text-red-500"
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        field.onChange([...(field.value || []), ...files]);
                        e.target.value = "";
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {images && images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {images?.map((file, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg border"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="h-32 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-1 top-1 rounded bg-black/60 px-2 py-1 text-xs text-white hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating..." : "Create Post"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePost;

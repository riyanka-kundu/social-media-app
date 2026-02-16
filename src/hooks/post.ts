import { QUERY_KEYS } from "@/lib/query-keys";
import { API_ROUTES } from "@/lib/route";
import { axiosInstance } from "@/lib/utils";
import type { EditPostType } from "@/schema/postSchema";
import type { TApiResponse, TPaginationApiResponse, TPost } from "@/type";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const usePosts = ({
  search = "",
  page,
  limit = 10,
}: {
  search?: string;
  limit?: number;
  page: number;
}) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.GET_ALL_POST({ search, page, limit }),
    queryFn: async ({ pageParam = 1 }) => {
      const param = new URLSearchParams();
      param.set("page", String(pageParam));
      param.set("limit", String(limit));
      if (search) param.set("search", String(search));
      const res = await axiosInstance.get(API_ROUTES.post.GET_ALL(param));
      return res.data as TPaginationApiResponse<TPost>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.meta.hasNextPage) {
        return lastPage.data.meta.page + 1;
      }
      return undefined;
    },
  });
};
export const useFeed = ({
  search = "",
  page,
  limit = 10,
}: {
  search?: string;
  limit?: number;
  page: number;
}) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.GET_FEED({ search, page, limit }),
    queryFn: async ({ pageParam = 1 }) => {
      const param = new URLSearchParams();
      param.set("page", String(pageParam));
      param.set("limit", String(limit));
      if (search) param.set("search", String(search));
      const res = await axiosInstance.get(API_ROUTES.feed.GET_ALL(param));
      return res.data as TPaginationApiResponse<TPost>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.meta.hasNextPage) {
        return lastPage.data.meta.page + 1;
      }
      return undefined;
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationKey: [QUERY_KEYS.CREATE_POST],
    mutationFn: async (data: FormData) => {
      const res = await axiosInstance.post(API_ROUTES.post.CREATE, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data as TApiResponse<TPost>;
    },
    onSuccess: async (data) => {
      toast.success(data.message || "Post created successfully");
      navigate("/my-posts");
      await Promise.all([
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "getAllPost",
        }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "getFeed",
        }),
      ]);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    },
  });
};

type EditPostPayload = {
  id: string;
  formData: FormData;
};
export const useEditPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [QUERY_KEYS.UPDATE_POST],
    mutationFn: async ({ id, formData }: EditPostPayload) => {
      const res = await axiosInstance.patch<EditPostType>(
        API_ROUTES.post.GET_BY_ID(id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return res.data;
    },
    onSuccess: async (_, { id }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "getAllPost",
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SINGLE_POST, id],
        }),
      ]);
    },
  });
};
export const useDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [QUERY_KEYS.DELETE_POST],
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(API_ROUTES.post.GET_BY_ID(id));
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "getAllPost",
      });
    },
  });
};
export const useLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [QUERY_KEYS.TOGGLE_LIKE],
    mutationFn: async (id: string) => {
      const res = await axiosInstance.patch(API_ROUTES.feed.TOGGLE_LIKE(id));
      return res.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "getAllPost",
        }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "getFeed",
        }),
      ]);
    },
  });
};

export const useSinglePost = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SINGLE_POST, id],
    queryFn: async () => {
      const res = await axiosInstance.get(API_ROUTES.post.GET_BY_ID(id));
      return res.data as TApiResponse<TPost>;
    },
    enabled: !!id,
  });
};

import { QUERY_KEYS } from "@/lib/query-keys";
import { API_ROUTES } from "@/lib/route";
import { axiosInstance, clearAuthToken, setAuthToken } from "@/lib/utils";
import type { TLoginData } from "@/schema/login";
import type { TSignUpData } from "@/schema/signup";
import type { TApiResponse, TLoginResponse, TUser } from "@/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useRegistration = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.REGISTRATION],
    mutationFn: async (data: TSignUpData) => {
      const response = await axiosInstance.post(API_ROUTES.auth.REGISTER, data);
      return response.data as TApiResponse;
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      const successMessage = data.message || "Success!";
      toast.success(successMessage);
    },
  });
};
export const useLogin = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.LOG_IN],
    mutationFn: async (data: TLoginData) => {
      const response = await axiosInstance.post(API_ROUTES.auth.LOG_IN, data);
      const token = response.data?.accessToken;
      if (token) setAuthToken(token);
      return response.data as TLoginResponse;
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || "An error occurred";
      console.log(error);
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      const successMessage = data.message || "Success!";
      toast.success(successMessage);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [QUERY_KEYS.LOG_OUT],
    mutationFn: async () => {
      const response = await axiosInstance.get(API_ROUTES.auth.LOG_OUT);
      return response.data as TApiResponse;
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || "Logout failed";
      toast.error(errorMessage);
    },
    onSuccess: async (data) => {
      clearAuthToken();
      queryClient.setQueryData([QUERY_KEYS.CURRENT_USER], null);
      const successMessage = data.message || "Logged out successfully";
      toast.success(successMessage);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_USER],
    queryFn: async () => {
      const res = await axiosInstance.get(API_ROUTES.user.MY_PROFILE);
      return res.data as TApiResponse<TUser>;
    },
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [QUERY_KEYS.UPDATE_PROFILE],
    mutationFn: async (data: FormData) => {
      const res = await axiosInstance.patch(
        API_ROUTES.user.UPDATE_PROFILE,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return res.data as TApiResponse<TUser>;
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || "Update failed";
      toast.error(errorMessage);
    },
    onSuccess: async (data) => {
      toast.success(data.message || "Profile updated!");
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CURRENT_USER],
      });
    },
  });
};

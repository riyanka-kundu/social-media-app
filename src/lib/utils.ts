import axios, { type InternalAxiosRequestConfig } from "axios";
import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import { API_ROUTES } from "./route";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(dateStr: string): string {
  const date = moment(dateStr);
  const now = moment();
  if (now.diff(date, "days") < 7) return date.fromNow();
  return date.format("D MMM YYYY, hh:mm A");
}

const ACCESS_TOKEN_KEY = "social_media_access_token";
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAuthToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};
export const clearAuthToken = () => setAuthToken(null);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isAuthRoute = [
      API_ROUTES.auth.LOG_IN,
      API_ROUTES.auth.REGISTER,
      API_ROUTES.auth.REFRESH,
    ].some((route) => originalRequest.url?.includes(route));

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.get(API_ROUTES.auth.REFRESH);
        const newToken = data?.data?.accessToken || data?.accessToken;

        if (newToken) {
          setAuthToken(newToken);
          onTokenRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
        throw new Error("No token in refresh response");
      } catch {
        clearAuthToken();
        refreshSubscribers = [];
        throw error;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

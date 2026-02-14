export const API_ROUTES = {
  auth: {
    REGISTER: "/auth/register",
    LOG_IN: "/auth/login",
    LOG_OUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  user: {
    MY_PROFILE: "/users/my-profile",
    UPDATE_PROFILE: "/users/profile",
  },
  post: {
    GET_ALL: (param: URLSearchParams) => `/posts?${param}`,
    CREATE: "/posts",
    GET_BY_ID: (id: string) => `/posts/${id}`,
  },
  feed: {
    TOGGLE_LIKE: (id: string) => `/feed/${id}/like`,
    GET_ALL: (param: URLSearchParams) => `/feed?${param}`,
    GET_BY_ID: (id: string) => `/feed/${id}`,
  },
} as const;

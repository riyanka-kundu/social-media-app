export const QUERY_KEYS = {
  REGISTRATION: "registration",
  LOG_IN: "signIn",
  LOG_OUT: "logout",
  REFRESH: "refresh",
  CURRENT_USER: "currentUser",
  UPDATE_PROFILE: "updateProfile",
  CREATE_POST: "createPost",
  GET_ALL_POST: ({
    search,
    limit,
    page,
  }: {
    search: string;
    limit: number;
    page: number;
  }) => ["getAllPost", search, limit, page],
  GET_FEED: ({
    search,
    limit,
    page,
  }: {
    search: string;
    limit: number;
    page: number;
  }) => ["getFeed", search, limit, page],
  UPDATE_POST: (id: string) => ["update", id],
  DELETE_POST: (id: string) => ["delete", id],
  TOGGLE_LIKE: (id: string) => ["like", id],
  SINGLE_POST: (id: string) => ["singlePost", id],
} as const;

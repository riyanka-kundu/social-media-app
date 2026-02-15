export type TApiResponse<T = unknown> = {
  statusCode: number;
  message: string;
  data?: T;
};
export type TUser = {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  createdAt: string;
  dateOfBirth: string | null;
  gender: string;
};
export type TLoginResponse = {
  statusCode: number;
  message: string;
  user: TUser;
  accessToken: string;
};

export type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
export type TPaginationApiResponse<T = unknown> = {
  status: number;
  message: string;
  data: {
    meta: Meta;
    docs: T;
  };
};

export type TPost = {
  id: string;
  title: string;
  body: string;
  likeCount: number;
  images: string[];
  tags: string[];
  creator: TCreator;
  createdAt: string;
  updatedAt: string;
};

export type TCreator = {
  id: string;
  name: string;
  profilePicture: string | null;
};

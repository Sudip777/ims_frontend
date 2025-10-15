export interface Meta {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedApiResponse<T, M = Meta> {
  result: {
    data: T;
    meta: M;
  };
  message: string;
  response_code: string;
}

export interface ApiResponse<T> {
  result: T;
  message: string;
  response_code: string;
}

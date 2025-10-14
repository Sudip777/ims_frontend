export interface ApiResponse<T, Meta> {
  result: {
    data: T;
    meta: Meta | undefined;
  };
  message: string;
  response_code: string;
}

export interface Meta {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

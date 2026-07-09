/**
 * Standard success envelope, used when the backend wraps payloads
 * in a consistent shape. Feature-specific data types are passed in as T.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Standard shape for paginated list endpoints. */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
}

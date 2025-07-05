// Genre const for type safety
export const Genre = {
  FICTION: "FICTION",
  NON_FICTION: "NON_FICTION",
  SCIENCE: "SCIENCE",
  HISTORY: "HISTORY",
  BIOGRAPHY: "BIOGRAPHY",
  FANTASY: "FANTASY",
} as const;

export type Genre = (typeof Genre)[keyof typeof Genre];

// Sort order const
export const SortOrder = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

// Sort field const
export const SortField = {
  CREATED_AT: "createdAt",
  TITLE: "title",
  AUTHOR: "author",
  GENRE: "genre",
} as const;

export type SortField = (typeof SortField)[keyof typeof SortField];

// Book interface with strict typing
export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description: string;
  copies: number;
  available: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Create book request with validation
export interface CreateBookRequest {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description: string;
  copies: number;
  available?: boolean;
  image?: string;
}

// Update book request with partial fields
export interface UpdateBookRequest
  extends Partial<Omit<CreateBookRequest, "genre">> {
  id: string;
  genre?: Genre;
}

// Borrow interface
export interface Borrow {
  id: string;
  bookId: string;
  bookTitle: string;
  isbn: string;
  quantity: number;
  dueDate: string;
  createdAt: string;
}

// Create borrow request
export interface CreateBorrowRequest {
  book: string; // book ID
  quantity: number;
  dueDate: string;
}

// Borrow summary interface
export interface BorrowSummary {
  book: {
    title: string;
    isbn: string;
  };
  totalQuantity: number;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query parameters for filtering and sorting
export interface BookQueryParams {
  page?: number;
  limit?: number;
  filter?: Genre;
  sort?: SortOrder;
  sortBy?: SortField;
}

// Borrow query parameters
export interface BorrowQueryParams {
  page?: number;
  limit?: number;
}

// Error response interface
export interface ApiErrorResponse {
  message: string;
  success: false;
  status?: number;
}

// Success response interface
export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  success: true;
}

// Union type for API responses
export type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Type guards for runtime type checking
export const isApiSuccess = <T>(
  response: ApiResult<T>
): response is ApiSuccessResponse<T> => {
  return response.success === true;
};

export const isApiError = <T>(
  response: ApiResult<T>
): response is ApiErrorResponse => {
  return response.success === false;
};

// Validation functions
export const isValidGenre = (genre: string): genre is Genre => {
  return Object.values(Genre).includes(genre as Genre);
};

export const isValidSortOrder = (sort: string): sort is SortOrder => {
  return Object.values(SortOrder).includes(sort as SortOrder);
};

export const isValidSortField = (field: string): field is SortField => {
  return Object.values(SortField).includes(field as SortField);
};

// Book validation
export const validateBook = (book: unknown): book is Book => {
  if (!book || typeof book !== "object") return false;

  const bookObj = book as Record<string, unknown>;

  return (
    typeof bookObj._id === "string" &&
    typeof bookObj.title === "string" &&
    typeof bookObj.author === "string" &&
    isValidGenre(bookObj.genre as string) &&
    typeof bookObj.isbn === "string" &&
    typeof bookObj.description === "string" &&
    typeof bookObj.copies === "number" &&
    typeof bookObj.available === "boolean" &&
    (bookObj.image === undefined || typeof bookObj.image === "string") &&
    typeof bookObj.createdAt === "string" &&
    typeof bookObj.updatedAt === "string"
  );
};

// Create book request validation
export const validateCreateBookRequest = (
  request: unknown
): request is CreateBookRequest => {
  if (!request || typeof request !== "object") return false;

  const req = request as Record<string, unknown>;

  return (
    typeof req.title === "string" &&
    typeof req.author === "string" &&
    isValidGenre(req.genre as string) &&
    typeof req.isbn === "string" &&
    typeof req.description === "string" &&
    typeof req.copies === "number" &&
    (req.available === undefined || typeof req.available === "boolean") &&
    (req.image === undefined || typeof req.image === "string")
  );
};

// Borrow summary validation
export const validateBorrowSummary = (
  summary: unknown
): summary is BorrowSummary => {
  if (!summary || typeof summary !== "object") return false;

  const sum = summary as Record<string, unknown>;

  return (
    sum.book !== null &&
    typeof sum.book === "object" &&
    typeof (sum.book as Record<string, unknown>).title === "string" &&
    typeof (sum.book as Record<string, unknown>).isbn === "string" &&
    typeof sum.totalQuantity === "number"
  );
};

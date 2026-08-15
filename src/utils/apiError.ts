export class CustomApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

interface IApiErrors {
  badRequest: (message?: string) => CustomApiError;
  unauthorized: (message?: string) => CustomApiError;
  forbidden: (message?: string) => CustomApiError;
  notFound: (message?: string) => CustomApiError;
  conflict: (message?: string) => CustomApiError;
  limit: (message?: string) => CustomApiError;
}

export const apiErrors: IApiErrors = {
  badRequest: (message = "Bad Request") => new CustomApiError(400, message),
  unauthorized: (message = "Unauthorized") => new CustomApiError(401, message),
  forbidden: (message = "Forbidden") => new CustomApiError(403, message),
  notFound: (message = "Not Found") => new CustomApiError(404, message),
  conflict: (message = "Conflict") => new CustomApiError(409, message),
  limit: (message = "Too Many Requests") => new CustomApiError(429, message),
};

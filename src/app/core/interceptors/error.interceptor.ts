import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '@models/api-error.model';

/**
 * Converts every HttpErrorResponse into a normalized ApiError before
 * it reaches feature services/components. Components should never
 * need to know about HttpErrorResponse internals.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: unknown) => {
      const apiError: ApiError = toApiError(error);
      return throwError(() => apiError);
    }),
  );
};

function toApiError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse) {
    return {
      status: error.status,
      message: resolveMessage(error),
      cause: error,
    };
  }

  return {
    status: 0,
    message: 'An unexpected error occurred. Please try again.',
    cause: error,
  };
}

function resolveMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Unable to reach the server. Check your connection and try again.';
  }
  if (error.status >= 500) {
    return 'Something went wrong on our end. Please try again shortly.';
  }
  if (error.status === 404) {
    return 'The requested resource could not be found.';
  }
  if (error.status === 401 || error.status === 403) {
    return 'You are not authorized to perform this action.';
  }
  return error.error?.message ?? 'The request could not be completed.';
}

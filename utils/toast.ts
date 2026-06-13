import { toast } from "react-toastify";
import { ApiError } from "./errors";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const handleError = (
  error: unknown,
  fallbackMessage = "Something went wrong",
  setFieldErrors?: (errors: Record<string, string>) => void,
) => {
  let message = fallbackMessage;

  if (error instanceof TypeError) {
    message = "Cannot connect to server. Please check your connection.";
  } else if (error instanceof ApiError) {
    message = error.message;
  } else if (isRecord(error) && typeof error.message === "string") {
    message = error.message;
  }

  toast.error(message);

  if (error instanceof ApiError && error.errors) {
    setFieldErrors?.(error.errors);
    return;
  }

  setFieldErrors?.({ form: message });
};

export const handleSuccess = (
  message?: string,
  fallbackMessage = "Success",
) => {
  toast.success(message || fallbackMessage);
};

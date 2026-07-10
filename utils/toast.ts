import { toast } from "react-toastify";
import { ApiError } from "./errors";

<<<<<<< Updated upstream
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const handleError = (
  error: unknown,
=======
export const handleError = (
  error: any,
>>>>>>> Stashed changes
  fallbackMessage = "Something went wrong",
  setFieldErrors?: (errors: Record<string, string>) => void,
) => {
  let message = fallbackMessage;

<<<<<<< Updated upstream
  if (error instanceof TypeError) {
    message = "Cannot connect to server. Please check your connection.";
  } else if (error instanceof ApiError) {
    message = error.message;
  } else if (isRecord(error) && typeof error.message === "string") {
=======
  // ✅ Handle fetch/network errors
  if (error instanceof TypeError) {
    message = "Cannot connect to server. Please check your connection.";
  }

  // ✅ Handle your custom API errors
  else if (error instanceof ApiError) {
    message = error.message;
  }

  // ✅ fallback
  else if (error?.message) {
>>>>>>> Stashed changes
    message = error.message;
  }

  toast.error(message);

<<<<<<< Updated upstream
  if (error instanceof ApiError && error.errors) {
=======
  if (error?.errors) {
>>>>>>> Stashed changes
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

import { toast } from "react-toastify";
import { ApiError } from "./errors";

export const handleError = (
  error: any,
  fallbackMessage = "Something went wrong",
  setFieldErrors?: (errors: Record<string, string>) => void,
) => {
  let message = fallbackMessage;

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
    message = error.message;
  }

  toast.error(message);

  if (error?.errors) {
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

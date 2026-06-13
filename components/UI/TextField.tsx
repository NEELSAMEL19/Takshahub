"use client";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  "data-error"?: boolean;
  color?: "info" | "success" | "error";
}

export function TextField({
  label,
  error,
  className = "",
  id,
  name,
  type = "text",
  required,
  maxLength,
  autoComplete,
  "data-error": dataError,
  color = "info",
  ...props
}: InputProps) {
  const hasError = Boolean(error || dataError);

  const bgColor =
    color === "error"
      ? "bg-red-100"
      : color === "success"
        ? "bg-green-100"
        : "bg-gray-50";

  const borderColor = hasError ? "border-red-500" : "border-gray-200";

  const inputId = id ?? name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-sans mb-1">
          {label} {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        data-error={hasError}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-transparent
          ${
            color === "error"
              ? "hover:bg-red-200"
              : color === "success"
                ? "hover:bg-green-200 "
                : "hover:bg-gray-100 "
          }
          ${bgColor}
          ${borderColor}
        text-sm
          ${className}
        `}
        {...props}
      />

      {error && <p className="mt-1 text-xs font-sans text-red-500">{error}</p>}
    </div>
  );
}

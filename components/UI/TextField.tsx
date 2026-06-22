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
        : "bg-white";

  const borderColor = hasError ? "border-red-500" : "border-gray-300";

  const inputId = id ?? name;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm mb-1">
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
        className={`w-full px-3 py-2 h-10 border rounded-md focus:outline-none 
          ${
            color === "error"
              ? "hover:bg-red-200 border-red-500"
              : color === "success"
                ? "hover:bg-green-200 border-green-500"
                : "hover:bg-gray-50  "
          }
          ${bgColor}
          ${borderColor}
        text-sm
          ${className}
        `}
        {...props}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

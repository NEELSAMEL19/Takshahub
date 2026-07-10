<<<<<<< Updated upstream
import React, { ButtonHTMLAttributes } from "react";

// Update props to restrict variants to primary and secondary only
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidthOnMobile?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidthOnMobile = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  // Base structural layout rules
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] whitespace-nowrap";

  // Cleaned up to only contain primary and secondary mappings
  const variants = {
    primary:
      "theme-primary-background !text-white hover:brightness-110 shadow-sm",
    secondary:
      "bg-slate-200 text-slate-900 border border-slate-200 hover:bg-slate-300 shadow-md transition-colors",
  };

  // Dimensional padding variations — scale up with breakpoints
  const sizes = {
    sm: "px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm",
    md: "px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base md:px-5 md:py-2.5",
    lg: "px-4 py-2 text-base sm:px-5 sm:py-2.5 sm:text-lg md:px-7 md:py-3",
=======
"use client";

import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClass =
    "font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

  const variantClass = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizeClass = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
>>>>>>> Stashed changes
  };

  return (
    <button
<<<<<<< Updated upstream
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidthOnMobile ? "w-full sm:w-auto" : ""
      } ${className} !rounded-md`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          {/* SVG Loading Spinner */}
          <svg
            className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};
=======
      className={`${baseClass} ${variantClass[variant]} ${sizeClass[size]} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
>>>>>>> Stashed changes

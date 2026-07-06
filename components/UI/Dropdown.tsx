"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface DropdownProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect" | "value"
> {
  label?: string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  error?: string;
  "data-error"?: boolean;
  color?: "info" | "success" | "error";
  options: SelectOption[];
  search?: boolean;
  multiple?: boolean;
  value?: string | number | (string | number)[];
  onSelect?: (
    e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
    value: string | number | (string | number)[],
  ) => void;
  variant?: "normal" | "rounded" | "circle";
  menuWidth?: string; // New Prop added here (Accepts Tailwind classes like w-48, w-max, etc.)
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      label,
      placeholder = "Select",
      id,
      required,
      error,
      "data-error": dataError,
      color = "info",
      options = [],
      search,
      multiple,
      value,
      onSelect,
      className = "",
      variant = "normal",
      menuWidth, // Destructure new prop
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const internalRef = useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => internalRef.current!);

    const hasError = Boolean(error || dataError);
    const dropdownId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    const status = hasError ? "error" : color;

    const statusStyles = {
      error: "bg-red-100 hover:bg-red-200 border-red-500 focus:border-red-500",
      success:
        "bg-green-100 hover:bg-green-200 border-green-500 focus:border-green-500",
      info: "bg-white hover:bg-gray-50 border-gray-300 focus:border-gray-300",
    };

    const variantStyles = {
      normal: "w-full px-3 py-2 !rounded-md justify-between",
      rounded: "w-full px-4 py-2 !rounded-full justify-between",
      circle:
        "!rounded-full justify-center font-bold text-xl !border !border-red-200 cursor-pointer p-0 text-center shrink-0",
    };

    useEffect(() => {
      const handleClose = (e: MouseEvent) => {
        if (
          internalRef.current &&
          !internalRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClose);
      return () => document.removeEventListener("mousedown", handleClose);
    }, []);

    const filteredOptions = useMemo(() => {
      const sv = searchValue ?? "";
      const lowerSv = sv.toLowerCase();
      return options.filter((o) =>
        String(o.label).toLowerCase().includes(lowerSv),
      );
    }, [options, searchValue]);

    const selectedValues: (string | number)[] = multiple
      ? (value as (string | number)[]) || []
      : value !== undefined && value !== null
        ? [value as string | number]
        : [];

    const handleSelect = (
      e: React.MouseEvent<HTMLDivElement>,
      selectedValue: string | number,
    ) => {
      if (multiple) {
        const exists = selectedValues.includes(selectedValue);
        const updated = exists
          ? selectedValues.filter((v) => v !== selectedValue)
          : [...selectedValues, selectedValue];
        onSelect?.(e, updated);
      } else {
        onSelect?.(e, selectedValue);
        setOpen(false);
      }
    };

    const selectedLabels = options
      .filter((o) => selectedValues.includes(o.value))
      .map((o) => o.label);

    const displayValue = () => {
      if (!selectedLabels.length) return placeholder;
      if (selectedLabels.length === 1) return selectedLabels[0];
      return `${selectedLabels[0]} +${selectedLabels.length - 1}`;
    };

    return (
      <div
        ref={internalRef}
        className={`relative flex flex-col gap-1.5 ${variant === "circle" ? "w-max" : "w-full"} ${className}`}
        {...props}
      >
        {label && (
          <label
            htmlFor={dropdownId}
            className="block text-sm mb-1"
          >
            {label} {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Trigger */}
        <button
          id={dropdownId}
          type="button"
          onClick={() => setOpen((v) => !v)}
          data-error={hasError}
          className={`text-sm cursor-pointer h-10 flex items-center border! border-gray-300! outline-none focus:outline-none transition-all duration-150
            ${variantStyles[variant]}
            ${statusStyles[status]}
            ${variant === "circle" && !className.includes("w-") ? "w-10" : ""}
            ${variant === "circle" && !className.includes("h-") ? "h-10" : ""}
          `}
        >
          <span className="truncate">{displayValue()}</span>

          {variant !== "circle" && (
            <KeyboardArrowDownIcon
              fontSize="small"
              className={`text-gray-500 transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          )}
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div
            className={`absolute top-full z-50 mt-2 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-hidden animate-in fade-in duration-100
              ${variant === "circle" ? "right-0" : "left-0"}
              ${menuWidth ? menuWidth : "w-full"}
            `}
          >
            {search && (
              <div className="p-2 border-b border-gray-100">
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md outline-none focus:outline-none focus:bg-white focus:border-gray-300 transition-colors"
                />
              </div>
            )}

            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-400 italic text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={(e) => handleSelect(e, option.value)}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {multiple && (
                      <input
                        type="checkbox"
                        readOnly
                        checked={selectedValues.includes(option.value)}
                        className="h-4 w-4 rounded border-gray-300 accent-black"
                      />
                    )}
                    <span className="truncate text-typography-primary">{option.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {error && (
          <p
            id={`${dropdownId}-error`}
            className="mt-1 text-xs text-red-500 font-medium"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";

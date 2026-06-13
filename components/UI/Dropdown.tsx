"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  error?: string;

  options: SelectOption[];

  search?: boolean;
  multiple?: boolean;

  value?: string | number | (string | number)[];

  onSelect?: (
    e: React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => void;
}

export function Dropdown({
  label,
  placeholder = "Select",
  required,
  error,
  options,
  search,
  multiple,
  value,
  onSelect,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasError = Boolean(error);

  // close outside click
  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  // filter options
  const filteredOptions = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [options, searchValue]);

  // normalize selected values
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

  // selected labels
  const selectedLabels = options
    .filter((o) => selectedValues.includes(o.value))
    .map((o) => o.label);

  const displayValue = () => {
    if (!selectedLabels.length) return placeholder;
    if (selectedLabels.length === 1) return selectedLabels[0];
    return `${selectedLabels[0]} +${selectedLabels.length - 1}`;
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-sans mb-1 text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full px-3 py-2 text-sm font-sans text-left rounded-md shadow-sm transition-all duration-200 flex items-center justify-between
          ${
            hasError
              ? "bg-red-100 hover:bg-red-200"
              : "bg-gray-50 hover:bg-gray-100"
          }
        `}
      >
        <span className="truncate">{displayValue()}</span>

        <KeyboardArrowDownIcon
          fontSize="small"
          className={`text-gray-600 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-md shadow-lg overflow-hidden">
          {/* Search */}
          {search && (
            <div className="p-2">
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 text-sm font-sans bg-gray-50 rounded-md outline-none focus:bg-gray-100"
              />
            </div>
          )}

          {/* Options */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={(e) => handleSelect(e, option.value)}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm font-sans hover:bg-gray-100 transition"
              >
                {multiple && (
                  <input
                    type="checkbox"
                    readOnly
                    checked={selectedValues.includes(option.value)}
                    className="accent-black"
                  />
                )}
                <span className="truncate">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p className="mt-1 text-xs font-sans text-red-500">{error}</p>}
    </div>
  );
}

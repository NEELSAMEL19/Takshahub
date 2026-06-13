"use client";

export interface AlertProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const bgColor = {
    success: "bg-green-50",
    error: "bg-red-50",
    info: "bg-blue-50",
    warning: "bg-yellow-50",
  };

  const borderColor = {
    success: "border-green-200",
    error: "border-red-200",
    info: "border-blue-200",
    warning: "border-yellow-200",
  };

  const textColor = {
    success: "text-green-800",
    error: "text-red-800",
    info: "text-blue-800",
    warning: "text-yellow-800",
  };

  return (
    <div
      className={`${bgColor[type]} border ${borderColor[type]} ${textColor[type]} px-4 py-3 rounded-md flex justify-between items-center`}
    >
      <p className="text-sm">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-sm font-semibold hover:opacity-70"
        >
          ✕
        </button>
      )}
    </div>
  );
}

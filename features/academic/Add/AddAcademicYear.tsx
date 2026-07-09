"use client";

import Header from "@/components/Base/Header/Header";
import { Button, TextField } from "@/components/UI";
import { Status } from "@/types/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
import dayjs from "dayjs";
import { useAddAcademicYear } from "@/hooks/academic/academicYear"; // adjust path to match your hooks file
import { addAcademicYearSchema } from "../validation";

type DateRangeValue = [Date, Date] | null;

const AddAcademicYear = () => {
  const router = useRouter();

  const [label, setLabel] = useState("");
  const [range, setRange] = useState<DateRangeValue>(null);

  const [errors, setErrors] = useState<{
    label?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const [status, setStatus] = useState<{
    label: Status;
    dateRange: Status;
  }>({
    label: "info",
    dateRange: "info",
  });

  const addAcademicYearMutation = useAddAcademicYear(
    (backendErrors: Record<string, string>) => {
      setErrors(backendErrors);
      setStatus({
        label: backendErrors?.label ? "error" : "success",
        dateRange:
          backendErrors?.startDate || backendErrors?.endDate
            ? "error"
            : "success",
      });
    },
  );

  const validateLabel = (value: string) => {
    const result = addAcademicYearSchema.shape
      ? undefined // placeholder, real check below since schema is a refine() wrapper
      : undefined;

    // addAcademicYearSchema is wrapped in .refine(), so validate label alone
    // against a plain string check instead of pulling .shape off it.
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, label: "Label is required." }));
      setStatus((prev) => ({ ...prev, label: "error" }));
    } else if (value.trim().length > 20) {
      setErrors((prev) => ({
        ...prev,
        label: "Label must be under 20 characters.",
      }));
      setStatus((prev) => ({ ...prev, label: "error" }));
    } else {
      setErrors((prev) => ({ ...prev, label: undefined }));
      setStatus((prev) => ({ ...prev, label: "success" }));
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLabel(value);
    validateLabel(value);
  };

  const handleRangeChange = (value: DateRangeValue) => {
    setRange(value);
    setErrors((prev) => ({
      ...prev,
      startDate: undefined,
      endDate: undefined,
    }));
    setStatus((prev) => ({ ...prev, dateRange: value ? "success" : "info" }));
  };

  const onSubmit = async () => {
    const payload = {
      label,
      startDate: range ? dayjs(range[0]).format("YYYY-MM-DD") : "",
      endDate: range ? dayjs(range[1]).format("YYYY-MM-DD") : "",
    };

    const result = addAcademicYearSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof errors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      setStatus((prev) => ({
        ...prev,
        label: fieldErrors.label ? "error" : prev.label,
        dateRange:
          fieldErrors.startDate || fieldErrors.endDate
            ? "error"
            : prev.dateRange,
      }));
      return;
    }

    setErrors({});

    try {
      await addAcademicYearMutation.mutateAsync(payload);
      router.back();
    } catch (error) {}
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Header header="Add Academic Year" />
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        <TextField
          label="Label"
          type="text"
          name="label"
          required
          maxLength={20}
          placeholder="e.g. 2025-26"
          value={label}
          onChange={handleLabelChange}
          color={errors.label ? "error" : status.label}
          error={errors.label || ""}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Academic Year Duration <span className="text-red-500">*</span>
          </label>
          <DateRangePicker
            value={range}
            onChange={handleRangeChange}
            placeholder="Select start and end date"
            format="yyyy-MM-dd"
            character=" to "
            cleanable
            block
          />
          {(errors.startDate || errors.endDate) && (
            <p className="text-red-500 text-sm mt-1">
              {errors.startDate || errors.endDate}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 flex flex-row gap-2.5">
        <Button
          onClick={handleCancel}
          disabled={addAcademicYearMutation.isPending}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={addAcademicYearMutation.isPending}>
          {addAcademicYearMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AddAcademicYear;

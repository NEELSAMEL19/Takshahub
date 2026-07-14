"use client";

import Header from "@/components/Base/Header/Header";
import { Button, TextField } from "@/components/UI";
import NotFoundPage from "@/components/UI/NotFound";
import { Status } from "@/types/ui";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
import {
  useEditAcademicYear,
  useGetAcademicYearById,
} from "@/hooks/academic/academicYear";
import { addAcademicYearSchema } from "../validation"; // adjust path as needed

type DateRangeValue = [Date, Date] | null;

const toDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const EditAcademicYear = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    data,
    isLoading: isFetching,
    isError,
    isFetched,
  } = useGetAcademicYearById(id);

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

  // Prefill form once the academic year loads
  useEffect(() => {
    const year = data?.data;
    if (!year) return;

    setLabel(year.label);
    setRange([new Date(year.startDate), new Date(year.endDate)]);
  }, [data]);

  const editAcademicYearMutation = useEditAcademicYear(
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
      startDate: range ? toDateString(range[0]) : "",
      endDate: range ? toDateString(range[1]) : "",
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
      await editAcademicYearMutation.mutateAsync({ id, data: payload });
      router.back();
    } catch (error) {}
  };

  const handleCancel = () => {
    router.back();
  };

  if (isFetching) {
    return <p className="px-5">Loading academic year...</p>;
  }

  // Invalid / non-existent id → show 404 UI, but layout (navbar/sidebar) stays intact
  if (isError || (isFetched && !data?.data)) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Header header="Edit Academic Year" />
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
          disabled={editAcademicYearMutation.isPending}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={editAcademicYearMutation.isPending}
        >
          {editAcademicYearMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default EditAcademicYear;

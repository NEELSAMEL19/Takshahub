"use client";

import { useEffect, useState } from "react";
import Grid from "@/components/UI/Grid";
import { Dropdown } from "@/components/UI";
import type { SelectOption } from "@/components/UI/Dropdown";
import {
  useGetTeachersAttendance,
  useUpdateTeacherAttendance,
} from "@/hooks/attendance/teacher";
import { useGetAcademicYears } from "@/hooks/academic/academicYear"; // adjust path to match your actual hook file

type AcademicYearItem = {
  id: string | number;
  label: string;
  isActive: boolean;
};

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | null;

type TeacherRow = {
  id: string | number;
  teacherId: string;
  fullName: string;
  email: string;
  status: AttendanceStatus;
};

type StatusConfigEntry = {
  label: string;
  icon: string;
  fill: string;
  on: string;
  outline?: boolean;
};

const toAcademicYearOption = (year: AcademicYearItem): SelectOption => ({
  label: year.isActive ? `${year.label} (Current)` : year.label,
  value: String(year.id),
});

const todayISO = () => new Date().toISOString().slice(0, 10);

// Click cycles through these in order. Cycling back to null unmarks it.
const STATUS_CYCLE: AttendanceStatus[] = ["PRESENT", "ABSENT", "LATE", null];

const STATUS_CONFIG: { [key: string]: StatusConfigEntry } = {
  PRESENT: {
    label: "Present",
    icon: "✓",
    fill: "bg-green-600",
    on: "text-white",
  },
  ABSENT: { label: "Absent", icon: "✕", fill: "bg-red-600", on: "text-white" },
  LATE: { label: "Late", icon: "🕐", fill: "bg-amber-600", on: "text-white" },
  UNMARKED: {
    label: "Mark",
    icon: "○",
    fill: "bg-transparent",
    on: "text-gray-600",
    outline: true,
  },
};

const Teachers = () => {
  const [date, setDate] = useState<string>(todayISO());

  // "" means "use active year" (default/current). Once academic years load,
  // we set this to the active year's id explicitly so the dropdown shows
  // the right selection. Selecting a past year sends its id to the backend
  // and switches the roster to view-only mode.
  const [academicYearId, setAcademicYearId] = useState<string>("");

  // Track which row is currently mid-mutation so we can disable/dim just
  // that cell rather than the whole grid.
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data: academicYearsData } = useGetAcademicYears();

  const academicYears = (academicYearsData?.data as AcademicYearItem[]) ?? [];

  // Default the dropdown to the active year once data arrives.
  useEffect(() => {
    if (!academicYearId && academicYears.length > 0) {
      const active = academicYears.find((y) => y.isActive);
      if (active) setAcademicYearId(String(active.id));
    }
  }, [academicYears, academicYearId]);

  const selectedYear = academicYears.find(
    (y) => String(y.id) === academicYearId,
  );
  // Only the active year is editable; any other (past/inactive) year is
  // view-only — matches the backend, which rejects writes against
  // non-active years.
  const isViewOnly = !!selectedYear && !selectedYear.isActive;

  const academicYearOptions: SelectOption[] =
    academicYears.map(toAcademicYearOption);

  const { data, isLoading } = useGetTeachersAttendance({
    date,
    academicYearId, // sent through to the backend as-is
  });

  const { mutate: updateAttendance } = useUpdateTeacherAttendance();

  const handleAcademicYearSelect = (
    _e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const next = Array.isArray(value) ? value[0] : value;
    setAcademicYearId(String(next));
  };

  const handleToggleStatus = (row: TeacherRow) => {
    if (isViewOnly) return; // guard: past years are not editable

    // Unlike students, no classId/sectionId is needed here — teacher
    // attendance is a single school-wide record per day.
    const currentIndex = STATUS_CYCLE.indexOf(row.status ?? null);
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];

    setPendingId(row.teacherId);
    updateAttendance(
      {
        teacherId: row.teacherId,
        date,
        status: nextStatus,
      },
      {
        onSettled: () => setPendingId(null),
      },
    );
  };

  const columns = [
    { field: "fullName", headerName: "Teacher" },
    {
      field: "status",
      headerName: "Status",
      align: "right" as const,
      headerAlign: "right" as const,
      renderCell: (row: TeacherRow) => {
        const config = STATUS_CONFIG[row.status ?? "UNMARKED"];
        const isPending = pendingId === row.teacherId;
        const disabled = isPending || isViewOnly;
        return (
          <button
            type="button"
            disabled={disabled}
            title={isViewOnly ? "Past academic years are view-only" : undefined}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row);
            }}
            className={`inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg shadow-sm min-w-[96px] transition-all active:scale-95 ${config.fill} ${config.on} ${
              config.outline ? "border border-gray-300" : ""
            } ${
              disabled
                ? "opacity-40 cursor-not-allowed"
                : "cursor-pointer hover:brightness-110"
            }`}
          >
            <span aria-hidden="true">{config.icon}</span>
            {config.label}
          </button>
        );
      },
    },
  ];

  const filters = (
    <div className="flex gap-2.5 items-center">
      <Dropdown
        options={academicYearOptions}
        value={academicYearId}
        onSelect={handleAcademicYearSelect}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="px-3 py-2 sm:py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2"
      />
    </div>
  );

  return (
    <Grid
      rows={(data?.data as TeacherRow[]) ?? []}
      columns={columns}
      loading={isLoading}
      filters={filters}
      searchable
    />
  );
};

export default Teachers;

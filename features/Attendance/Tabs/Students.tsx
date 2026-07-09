"use client";

import { useEffect, useState } from "react";
import Grid from "@/components/UI/Grid";
import { Dropdown } from "@/components/UI";
import type { SelectOption } from "@/components/UI/Dropdown";
import {
  useGetStudentsAttendance,
  useUpdateStudentAttendance,
} from "@/hooks/attendance/students";
import {
  useGetClassDropdown,
  useGetSectionDropdown,
} from "@/hooks/management/class";
import { useGetAcademicYears } from "@/hooks/academic/academicYear"; // adjust path to match your actual hook file

type DropdownItem = {
  id?: string | number;
  value?: string | number;
  classId?: string | number;
  sectionId?: string | number;
  name?: string;
  label?: string;
  className?: string;
  sectionName?: string;
};

type AcademicYearItem = {
  id: string | number;
  label: string;
  isActive: boolean;
};

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | null;

type StudentRow = {
  id: string | number;
  studentId: string;
  classId: string;
  sectionId: string;
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

const toDropdownOption = (item: DropdownItem): SelectOption => {
  const value = item.value ?? item.id ?? item.classId ?? item.sectionId ?? "";
  return {
    label:
      item.label ??
      item.className ??
      item.sectionName ??
      item.name ??
      String(value),
    value: String(value),
  };
};

const toAcademicYearOption = (year: AcademicYearItem): SelectOption => ({
  label: year.isActive ? `${year.label} (Current)` : year.label,
  value: String(year.id),
});

const ALL_VALUE = "all";
const ALL_OPTION: SelectOption = { label: "All", value: ALL_VALUE };

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

const Students = () => {
  const [classId, setClassId] = useState<string | number>(ALL_VALUE);
  const [sectionId, setSectionId] = useState<string | number>(ALL_VALUE);
  const [date, setDate] = useState<string>(todayISO());

  // "" means "use active year" (default/current). Once academic years load,
  // we set this to the active year's id explicitly so the dropdown shows
  // the right selection. Selecting a past year sends its id to the backend
  // and switches the roster to view-only mode.
  const [academicYearId, setAcademicYearId] = useState<string>("");

  // Track which row is currently mid-mutation so we can disable/dim just
  // that cell rather than the whole grid.
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data: classDropdownData } = useGetClassDropdown();
  const { data: sectionDropdownData } = useGetSectionDropdown(
    classId === ALL_VALUE ? null : classId,
  );
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

  const classOptions: SelectOption[] = [
    ALL_OPTION,
    ...((classDropdownData?.data as DropdownItem[]) ?? []).map(
      toDropdownOption,
    ),
  ];

  const sectionOptions: SelectOption[] = [
    ALL_OPTION,
    ...((sectionDropdownData?.data as DropdownItem[]) ?? []).map(
      toDropdownOption,
    ),
  ];

  const academicYearOptions: SelectOption[] =
    academicYears.map(toAcademicYearOption);

  const { data, isLoading } = useGetStudentsAttendance({
    classId: classId === ALL_VALUE ? "" : String(classId),
    sectionId: sectionId === ALL_VALUE ? "" : String(sectionId),
    date,
    academicYearId, // NEW — sent through to the backend as-is
  });

  const { mutate: updateAttendance } = useUpdateStudentAttendance();

  const handleClassSelect = (
    _e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const next = Array.isArray(value) ? value[0] : value;
    setClassId(next);
    setSectionId(ALL_VALUE);
  };

  const handleSectionSelect = (
    _e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    setSectionId(Array.isArray(value) ? value[0] : value);
  };

  const handleAcademicYearSelect = (
    _e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const next = Array.isArray(value) ? value[0] : value;
    setAcademicYearId(String(next));
  };

  const handleToggleStatus = (row: StudentRow) => {
    if (isViewOnly) return; // guard: past years are not editable

    // classId/sectionId come from the ROW itself (per-student, returned by
    // the backend), not from page-level filter state — required so this
    // works correctly in "All" mode where no single class/section is set.
    const currentIndex = STATUS_CYCLE.indexOf(row.status ?? null);
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];

    setPendingId(row.studentId);
    updateAttendance(
      {
        studentId: row.studentId,
        classId: row.classId,
        sectionId: row.sectionId,
        date,
        status: nextStatus,
      },
      {
        onSettled: () => setPendingId(null),
      },
    );
  };

  const columns = [
    { field: "fullName", headerName: "Student" },
    {
      field: "status",
      headerName: "Status",
      align: "right" as const,
      headerAlign: "right" as const,
      renderCell: (row: StudentRow) => {
        const config = STATUS_CONFIG[row.status ?? "UNMARKED"];
        const isPending = pendingId === row.studentId;
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
    <>
      <Dropdown
        options={academicYearOptions}
        value={academicYearId}
        onSelect={handleAcademicYearSelect}
      />
      <Dropdown
        options={classOptions}
        value={classId}
        onSelect={handleClassSelect}
      />
      <Dropdown
        options={sectionOptions}
        value={sectionId}
        onSelect={handleSectionSelect}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="px-3 py-2 sm:py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2"
      />
    </>
  );

  return (
    <Grid
      rows={(data?.data as StudentRow[]) ?? []}
      columns={columns}
      loading={isLoading}
      filters={filters}
    />
  );
};

export default Students;

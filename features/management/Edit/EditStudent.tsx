"use client";

import Header from "@/components/Base/Header/Header";
import { Button, Dropdown } from "@/components/UI";
import NotFoundPage from "@/components/UI/NotFound";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { useEditStudent, useGetStudentById } from "@/hooks/management/student";
import {
  useGetClassDropdown,
  useGetSectionDropdown,
} from "@/hooks/management/class";
import type { DropdownOption, StudentFieldErrors } from "@/types/management";

type DropdownItem = {
  id?: string | number;
  value?: string | number;
  studentId?: string | number;
  classId?: string | number;
  sectionId?: string | number;
  name?: string;
  label?: string;
  fullName?: string;
  className?: string;
  sectionName?: string;
};

const toDropdownOption = (item: DropdownItem): DropdownOption => {
  const value =
    item.value ??
    item.id ??
    item.studentId ??
    item.classId ??
    item.sectionId ??
    "";

  return {
    label:
      item.label ??
      item.fullName ??
      item.name ??
      item.className ??
      item.sectionName ??
      String(value),
    value: String(value),
  };
};

const EditStudent = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: studentData, isLoading: isStudentLoading } =
    useGetStudentById(id);
  // getEnrolledStudentById returns an array of enrollments — take the first
  const enrollment = studentData?.data?.[0];

const [classIdOverride, setClassIdOverride] = useState<string | number | null>(null);
   const [sectionIdOverride, setSectionIdOverride] = useState<string | number | null>(null);
  const [errors, setErrors] = useState<StudentFieldErrors>({});

  const classId = classIdOverride ?? enrollment?.classId ?? "";
  const sectionId = sectionIdOverride ?? enrollment?.sectionId ?? "";

  const { data: classDropdownData } = useGetClassDropdown();
  const { data: sectionDropdownData } = useGetSectionDropdown(classId || null);

  const editStudentMutation = useEditStudent(
    (backendErrors: StudentFieldErrors) => {
      setErrors(backendErrors);
    },
  );

  // Backend returns [{ label, value }] directly — no mapping needed.
  const classOptions: DropdownOption[] = (
    (classDropdownData?.data as DropdownItem[]) ?? []
  ).map(toDropdownOption);

  const sectionOptions: DropdownOption[] = (
    (sectionDropdownData?.data as DropdownItem[]) ?? []
  ).map(toDropdownOption);

  const handleClassSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const newClassId = Array.isArray(value) ? value[0] : value;
    // reset section whenever class changes — old section no longer valid
    setClassIdOverride(newClassId);
    setSectionIdOverride("");
    setErrors((prev) => ({
      ...prev,
      classId: undefined,
      sectionId: undefined,
    }));
  };

  const handleSectionSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const newSectionId = Array.isArray(value) ? value[0] : value;
    setSectionIdOverride(newSectionId);
    setErrors((prev) => ({ ...prev, sectionId: undefined }));
  };

  const validate = () => {
    const newErrors: StudentFieldErrors = {};
    if (!classId) newErrors.classId = "Class is required";
    if (!sectionId) newErrors.sectionId = "Section is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    if (!enrollment) return;

    try {
      await editStudentMutation.mutateAsync({
        studentId: enrollment.studentId,
        currentClassId: String(enrollment.classId),
        newClassId: String(classId),
        newSectionId: String(sectionId),
      });
      router.back();
    } catch (error) {
      // Log error for debugging
      console.error(error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isStudentLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-sm text-gray-500">Loading student...</span>
      </div>
    );
  }

  // Invalid / non-existent id → show 404 UI, but layout (navbar/sidebar) stays intact
  if (!enrollment) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Header header="Edit Student" />
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        <Dropdown
          label="Student"
          options={[
            {
              label: enrollment.student?.fullName ?? "",
              value: enrollment.studentId,
            },
          ]}
          value={enrollment.studentId}
          onSelect={() => {}}
          className="opacity-60 pointer-events-none"
        />

        <Dropdown
          label="Class"
          options={classOptions}
          value={classId}
          onSelect={handleClassSelect}
          error={errors.classId}
        />

        <Dropdown
          label="Section"
          options={sectionOptions}
          value={sectionId}
          onSelect={handleSectionSelect}
          error={errors.sectionId}
          className={!classId ? "opacity-60 pointer-events-none" : ""}
        />
      </div>

      <div className="px-5 flex flex-row gap-2.5">
        <Button
          onClick={handleCancel}
          disabled={editStudentMutation.isPending}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={editStudentMutation.isPending}>
          {editStudentMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default EditStudent;

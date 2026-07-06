"use client";

import Header from "@/components/Base/Header/Header";
import { Button, Dropdown } from "@/components/UI";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddStudent } from "@/hooks/management/student"; // adjust import path
import {
  useGetClassDropdown,
  useGetSectionDropdown,
} from "@/hooks/management/class"; // adjust import path
import { useGetAvailableStudents } from "@/hooks/management/student"; // adjust import path
import type { StudentFieldErrors } from "@/types/management";
import type { SelectOption } from "@/components/UI/Dropdown";

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

const toDropdownOption = (item: DropdownItem): SelectOption => {
  const value =
    item.value ?? item.id ?? item.studentId ?? item.classId ?? item.sectionId ?? "";

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

const AddStudent = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    studentId: string | number | "";
    classId: string | number | "";
    sectionId: string | number | "";
  }>({
    studentId: "",
    classId: "",
    sectionId: "",
  });

  const [errors, setErrors] = useState<StudentFieldErrors>({});

  const { data: availableStudentsData } = useGetAvailableStudents();
  const { data: classDropdownData } = useGetClassDropdown();
  const { data: sectionDropdownData } = useGetSectionDropdown(
    formData.classId || null,
  );

  const addStudentMutation = useAddStudent((backendErrors: StudentFieldErrors) => {
    setErrors(backendErrors);
  });

  // Map API shapes to `DropdownOption` safely
  const studentOptions: SelectOption[] =
    ((availableStudentsData?.data as DropdownItem[]) ?? []).map(
      toDropdownOption,
    ) ?? [];

  const classOptions: SelectOption[] =
    ((classDropdownData?.data as DropdownItem[]) ?? []).map(toDropdownOption) ??
    [];

  const sectionOptions: SelectOption[] =
    ((sectionDropdownData?.data as DropdownItem[]) ?? []).map(
      toDropdownOption,
    ) ?? [];

  const handleStudentSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const studentId = Array.isArray(value) ? value[0] : value;
    setFormData((prev) => ({ ...prev, studentId }));
    setErrors((prev) => ({ ...prev, studentId: undefined }));
  };

  const handleClassSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const classId = Array.isArray(value) ? value[0] : value;
    // Reset section whenever class changes — old section no longer valid.
    setFormData((prev) => ({ ...prev, classId, sectionId: "" }));
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
    const sectionId = Array.isArray(value) ? value[0] : value;
    setFormData((prev) => ({ ...prev, sectionId }));
    setErrors((prev) => ({ ...prev, sectionId: undefined }));
  };

  const validate = () => {
    const newErrors: StudentFieldErrors = {};
    if (!formData.studentId) newErrors.studentId = "Student is required";
    if (!formData.classId) newErrors.classId = "Class is required";
    if (!formData.sectionId) newErrors.sectionId = "Section is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      await addStudentMutation.mutateAsync({
        studentId: String(formData.studentId),
        classId: String(formData.classId),
        sectionId: String(formData.sectionId),
      });
      router.back();
    } catch {}
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Header header="Add Student" />
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        <Dropdown
          label="Student"
          options={studentOptions}
          value={formData.studentId}
          onSelect={handleStudentSelect}
          error={errors.studentId}
        />

        <Dropdown
          label="Class"
          options={classOptions}
          value={formData.classId}
          onSelect={handleClassSelect}
          error={errors.classId}
        />

        <Dropdown
          label="Section"
          options={sectionOptions}
          value={formData.sectionId}
          onSelect={handleSectionSelect}
          error={errors.sectionId}
        />
      </div>

      <div className="px-5 flex flex-row gap-2.5">
        <Button
          onClick={handleCancel}
          disabled={addStudentMutation.isPending}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={addStudentMutation.isPending}>
          {addStudentMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AddStudent;

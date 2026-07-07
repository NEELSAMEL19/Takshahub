"use client";

import Header from "@/components/Base/Header/Header";
import { Button, Dropdown } from "@/components/UI";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssignSubjectTeacher } from "@/hooks/management/SubjectTeacher";
import {
  useGetClassDropdown,
  useGetSectionDropdown,
} from "@/hooks/management/class";
import { useGetSubjectDropdown } from "@/hooks/management/subject";
import { useGetAllMembers } from "@/hooks/organization/member";
import type { FieldErrors } from "@/types/management";
import type { SelectOption } from "@/components/UI/Dropdown";

type DropdownItem = {
  id?: string | number;
  value?: string | number;
  teacherId?: string | number;
  classId?: string | number;
  sectionId?: string | number;
  subjectId?: string | number;
  name?: string;
  label?: string;
  fullName?: string;
  className?: string;
  sectionName?: string;
  role?: string;
};

const toDropdownOption = (item: DropdownItem): SelectOption => {
  const value =
    item.value ??
    item.id ??
    item.teacherId ??
    item.classId ??
    item.sectionId ??
    item.subjectId ??
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

const AddSubjectTeacher = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    teacherId: string | number | "";
    classId: string | number | "";
    sectionId: string | number | "";
    subjectId: string | number | "";
  }>({
    teacherId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});

  const { data: membersData } = useGetAllMembers();
  const { data: classDropdownData } = useGetClassDropdown();
  const { data: subjectDropdownData } = useGetSubjectDropdown();
  const { data: sectionDropdownData } = useGetSectionDropdown(
    formData.classId || null,
  );

  const assignSubjectTeacherMutation = useAssignSubjectTeacher(
    (backendErrors: FieldErrors) => {
      setErrors(backendErrors);
    },
  );

  // Filter for teachers only and map to dropdown options
  const teacherOptions: SelectOption[] =
    ((membersData?.data as any[]) ?? [])
      .filter((member) => member.role?.portalType === "TEACHER")
      .map((member) => ({
        label: member.fullName,
        value: String(member.id),
      })) ?? [];

  const classOptions: SelectOption[] =
    ((classDropdownData?.data as DropdownItem[]) ?? []).map(toDropdownOption) ??
    [];

  const subjectOptions: SelectOption[] =
    ((subjectDropdownData?.data as DropdownItem[]) ?? []).map(
      toDropdownOption,
    ) ?? [];

  const sectionOptions: SelectOption[] =
    ((sectionDropdownData?.data as DropdownItem[]) ?? []).map(
      toDropdownOption,
    ) ?? [];

  const handleTeacherSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const teacherId = Array.isArray(value) ? value[0] : value;
    setFormData((prev) => ({ ...prev, teacherId }));
    setErrors((prev) => {
      const { teacherId: _omit, ...rest } = prev;
      return rest;
    });
  };

  const handleClassSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const classId = Array.isArray(value) ? value[0] : value;
    setFormData((prev) => ({ ...prev, classId, sectionId: "" }));
    setErrors((prev) => {
      const { classId: _c, sectionId: _s, ...rest } = prev;
      return rest;
    });
  };

  const handleSectionSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const sectionId = Array.isArray(value) ? value[0] : value;
    setFormData((prev) => ({ ...prev, sectionId }));
    setErrors((prev) => {
      const { sectionId: _omit, ...rest } = prev;
      return rest;
    });
  };

  const handleSubjectSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>,
    value: string | number | (string | number)[],
  ) => {
    const subjectId = Array.isArray(value) ? value[0] : value;
    setFormData((prev) => ({ ...prev, subjectId }));
    setErrors((prev) => {
      const { subjectId: _omit, ...rest } = prev;
      return rest;
    });
  };

  const validate = () => {
    const newErrors: FieldErrors = {};
    if (!formData.teacherId) newErrors.teacherId = "Teacher is required";
    if (!formData.classId) newErrors.classId = "Class is required";
    if (!formData.sectionId) newErrors.sectionId = "Section is required";
    if (!formData.subjectId) newErrors.subjectId = "Subject is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      await assignSubjectTeacherMutation.mutateAsync({
        teacherId: String(formData.teacherId),
        classId: String(formData.classId),
        sectionId: String(formData.sectionId),
        subjectId: String(formData.subjectId),
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
        <Header header="Assign Subject Teacher" />
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        <Dropdown
          label="Teacher"
          options={teacherOptions}
          value={formData.teacherId}
          onSelect={handleTeacherSelect}
          error={errors.teacherId}
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

        <Dropdown
          label="Subject"
          options={subjectOptions}
          value={formData.subjectId}
          onSelect={handleSubjectSelect}
          error={errors.subjectId}
        />
      </div>

      <div className="px-5 flex flex-row gap-2.5">
        <Button
          onClick={handleCancel}
          disabled={assignSubjectTeacherMutation.isPending}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={assignSubjectTeacherMutation.isPending}
        >
          {assignSubjectTeacherMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AddSubjectTeacher;

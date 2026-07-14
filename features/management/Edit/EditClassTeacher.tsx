"use client";

import Header from "@/components/Base/Header/Header";
import { Button, Dropdown } from "@/components/UI";
import NotFoundPage from "@/components/UI/NotFound";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useGetClassTeacherById,
  useUpdateClassTeacher,
} from "@/hooks/management/classTeacher";
import {
  useGetClassDropdown,
  useGetSectionDropdown,
} from "@/hooks/management/class";
import { useGetAllMembers } from "@/hooks/organization/member";
import type { FieldErrors } from "@/types/management";
import type { SelectOption } from "@/components/UI/Dropdown";

type DropdownItem = {
  id?: string | number;
  value?: string | number;
  teacherId?: string | number;
  classId?: string | number;
  sectionId?: string | number;
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

const EditClassTeacher = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: classTeacherData, isLoading: isClassTeacherLoading } =
    useGetClassTeacherById(id);
  const classTeacherItem = classTeacherData?.data;

  const [formData, setFormData] = useState<{
    teacherId: string | number | "";
    classId: string | number | "";
    sectionId: string | number | "";
  }>({
    teacherId: "",
    classId: "",
    sectionId: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});

  // Prefill form once class teacher data arrives
  useEffect(() => {
    if (classTeacherItem) {
      setFormData({
        teacherId: classTeacherItem.teacherId ?? "",
        classId: classTeacherItem.classId ?? "",
        sectionId: classTeacherItem.sectionId ?? "",
      });
    }
  }, [
    classTeacherItem?.teacherId,
    classTeacherItem?.classId,
    classTeacherItem?.sectionId,
  ]);

  const { data: membersData } = useGetAllMembers();
  const { data: classDropdownData } = useGetClassDropdown();
  const { data: sectionDropdownData } = useGetSectionDropdown(
    formData.classId || null,
  );

  const updateClassTeacherMutation = useUpdateClassTeacher(
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

  const validate = () => {
    const newErrors: FieldErrors = {};
    if (!formData.teacherId) newErrors.teacherId = "Teacher is required";
    if (!formData.classId) newErrors.classId = "Class is required";
    if (!formData.sectionId) newErrors.sectionId = "Section is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      await updateClassTeacherMutation.mutateAsync({
        id,
        data: {
          teacherId: String(formData.teacherId),
          classId: String(formData.classId),
          sectionId: String(formData.sectionId),
        },
      });
      router.back();
    } catch {}
  };

  const handleCancel = () => {
    router.back();
  };

  if (isClassTeacherLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-sm text-gray-500">Loading class teacher...</span>
      </div>
    );
  }

  // Invalid / non-existent id → show 404 UI, but layout (navbar/sidebar) stays intact
  if (!classTeacherItem) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Header header="Edit Class Teacher" />
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
      </div>

      <div className="px-5 flex flex-row gap-2.5">
        <Button
          onClick={handleCancel}
          disabled={updateClassTeacherMutation.isPending}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={updateClassTeacherMutation.isPending}
        >
          {updateClassTeacherMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default EditClassTeacher;

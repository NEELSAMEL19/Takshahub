"use client";

import Header from "@/components/Base/Header/Header";
import { Button, TextField } from "@/components/UI";
import { Status } from "@/types/ui";
import { useEditClass, useGetClassById } from "@/hooks/management/class";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { addClassSchema } from "../validation";
import { EDITCLASSPAYLOAD, SectionInput } from "@/types/management";

const EditClass = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: classData, isLoading: isClassLoading } = useGetClassById(id);
  const classItem = classData?.data;

  const [classNameOverride, setClassNameOverride] = useState<string | null>(
    null,
  );
  const [sectionsInput, setSectionsInput] = useState<string | null>(null);
  // keep original sections (with ids) so we can map names back to ids on submit
  const [originalSections, setOriginalSections] = useState<SectionInput[]>([]);

  const [errors, setErrors] = useState<{
    className?: string;
    sections?: string;
  }>({});

  const [status, setStatus] = useState<{
    className: Status;
    sections: Status;
  }>({
    className: "info",
    sections: "info",
  });

  useEffect(() => {
    if (classItem) {
      // Avoid synchronous setState inside effect (ESLint rule).
      setTimeout(() => {
        setClassNameOverride(null);
        const sections = (classItem.sections ?? []).map(
          (s: { id: string; name: string }) => ({ id: s.id, name: s.name }),
        );
        setOriginalSections(sections);
        setSectionsInput(sections.map((s: SectionInput) => s.name).join(", "));
      }, 0);
    }
  }, [classItem?.id]);

  const className = classNameOverride ?? classItem?.name ?? "";
  const sectionsText = sectionsInput ?? "";

  const editClassMutation = useEditClass(
    (backendErrors: Record<string, string>) => {
      setErrors(backendErrors);
      setStatus({
        className: backendErrors?.className ? "error" : "success",
        sections: backendErrors?.sections ? "error" : "success",
      });
    },
  );

  const parseSections = (raw: string): string[] => {
    return Array.from(
      new Set(
        raw
          .split(",")
          .map((s) => s.trim().toUpperCase())
          .filter((s) => s.length > 0),
      ),
    );
  };

  const validateClassName = (value: string) => {
    const result = addClassSchema.shape.className.safeParse(value);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        className: result.error.issues[0].message,
      }));
      setStatus((prev) => ({ ...prev, className: "error" }));
    } else {
      setErrors((prev) => ({ ...prev, className: undefined }));
      setStatus((prev) => ({ ...prev, className: value ? "success" : "info" }));
    }
  };

  const validateSections = (raw: string) => {
    const parsed = parseSections(raw);
    const result = addClassSchema.shape.sections.safeParse(parsed);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        sections: result.error.issues[0].message,
      }));
      setStatus((prev) => ({ ...prev, sections: "error" }));
    } else {
      setErrors((prev) => ({ ...prev, sections: undefined }));
      setStatus((prev) => ({
        ...prev,
        sections: parsed.length ? "success" : "info",
      }));
    }
  };

  const handleClassNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClassNameOverride(value);
    validateClassName(value);
  };

  const handleSectionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSectionsInput(value);
    validateSections(value);
  };

  const onSubmit = async () => {
    const parsedNames = parseSections(sectionsText);

    const result = addClassSchema.safeParse({
      className,
      sections: parsedNames,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof errors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setStatus((prev) => ({
        ...prev,
        className: fieldErrors.className ? "error" : prev.className,
        sections: fieldErrors.sections ? "error" : prev.sections,
      }));
      return;
    }

    setErrors({});

    // map parsed names back to their original id if it existed, else new (no id)
    const finalSections: SectionInput[] = parsedNames.map((name) => {
      const existing = originalSections.find(
        (s) => s.name.toUpperCase() === name,
      );
      return existing ? { id: existing.id, name } : { name };
    });

    try {
      const payload: EDITCLASSPAYLOAD = {
        className,
        sections: finalSections,
      };

      await editClassMutation.mutateAsync({ classId: id, data: payload });
      router.back();
    } catch (_) {}
  };

  if (isClassLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-sm text-gray-500">Loading class...</span>
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-sm text-red-400">Class not found.</span>
      </div>
    );
  }

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Header header="Edit Class" />
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        <TextField
          label="Class Name"
          type="text"
          name="className"
          required
          maxLength={100}
          placeholder="e.g. Grade 6"
          value={className}
          onChange={handleClassNameChange}
          color={errors.className ? "error" : status.className}
          error={errors.className || ""}
        />

        <TextField
          label="Sections"
          type="text"
          name="sectionsInput"
          required
          placeholder="e.g. A, B, C"
          value={sectionsText}
          onChange={handleSectionsChange}
          color={errors.sections ? "error" : status.sections}
          error={errors.sections || ""}
        />
      </div>

      <div className="px-5 flex flex-row gap-2.5">
        <Button
          onClick={handleCancel}
          disabled={editClassMutation.isPending}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={editClassMutation.isPending}>
          {editClassMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default EditClass;

"use client";

import Header from "@/components/Base/Header/Header";
import { Button, TextField } from "@/components/UI";
import { Status } from "../types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddClass } from "@/hooks/management/class"; // adjust path to match your hooks file
import { addClassSchema } from "../validation";

const AddClass = () => {
  const router = useRouter();

  const [className, setClassName] = useState("");
  const [sections, setSections] = useState<string[]>([]);
  const [sectionInput, setSectionInput] = useState("");

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

  const addClassMutation = useAddClass(
    (backendErrors: Record<string, string>) => {
      setErrors(backendErrors);
      setStatus({
        className: backendErrors?.className ? "error" : "success",
        sections: backendErrors?.sections ? "error" : "success",
      });
    },
  );

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

  const handleClassNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClassName(value);
    validateClassName(value);
  };

  const addSection = () => {
    const trimmed = sectionInput.trim().toUpperCase();
    if (!trimmed) return;
    if (sections.includes(trimmed)) {
      setErrors((prev) => ({ ...prev, sections: "Section already added" }));
      setStatus((prev) => ({ ...prev, sections: "error" }));
      return;
    }
    const updated = [...sections, trimmed];
    setSections(updated);
    setSectionInput("");
    setErrors((prev) => ({ ...prev, sections: undefined }));
    setStatus((prev) => ({ ...prev, sections: "success" }));
  };

  const removeSection = (section: string) => {
    const updated = sections.filter((s) => s !== section);
    setSections(updated);
    setErrors((prev) => ({ ...prev, sections: undefined }));
    setStatus((prev) => ({
      ...prev,
      sections: updated.length === 0 ? "info" : "success",
    }));
  };

  const handleSectionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSection();
    }
  };

  const onSubmit = async () => {
    // safety net: commit any typed-but-not-added section (in case Enter didn't fire)
    let finalSections = sections;
    const pending = sectionInput.trim().toUpperCase();
    if (pending && !sections.includes(pending)) {
      finalSections = [...sections, pending];
      setSections(finalSections);
      setSectionInput("");
    }

    const payload = { className, sections: finalSections };
    const result = addClassSchema.safeParse(payload);

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

    try {
      await addClassMutation.mutateAsync(payload);
      router.back();
    } catch (error) {}
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Header header="Add Class" />
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
          label="Add Section"
          type="text"
          name="sectionInput"
          placeholder="e.g. A (press Enter)"
          value={sectionInput}
          onChange={(e) => setSectionInput(e.target.value)}
          onKeyDown={handleSectionKeyDown}
          color={errors.sections ? "error" : status.sections}
          error={errors.sections || ""}
        />
      </div>

      {sections.length > 0 && (
        <div className="px-5 flex flex-wrap gap-2">
          {sections.map((section) => (
            <span
              key={section}
              className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
            >
              {section}
              <button
                type="button"
                onClick={() => removeSection(section)}
                className="text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="px-5 flex flex-row gap-2.5">
        <Button
          onClick={handleCancel}
          disabled={addClassMutation.isPending}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={addClassMutation.isPending}>
          {addClassMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AddClass;

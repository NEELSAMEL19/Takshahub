"use client";

import Header from "@/components/Base/Header/Header";
import { Button, TextField } from "@/components/UI";
import { Status } from "@/types/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddClass } from "@/hooks/management/class"; // adjust path to match your hooks file
import { addClassSchema } from "../validation";

// Splits raw input into clean, deduped, uppercased section names.
// Handles both "A" (single) and "A,B,C" (comma-separated) in one entry.
const parseSectionInput = (raw: string): string[] => {
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
    ),
  );
};

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

  // Adds one or more sections from the current input, merging into
  // `existing` and returning the updated list (or null if nothing valid
  // was found, or a duplicate was rejected).
  const mergeSections = (raw: string, existing: string[]): string[] | null => {
    const candidates = parseSectionInput(raw);
    if (candidates.length === 0) return null;

    const duplicates = candidates.filter((c) => existing.includes(c));
    if (duplicates.length > 0) {
      setErrors((prev) => ({
        ...prev,
        sections: `Section already added: ${duplicates.join(", ")}`,
      }));
      setStatus((prev) => ({ ...prev, sections: "error" }));
      return null;
    }

    return [...existing, ...candidates];
  };

  const addSection = () => {
    const updated = mergeSections(sectionInput, sections);
    if (!updated) return;

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
    // Safety net: commit any typed-but-not-added section (in case Enter/click
    // never fired), using the same parsing/dedup logic as addSection so a
    // comma-separated leftover can never slip through as one bad entry.
    let finalSections = sections;
    if (sectionInput.trim()) {
      const updated = mergeSections(sectionInput, sections);
      if (updated) {
        finalSections = updated;
        setSections(updated);
        setSectionInput("");
      } else {
        // mergeSections already set an error (duplicate) — stop submit.
        return;
      }
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
          placeholder="e.g. A or A,B,C (press Enter)"
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

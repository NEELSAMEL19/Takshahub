"use client";

import Header from "@/components/Base/Header/Header";
import { Button, TextField } from "@/components/UI";
import NotFoundPage from "@/components/UI/NotFound";
import { Status } from "@/types/ui";
import { useEditSubject, useGetSubjectById } from "@/hooks/management/subject";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { addSubjectSchema } from "../validation";
import { UpdateSubjectPayload } from "@/types/management";

const EditSubject = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: subjectData, isLoading: isSubjectLoading } =
    useGetSubjectById(id);
  const subjectItem = subjectData?.data;

  const [nameOverride, setNameOverride] = useState<string | null>(null);
  // keep the original name so we can send it as oldName on submit
  const [originalName, setOriginalName] = useState<string>("");

  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

  const [status, setStatus] = useState<{
    name: Status;
  }>({
    name: "info",
  });

  useEffect(() => {
    if (subjectItem) {
      // Avoid synchronous setState inside effect (ESLint rule).
      setTimeout(() => {
        setNameOverride(null);
        setOriginalName(subjectItem.name);
      }, 0);
    }
  }, [subjectItem?.id]);

  const name = nameOverride ?? subjectItem?.name ?? "";

  const editSubjectMutation = useEditSubject(
    (backendErrors: Record<string, string>) => {
      setErrors(backendErrors);
      setStatus({
        name: backendErrors?.name ? "error" : "success",
      });
    },
  );

  const validateName = (value: string) => {
    const result = addSubjectSchema.shape.name.safeParse(value);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        name: result.error.issues[0].message,
      }));
      setStatus((prev) => ({ ...prev, name: "error" }));
    } else {
      setErrors((prev) => ({ ...prev, name: undefined }));
      setStatus((prev) => ({ ...prev, name: value ? "success" : "info" }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameOverride(value);
    validateName(value);
  };

  const onSubmit = async () => {
    const result = addSubjectSchema.safeParse({ name });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof errors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setStatus((prev) => ({
        ...prev,
        name: fieldErrors.name ? "error" : prev.name,
      }));
      return;
    }

    setErrors({});

    try {
      const payload: UpdateSubjectPayload = {
        oldName: originalName,
        newName: name,
      };

      await editSubjectMutation.mutateAsync(payload);
      router.back();
    } catch (_) {}
  };

  if (isSubjectLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-sm text-gray-500">Loading subject...</span>
      </div>
    );
  }

  // Invalid / non-existent id → show 404 UI, but layout (navbar/sidebar) stays intact
  if (!subjectItem) {
    return <NotFoundPage />;
  }

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Header header="Edit Subject" />
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        <TextField
          label="Subject Name"
          type="text"
          name="name"
          required
          maxLength={100}
          placeholder="e.g. Mathematics"
          value={name}
          onChange={handleNameChange}
          color={errors.name ? "error" : status.name}
          error={errors.name || ""}
        />
      </div>

      <div className="px-5 flex flex-row gap-2.5">
        <Button
          onClick={handleCancel}
          disabled={editSubjectMutation.isPending}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={editSubjectMutation.isPending}>
          {editSubjectMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default EditSubject;

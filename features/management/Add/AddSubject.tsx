"use client";

import Header from "@/components/Base/Header/Header";
import { Button, TextField } from "@/components/UI";
import { Status } from "../types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddSubject } from "@/hooks/management/subject"; // adjust path to match your hooks file
import { addSubjectSchema } from "../validation";

const AddSubject = () => {
  const router = useRouter();

  const [name, setName] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

  const [status, setStatus] = useState<{
    name: Status;
  }>({
    name: "info",
  });

  const addSubjectMutation = useAddSubject(
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
    setName(value);
    validateName(value);
  };

  const onSubmit = async () => {
    const payload = { name };
    const result = addSubjectSchema.safeParse(payload);

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
      await addSubjectMutation.mutateAsync(payload);
      router.back();
    } catch (error) {}
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Header header="Add Subject" />
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
          disabled={addSubjectMutation.isPending}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={addSubjectMutation.isPending}>
          {addSubjectMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AddSubject;

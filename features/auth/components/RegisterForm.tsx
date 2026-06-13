"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { registerSchema, RegisterFormData } from "../validation";
import { useRegister } from "@/hooks/auth/useAuth";
import { TextField, Button, Dropdown } from "@/components/UI";
import { Status } from "../types";

const SCHOOL_TYPES = [
  { label: "Government", value: "PUBLIC" },
  { label: "Private", value: "PRIVATE" },
  { label: "Other", value: "OTHER" },
];

const BOARDS = [
  { label: "CBSE", value: "CBSE" },
  { label: "ICSE", value: "ICSE" },
  { label: "State Board", value: "STATE" },
  { label: "Other", value: "OTHER" },
];

const STATES = ["Gujarat", "Maharashtra", "Rajasthan", "Delhi", "Karnataka"];

export function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    school: {
      name: "",
      type: "",
      board: "",
      city: "",
      state: "",
      website: "",
      udiseNumber: "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, Status>>({});

  const registerMutation = useRegister(
    (backendErrors: Record<string, string>) => {
      setErrors(backendErrors);

      const errorStatus = Object.keys(backendErrors).reduce<
        Record<string, Status>
      >((acc, key) => {
        acc[key] = "error";
        return acc;
      }, {});
      
      setStatus((prev) => ({
        ...prev,
        ...errorStatus,
      }));
    },
  );

  const getFieldSchema = (path: string) => {
    if (path.startsWith("school.")) {
      const field = path.split(".")[1];
      return (registerSchema.shape.school as any).shape[field];
    }

    return (registerSchema.shape as any)[path];
  };

  const validateField = (path: string, value: string) => {
    const schema = getFieldSchema(path);

    if (!schema) return;

    const result = schema.safeParse(value);

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [path]: result.error.issues[0]?.message || "Invalid value",
      }));

      setStatus((prev) => ({
        ...prev,
        [path]: "error",
      }));

      return;
    }

    setErrors((prev) => ({
      ...prev,
      [path]: "",
    }));

    setStatus((prev) => ({
      ...prev,
      [path]: value ? "success" : "info",
    }));
  };

  const updateFormData = (path: string, value: string) => {
    setFormData((prev) => {
      const updated = structuredClone(prev);
      const keys = path.split(".");

      let current: any = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      return updated;
    });
  };

  const handleInputChange =
    (path: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;

      updateFormData(path, value);
      validateField(path, value);
    };

  const handleDropdownChange = (
    path: string,
    value: string | number | (string | number)[],
  ) => {
    if (Array.isArray(value)) return;

    const stringValue = String(value);

    updateFormData(path, stringValue);
    validateField(path, stringValue);
  };

  const handleSubmit = async () => {
    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      const fieldStatus: Record<string, Status> = {};

      validation.error.issues.forEach((issue) => {
        const path = issue.path.join(".");

        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }

        fieldStatus[path] = "error";
      });

      setErrors(fieldErrors);
      setStatus((prev) => ({
        ...prev,
        ...fieldStatus,
      }));

      return;
    }

    try {
      setErrors({});

      await registerMutation.mutateAsync(formData);

      localStorage.setItem("verifyEmail", formData.email);

      router.push("/verify-otp");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* User Details */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          label="Full Name"
          name="fullName"
          required
          value={formData.fullName}
          onChange={handleInputChange("fullName")}
          error={errors.fullName}
          color={status.fullName}
        />

        <TextField
          label="Email"
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleInputChange("email")}
          error={errors.email}
          color={status.email}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          label="Password"
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleInputChange("password")}
          error={errors.password}
          color={status.password}
        />

        <TextField
          label="Phone Number"
          type="tel"
          name="phoneNumber"
          required
          value={formData.phoneNumber}
          onChange={handleInputChange("phoneNumber")}
          error={errors.phoneNumber}
          color={status.phoneNumber}
        />
      </div>

      {/* School Details */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">School Information</h3>

        <TextField
          label="School Name"
          name="school.name"
          required
          value={formData.school.name}
          onChange={handleInputChange("school.name")}
          error={errors["school.name"]}
          color={status["school.name"]}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Dropdown
            label="School Type"
            options={SCHOOL_TYPES}
            value={formData.school.type}
            onSelect={(_, value) => handleDropdownChange("school.type", value)}
            error={errors["school.type"]}
          />

          <Dropdown
            label="Board"
            options={BOARDS}
            value={formData.school.board}
            onSelect={(_, value) => handleDropdownChange("school.board", value)}
            error={errors["school.board"]}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            label="City"
            name="school.city"
            required
            value={formData.school.city}
            onChange={handleInputChange("school.city")}
            error={errors["school.city"]}
            color={status["school.city"]}
          />

          <Dropdown
            label="State"
            options={STATES.map((state) => ({
              label: state,
              value: state,
            }))}
            value={formData.school.state}
            onSelect={(_, value) => handleDropdownChange("school.state", value)}
            error={errors["school.state"]}
          />
        </div>

        <TextField
          label="Website (Optional)"
          name="school.website"
          value={formData.school.website}
          onChange={handleInputChange("school.website")}
          error={errors["school.website"]}
          color={status["school.website"]}
        />

        <TextField
          label="UDISE Number"
          name="school.udiseNumber"
          required
          value={formData.school.udiseNumber}
          onChange={handleInputChange("school.udiseNumber")}
          error={errors["school.udiseNumber"]}
          color={status["school.udiseNumber"]}
        />
      </div>

      <Button
        type="submit"
        size="md"
        loading={registerMutation.isPending}
        className="w-full"
      >
        Register
      </Button>
    </form>
  );
}

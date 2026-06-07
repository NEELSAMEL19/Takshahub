"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import Link from "next/link";

import { registerSchema, RegisterFormData } from "../validation";
import { useRegister } from "@/hooks/auth/useAuth";

import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Alert } from "@/components/common/Alert";

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

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export function RegisterForm() {
  const router = useRouter();

  const registerMutation = useRegister();

  const [error, setError] = useState("");

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

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

  const isLoading = registerMutation.isPending;

  const clearError = () => {
    setError("");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("school.")) {
      const schoolField = name.replace("school.", "");

      setFormData((prev) => ({
        ...prev,
        school: {
          ...prev.school,
          [schoolField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    clearError();
    setValidationErrors({});

    try {
      const validatedData = registerSchema.parse(formData);

      await registerMutation.mutateAsync(validatedData);

      router.push(
        `/verify-otp?email=${encodeURIComponent(validatedData.email)}`,
      );
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};

        err.issues.forEach((issue) => {
          const field = issue.path[0];

          if (typeof field === "string") {
            fieldErrors[field] = issue.message;
          }
        });

        setValidationErrors(fieldErrors);
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={clearError} />}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={validationErrors.fullName}
          placeholder="John Doe"
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={validationErrors.email}
          placeholder="you@example.com"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={validationErrors.password}
          placeholder="••••••••"
        />

        <Input
          label="Phone Number (Optional)"
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={validationErrors.phoneNumber}
          placeholder="+91 9876543210"
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          School Information
        </h3>

        <div className="space-y-4">
          <Input
            label="School Name"
            type="text"
            name="school.name"
            value={formData.school.name}
            onChange={handleChange}
            error={validationErrors["school.name"]}
            placeholder="Your School Name"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                School Type
              </label>

              <select
                name="school.type"
                value={formData.school.type}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors["school.type"]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select School Type</option>

                {SCHOOL_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {validationErrors["school.type"] && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors["school.type"]}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Board
              </label>

              <select
                name="school.board"
                value={formData.school.board}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors["school.board"]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Board</option>

                {BOARDS.map((board) => (
                  <option key={board.value} value={board.value}>
                    {board.label}
                  </option>
                ))}
              </select>

              {validationErrors["school.board"] && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors["school.board"]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="City"
              type="text"
              name="school.city"
              value={formData.school.city}
              onChange={handleChange}
              error={validationErrors["school.city"]}
              placeholder="City"
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                State
              </label>

              <select
                name="school.state"
                value={formData.school.state}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors["school.state"]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select State</option>

                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              {validationErrors["school.state"] && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors["school.state"]}
                </p>
              )}
            </div>
          </div>

          <Input
            label="Website (Optional)"
            type="url"
            name="school.website"
            value={formData.school.website}
            onChange={handleChange}
            error={validationErrors["school.website"]}
            placeholder="https://school.com"
          />

          <Input
            label="UDISE Number"
            type="text"
            name="school.udiseNumber"
            value={formData.school.udiseNumber}
            onChange={handleChange}
            error={validationErrors["school.udiseNumber"]}
            placeholder="UDISE Number"
          />
        </div>
      </div>

      <Button type="submit" size="md" loading={isLoading} className="w-full">
        Register
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Login here
        </Link>
      </p>
    </form>
  );
}

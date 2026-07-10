"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/UI/TextField";
import { Button } from "@/components/UI/Button";
import { Dropdown } from "@/components/UI/Dropdown";
import { registerSchema, RegisterFormData } from "../validation";
import { useRegister } from  "@/hooks/auth/useAuth";

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

type FormErrors = Partial<Record<string, string>>;
type SchoolField = keyof RegisterFormData["school"];

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

  const [errors, setErrors] = useState<FormErrors>({});

  const registerMutation = useRegister((backendErrors: any) => {
    setErrors(backendErrors);
  });

<<<<<<< Updated upstream
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        `/verify-otp?email=${encodeURIComponent(
          validatedData.email
        )}`
      );
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};

        err.errors.forEach((error) => {
          const path = error.path.join(".");
          fieldErrors[path] = error.message;
        });

        setValidationErrors(fieldErrors);
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
=======
  // ---------------------------
  // UPDATE FIELD (SAFE + CLEAN)
  // ---------------------------
  const updateField = (path: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev };

      if (path.startsWith("school.")) {
        const key = path.split(".")[1] as SchoolField;
        updated.school[key] = value;
      } else {
        (updated as any)[path] = value;
      }

      return updated;
    });

    // clear error on change
    setErrors((prev) => ({
      ...prev,
      [path]: undefined,
    }));
  };

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const onSubmit = () => {
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};

      result.error.issues.forEach((e) => {
        fieldErrors[e.path.join(".")] = e.message;
      });

      setErrors(fieldErrors);
      return;
>>>>>>> Stashed changes
    }

    registerMutation.mutate(formData, {
      onSuccess: () => {
        localStorage.setItem("verifyEmail", formData.email);
        router.push("/verify-otp");
      },
    });
  };

  return (
<<<<<<< Updated upstream
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={clearError}
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
=======
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      {/* ROW 1 */}
      <div className="grid md:grid-cols-2 gap-4">
        <TextField
>>>>>>> Stashed changes
          label="Full Name"
          value={formData.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          error={errors.fullName || ""}
          data-error={!!errors.fullName}
          required
        />

        <TextField
          label="Email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email || ""}
          data-error={!!errors.email}
          required
        />
      </div>

      {/* ROW 2 */}
      <div className="grid md:grid-cols-2 gap-4">
        <TextField
          type="password"
          label="Password"
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          error={errors.password || ""}
          data-error={!!errors.password}
          required
        />

        <TextField
          type="tel"
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => updateField("phoneNumber", e.target.value)}
          error={errors.phoneNumber || ""}
          data-error={!!errors.phoneNumber}
          required
        />
      </div>

      {/* SCHOOL SECTION */}
      <div className="border-t pt-4 space-y-4">
        <h3 className="text-lg font-semibold">School Information</h3>

        <TextField
          label="School Name"
          value={formData.school.name}
          onChange={(e) => updateField("school.name", e.target.value)}
          error={errors["school.name"] || ""}
          data-error={!!errors["school.name"]}
          required
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Dropdown
            label="School Type"
            options={SCHOOL_TYPES}
            value={formData.school.type}
            onSelect={(e, val) => updateField("school.type", val)}
            error={errors["school.type"]}
          />

<<<<<<< Updated upstream
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
                  <option
                    key={type.value}
                    value={type.value}
                  >
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
                  <option
                    key={board.value}
                    value={board.value}
                  >
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
=======
          <Dropdown
            label="Board"
            options={BOARDS}
            value={formData.school.board}
            onSelect={(e, val) => updateField("school.board", val)}
            error={errors["school.board"]}
>>>>>>> Stashed changes
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <TextField
            label="City"
            value={formData.school.city}
            onChange={(e) => updateField("school.city", e.target.value)}
            error={errors["school.city"] || ""}
            required
          />

          <Dropdown
            label="State"
            options={STATES.map((s) => ({ label: s, value: s }))}
            value={formData.school.state}
            onSelect={(e, val) => updateField("school.state", val)}
            error={errors["school.state"]}
          />
        </div>

        <TextField
          label="Website (Optional)"
          value={formData.school.website}
          onChange={(e) => updateField("school.website", e.target.value)}
          error={errors["school.website"] || ""}
        />

        <TextField
          label="UDISE Number"
          value={formData.school.udiseNumber}
          onChange={(e) => updateField("school.udiseNumber", e.target.value)}
          error={errors["school.udiseNumber"] || ""}
          required
        />
      </div>

<<<<<<< Updated upstream
      <Button
        type="submit"
        size="md"
        loading={isLoading}
        className="w-full"
      >
        Register
=======
      {/* SUBMIT */}
      <Button type="submit" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? "Registering..." : "Register"}
>>>>>>> Stashed changes
      </Button>
    </form>
  );
}
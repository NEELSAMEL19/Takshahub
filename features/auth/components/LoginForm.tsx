"use client";

import { useState } from "react";
import Link from "next/link";
import { loginSchema, LoginFormData } from "../validation";
import { useLogin } from "@/hooks/auth/useAuth";
import { TextField } from "@/components/UI";
import { Button } from "@/components/UI";
import { Status } from "../types";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [status, setStatus] = useState<{ email: Status; password: Status }>({
    email: "info",
    password: "info",
  });

  // ✅ FIX: handle backend errors + status
  const loginMutation = useLogin((backendErrors: any) => {
    setErrors(backendErrors);

    setStatus((prev) => ({
      ...prev,
      email: backendErrors.email ? "error" : prev.email,
      password: backendErrors.password ? "error" : prev.password,
    }));
  });

  const handleEmailChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;

    setFormData((prev) => ({
      ...prev,
      email: value,
    }));

    const result = loginSchema.shape.email.safeParse(value);

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        email: result.error.issues[0].message,
      }));
      setStatus((prev) => ({ ...prev, email: "error" }));
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
      setStatus((prev) => ({
        ...prev,
        email: value ? "success" : "info",
      }));
    }
  };

  const handlePasswordChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;

    setFormData((prev) => ({
      ...prev,
      password: value,
    }));

    const result = loginSchema.shape.password.safeParse(value);

<<<<<<< Updated upstream
    try {
      const validatedData = loginSchema.parse(formData);

      await loginMutation.mutateAsync(validatedData);

      router.push("/dashboard");
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
          : "Failed to login. Please try again.",
      );
=======
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        password: result.error.issues[0].message,
      }));
      setStatus((prev) => ({ ...prev, password: "error" }));
    } else {
      setErrors((prev) => ({ ...prev, password: undefined }));
      setStatus((prev) => ({
        ...prev,
        password: value ? "success" : "info",
      }));
>>>>>>> Stashed changes
    }
  };

  const onSubmit = async () => {
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((e) => {
        const field = e.path[0] as "email" | "password";

        if (!fieldErrors[field]) {
          fieldErrors[field] = e.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await loginMutation.mutateAsync(formData);
    router.refresh();
    router.replace("/dashboard");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <TextField
        type="text"
        label="Email"
        name="email"
        required
        maxLength={30}
        color={errors.email ? "error" : status.email}
        autoComplete="off"
        value={formData.email}
        onChange={handleEmailChange}
        error={errors.email || ""}
        data-error={!!errors.email}
      />

      <TextField
        label="Password"
        type="password"
        name="password"
        required
        maxLength={30}
        color={errors.password ? "error" : status.password}
        autoComplete="off"
        value={formData.password}
        onChange={handlePasswordChange}
        error={errors.password || ""}
        data-error={!!errors.password}
      />

      <Button
        type="submit"
        size="md"
        loading={loginMutation.isPending}
        className="w-full"
      >
        Login
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className=" font-semibold text-blue-600 hover:text-blue-700"
        >
          Register here
        </Link>
      </p>
    </form>
  );
}

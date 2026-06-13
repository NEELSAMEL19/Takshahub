"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginSchema, LoginFormData } from "../validation";
import { useLogin } from "@/hooks/auth/useAuth";
import { TextField, Button } from "@/components/UI";
import { Status } from "../types";

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

  const [status, setStatus] = useState<{
    email: Status;
    password: Status;
  }>({
    email: "info",
    password: "info",
  });

  const loginMutation = useLogin((backendErrors: any) => {
    setErrors(backendErrors);

    setStatus({
      email: backendErrors?.email ? "error" : "success",
      password: backendErrors?.password ? "error" : "success",
    });
  });

  const validateField = (field: "email" | "password", value: string) => {
    const result = loginSchema.shape[field].safeParse(value);

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.error.issues[0].message,
      }));

      setStatus((prev) => ({
        ...prev,
        [field]: "error",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));

      setStatus((prev) => ({
        ...prev,
        [field]: value ? "success" : "info",
      }));
    }
  };

  const handleChange =
    (field: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      validateField(field, value);
    };

  const onSubmit = async () => {
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as "email" | "password";

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);

      setStatus({
        email: fieldErrors.email ? "error" : status.email,
        password: fieldErrors.password ? "error" : status.password,
      });

      return;
    }

    try {
      setErrors({});

      await loginMutation.mutateAsync(formData);

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login failed:", error);
    }
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
        label="Email"
        type="email"
        name="email"
        required
        maxLength={100}
        autoComplete="email"
        value={formData.email}
        onChange={handleChange("email")}
        color={errors.email ? "error" : status.email}
        error={errors.email || ""}
      />

      <TextField
        label="Password"
        type="password"
        name="password"
        required
        maxLength={100}
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange("password")}
        color={errors.password ? "error" : status.password}
        error={errors.password || ""}
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
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Register here
        </Link>
      </p>
    </form>
  );
}

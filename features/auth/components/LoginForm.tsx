"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import Link from "next/link";

import { loginSchema, LoginFormData } from "../validation";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Alert } from "@/components/common/Alert";

import { useLogin } from "@/hooks/auth/useAuth";

export function LoginForm() {
  const router = useRouter();

  const loginMutation = useLogin();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const clearError = () => setError("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationErrors({});
    setError("");

    try {
      const validatedData = loginSchema.parse(formData);

      await loginMutation.mutateAsync(validatedData);

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};

        err.errors.forEach((error) => {
          const field = error.path[0];

          if (typeof field === "string") {
            fieldErrors[field] = error.message;
          }
        });

        setValidationErrors(fieldErrors);
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Failed to login. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={clearError} />}

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
        placeholder="you@example.com"
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={validationErrors.password}
        placeholder="••••••"
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
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Register here
        </Link>
      </p>
    </form>
  );
}
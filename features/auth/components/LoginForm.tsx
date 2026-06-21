"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { loginSchema, LoginFormData } from "../validation";
import { useLogin } from "@/hooks/auth/useAuth";
import { sideMenuApi } from "@/service/sideMenu";
import { getSideMenuItems } from "@/utils/permission";
import { TextField, Button } from "@/components/UI";
import { Status } from "../types";

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient(); // Access the query cache client

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

  const loginMutation = useLogin((backendErrors: Record<string, string>) => {
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

    setErrors({});

    try {
      const response = await loginMutation.mutateAsync(formData);
      const role = response?.data?.auth?.role;

      if (role === "ADMIN") {
        // 1. Fetch menu configurations imperatively to prime TanStack's cache
        const menuData = await queryClient.fetchQuery({
          queryKey: ["sideMenu", "admin"],
          queryFn: sideMenuApi.adminMenu,
          staleTime: 1000 * 60 * 5,
        });

        if (menuData?.data) {
          const menuItems = getSideMenuItems(menuData.data);
          const firstModulePath = menuItems[0]?.path;

          if (firstModulePath) {
            router.replace(firstModulePath);
            return;
          }
        }

        // Fallback if the admin menu endpoint data is empty
        router.replace("/admin");
      } else if (role === "TEACHER") {
        router.replace("/teacher");
      } else if (role === "STUDENT") {
        router.replace("/student");
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Redirection failure:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 mx-3 w-full max-w-64 max-h-1/5">
      <span className="theme-text text-5xl text-theme-text">Takshahub</span>
      <span className="text-2xl">Sign in to your account</span>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-5"
      >
        <TextField
          label="Email"
          type="email"
          name="email"
          required
          maxLength={100}
          placeholder="Email"
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
          placeholder="Password"
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
          isLoading={loginMutation.isPending}
          className="w-full"
        >
          Login
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            prefetch={false}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

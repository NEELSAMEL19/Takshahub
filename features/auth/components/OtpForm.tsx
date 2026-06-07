"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ZodError } from "zod";

import { otpSchema, OtpFormData } from "../validation";
import { useVerifyOtp, useResendOtp } from "@/hooks/auth/useAuth";

import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Alert } from "@/components/common/Alert";

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  const [formData, setFormData] = useState<OtpFormData>({
    otp: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [error, setError] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);

  const isLoading = verifyOtpMutation.isPending || resendOtpMutation.isPending;

  const clearError = () => {
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (/^\d*$/.test(value) && value.length <= 6) {
      setFormData({
        otp: value,
      });

      if (validationErrors.otp) {
        setValidationErrors((prev) => {
          const copy = { ...prev };
          delete copy.otp;
          return copy;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    clearError();
    setValidationErrors({});

    if (!email) {
      setError("Email is missing");
      return;
    }

    try {
      const validatedData = otpSchema.parse(formData);

      await verifyOtpMutation.mutateAsync({
        email,
        otp: validatedData.otp,
      });

      router.push("/login");
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

      setError(err instanceof Error ? err.message : "OTP verification failed");
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError("Email is missing");
      return;
    }

    clearError();
    setResendSuccess(false);

    try {
      await resendOtpMutation.mutateAsync({
        email,
        otp: "",
      });

      setResendSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={clearError} />}

      {resendSuccess && (
        <Alert type="success" message="OTP resent successfully to your email" />
      )}

      <div className="text-center text-sm text-gray-600">
        <p>Enter the 6-digit OTP sent to</p>
        <p className="font-semibold text-gray-900">{email}</p>
      </div>

      <Input
        label="One-Time Password (OTP)"
        type="text"
        name="otp"
        inputMode="numeric"
        maxLength={6}
        value={formData.otp}
        onChange={handleChange}
        error={validationErrors.otp}
        placeholder="000000"
        className="text-center text-2xl tracking-widest"
      />

      <Button type="submit" size="md" loading={isLoading} className="w-full">
        Verify OTP
      </Button>

      <button
        type="button"
        onClick={handleResendOtp}
        disabled={isLoading}
        className="w-full font-semibold text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
      >
        Resend OTP
      </button>
    </form>
  );
}

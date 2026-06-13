"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { otpSchema, OtpFormData } from "../validation";
import { useVerifyOtp, useResendOtp } from "@/hooks/auth/useAuth";
import { TextField } from "@/components/UI/TextField";
import { Button } from "@/components/UI/Button";
import { Status } from "../types";

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email =
    searchParams.get("email") ||
    (typeof window !== "undefined"
      ? localStorage.getItem("verifyEmail") || ""
      : "");

  const [formData, setFormData] = useState<OtpFormData>({
    otp: "",
  });

  const [errors, setErrors] = useState<{
    otp?: string;
  }>({});

  const [status, setStatus] = useState<{
    otp: Status;
  }>({
    otp: "info",
  });

  const [timer, setTimer] = useState(30);

  const verifyOtpMutation = useVerifyOtp((backendErrors: any) => {
    setErrors(backendErrors);

    setStatus({
      otp: backendErrors?.otp ? "error" : "success",
    });
  });

  const resendOtpMutation = useResendOtp();

  const isLoading = verifyOtpMutation.isPending || resendOtpMutation.isPending;

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setFormData({
      otp: value,
    });

    const result = otpSchema.shape.otp.safeParse(value);

    if (!result.success) {
      setErrors({
        otp: result.error.issues[0].message,
      });

      setStatus({
        otp: "error",
      });
    } else {
      setErrors({
        otp: undefined,
      });

      setStatus({
        otp: value ? "success" : "info",
      });
    }
  };

  const onSubmit = async () => {
    const payload = {
      email,
      otp: formData.otp,
    };

    const result = otpSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as "otp";

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      setStatus({ otp: "error" });

      return;
    }

    try {
      setErrors({});

      await verifyOtpMutation.mutateAsync(payload);

      localStorage.removeItem("verifyEmail");

      router.replace("/login");
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleResendOtp = async () => {
    if (!email || timer > 0) return;

    try {
      await resendOtpMutation.mutateAsync({email});

      setFormData({
        otp: "",
      });

      setErrors({});
      setStatus({
        otp: "info",
      });

      setTimer(30);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
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
      <div className="text-center text-sm text-gray-600">
        <p>Enter the 6-digit OTP sent to</p>
        <p className="font-semibold text-gray-900">{email}</p>
      </div>

      <TextField
        label="One-Time Password (OTP)"
        name="otp"
        maxLength={6}
        required
        autoComplete="one-time-code"
        value={formData.otp}
        onChange={handleOtpChange}
        error={errors.otp || ""}
        color={errors.otp ? "error" : status.otp}
      />

      <Button type="submit" size="md" loading={isLoading} className="w-full">
        Verify OTP
      </Button>

      <button
        type="button"
        onClick={handleResendOtp}
        disabled={resendOtpMutation.isPending || timer > 0}
        className="w-full text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
      >
        {resendOtpMutation.isPending
          ? "Sending..."
          : timer > 0
            ? `Resend in ${timer}s`
            : "Resend OTP"}
      </button>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { otpSchema, OtpFormData } from "../validation";
import { useVerifyOtp, useResendOtp } from "@/hooks/auth/useAuth";
import { TextField } from "@/components/UI/TextField";
import { Button } from "@/components/UI/Button";
import { Status } from "../types";

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Get email from query OR localStorage
  const email =
    searchParams.get("email") ||
    (typeof window !== "undefined"
      ? localStorage.getItem("verifyEmail") || ""
      : "");

  const [formData, setFormData] = useState<OtpFormData>({ otp: "" });
  const [errors, setErrors] = useState<{ otp?: string }>({});
  const [status, setStatus] = useState<{ otp: Status }>({ otp: "info" });
  const [timer, setTimer] = useState(30);

  // ✅ Timer countdown
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ✅ Verify OTP
  const otpMutation = useVerifyOtp((backendErrors: any) => {
    setErrors(backendErrors);

    setStatus((prev) => ({
      ...prev,
      otp: backendErrors.otp ? "error" : prev.otp,
    }));
  });

  // ✅ Resend OTP
  const resendOtpMutation = useResendOtp();

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

<<<<<<< Updated upstream
  const isLoading =
    verifyOtpMutation.isPending || resendOtpMutation.isPending;
=======
    setFormData({ otp: value });
>>>>>>> Stashed changes

    const result = otpSchema.shape.otp.safeParse(value);

    if (!result.success) {
      setErrors({ otp: result.error.issues[0].message });
      setStatus({ otp: "error" });
    } else {
      setErrors({ otp: undefined });
      setStatus({ otp: value ? "success" : "info" });
    }
  };

  const onSubmit = () => {
    const payload = { ...formData, email };

    const result = otpSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: any = {};

      result.error.issues.forEach((e) => {
        const field = e.path[0] as "otp";
        if (!fieldErrors[field]) fieldErrors[field] = e.message;
      });

      setErrors(fieldErrors);
      setStatus({ otp: "error" });
      return;
    }

    setErrors({});

<<<<<<< Updated upstream
      await verifyOtpMutation.mutateAsync({
        email,
        otp: validatedData.otp,
      });

      router.push("/login");
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
          : "OTP verification failed"
      );
    }
=======
    otpMutation.mutate(payload, {
      onSuccess: () => {
        localStorage.removeItem("verifyEmail"); // ✅ cleanup
        router.push("/login");
      },
    });
>>>>>>> Stashed changes
  };

  const handleResendOtp = () => {
    if (!email || timer > 0) return;

<<<<<<< Updated upstream
    clearError();
    setResendSuccess(false);

    try {
      await resendOtpMutation.mutateAsync({
        email,
        otp: "",
      });

      setResendSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to resend OTP"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={clearError}
        />
      )}

      {resendSuccess && (
        <Alert
          type="success"
          message="OTP resent successfully to your email"
        />
      )}

=======
    resendOtpMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setFormData({ otp: "" });
          setStatus({ otp: "info" });
          setTimer(30); // ✅ restart timer
        },
      },
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      {" "}
>>>>>>> Stashed changes
      <div className="text-center text-sm text-gray-600">
        {" "}
        <p>Enter the 6-digit OTP sent to</p>{" "}
        <p className="font-semibold text-gray-900">{email}</p>{" "}
      </div>
      <TextField
        label="One-Time Password (OTP)"
        name="otp"
        maxLength={6}
        required
        autoComplete="off"
        value={formData.otp}
        onChange={handleOtpChange}
        error={errors.otp || ""}
        data-error={!!errors.otp}
        color={errors.otp ? "error" : status.otp}
      />
<<<<<<< Updated upstream

      <Button
        type="submit"
        size="md"
        loading={isLoading}
        className="w-full"
      >
        Verify OTP
=======
      <Button type="submit" className="w-full" disabled={otpMutation.isPending}>
        {otpMutation.isPending ? "Verifying..." : "Verify OTP"}
>>>>>>> Stashed changes
      </Button>
      <button
        type="button"
        onClick={handleResendOtp}
        disabled={resendOtpMutation.isPending || timer > 0}
        className="w-full font-semibold text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
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
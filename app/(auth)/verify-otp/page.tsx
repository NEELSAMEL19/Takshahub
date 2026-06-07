"use client";

import { Suspense } from "react";
import { OtpForm } from "@/features/auth/components";

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Takshahub</h1>
          <p className="text-gray-600 mt-2">Verify your email</p>
        </div>
        <Suspense fallback={<p className="text-center text-gray-600">Loading...</p>}>
          <OtpForm />
        </Suspense>
      </div>
    </div>
  );
}

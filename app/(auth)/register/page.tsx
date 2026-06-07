"use client";

import { RegisterForm } from "@/features/auth/components";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Takshahub</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}

"use client";

import AuthDesign from "@/components/Base/AuthDesign/AuthDesign";
import { RegisterForm } from "@/features/auth/components";

export default function RegisterPage() {
  return (
    <div className="w-full h-screen flex justify-between">
      <div className="hidden min-[850px]:block min-[850px]:w-1/3 theme-primary-background">
        <AuthDesign />
      </div>

      <div className="w-full min-[850px]:w-2/4 h-full theme-secondary-background">
        <RegisterForm />
      </div>
    </div>
  );
}

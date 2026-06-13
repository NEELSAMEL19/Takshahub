"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const rolePaths: Record<string, string> = {
  ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
};

export function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const role = window.localStorage.getItem("authRole");

    if (role && rolePaths[role]) {
      router.replace(rolePaths[role]);
    }
  }, [router]);

  return null;
}

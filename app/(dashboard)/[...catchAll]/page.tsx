"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";
import { useMe } from "@/hooks/auth/useAuth";

export default function CatchAll() {
  const { data: me, isLoading } = useMe();

  const userId = me?.data.user?.id;

  useEffect(() => {
    if (!isLoading && userId) {
      notFound();
    }
  }, [isLoading, userId]);

  if (isLoading) {
    return null; // or a loading spinner/skeleton
  }

  return null; // fallback for logged-out users hitting an unmatched route
}

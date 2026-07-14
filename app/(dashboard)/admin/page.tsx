"use client";

import React from "react";
import GraduationLoader from "@/components/UI/GraduationLoader";
import { useMe } from "@/hooks/auth/useAuth";
import { useSideMenu } from "@/hooks/sideMenu/useSideMenu";

const Admin = () => {
  const { data: me } = useMe();
  const userId = me?.data.user?.id;

  const { isLoading } = useSideMenu(userId);

  if (isLoading) {
    return <GraduationLoader />;
  }

  return null;
};

export default Admin;

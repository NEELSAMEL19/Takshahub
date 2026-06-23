"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../../../service/auth";
import { Dropdown } from "@/components/UI";
import { useMe } from "../../../hooks/auth/useAuth";
import Image from "next/image";
import TakshahubLogo from "../../../public/Takshahub_logo.png";

const Navbar = () => {
  const router = useRouter();
  const { data } = useMe();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return "";

    const names = fullName.trim().split(" ").filter(Boolean);

    if (names.length === 1) {
      return names[0][0].toUpperCase();
    }

    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(data?.data?.user?.fullName);

  const dropdownOptions = [{ label: "Logout", value: "logout" }];

  return (
    <nav className="flex items-center h-12 py-2 justify-between shadow-sm bg-white border-b border-gray-200 md:px-10 px-4">
      <div className="flex items-center gap-3">

        <div className="hidden sm:flex items-center gap-2">
          <Image
            src={TakshahubLogo}
            alt="TakshaHub Logo"
            className="w-10 h-10 object-contain"
            loading="eager"
          />
          <span className="theme-text text-2xl font-semibold text-theme-text">
            Takshahub
          </span>
        </div>
      </div>

      {/* Right side: User Dropdown */}
      <div>
        <Dropdown
          options={dropdownOptions}
          value=""
          placeholder={initials || ""}
          variant="circle"
          menuWidth="w-32"
          onSelect={(_, value) => {
            if (value === "logout") handleLogout();
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;

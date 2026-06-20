"use client";

import React, { useState, useEffect, useRef } from "react";
import { authApi } from "../../../service/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter();
  const user = { name: "John Doe" };
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsOpen(false);
            router.replace("/login"); // or router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="relative mx-12 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
      {/* Left section: Hamburger menu for mobile */}
      <div className="flex items-center space-x-4">
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Open sidebar"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Right section: Profile Dropdown */}
      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="true"
            aria-expanded={isOpen}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm tracking-wider shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {getInitials(user.name)}
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50 origin-top-right transition-all">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
              >
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

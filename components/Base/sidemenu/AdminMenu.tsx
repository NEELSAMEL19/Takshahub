"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAdminMenu } from "@/hooks/sideMenu/useSideMenu";
import { getSideMenuItems } from "@/utils/permission";
import Tooltip from "@/components/UI/Tooltip";

const AdminMenu = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useAdminMenu();

  const menuItems = data?.data ? getSideMenuItems(data.data) : [];

  const handleClick = (path: string) => {
    if (path) {
      router.push(path);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-4 items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !menuItems.length) {
    return (
      <div className="flex flex-col h-full p-4 items-center justify-center">
        <span className="text-xs text-gray-500">Menu unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 items-center space-y-4 overflow-y-auto">
      {menuItems.map((item) => (
        <Tooltip key={item.id} content={item.name} placement="right">
          <button
            onClick={() => handleClick(item.path || "")}
            className="p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 group relative"
            aria-label={item.name}
          >
            <div className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200">
              {item.icon || (
                <svg
                  className="w-6 h-6 sidemenu-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              )}
            </div>
          </button>
        </Tooltip>
      ))}
    </div>
  );
};

export default AdminMenu;
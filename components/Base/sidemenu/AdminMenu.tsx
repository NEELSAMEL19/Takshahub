"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation"; // Imported usePathname
import { useAdminMenu } from "@/hooks/sideMenu/useSideMenu";
import { getSideMenuItems } from "@/utils/permission";
import Tooltip from "@/components/UI/Tooltip";
import { useAppSelector } from "@/store/hooks";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useSidebar } from "@/features/sidebar/useSidebar";

const AdminMenu = () => {
  const router = useRouter();
  const pathname = usePathname(); // Gets the current URL path (e.g., "/admin/organization/settings")
  const { data } = useAdminMenu();
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);
  const { toggle } = useSidebar();
  const menuItems = data?.data ? getSideMenuItems(data.data) : [];
  const handleClick = (path: string) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="fixed inset-0 z-40  md:hidden" />}

      {/* Mobile Sidebar */}
      <div
        className={`
    fixed left-0 top-0 z-50 h-screen w-64
    theme-primary-background
    transition-transform duration-300
  
    md:hidden
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <button
          onClick={toggle}
          className={` flex items-center justify-center
      absolute top-6 -right-5
      w-8 h-8
      rounded-full ${isOpen ? "bg-white" : "theme-primary-background"}
    `}
        >
          {isOpen ? (
            <IoChevronBack
              className="cursor-pointer text-xl text-theme-primary-background
"
            />
          ) : (
            <IoChevronForward
              className="cursor-pointer text-xl text-white
"
            />
          )}
        </button>

        <div className="flex flex-col h-full p-4 gap-4">
          {menuItems.map((item) => {
            const isActive = item.path ? pathname.startsWith(item.path) : false;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.path || "")}
                className={`
        flex items-center gap-3 p-3 rounded-xl
        text-white cursor-pointer
        transition-all duration-200
        hover:bg-white/15
        ${isActive ? "bg-white/20 shadow-lg scale-105" : ""}
      `}
              >
                <div
                  className={`text-xl ${
                    isActive ? "text-white" : "text-white/80"
                  }`}
                >
                  {item.icon ? <item.icon /> : null}
                </div>

                <span
                  className={`font-medium text-typography-secondary ${
                    isActive ? "text-white" : "text-white/90"
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar - Your Existing One */}
      <div className="hidden md:block md:w-20 theme-primary-background">
        <div className="flex flex-col h-full p-4 items-center space-y-4">
          {menuItems.map((item) => {
            const isActive = item.path ? pathname.startsWith(item.path) : false;

            return (
              <Tooltip key={item.id} content={item.name} placement="right">
                <button
                  onClick={() => handleClick(item.path || "")}
                  className={`cursor-pointer
                  group flex items-center justify-center
                  w-12 h-12 rounded-xl
                  transition-all duration-200
                  hover:bg-white/15
                  ${isActive ? "bg-white/20 shadow-lg scale-105" : ""}
                `}
                >
                  <div
                    className={`text-2xl ${
                      isActive ? "text-white" : "text-white/80"
                    }`}
                  >
                    {item.icon ? <item.icon /> : null}
                  </div>
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminMenu;

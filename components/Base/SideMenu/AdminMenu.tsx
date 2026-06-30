"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation"; // Imported usePathname
import { useAdminMenu } from "@/hooks/sideMenu/useSideMenu";
import { getSideMenuItems } from "@/utils/permission";
import Tooltip from "@/components/UI/Tooltip";
import { useAppSelector } from "@/store/hooks";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useSidebar } from "@/features/sidebar/useSidebar";
import Image from "next/image";
import TakshahubLogo from "../../../public/Takshahub_logo.png";

const AdminMenu = () => {
  const router = useRouter();
  const pathname = usePathname(); // Gets the current URL path (e.g., "/admin/organization/settings")
  const { data } = useAdminMenu();
  console.log(data)
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
      {isOpen && <div className="fixed inset-0 z-40  sm:hidden" />}

      {/* Mobile Sidebar */}
      <div
        className={`
    fixed left-0 top-0 z-50 h-screen w-64
    theme-primary-background
    transition-transform duration-300
    sm:hidden
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <button
          onClick={toggle}
          className={` flex items-center justify-center
      absolute top-6 -right-5
      w-6 h-6 !border border-theme-primary-background
      !rounded-full ${isOpen ? "bg-white" : "theme-primary-background"}
    `}
        >
          {isOpen ? (
            <IoChevronBack className="cursor-pointer text-xl text-theme-primary-background " />
          ) : (
            <IoChevronForward
              className="cursor-pointer text-xl text-white
"
            />
          )}
        </button>
        <div className="flex flex-col items-center justify-center gap-3.5 mt-4">
          <Image
            src={TakshahubLogo}
            alt="TakshaHub Logo"
            className="w-12 h-12 object-contain"
            loading="eager"
          />
          <span className="theme-text text-2xl font-semibold text-theme-text">
            Takshahub
          </span>
        </div>

        <div className="flex flex-col h-full p-4 gap-4">
          {menuItems.map((item) => {
            const isActive = pathname
              .toLowerCase()
              .includes(`/${item.name.toLowerCase()}/`);
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.path || "")}
                className={`
    cursor-pointer
    flex items-center gap-3
    w-full
    px-4 py-3
    !rounded-xl
    transition-all duration-200
    ${
      isActive
        ? "bg-white text-black shadow-lg scale-105"
        : "bg-white/15 !text-white hover:!bg-white hover:!text-black"
    }
  `}
              >
                {item.icon ? <item.icon className="text-xl" /> : null}

                <span className="text-lg font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar - Your Existing One */}
      <div className="hidden sm:block sm:w-20 theme-primary-background">
        <div className="flex flex-col h-full p-4 justify-center items-center space-y-4">
          {menuItems.map((item) => {
            const isActive = pathname
              .toLowerCase()
              .includes(`/${item.name.toLowerCase()}/`);
            return (
              <Tooltip key={item.id} content={item.name} placement="right">
                <button
                  onClick={() => handleClick(item.path || "")}
                  className={`
    cursor-pointer
    flex items-center justify-center
    w-10 h-10
    !rounded-xl
    transition-all duration-200
    ${
      isActive
        ? "bg-white shadow-lg scale-105"
        : "bg-white/15 !text-white hover:bg-white hover:!text-black"
    }
  `}
                >
                  {item.icon ? <item.icon className={`text-xl`} /> : null}
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

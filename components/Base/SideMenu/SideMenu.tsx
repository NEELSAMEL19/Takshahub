"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import Tooltip from "@/components/UI/Tooltip";
import { useSideMenu } from "@/hooks/sideMenu/useSideMenu";
import { useMe } from "@/hooks/auth/useAuth";
import { getSideMenuItems } from "@/utils/permission";
import { useAppSelector } from "@/store/hooks";
import { useSidebar } from "@/features/sidebar/useSidebar";

import TakshahubLogo from "../../../public/Takshahub_logo.png";

const SideMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: me } = useMe();

  const userId = me?.data.user?.id;
  const role = me?.data.auth.role ?? "";

  const { data: menuData } = useSideMenu(userId);
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);
  const { toggle } = useSidebar();

  const sideMenuData = menuData?.data;

  const menuItems = useMemo(() => {
    if (!sideMenuData || !role) return [];

    return getSideMenuItems(sideMenuData, role);
  }, [sideMenuData, role]);

  useEffect(() => {
    if (!role || menuItems.length === 0) return;

    const rootPath = `/${role.toLowerCase()}`;

    if (pathname === rootPath || pathname === `${rootPath}/`) {
      router.replace(menuItems[0].path);
    }
  }, [role, menuItems, pathname, router]);

  const handleClick = (path: string) => {
    router.push(path);
  };

  const isMenuActive = (path: string) => {
    const modulePath = path.split("/").slice(0, 3).join("/");

    return pathname === modulePath || pathname.startsWith(`${modulePath}/`);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 sm:hidden" />}

      {/* Mobile Sidebar */}
      <aside
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
          className="
            absolute top-6 -right-5
            flex h-6 w-6 items-center justify-center
            !rounded-full !border border-theme-primary-background
            bg-white
          "
        >
          {isOpen ? (
            <IoChevronBack className="text-xl !text-theme-primary-background" />
          ) : (
            <IoChevronForward className="text-xl !text-theme-primary-background" />
          )}
        </button>

        <div className="mt-4 flex flex-col items-center gap-3.5">
          <Image
            src={TakshahubLogo}
            alt="TakshaHub Logo"
            className="h-12 w-12 object-contain"
            priority
          />

          <span className="theme-text text-2xl font-semibold">Takshahub</span>
        </div>

        <nav className="flex h-full flex-col gap-4 p-4">
          {menuItems.map((item) => {
            const isActive = isMenuActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.path)}
                className={`
                  flex w-full items-center gap-3
                  !rounded-xl px-4 py-3
                  transition-all duration-200
                  ${
                    isActive
                      ? "scale-105 bg-white text-black shadow-lg"
                      : "bg-white/15 text-white hover:bg-white hover:text-black"
                  }
                `}
              >
                {item.icon && <item.icon className="text-xl" />}
                <span className="text-lg font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden w-20 theme-primary-background sm:block">
        <nav className="flex h-full flex-col items-center justify-center space-y-4 p-4">
          {menuItems.map((item) => {
            const isActive = isMenuActive(item.path);

            return (
              <Tooltip key={item.id} content={item.name} placement="right">
                <button
                  onClick={() => handleClick(item.path)}
                  className={`
                    flex h-10 w-10 items-center justify-center
                    !rounded-xl
                    transition-all duration-200
                    ${
                      isActive
                        ? "scale-105 bg-white shadow-lg"
                        : "bg-white/15 text-white hover:bg-white hover:text-black"
                    }
                  `}
                >
                  {item.icon && <item.icon className="text-xl" />}
                </button>
              </Tooltip>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default SideMenu;

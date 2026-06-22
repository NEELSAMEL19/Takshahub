"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Footer from "@/components/Base/Footer/Footer";
import Navbar from "@/components/Base/navbar/Navbar";
import AdminMenu from "@/components/Base/sidemenu/AdminMenu";
import { useAppSelector } from "@/store/hooks";
import { sideMenuApi } from "@/service/sideMenu";
import { getSideMenuItems } from "@/utils/permission";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);
  const router = useRouter();
  const pathname = usePathname();

  const { data: menuData } = useQuery({
    queryKey: ["sideMenu", "admin"],
    queryFn: sideMenuApi.adminMenu,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (pathname === "/admin" && menuData?.data) {
      const menuItems = getSideMenuItems(menuData.data);
      const firstModulePath = menuItems[0]?.path;

      if (firstModulePath) {
        router.replace(firstModulePath);
      }
    }
  }, [pathname, menuData, router]);

  return (
    <div className="flex h-screen flex-col theme-primary-background">
      <header className="bg-white">
        <Navbar />
      </header>

      <div className="flex flex-1">
        <aside
          className={`
            shrink-0
            fixed left-0 top-0 z-50 h-screen
            transition-transform duration-300
            sm:relative sm:h-auto sm:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <AdminMenu />
        </aside>

        <div className="flex flex-1 flex-col gap-2.5 my-2">
          <main className="flex-1 overflow-y-auto theme-secondary-background bg-white mx-2 rounded-sm">
            {children}
          </main>

          <footer className="shrink-0 h-4">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Footer from "@/components/Base/Footer/Footer";

import { useAppSelector } from "@/store/hooks";
import { sideMenuApi } from "@/service/sideMenu";
import { getSideMenuItems } from "@/utils/permission";
import Navbar from "@/components/Base/Navbar/Navbar";
import AdminMenu from "@/components/Base/SideMenu/AdminMenu";

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
      <header className="bg-white shrink-0">
        <Navbar />
      </header>

      <div className="flex flex-1 min-h-0">
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

        {/* min-w-0 allows this flex child to shrink below its content width */}
        <div className="flex flex-1 flex-col my-2 min-h-0 min-w-0 ">
          <main className="flex-1 overflow-auto h-screen mx-2  py-4 rounded-sm bg-white">
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

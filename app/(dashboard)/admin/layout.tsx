"use client";

import Footer from "@/components/Base/Footer/Footer";
import Navbar from "@/components/Base/navbar/Navbar";
import AdminMenu from "@/components/Base/sidemenu/AdminMenu";
import { useAppSelector } from "@/store/hooks";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);

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
            md:relative md:h-auto md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <AdminMenu />
        </aside>

        <div className="flex flex-1 flex-col gap-2.5 my-2">
          <main className="flex-1 overflow-y-auto theme-secondary-background bg-white md:mr-8 rounded-sm">
            {children}
          </main>

          <footer className="shrink-0">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
}

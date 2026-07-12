"use client";

import React from "react";

import Navbar from "@/components/Base/Navbar/Navbar";
import Footer from "@/components/Base/Footer/Footer";
import SideMenu from "@/components/Base/SideMenu/SideMenu";

import { useAppSelector } from "@/store/hooks";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);

  return (
    <div className="flex h-screen flex-col theme-primary-background">
      <header className="shrink-0 bg-white">
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
          <SideMenu />
        </aside>

        <div className="flex flex-1 flex-col min-h-0 min-w-0 my-2">
          <main className="flex-1 h-screen mx-2 overflow-auto rounded-sm bg-white py-4">
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

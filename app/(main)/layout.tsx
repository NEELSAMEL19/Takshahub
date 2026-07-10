"use client";

import React, { ReactNode } from "react";
import Footer from "@/website/Footer";
import Navbar from "@/website/Navbar";

type MainShellProps = {
  children: ReactNode;
  className?: string;
};

const MainShell: React.FC<MainShellProps> = ({ children, className }) => {
  return (
    <div
      className={`flex flex-col min-h-screen ${className || ""}`}
      style={{
        background: `
          radial-gradient(circle at 20% 20%, hsla(186, 40%, 97%, 0.7), transparent 40%),
          linear-gradient(180deg, hsla(186, 35%, 96%, 1) 0%, hsla(216, 40%, 92%, 1) 100%)
        `,
      }}
    >
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainShell;

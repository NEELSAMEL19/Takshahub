"use client";

import * as React from "react";
import NextLink from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/UI";
import Image from "next/image";
import TakshahubLogo from "../public/Takshahub_logo.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const header = document.querySelector("header");
      const headerHeight = header ? header.clientHeight : 0;

      const y =
        element.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-br from-[#ebf4f5] to-[#bbc7dc] backdrop-blur-md shadow-md border-b border-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 lg:h-20 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Image
            src={TakshahubLogo}
            alt="TakshaHub Logo"
            className="h-12 w-12 object-contain"
            priority
          />

          <NextLink
            href="/"
            onClick={() => handleScrollTo("hero")}
            className="theme-text text-2xl font-semibold text-theme-text no-underline hover:no-underline"
          >
            TakshaHub
          </NextLink>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          <NextLink href="/login">
            <Button variant="secondary">Login</Button>
          </NextLink>

          <NextLink href="/register">
            <Button>Connect Your School</Button>
          </NextLink>
        </div>

        {/* MOBILE ICON */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-[#0b132b] transition-colors hover:bg-black/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="absolute right-4 top-full mt-2 w-64 rounded-2xl border border-black/10 bg-gradient-to-br from-[#ebf4f5] to-[#bbc7dc] p-4 shadow-xl backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-3">
            <NextLink href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full">
                Login
              </Button>
            </NextLink>

            <NextLink href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Connect Your School</Button>
            </NextLink>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import * as React from "react";
import NextLink from "next/link";
import { Menu, X } from "lucide-react";

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

  const navLinks = [
    { label: "Features", id: "features" },
    { label: "Pricing", id: "pricing" },
  ];

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-250 ${
        scrolled
          ? "bg-gradient-to-br from-[#ebf4f5] to-[#bbc7dc] backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.06)] border-b border-black/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-32 max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto w-full h-16 lg:h-20">
        {/* LOGO */}
        <NextLink
          href="/"
          onClick={() => handleScrollTo("hero")}
          className="font-bold text-[#0b132b] text-xl xl:text-2xl 2xl:text-3xl !no-underline hover:!no-underline hover:text-[#0b132b]"
        >
          TakshaHub
        </NextLink>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10 2xl:gap-14">
          {navLinks.map((link) => (
            <NextLink
              key={link.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo(link.id);
              }}
              className="!no-underline hover:!no-underline font-medium whitespace-nowrap text-[#0b132b] hover:text-[#0b132b] text-[0.95rem] xl:text-[1.05rem] transition-all duration-200 hover:opacity-70"
            >
              {link.label}
            </NextLink>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8">
          <NextLink
            href="/login"
            className="!no-underline hover:!no-underline font-medium whitespace-nowrap text-[#0b132b] hover:text-[#0b132b] text-[0.95rem] xl:text-[1.05rem] transition-all duration-200 hover:opacity-70"
          >
            Login
          </NextLink>

          <NextLink
            href="/register"
            className="flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white hover:text-white font-bold text-[1.05rem] px-6 py-3 rounded-xl !no-underline hover:!no-underline shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-200 w-fit"
          >
            Connect Your School
          </NextLink>
        </div>

        {/* MOBILE ICON */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#0b132b] p-2 rounded-md hover:bg-black/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden flex flex-col gap-5 items-center py-6 px-6 bg-gradient-to-br from-[#ebf4f5] to-[#bbc7dc] backdrop-blur-md transition-all duration-250">
          {navLinks.map((link) => (
            <NextLink
              key={link.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo(link.id);
                setMobileMenuOpen(false);
              }}
              className="!no-underline hover:!no-underline font-medium whitespace-nowrap text-[#0b132b] hover:text-[#0b132b] text-[0.95rem]"
            >
              {link.label}
            </NextLink>
          ))}

          <NextLink
            href="/login"
            className="!no-underline hover:!no-underline font-medium whitespace-nowrap text-[#0b132b] hover:text-[#0b132b] text-[0.95rem]"
          >
            Login
          </NextLink>

          <NextLink
            href="/register"
            className="flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white hover:text-white font-bold text-[1.05rem] px-6 py-3 rounded-xl !no-underline hover:!no-underline shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-200 w-fit"
          >
            Connect Your School
          </NextLink>
        </div>
      )}
    </header>
  );
}

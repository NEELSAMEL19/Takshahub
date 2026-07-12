"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck, GraduationCap } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { Button } from "@/components/UI";

const Footer: React.FC = () => {
  return (
    <div
      style={{
        background:
          "linear-gradient(90deg, hsla(186, 30%, 88%, 1) 0%, hsla(216, 35%, 70%, 1) 100%)",
      }}
      className="text-[#1a1a1a] mt-8 py-8 pb-2 px-6 md:px-10"
    >
      {/* TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* BRAND */}
        <div>
          <div className="flex items-center gap-3 pb-4">
            <h2 className="text-2xl md:text-3xl font-semibold">Taskshab</h2>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed pb-5">
            Smart school management platform helping institutions manage
            students, staff, and operations efficiently.
          </p>

          {/* SOCIAL */}
          <div className="flex gap-3 pb-5">
            {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map(
              (Icon, i) => (
                <button
                  key={i}
                  className="bg-[#0f172a] hover:bg-blue-600 transition duration-300 p-2 rounded-full"
                >
                  <Icon size={16} className="text-white" />
                </button>
              ),
            )}
          </div>

          <div className="inline-block px-4 py-2 rounded-full bg-[#0f172a] text-sm text-blue-400">
            ⭐ Trusted by 500+ Schools
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="flex flex-col justify-start items-start">
          <p className="font-semibold pb-5">Quick Links</p>

          {["Home", "About Us", "Admissions", "Contact"].map((item, i) => (
            <Link
              key={i}
              href="#"
              className="block text-gray-600 text-sm pb-3 cursor-pointer transition hover:!no-underline"
            >
              › {item}
            </Link>
          ))}
        </div>

        {/* CONTACT */}
        <div className="flex flex-col justify-start items-start">
          <p className="font-semibold pb-5">Contact</p>

          <div className="flex items-center gap-2 pb-3 text-gray-500 text-sm">
            <Mail size={16} />
            info@taskshab.com
          </div>

          <div className="flex items-center gap-2 pb-3 text-gray-500 text-sm">
            <Phone size={16} />
            +91 89992 96121
          </div>

          <div className="flex items-center gap-2 pb-4 text-gray-500 text-sm">
            <MapPin size={16} />
            Ahmedabad, Gujarat, India
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f172a] rounded-full text-sm text-green-400">
            ● 24/7 Support Available
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="flex flex-col justify-start items-start">
          <p className="font-semibold pb-5">Newsletter</p>

          <p className="text-gray-500 text-sm pb-4">
            Get latest updates and news.
          </p>

          <div className="flex items-stretch gap-2 bg-gray-800 rounded-2xl w-full h-10">
            <div className="flex items-center gap-2 flex-1 px-2">
              <Mail size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent text-white placeholder-gray-400 text-sm outline-none w-full"
              />
            </div>

            <Button
              variant="secondary"
              className="!rounded-none active:!scale-100"
            >
              Subscribe
            </Button>
          </div>

          <p className="text-xs text-gray-500 pt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-400 my-2" />

      {/* BOTTOM BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
        <p>© 2026 Taskshab. All rights reserved.</p>

        {/* CENTER BADGES */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0f172a] rounded-full text-white text-xs">
            <ShieldCheck size={16} />
            Secure & Reliable
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-[#0f172a] rounded-full text-white text-xs">
            <GraduationCap size={16} />
            Built for Schools
          </div>
        </div>

        {/* LINKS */}
        <div className="flex gap-4">
          <span className="hover:text-blue-500 cursor-pointer">
            Privacy Policy
          </span>
          <span className="hover:text-blue-500 cursor-pointer">
            Terms of Service
          </span>
          <span className="hover:text-blue-500 cursor-pointer">Support</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;

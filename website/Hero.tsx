"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Rocket, CheckCircle2 } from "lucide-react";

const features = [
  "Easy Setup",
  "No Credit Card Required",
  "Free Training & Support",
];

const Hero: React.FC = () => {
  return (
    <>
      <section
        id="hero"
        className="
          relative
          w-full
          overflow-hidden
          bg-gradient-to-br from-blue-50 via-white to-blue-100
          py-14 sm:py-16 lg:py-20
          px-4 sm:px-6 lg:px-10
        "
      >
        {/* Background Glow */}
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-blue-400/20 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12),transparent_40%)]" />

        {/* Main Content */}
        <div
          className="
            relative z-10
            max-w-7xl 2xl:max-w-[1600px]
            mx-auto
            flex flex-col-reverse lg:flex-row
            items-center
            justify-between
            gap-12 lg:gap-16
          "
        >
          {/* LEFT CONTENT */}
          <div className="flex-1 w-full text-center lg:text-left">
            <h1
              className="
                font-bold
                leading-tight
                text-3xl
                sm:text-4xl
                lg:text-5xl
                2xl:text-6xl
                max-w-2xl
                mx-auto
                lg:mx-0
              "
            >
              Simplify School Management{" "}
              <span className="text-blue-600 block sm:inline">
                Empower Education
              </span>
            </h1>

            <p
              className="
                mt-6
                text-gray-600
                text-sm
                sm:text-base
                lg:text-lg
                leading-relaxed
                max-w-xl
                mx-auto
                lg:mx-0
              "
            >
              <span className="font-semibold text-gray-800">TakshaHub</span>{" "}
              connects Admins, Teachers, Students, and Parents on one smart
              platform to streamline school operations and improve learning
              experiences.
            </p>

            {/* Buttons */}
            <div
              className="
                mt-8
                mb-6
                flex
                flex-col
                sm:flex-row
                gap-4
                justify-center
                lg:justify-start
              "
            >
              <Link
                href="/register"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-green-600
                  px-6
                  py-3
                  text-white
                  font-semibold
                  shadow-md
                  transition-all
                  duration-300
                  hover:bg-green-700
                  hover:shadow-lg
                  hover:-translate-y-0.5
                "
              >
                <Rocket size={18} />
                Get Started
              </Link>
            </div>

            {/* Features */}
            <ul
              className="
                mt-2
                flex
                flex-wrap
                items-center
                justify-center
                lg:justify-start
                gap-x-6
                gap-y-3
                text-sm
                sm:text-base
              "
            >
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <CheckCircle2 size={18} className="text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-1 w-full flex justify-center">
            <div
              className="
                relative
                w-full
                max-w-sm
                sm:max-w-md
                lg:max-w-2xl
                h-[280px]
                sm:h-[380px]
                lg:h-[520px]
              "
            >
              {/* Background Image */}
              <Image
                src="/images/sections/hero-children.png"
                alt="Children learning"
                fill
                priority
                sizes="(max-width: 640px) 100vw,
                       (max-width: 1024px) 80vw,
                       50vw"
                className="
                  object-cover
                  rounded-3xl
                  opacity-90
                "
              />

              {/* Overlay Image */}
              <Image
                src="/images/sections/hero-girl.png"
                alt="Student using platform"
                fill
                priority
                sizes="(max-width: 640px) 100vw,
                       (max-width: 1024px) 80vw,
                       50vw"
                className="
                  object-cover
                  rounded-3xl
                  drop-shadow-2xl
                "
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
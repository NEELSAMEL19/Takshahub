"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Rocket, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/UI";

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
        className="relative
  w-full
  min-h-screen
  overflow-hidden
  bg-gradient-to-br
  from-blue-50
  via-white
  to-blue-100
"
      >
        {/* Background Glow */}
        <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12),transparent_40%)]" />

        <div
          className="
    relative z-10
    mx-auto
    flex
    min-h-[calc(100vh-4rem)]
    lg:min-h-[calc(100vh-5rem)]
    max-w-7xl
    2xl:max-w-[1600px]
    flex-col-reverse
    lg:flex-row
    items-center
  "
        >
          {/* Left Content */}
          <div
            className="
        flex-1
        px-6
        py-12
        sm:px-10
        lg:px-12
        text-center
        lg:text-left
      "
          >
            <h1
              className="
          max-w-2xl
          text-3xl
          font-bold
          leading-tight
          sm:text-4xl
          lg:text-5xl
          2xl:text-6xl
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
          max-w-xl
          text-sm
          leading-relaxed
          text-gray-600
          sm:text-base
          lg:text-lg
          mx-auto
          lg:mx-0
        "
            >
              <span className="font-semibold text-gray-800">TakshaHub</span>{" "}
              connects Admins, Teachers, Students, and Parents on one smart
              platform to streamline school operations and improve learning
              experiences.
            </p>

            <div className="mt-8 mb-6 flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
              <Link href="/register">
                <Button className="inline-flex items-center justify-center gap-2 rounded-xl hover:-translate-y-0.5 hover:shadow-lg">
                  <Rocket size={18} />
                  Get Started
                </Button>
              </Link>
            </div>

            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm sm:text-base lg:justify-start">
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

          {/* Right Image */}
          <div className="relative flex-1  self-stretch w-full min-h-[350px] lg:min-h-[calc(100vh-5rem)]">
            <Image
              src="/hero-children.png"
              alt="Children learning"
              fill
              priority
              className="object-cover object-center !rounded"
            />
            <Image
              src="/hero-girl.png"
              alt="Student using platform"
              fill
              priority
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;

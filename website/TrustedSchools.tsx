"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const images: string[] = [
  "/images/trustbyschool/1.png",
  "/images/trustbyschool/2.png",
  "/images/trustbyschool/3.png",
  "/images/trustbyschool/4.png",
  "/images/trustbyschool/5.png",
  "/images/trustbyschool/6.png",
];

type CardType = {
  num: string;
  text: string;
};

const cardsTrusted: CardType[] = [
  { num: "500+", text: "Schools Trust Us" },
  { num: "50,000+", text: "Students Managed" },
  { num: "10,00,000+", text: "Tasks Automated" },
  { num: "99.9%", text: "Uptime & Reliability" },
];

const TrustedSchools = () => {
  const [index, setIndex] = useState(0);

  // Auto rotate logos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-10 bg-white overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="font-bold text-gray-800 text-2xl sm:text-3xl md:text-4xl">
          Trusted by 5000+ Schools Across India
        </h2>

        <p className="text-gray-500 mt-4 text-sm sm:text-base">
          Empowering schools with smart, reliable, and modern management
          solutions.
        </p>
      </div>

      {/* Logo Slider */}
      <div className="w-full overflow-hidden mb-14">
        <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-10 flex-wrap">
          {images.map((img, i) => (
            <div
              key={i}
              className="
                relative
                w-[120px] h-[80px]
                sm:w-[140px] sm:h-[90px]
                md:w-[160px] md:h-[100px]
                lg:w-[180px] lg:h-[110px]
                flex-shrink-0
              "
            >
              <Image
                src={img}
                alt={`School Logo ${i + 1}`}
                fill
                sizes="(max-width: 640px) 120px,
                       (max-width: 768px) 140px,
                       (max-width: 1024px) 160px,
                       180px"
                className="
                  object-contain
                  transition-all duration-300
                  hover:scale-105
                "
                priority={i < 3}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cardsTrusted.map((item) => (
          <div
            key={item.text}
            className="
              bg-gray-50
              border border-gray-100
              rounded-2xl
              p-6
              shadow-sm
              hover:shadow-md
              transition-all duration-300
              text-center
            "
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">
              {item.num}
            </h2>

            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustedSchools;

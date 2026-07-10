"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question:
      "How easy is it to implement the system into our existing school operations?",
    answer:
      "Our system is designed for quick and seamless integration. Most schools can get started within a few days with minimal disruption.",
  },
  {
    question: "Is there training available for our staff?",
    answer:
      "Yes, we provide complete onboarding and training sessions along with documentation and video tutorials.",
  },
  {
    question: "Can the system be customized to our school’s needs?",
    answer:
      "Absolutely! Our platform is flexible and can be customized based on your workflows and requirements.",
  },
  {
    question: "What kind of support can we expect?",
    answer:
      "We offer 24/7 support via email and chat, along with dedicated account assistance for premium users.",
  },
];

const FAQ = () => {
  const [expanded, setExpanded] = useState<number | false>(false);

  const handleToggle = (index: number) => {
    setExpanded((prev) => (prev === index ? false : index));
  };

  return (
    <section
      className="relative w-full overflow-hidden 
    py-10 sm:py-10 lg:py-10 
  px-4 sm:px-6 lg:px-10"
    >
      <div className="relative max-w-6xl mx-auto px-4 text-center">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-500 max-w-xl">
            Everything you need to know about our school management system.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = expanded === index;

            return (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="text-gray-800 font-medium text-lg">
                    {item.question}
                  </span>

                  <ChevronDown
                    size={22}
                    className={`flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-blue-600" : "text-gray-500"
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-gray-600 text-left leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/UI";

const plans = [
  { name: "STANDARD", price: 480, apps: "1" },
  { name: "PROFESSIONAL", price: 1200, apps: "Unlimited" },
  { name: "ENTERPRISE", price: 1500, apps: "Unlimited" },
];

const accordionData = [
  {
    title: "Application and Data Management",
    key: "app",
    rows: [
      { label: "Applications", values: plans.map((p) => p.apps) },
      {
        label: "Building blocks - forms, reports, pages, workflows",
        values: [true, true, true],
      },
      {
        label: "Multi-experience deployment",
        values: [true, true, true],
      },
    ],
  },
  {
    title: "Support",
    key: "support",
    rows: [
      { label: "Email support", values: [true, true, true] },
      { label: "Live chat", values: [true, true, true] },
      { label: "Toll-free support", values: [true, true, true] },
      { label: "Dedicated account manager", values: [true, true, true] },
    ],
  },
];

export default function Pricing() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openModal, setOpenModal] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section
      id="pricing"
      className="  py-10 sm:py-10 lg:py-10  
  px-4 sm:px-6 lg:px-10"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Simple & Transparent Pricing
          </h1>
          <p className="text-gray-600 mt-3 text-sm md:text-base">
            Choose a plan that fits your school’s needs. No hidden charges.
          </p>
        </div>

        {/* Pricing Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[750px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-4">
              {/* Info */}
              <div
                className="p-6 text-center 
                bg-gradient-to-br from-yellow-50 to-yellow-100 
                border border-yellow-200 
                rounded-xl 
                shadow-sm"
              >
                <p className="font-bold text-base md:text-lg text-yellow-900">
                  Go Yearly
                </p>

                <p className="text-sm md:text-base text-yellow-800 mt-2 font-medium">
                  Save up to 30%
                </p>

                <span
                  className="inline-block mt-3 
                   bg-yellow-400 text-yellow-900 
                   text-sm font-bold 
                   px-3 py-1.5 rounded-full 
                   shadow-sm"
                >
                  Best Value
                </span>
              </div>

              {/* Plans */}
              {plans.map((plan, index) => (
                <div key={index} className="p-5 text-center">
                  <h2 className="font-semibold text-sm md:text-base">
                    {plan.name}
                  </h2>

                  <p className="text-2xl md:text-3xl font-bold my-2">
                    ₹{plan.price}
                    <span className="text-sm text-gray-500 ml-1">/month</span>
                  </p>

                  <p className="text-xs text-gray-400 mb-4">billed annually</p>

                  {/* Buttons */}
                  <div>
                    <Link href="/register">
                      <Button className="shadow-sm hover:shadow-md transition-all duration-200 w-full">
                        Buy Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Accordion */}
            {accordionData.map((section) => (
              <div key={section.key}>
                {/* Header */}
                <div
                  onClick={() => toggleSection(section.key)}
                  className="flex justify-between items-center px-5 py-4 cursor-pointer bg-gray-50 border-t border-gray-200 "
                >
                  <span className="font-semibold text-sm md:text-base">
                    {section.title}
                  </span>
                  <span className="text-lg">
                    {openSections[section.key] ? "−" : "+"}
                  </span>
                </div>

                {/* Content */}
                {openSections[section.key] && (
                  <div>
                    {section.rows.map((row, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-4 text-sm border-t border-gray-200 "
                      >
                        <div className="p-4 bg-gray-50 text-gray-600">
                          {row.label}
                        </div>

                        {row.values.map((val, i) => (
                          <div
                            key={i}
                            className="flex justify-center items-center p-4"
                          >
                            {typeof val === "boolean"
                              ? val && (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                )
                              : val}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

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

type AccordionRow = {
  label: string;
  values: (string | boolean)[];
};

const accordionData: { title: string; key: string; rows: AccordionRow[] }[] = [
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

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section id="pricing" className="py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Simple & Transparent Pricing
          </h1>
          <p className="text-gray-600 mt-3 text-sm md:text-base">
            Choose a plan that fits your school’s needs. No hidden charges.
          </p>
        </div>

        {/* Yearly banner - shown once, above everything, on mobile only */}
        <div className="sm:hidden mb-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 p-4 text-center">
          <p className="font-bold text-base text-yellow-900">Go Yearly</p>
          <p className="text-sm text-yellow-800 mt-1 font-medium">
            Save up to 30%
          </p>
          <span className="inline-block mt-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
            Best Value
          </span>
        </div>

        {/* MOBILE: stacked cards */}
        <div className="sm:hidden space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5"
            >
              <h2 className="font-semibold text-sm text-gray-800 tracking-tight uppercase">
                {plan.name}
              </h2>

              <p className="mt-1 font-bold text-gray-900">
                <span className="text-3xl">₹{plan.price}</span>
                <span className="text-xs font-normal text-gray-500 ml-1">
                  /month
                </span>
              </p>

              <p className="text-xs text-gray-400 mt-1">billed annually</p>

              <Link href="/register">
                <Button className="w-full mt-4 shadow-sm hover:shadow-md transition-all duration-200 text-sm">
                  Buy Now
                </Button>
              </Link>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>
                    {plan.apps} application{plan.apps === "1" ? "" : "s"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Full feature access & support</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP / TABLET: table */}
        <div className="hidden sm:block overflow-x-auto">
          <div className="min-w-[650px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-4">
              {/* Info */}
              <div className="p-4 md:p-6 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-r border-yellow-200">
                <p className="font-bold text-sm md:text-lg text-yellow-900 leading-tight">
                  Go Yearly
                </p>
                <p className="text-xs md:text-base text-yellow-800 mt-2 font-medium leading-tight">
                  Save up to 30%
                </p>
                <span className="inline-block mt-3 bg-yellow-400 text-yellow-900 text-xs md:text-sm font-bold px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                  Best Value
                </span>
              </div>

              {/* Plans */}
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`p-3 md:p-5 text-center ${
                    index < plans.length - 1 ? "border-r border-gray-100" : ""
                  }`}
                >
                  <h2 className="font-semibold text-xs md:text-base leading-tight tracking-tight break-words">
                    {plan.name}
                  </h2>

                  <p className="text-xl md:text-3xl font-bold my-2 leading-tight">
                    ₹{plan.price}
                    <span className="block md:inline text-xs md:text-sm text-gray-500 md:ml-1">
                      /month
                    </span>
                  </p>

                  <p className="text-xs text-gray-400 mb-3 md:mb-4">
                    billed annually
                  </p>

                  <Link href="/register">
                    <Button className="shadow-sm hover:shadow-md transition-all duration-200 w-full text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2">
                      Buy Now
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Accordion */}
            {accordionData.map((section) => {
              const isOpen = !!openSections[section.key];
              return (
                <div key={section.key}>
                  <button
                    type="button"
                    onClick={() => toggleSection(section.key)}
                    aria-expanded={isOpen}
                    aria-controls={`accordion-panel-${section.key}`}
                    className="w-full flex justify-between items-center px-5 py-4 text-left cursor-pointer bg-gray-50 border-t border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-sm md:text-base">
                      {section.title}
                    </span>
                    <span className="text-lg leading-none" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div id={`accordion-panel-${section.key}`}>
                      {section.rows.map((row, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-4 text-sm border-t border-gray-200"
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import {
  User,
  CalendarDays,
  Clock,
  ClipboardCheck,
  Award,
  Megaphone,
  CreditCard,
  Users,
} from "lucide-react";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <User className="w-12 h-12 text-green-500" />,
    title: "Student Information",
    description: "Manage student profiles and records.",
  },
  {
    icon: <CalendarDays className="w-12 h-12 text-purple-500" />,
    title: "Attendance Tracking",
    description: "Monitor daily attendance easily.",
  },
  {
    icon: <Clock className="w-12 h-12 text-blue-500" />,
    title: "Timetable Management",
    description: "Create and organize class schedules.",
  },
  {
    icon: <ClipboardCheck className="w-12 h-12 text-orange-500" />,
    title: "Admissions & Enrollments",
    description: "Streamline the admissions process.",
  },
  {
    icon: <Award className="w-12 h-12 text-red-500" />,
    title: "Gradebook & Report Cards",
    description: "Track grades and generate report cards.",
  },
  {
    icon: <Megaphone className="w-12 h-12 text-blue-400" />,
    title: "Communication Tools",
    description: "Send notices and messages to parents & staff.",
  },
  {
    icon: <CreditCard className="w-12 h-12 text-yellow-500" />,
    title: "Fee Management",
    description: "Handle school fees and payments.",
  },
  {
    icon: <Users className="w-12 h-12 text-purple-400" />,
    title: "Staff Management",
    description: "Oversee teacher and staff details.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-10 sm:py-10 lg:py-10 px-4 sm:px-6 lg:px-10"
    >
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
          Powerful Features for Smart School Management
        </h1>
        <p className="mt-3 text-gray-500 text-sm md:text-lg">
          Simplify operations, enhance learning, and stay in control
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-gray-100"
          >
            <div className="flex flex-col items-center text-center p-6">
              {/* Icon */}
              <div className="mb-4">{item.icon}</div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>

              {/* Divider */}
              <hr className="w-full my-3 border-t border-gray-200" />

              {/* Description */}
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

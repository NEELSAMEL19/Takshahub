"use client";

import Image from "next/image";
import React from "react";

type Testimonial = {
  name: string;
  role: string;
  message: string;
  image: string;
};

const testimonialsData: Testimonial[] = [
  {
    name: "Sarah Thompson",
    role: "Principal, Green Valley High School",
    message:
      "This system has transformed the way we manage our school. It's intuitive and saves us so much time!",
    image: "/default-avatar.png",
  },
  {
    name: "David Williams",
    role: "Headmaster, Crestwood Academy",
    message:
      "An outstanding tool for school administration. Our workflow has become more efficient and organized.",
    image: "/default-avatar.png",
  },
  {
    name: "Michael Roberts",
    role: "Director, Sunnydale Elementary",
    message:
      "Excellent support and powerful features. This system has made a huge difference in our daily operations.",
    image: "/default-avatar.png",
  },
];

const Testimonials = () => {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          What Our Clients Say
        </h2>

        <p className="text-gray-500 mb-12">
          Hear from school leaders about their experience with our management
          system.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonialsData.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div className="text-left">
                <span className="text-3xl text-blue-500 font-bold">“</span>

                <p className="text-gray-600 leading-relaxed mt-2">
                  {item.message}
                </p>

                <span className="text-3xl text-teal-400 font-bold float-right">
                  ”
                </span>
              </div>

              <div className="flex flex-col items-center mt-6">
                <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-lg text-gray-800">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500 text-center">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

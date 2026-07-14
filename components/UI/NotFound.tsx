"use client";

import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <motion.div
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background Glow */}
      <motion.div
        className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl"
        animate={{
          x: [-20, 20, -20],
          y: [-10, 20, -10],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -right-24 bottom-10 h-[26rem] w-[26rem] rounded-full bg-blue-300/30 blur-3xl"
        animate={{
          x: [20, -20, 20],
          y: [10, -20, 10],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center justify-center text-center">
        {/* Rotating Ring behind the number */}
        <motion.svg
          className="pointer-events-none absolute h-[26rem] w-[26rem] md:h-[32rem] md:w-[32rem]"
          viewBox="0 0 160 160"
          animate={{ rotate: 360 }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#BFDBFE"
            strokeWidth="1"
            fill="none"
            strokeDasharray="6 12"
          />
          <motion.circle cx="80" cy="10" r="3.5" fill="#2563EB" />
        </motion.svg>

        <motion.svg
          className="pointer-events-none absolute h-[22rem] w-[22rem] md:h-[27rem] md:w-[27rem]"
          viewBox="0 0 160 160"
          animate={{ rotate: -360 }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <circle
            cx="80"
            cy="80"
            r="55"
            stroke="#DBEAFE"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2 8"
          />
          <motion.circle cx="80" cy="25" r="2.5" fill="#60A5FA" />
        </motion.svg>

        {/* Floating 404 — large and animated */}
        <motion.h1
          className="relative select-none bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-[9rem] font-extrabold leading-none tracking-tight text-transparent sm:text-[11rem] md:text-[13rem]"
          animate={{
            y: [0, -18, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          404
        </motion.h1>

        <motion.h2
          className="relative mt-4 text-2xl font-bold text-slate-800 sm:text-3xl"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Page Not Found
        </motion.h2>

        <motion.p
          className="relative mt-3 max-w-md text-slate-500"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or you don&apos;t
          have permission to access it.
        </motion.p>
      </div>

      {/* Floating Dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-blue-400"
          style={{
            left: `${15 + i * 12}%`,
            top: `${20 + (i % 2) * 50}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  );
}

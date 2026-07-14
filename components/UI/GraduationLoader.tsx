"use client";
import { motion } from "framer-motion";

export default function GraduationLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex h-44 w-44 items-center justify-center">
        {/* Animated Ring */}
        <motion.svg
          className="absolute h-40 w-40"
          viewBox="0 0 160 160"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        >
          <circle
            cx="80"
            cy="80"
            r="56"
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="80"
            cy="80"
            r="56"
            stroke="#2563EB"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="90 260"
            fill="none"
          />
        </motion.svg>

        {/* Graduation Cap */}
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            delay: 0.5,
            duration: 1,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="relative"
        >
          {/* Cap Top */}
          <div
            className="h-4 w-24 rounded-sm bg-blue-600"
            style={{ transform: "rotate(-12deg)" }}
          />
          {/* Cap Base */}
          <div className="absolute left-5 top-3 h-5 w-14 rounded-md bg-blue-700" />
          {/* Tassel */}
          <motion.div
            className="absolute right-1 top-2 origin-top"
            animate={{
              rotate: [-20, 20, -15, 15, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
            }}
          >
            <div className="mx-auto h-10 w-[2px] bg-yellow-500" />
            <div className="-mt-1 h-3 w-3 rounded-full bg-yellow-500" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

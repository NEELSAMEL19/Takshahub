import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  // NEW: Callback prop to update state in the parent container
  onStepClick: (stepNumber: number) => void;
}

const Stepper = ({
  steps = [],
  currentStep = 1,
  onStepClick,
}: StepperProps) => {
  return (
    <div className="w-full">
      {/* Visual Timeline Bar Container */}
      <div className="relative flex items-center justify-between w-full">
        {/* Background Connecting Line */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-gray-300" />

        {/* Dynamic Steps Mapping */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;

          return (
            <button
              key={index}
              type="button" // Prevents accidental form submissions
              onClick={() => onStepClick(stepNumber)}
              className={`relative z-10 w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-semibold text-sm transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus:outline-none ${
                isActive
                  ? "theme-primary-background text-white shadow-md"
                  : "bg-gray-300 text-gray-500 hover:bg-gray-400"
              }`}
            >
              {stepNumber}
            </button>
          );
        })}
      </div>

      {/* Dynamic Text Labels Container */}
      <div className="mt-2 flex justify-between w-full px-1">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onStepClick(stepNumber)}
              className={`text-lg font-medium transition-colors duration-300 cursor-pointer text-left focus:outline-none ${
                isActive
                  ? "text-theme-primary-background font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {step}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;

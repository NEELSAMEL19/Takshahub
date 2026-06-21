import React from "react";

type Placement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: React.ReactNode;
  content?: React.ReactNode;
  placement?: Placement;
  space?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = "top",
  space = 12,
}) => {
  const positions: Record<
    Placement,
    {
      style: React.CSSProperties;
      arrow: string;
    }
  > = {
    top: {
      style: {
        bottom: `calc(100% + ${space}px)`,
        left: "50%",
        transform: "translateX(-50%)",
      },
      arrow: "bottom-[-5px] left-1/2 -translate-x-1/2",
    },
    bottom: {
      style: {
        top: `calc(100% + ${space}px)`,
        left: "50%",
        transform: "translateX(-50%)",
      },
      arrow: "top-[-5px] left-1/2 -translate-x-1/2",
    },
    left: {
      style: {
        right: `calc(100% + ${space}px)`,
        top: "50%",
        transform: "translateY(-50%)",
      },
      arrow: "right-[-5px] top-1/2 -translate-y-1/2",
    },
    right: {
      style: {
        left: `calc(100% + ${space}px)`,
        top: "50%",
        transform: "translateY(-50%)",
      },
      arrow: "left-[-5px] top-1/2 -translate-y-1/2",
    },
  };

  const current = positions[placement] ?? positions.top;

  return (
    <div className="relative inline-flex group">
      {children}

      {content && (
        <div
          style={current.style}
          className="
            absolute z-50
            invisible opacity-0
            group-hover:visible group-hover:opacity-100
            transition-all duration-150
            pointer-events-none
          "
        >
          <div className="relative rounded-md bg-[#2c3c4e] px-3 py-2 text-md font-medium text-white shadow-lg whitespace-nowrap">
            {content}

            <span
              className={`absolute h-[10px] w-[10px] rotate-45 bg-[#2c3c4e] ${current.arrow}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;

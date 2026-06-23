"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Nav } from "rsuite";

interface TabItem {
  label: string;
  path: string;
}

interface TabProps {
  items?: TabItem[];
  active?: number;
  onClick?: (eventKey: number) => void;
  button?: ReactNode;
  className?: string;
}

const Tab = ({
  items = [],
  active = 0,
  onClick,
  button,
  className = "",
}: TabProps) => {
  const handleSelect = (eventKey: string | number | undefined) => {
    if (typeof eventKey === "number") {
      onClick?.(eventKey);
    }
  };

  return (
    <div className={`flex justify-between ${button ? "gap-5" : ""} flex-wrap`}>
      <Nav
        appearance="subtle"
        activeKey={active}
        onSelect={handleSelect}
        className={`
    ${className}
  `}
      >
        {items.map((item, index) => (
          <Nav.Item key={item.path} eventKey={index} as={Link} href={item.path}>
            {item.label}
          </Nav.Item>
        ))}
      </Nav>

      {button && (
        <div className="flex items-center justify-center w-fit">{button}</div>
      )}
    </div>
  );
};

export default Tab;

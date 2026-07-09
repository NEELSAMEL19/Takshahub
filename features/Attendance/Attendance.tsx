"use client";

import Header from "@/components/Base/Header/Header";
import Tab from "@/components/Base/Tab/Tab";
import { useAdminMenu } from "@/hooks/sideMenu/useSideMenu";
import { camelToSnake } from "@/utils/utils";
import { usePathname } from "next/navigation";
import React from "react";

const Attendance = () => {
  const { data } = useAdminMenu();
  const pathname = usePathname();
  const attendanceTabs = (data?.data?.Attendance || {}) as Record<
    string,
    string
  >;
  const currentTab = pathname.split("/").pop() ?? "";

  const tabItems = Object.entries(attendanceTabs).map(
    ([key, value], index) => ({
      index,
      label: value,
      name: key,
      path: `/admin/attendance/${camelToSnake(key)}`,
    }),
  );

  const activeTabIndex = tabItems.findIndex(
    (tab) => camelToSnake(tab.name) === currentTab,
  );

  return (
    <div className="flex flex-col gap-2.5 bg-white">
      <Header header="Attendance" />
      <div className="py-4 px-5">
        <Tab
          items={tabItems}
          active={activeTabIndex === -1 ? 0 : activeTabIndex}
        />
      </div>
    </div>
  );
};

export default Attendance;

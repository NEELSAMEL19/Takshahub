"use client";

import React from "react";
import { usePathname } from "next/navigation";

import Header from "@/components/Base/Header/Header";
import Tab from "@/components/Base/Tab/Tab";
import { useMe } from "@/hooks/auth/useAuth";
import { useSideMenu } from "@/hooks/sideMenu/useSideMenu";
import { camelToSnake } from "@/utils/utils";

const Attendance = () => {
  const pathname = usePathname();

  // Get logged-in user
  const { data: me } = useMe();
  const userId = me?.data.user?.id;

  // Uses React Query cache if already fetched
  const { data } = useSideMenu(userId);

  const attendanceTabs =
    (data?.data?.Attendance as Record<string, string>) || {};

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

      <div className="px-5 py-4">
        <Tab
          items={tabItems}
          active={activeTabIndex === -1 ? 0 : activeTabIndex}
        />
      </div>
    </div>
  );
};

export default Attendance;

"use client";

import Header from "@/components/Base/Header/Header";
import Tab from "@/components/Base/Tab/Tab";
import { Button } from "@/components/UI";
import { useMe } from "@/hooks/auth/useAuth";
import { useSideMenu } from "@/hooks/sideMenu/useSideMenu";
import { camelToSnake } from "@/utils/utils";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const TAB_CONFIG: Record<string, { label: string; addPath: string }> = {
  academic_year: {
    label: "Academic year",
    addPath: "/admin/academic/add/academic_year",
  },
};

const Academic = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Get logged-in user
  const { data: me } = useMe();
  const userId = me?.data.user?.id;

  // Uses React Query cache if already fetched in SideMenu
  const { data } = useSideMenu(userId);

  const academicTabs = (data?.data?.Academic as Record<string, string>) || {};

  const currentTab = pathname.split("/").pop() ?? "";

  const tabItems = Object.entries(academicTabs).map(([key, value], index) => ({
    index,
    label: value,
    name: key,
    path: `/admin/academic/${camelToSnake(key)}`,
  }));

  const activeTabIndex = tabItems.findIndex(
    (tab) => camelToSnake(tab.name) === currentTab,
  );

  const config = TAB_CONFIG[currentTab];

  const handleClick = () => {
    if (config) {
      router.push(config.addPath);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 bg-white">
      <Header
        header="Academic"
        actionButtons={
          config && (
            <Button onClick={handleClick} className="!rounded-lg">
              {config.label}
            </Button>
          )
        }
      />

      <div className="px-5 py-4">
        <Tab
          items={tabItems}
          active={activeTabIndex === -1 ? 0 : activeTabIndex}
        />
      </div>
    </div>
  );
};

export default Academic;

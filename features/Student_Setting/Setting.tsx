"use client";

import Header from "@/components/Base/Header/Header";
import Tab from "@/components/Base/Tab/Tab";
import { useMe } from "@/hooks/auth/useAuth";
import { useSideMenu } from "@/hooks/sideMenu/useSideMenu";
import { usePathname } from "next/navigation";

import React from "react";

const Setting = () => {
  const pathname = usePathname();

  // Get logged-in user
  const { data: me } = useMe();
  const userId = me?.data.user?.id;

  // Uses React Query cache if already fetched
  const { data } = useSideMenu(userId);

  const organizationTabs =
    (data?.data?.Setting as Record<string, string>) || {};

  const currentTab = pathname.split("/").pop() ?? "";

  const tabItems = Object.entries(organizationTabs).map(
    ([key, value], index) => ({
      index,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      name: value,
      path: `/student/setting/${String(value).toLowerCase()}`,
    }),
  );

  const activeTabIndex = tabItems.findIndex(
    (tab) => String(tab.name).toLowerCase() === currentTab,
  );

  return (
    <div className="flex flex-col gap-2.5 bg-white">
      <Header header="Setting" />

      <div className="px-5 py-4">
        <Tab
          items={tabItems}
          active={activeTabIndex === -1 ? 0 : activeTabIndex}
        />
      </div>
    </div>
  );
};

export default Setting;

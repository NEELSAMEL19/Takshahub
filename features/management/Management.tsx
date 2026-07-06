"use client";

import Header from "@/components/Base/Header/Header";
import Tab from "@/components/Base/Tab/Tab";
import { Button } from "@/components/UI";
import { useAdminMenu } from "@/hooks/sideMenu/useSideMenu";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const TAB_CONFIG: Record<string, { label: string; addPath: string }> = {
  class: { label: "Add Class", addPath: "/admin/management/add/class" },
  subject: { label: "Add Subject", addPath: "/admin/management/add/subject" },
  student: { label: "Enroll Student", addPath: "/admin/management/add/student" },
  teacher: { label: "Enroll Teacher", addPath: "/admin/management/add/teacher" },
};

const Management = () => {
  const { data } = useAdminMenu();
  const pathname = usePathname();
  const router = useRouter();
  const managementTabs = data?.data?.Management || {};
  const currentTab = pathname.split("/").pop() ?? "";

  const tabItems = Object.entries(managementTabs).map(
    ([key, value], index) => ({
      index,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      name: value,
      path: `/admin/management/${String(value).toLowerCase()}`,
    }),
  );

  const activeTabIndex = tabItems.findIndex(
    (tab) => String(tab.name).toLowerCase() === currentTab,
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
        header="Management"
        actionButtons={
          config && (
            <Button onClick={handleClick} className="!rounded-lg">
              {config.label}
            </Button>
          )
        }
      />
      <div className="py-4 px-5">
        <Tab
          items={tabItems}
          active={activeTabIndex === -1 ? 0 : activeTabIndex}
        />
      </div>
    </div>
  );
};

export default Management;

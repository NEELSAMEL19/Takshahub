"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

import Header from "@/components/Base/Header/Header";
import Tab from "@/components/Base/Tab/Tab";
import { Button } from "@/components/UI";
import { useMe } from "@/hooks/auth/useAuth";
import { useSideMenu } from "@/hooks/sideMenu/useSideMenu";
import { camelToSnake } from "@/utils/utils";

const TAB_CONFIG: Record<string, { label: string; addPath: string }> = {
  class: {
    label: "Add Class",
    addPath: "/admin/management/add/class",
  },
  subject: {
    label: "Add Subject",
    addPath: "/admin/management/add/subject",
  },
  student: {
    label: "Enroll Student",
    addPath: "/admin/management/add/student",
  },
  class_teacher: {
    label: "Enroll Class Teacher",
    addPath: "/admin/management/add/class_teacher",
  },
  subject_teacher: {
    label: "Enroll Subject Teacher",
    addPath: "/admin/management/add/subject_teacher",
  },
};

const Management = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Get logged-in user
  const { data: me } = useMe();
  const userId = me?.data.user?.id;

  // Uses cached data if already fetched by SideMenu
  const { data } = useSideMenu(userId);

  const managementTabs =
    (data?.data?.Management as Record<string, string>) || {};

  const currentTab = pathname.split("/").pop() ?? "";

  const tabItems = Object.entries(managementTabs).map(
    ([key, value], index) => ({
      index,
      label: value,
      name: key,
      path: `/admin/management/${camelToSnake(key)}`,
    }),
  );

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
        header="Management"
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

export default Management;

"use client"

import Header from "@/components/Base/Header/Header";
import Tab from "@/components/Base/Tab/Tab";
import { Button } from "@/components/UI";
import { useAdminMenu } from "@/hooks/sideMenu/useSideMenu";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Management = () => {
  const { data } = useAdminMenu();
  const pathname = usePathname();
  const router = useRouter();
  const managementTabs = data?.data?.Management || {};
  const currentTab = pathname.split("/").pop();
  
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

  const handleClick = () => {
        router.push("/admin/management/add/class");
  };

  return (
    <div className="flex flex-col gap-2.5 bg-white">
      <Header
        header="Management"
        actionButtons={
          <Button onClick={handleClick} className="!rounded-lg">Add Class</Button>
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

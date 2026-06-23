"use client";

import Tab from "@/components/Base/Tab/Tab";
import { useAdminMenu } from "@/hooks/sideMenu/useSideMenu";
import { usePathname } from "next/navigation";

const OrganizationTabs = () => {
  const { data } = useAdminMenu();
  const pathname = usePathname();

  const organizationTabs = data?.data?.Organization || {};

  const currentTab = pathname.split("/").pop();

  const tabItems = Object.entries(organizationTabs).map(
    ([key, value], index) => ({
      index,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      name: value,
      path: `/admin/organization/${value}`,
    }),
  );

  const activeTabIndex = tabItems.findIndex((tab) => tab.name === currentTab);

  return (
    <div className="">
      <Tab
        items={tabItems}
        active={activeTabIndex === -1 ? 0 : activeTabIndex}
      />
    </div>
  );
};

export default OrganizationTabs;

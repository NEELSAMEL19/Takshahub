"use client";

import Header from "@/components/Base/Header/Header";
import Tab from "@/components/Base/Tab/Tab";
import { Button } from "@/components/UI";
import { useSideMenu } from "@/hooks/sideMenu/useSideMenu";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const Organization = () => {
  const { data } = useSideMenu();
  const pathname = usePathname();
  const router = useRouter();
  const organizationTabs = data?.data?.Organization || {};

  const currentTab = pathname.split("/").pop();

  const tabItems = Object.entries(organizationTabs).map(
    ([key, value], index) => ({
      index,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      name: value,
      path: `/admin/organization/${String(value).toLowerCase()}`,
    }),
  );

  const activeTabIndex = tabItems.findIndex(
    (tab) => String(tab.name).toLowerCase() === currentTab,
  );

  const handleClick = () => {
    router.push(
      `/admin/organization/add/${currentTab === "role" ? "role" : "team"}`,
    );
  };

  return (
    <div className="flex flex-col gap-2.5 bg-white">
      <Header
        header="Organization"
        actionButtons={
          <Button onClick={handleClick} className="!rounded-lg">
            {currentTab === "role" ? "Add role" : "Add team"}
          </Button>
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

export default Organization;

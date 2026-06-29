import { RiOrganizationChart } from "react-icons/ri";
import { MdOutlineSchool } from "react-icons/md";
import { MdOutlineFactCheck } from "react-icons/md";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import type { IconType } from "react-icons";

export const menuIcons: Record<string, IconType> = {
  Academic: MdOutlineSchool, 
  Attendance: MdOutlineFactCheck,
  Management: MdOutlineAdminPanelSettings,
  Organization: RiOrganizationChart, 
};

type PathHandler = (
  baseRoute: string,
  category: string,
  subcategories: any,
) => string;

const pathTypeHandlers: Record<string, PathHandler> = {
  Organization: (baseRoute, category, subcategories) => {
    const basePath = `/${baseRoute}/${category.toLowerCase()}`;

    if (!subcategories || typeof subcategories !== "object") {
      return basePath;
    }

    const firstKey = Object.keys(subcategories)[0];
    return firstKey ? `${basePath}/${firstKey}` : basePath;
  },

  default: (baseRoute, category) => `/${baseRoute}/${category.toLowerCase()}`,
};

export const getSideMenuItems = (sideMenus: any) => {
  if (!sideMenus) return [];

  return Object.entries(sideMenus).map(
    ([category, subcategories]: [string, any]) => {
      const handler = pathTypeHandlers[category] ?? pathTypeHandlers.default;

      const path = handler("admin", category, subcategories);

      const Icon = menuIcons[category] ?? FaBuilding;

      return {
        icon: Icon,
        name: category,
        path,
        id: category.toLowerCase(),
        placement: "right",
        children: subcategories,
      };
    },
  );
};

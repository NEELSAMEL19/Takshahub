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

type Subcategories = Record<string, unknown> | null;

type PathHandler = (
  baseRoute: string,
  category: string,
  subcategories: Subcategories,
) => string;

const defaultPathHandler: PathHandler = (
  baseRoute,
  category,
  subcategories,
) => {

  const basePath = `/${baseRoute}/${category.toLowerCase()}`;

  if (
    subcategories &&
    typeof subcategories === "object" &&
    Object.keys(subcategories).length > 0
  ) {
    const firstKey = Object.keys(subcategories)[0];
    return `${basePath}/${firstKey}`;
  }

  return basePath;
};

export const getSideMenuItems = (sideMenus: Record<string, unknown> | null) => {
  if (!sideMenus) return [];

  return Object.entries(sideMenus as Record<string, Subcategories>).map(
    ([category, subcategories]: [string, Subcategories]) => {
      const path = defaultPathHandler("admin", category, subcategories);
      const Icon = menuIcons[category];

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

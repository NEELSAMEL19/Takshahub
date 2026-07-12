import type { IconType } from "react-icons";
import { RiOrganizationChart } from "react-icons/ri";
import {
  MdDashboard,
  MdOutlineAdminPanelSettings,
  MdOutlineFactCheck,
  MdOutlineSchool,
  MdMenuBook,
} from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";

export const menuIcons: Record<string, IconType> = {
  // Common
  Dashboard: MdDashboard,

  // Academic
  Academic: MdOutlineSchool,
  Attendance: MdOutlineFactCheck,

  // Admin
  Management: MdOutlineAdminPanelSettings,
  Organization: RiOrganizationChart,

  // Teacher
  Teaching: FaChalkboardTeacher,

  // Teacher
  Learning: MdMenuBook,
};

type Subcategories = Record<string, unknown> | null;

export interface SideMenuItem {
  icon?: IconType;
  name: string;
  path: string;
  id: string;
  placement: "right";
  children: Subcategories;
}

const normalize = (value?: string) =>
  value?.trim().toLowerCase().replace(/\s+/g, "-") ?? "";

const buildPath = (
  baseRoute?: string,
  category?: string,
  subcategories?: Subcategories,
): string => {
  const route = normalize(baseRoute);
  const module = normalize(category);

  if (!route || !module) {
    console.error("Invalid buildPath arguments:", {
      baseRoute,
      category,
      subcategories,
    });
    return "/";
  }

  let path = `/${route}/${module}`;

  if (
    subcategories &&
    typeof subcategories === "object" &&
    Object.keys(subcategories).length > 0
  ) {
    path += `/${normalize(Object.keys(subcategories)[0])}`;
  }

  return path;
};

export const getSideMenuItems = (
  sideMenus: Record<string, unknown> | null,
  baseRoute?: string,
): SideMenuItem[] => {
  if (!sideMenus || !baseRoute) {
    console.warn("getSideMenuItems: Missing sideMenus or baseRoute", {
      sideMenus,
      baseRoute,
    });
    return [];
  }

  return Object.entries(sideMenus as Record<string, Subcategories>).map(
    ([category, subcategories]) => ({
      icon: menuIcons[category],
      name: category,
      path: buildPath(baseRoute, category, subcategories),
      id: normalize(category),
      placement: "right",
      children: subcategories,
    }),
  );
};

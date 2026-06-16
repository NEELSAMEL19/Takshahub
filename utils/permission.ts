import { FaBuilding } from "react-icons/fa";
import type { IconType } from "react-icons";

export const menuIcons: Record<string, IconType> = {
  Organization: FaBuilding,
};

type PathHandler = (category: string, subcategories: any) => string;

const pathTypeHandlers: Record<string, PathHandler> = {
  Organization: (category, subcategories) => {
    const basePath = `/${category.toLowerCase()}`;

    if (!subcategories || typeof subcategories !== "object") {
      return basePath;
    }

    const firstKey = Object.keys(subcategories)[0];
    return firstKey ? `${basePath}/${firstKey}` : basePath;
  },

  default: (category) => `/${category.toLowerCase()}`,
};

export const getSideMenuItems = (sideMenus: any) => {
  if (!sideMenus) return [];

  return Object.entries(sideMenus).map(([category, subcategories]: any) => {
    const handler = pathTypeHandlers[category] ?? pathTypeHandlers.default;

    const pathType = handler(category, subcategories);

    const Icon = menuIcons[category] ?? FaBuilding; 

    return {
      icon: Icon,
      name: category,
      path: pathType,
      id: category.toLowerCase(),
      placement: "right",
      children: subcategories,
    };
  });
};

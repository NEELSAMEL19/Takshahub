export interface SideMenuResponse {
  code: number;
  message: string;
  data: Record<string, Record<string, unknown>>;
}

export interface MenuItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
  path?: string;
  placement?: string;
}

export interface SidebarState {
  isOpen: boolean;
}
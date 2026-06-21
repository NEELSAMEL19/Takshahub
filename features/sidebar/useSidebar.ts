import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar, openSidebar, closeSidebar } from "./sidebarSlice";

export const useSidebar = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);

  // Improvement: Wrap dispatch functions in useCallback to maintain
  // referential identity across re-renders.
  const toggle = useCallback(() => dispatch(toggleSidebar()), [dispatch]);
  const open = useCallback(() => dispatch(openSidebar()), [dispatch]);
  const close = useCallback(() => dispatch(closeSidebar()), [dispatch]);

  return {
    isOpen,
    toggle,
    open,
    close,
  };
};

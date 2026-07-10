"use client";

<<<<<<< Updated upstream
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { store } from "@/store";

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (typeof window === "undefined") {
    return new QueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = new QueryClient();
  }

  return browserQueryClient;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
=======
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
>>>>>>> Stashed changes

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
<<<<<<< Updated upstream
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
=======
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
>>>>>>> Stashed changes
  );
}

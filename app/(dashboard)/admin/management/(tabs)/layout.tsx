import Management from "@/features/management/Management";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Management />
      {children}
    </>
  );
}

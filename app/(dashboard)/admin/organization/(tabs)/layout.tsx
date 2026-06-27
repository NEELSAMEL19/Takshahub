import OrganizationTabs from "@/features/organization/OrganizationTabs";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationTabs />
      {children}
    </>
  );
}

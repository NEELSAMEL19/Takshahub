import OrganizationTabs from "@/features/organization/Organization";

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

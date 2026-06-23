import Header from "@/components/Base/Header/Header";
import OrganizationTabs from "@/features/organization/OrganizationTabs";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-4">
        <Header header="Organization" />
        <OrganizationTabs />
      </div>

      {children}
    </div>
  );
}

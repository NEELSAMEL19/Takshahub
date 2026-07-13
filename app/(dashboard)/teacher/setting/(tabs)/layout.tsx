import Setting from "@/features/Teacher_Setting/Setting";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Setting />
      {children}
    </>
  );
}

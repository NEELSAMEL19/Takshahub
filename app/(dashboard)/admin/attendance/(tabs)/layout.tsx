import Attendance from "@/features/Attendance/Attendance";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Attendance />
      {children}
    </>
  );
}

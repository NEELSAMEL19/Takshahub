import StudentDashboard from "@/features/Student_Setting/Setting";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StudentDashboard />
      {children}
    </>
  );
}

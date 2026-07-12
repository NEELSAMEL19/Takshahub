import StudentDashboard from "@/features/Student_Dashboard/StudentDashboard";

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

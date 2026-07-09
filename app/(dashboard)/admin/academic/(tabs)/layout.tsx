import Academic from "@/features/academic/Academic";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Academic />
      {children}
    </>
  );
}

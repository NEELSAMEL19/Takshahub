export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col gap-2.5 bg-white">{children}</div>;
}

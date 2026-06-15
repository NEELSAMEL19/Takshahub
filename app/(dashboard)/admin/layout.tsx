import Footer from "@/components/Base/Footer/Footer";
import Navbar from "@/components/Base/navbar/Navbar";
import AdminMenu from "@/components/Base/sidemenu/AdminMenu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-theme-background overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 shrink-0 border-b shadow-sm bg-white">
        <Navbar />
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-20 shrink-0">
          <AdminMenu />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto p-6 bg-white mr-4 my-2 rounded-sm">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="shrink-0">
        <Footer />
      </footer>
    </div>
  );
}

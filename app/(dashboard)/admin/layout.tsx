import Footer from "@/components/Base/Footer/Footer";
import Navbar from "@/components/Base/navbar/Navbar";
import AdminMenu from "@/components/Base/sidemenu/AdminMenu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-theme-background">
      {/* Navbar */}
      <header className="h-16 shrink-0 border-b bg-white shadow-sm">
        <Navbar />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-20 shrink-0">
          <AdminMenu />
        </aside>

        <div className="flex flex-1 flex-col gap-2.5 my-2">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-white mr-4 rounded-sm">
            {children}
          </main>

          {/* Footer */}
          <footer className="shrink-0">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
}

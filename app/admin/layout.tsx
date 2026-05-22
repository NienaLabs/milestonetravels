import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Verify that the user is authenticated and is an admin (role check first, then email whitelist)
  if (!session || !isAdmin(session.user)) {
    redirect("/");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#050D2A] flex text-white-pure">
      {/* Admin Sidebar */}
      <AdminSidebar user={{ name: user.name, image: user.image }} />

      {/* Main Content Area */}
      <main className="flex-1 ml-16 md:ml-64 min-h-screen bg-[#050D2A] transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}

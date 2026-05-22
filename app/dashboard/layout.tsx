import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/auth/sign-in");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <DashboardSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? null,
        }}
      />

      {/* Main content area */}
      <main className="flex-1 ml-16 md:ml-64 min-h-screen transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}

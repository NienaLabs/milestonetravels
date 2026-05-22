import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import ManageUsersClient from "@/components/ManageUsersClient";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !isAdmin(session.user)) {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    include: {
      bookings: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // Serialize Dates
  const serializedUsers = users.map(u => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
    bookingsCount: u.bookings.length,
  }));

  return (
    <div>
      <div className="mb-10">
        <p className="font-body text-[11px] tracking-[0.16em] text-navy-sky uppercase mb-3">Admin Portal</p>
        <h1 className="font-display italic text-4xl font-light text-white-pure mb-2">Users Directory</h1>
        <p className="font-body text-white-muted text-base">
          View all registered users on the platform.
        </p>
      </div>

      <ManageUsersClient initialUsers={serializedUsers as any} />
    </div>
  );
}

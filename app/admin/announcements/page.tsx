import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import ManageAnnouncementsClient from "@/components/ManageAnnouncementsClient";

export default async function AdminAnnouncementsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !isAdmin(session.user)) {
    redirect("/");
  }

  const announcements = await prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  // Serialize Dates
  const serializedAnnouncements = announcements.map(a => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  return (
    <div>
      <div className="mb-10">
        <p className="font-body text-[11px] tracking-[0.16em] text-navy-sky uppercase mb-3">Admin Portal</p>
        <h1 className="font-display italic text-4xl font-light text-white-pure mb-2">Announcements</h1>
        <p className="font-body text-white-muted text-base">
          Publish and manage announcements that will be displayed to all users.
        </p>
      </div>

      <ManageAnnouncementsClient initialAnnouncements={serializedAnnouncements as any} />
    </div>
  );
}

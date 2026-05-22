import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import ManageToursClient from "@/components/ManageToursClient";

export default async function AdminToursPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !isAdmin(session.user)) {
    redirect("/");
  }

  const tours = await prisma.tour.findMany({
    orderBy: {
      departureDate: "asc"
    }
  });

  // Serialize Dates
  const serializedTours = tours.map(t => ({
    ...t,
    departureDate: t.departureDate.toISOString(),
    returnDate: t.returnDate.toISOString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return (
    <div>
      <div className="mb-10">
        <p className="font-body text-[11px] tracking-[0.16em] text-navy-sky uppercase mb-3">Admin Portal</p>
        <h1 className="font-display italic text-4xl font-light text-white-pure mb-2">Manage Tours</h1>
        <p className="font-body text-white-muted text-base">
          Configure upcoming travel destinations, pricing, spots, community chat links, and enquiry contacts.
        </p>
      </div>

      <ManageToursClient initialTours={serializedTours as any} />
    </div>
  );
}

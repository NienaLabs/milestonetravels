import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import AdminSupportClient from "@/components/AdminSupportClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Enquiries | Milestone Travels",
};

export default async function AdminSupportPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !isAdmin(session.user)) {
    redirect("/");
  }

  const messages = await prisma.supportMessage.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedMessages = messages.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }));

  return (
    <div>
      <div className="mb-10">
        <p className="font-body text-[11px] tracking-[0.16em] text-navy-sky uppercase mb-3">Admin Portal</p>
        <h1 className="font-display italic text-4xl font-light text-white-pure mb-2">Support Enquiries</h1>
        <p className="font-body text-white-muted text-base">
          Messages submitted by travelers through their dashboard.
        </p>
      </div>

      <AdminSupportClient initialMessages={serializedMessages as any} />
    </div>
  );
}

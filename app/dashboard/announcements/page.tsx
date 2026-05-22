import { prisma } from "@/lib/prisma";
import { BellRing, Info, Star } from "lucide-react";

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-10">
        <p className="font-body text-[11px] tracking-[0.16em] text-navy-sky uppercase mb-3">Dashboard</p>
        <h1 className="font-display italic text-4xl font-light text-white-pure mb-2">Announcements</h1>
        <p className="font-body text-white-muted text-base">
          Stay up to date with the latest news and updates from Milestone Travels.
        </p>
      </div>

      {announcements.length === 0 ? (
        <div className="border border-white/[0.07] rounded-2xl px-10 py-16 text-center bg-white/[0.02]">
          <BellRing className="w-8 h-8 text-white-muted mx-auto mb-4" />
          <p className="font-display italic text-2xl text-white-pure/70 mb-2">Nothing yet</p>
          <p className="font-body text-sm text-white-muted">Check back soon for updates from our team.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a, i) => (
            <div
              key={a.id}
              className="bg-white/[0.025] border border-white/[0.07] hover:border-white/[0.12] rounded-2xl p-6 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  i === 0 
                    ? "bg-navy-bright/20 border border-navy-bright/30" 
                    : "bg-white/[0.05] border border-white/[0.08]"
                }`}>
                  {i === 0 ? (
                    <Star className="w-4 h-4 text-navy-sky" />
                  ) : (
                    <Info className="w-4 h-4 text-white-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-headline text-lg font-bold text-white-pure">{a.title}</h3>
                    {i === 0 && (
                      <span className="shrink-0 text-[10px] font-body font-bold tracking-wider text-navy-sky uppercase bg-navy-bright/15 border border-navy-bright/25 px-2.5 py-1 rounded-md">
                        Latest
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm text-white-muted leading-relaxed mb-3">{a.message}</p>
                  <span className="font-body text-[11px] text-white-muted/50 uppercase tracking-wider">
                    {new Date(a.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

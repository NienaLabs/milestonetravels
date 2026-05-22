"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Users, Receipt, PlusCircle, Megaphone } from "lucide-react";
import Image from "next/image";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin" || pathname.startsWith("/admin/bookings");
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-16 md:w-64 bg-[#040B22] border-r border-white/[0.06] flex flex-col z-50 transition-all duration-300">
      {/* Logo & title */}
      <div className="px-2 md:px-6 pt-8 pb-6 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center justify-center md:justify-start gap-3 group">
          <div className="w-8 h-8 rounded-md bg-navy-bright/20 border border-navy-bright/30 flex items-center justify-center shrink-0 group-hover:bg-navy-bright/30 transition-colors">
            <Globe className="w-4 h-4 text-navy-sky" />
          </div>
          <div className="hidden md:block">
            <span className="font-body font-semibold text-[12px] tracking-[0.14em] text-white-pure block">MILESTONE</span>
            <span className="font-body text-[10px] tracking-[0.1em] text-white-muted">ADMIN PORTAL</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 md:px-3 py-6 space-y-2 md:space-y-1 overflow-y-auto">
        <p className="hidden md:block text-[10px] font-body tracking-[0.14em] text-white-muted/50 uppercase px-3 mb-4">Management</p>
        
        <Link
          href="/admin"
          title="Booking Tracker"
          className={`flex items-center justify-center md:justify-start gap-3 px-3 py-3 md:py-2.5 rounded-lg text-sm font-body transition-all duration-200 ${
            isActive("/admin")
              ? "text-white-pure bg-navy-bright/20 border border-navy-bright/30"
              : "text-white-muted hover:text-white-pure hover:bg-white/[0.04]"
          }`}
        >
          <Receipt className={`w-5 h-5 md:w-4 md:h-4 shrink-0 ${isActive("/admin") ? "text-navy-bright" : "text-navy-sky"}`} />
          <span className="hidden md:block font-medium">Booking Tracker</span>
        </Link>

        <Link
          href="/admin/tours"
          title="Manage Tours"
          className={`flex items-center justify-center md:justify-start gap-3 px-3 py-3 md:py-2.5 rounded-lg text-sm font-body transition-all duration-200 ${
            isActive("/admin/tours")
              ? "text-white-pure bg-navy-bright/20 border border-navy-bright/30"
              : "text-white-muted hover:text-white-pure hover:bg-white/[0.04]"
          }`}
        >
          <PlusCircle className={`w-5 h-5 md:w-4 md:h-4 shrink-0 ${isActive("/admin/tours") ? "text-navy-bright" : "text-navy-sky"}`} />
          <span className="hidden md:block font-medium">Manage Tours</span>
        </Link>

        <Link
          href="/admin/announcements"
          title="Announcements"
          className={`flex items-center justify-center md:justify-start gap-3 px-3 py-3 md:py-2.5 rounded-lg text-sm font-body transition-all duration-200 ${
            isActive("/admin/announcements")
              ? "text-white-pure bg-navy-bright/20 border border-navy-bright/30"
              : "text-white-muted hover:text-white-pure hover:bg-white/[0.04]"
          }`}
        >
          <Megaphone className={`w-5 h-5 md:w-4 md:h-4 shrink-0 ${isActive("/admin/announcements") ? "text-navy-bright" : "text-navy-sky"}`} />
          <span className="hidden md:block font-medium">Announcements</span>
        </Link>

        <Link
          href="/admin/users"
          title="Users"
          className={`flex items-center justify-center md:justify-start gap-3 px-3 py-3 md:py-2.5 rounded-lg text-sm font-body transition-all duration-200 ${
            isActive("/admin/users")
              ? "text-white-pure bg-navy-bright/20 border border-navy-bright/30"
              : "text-white-muted hover:text-white-pure hover:bg-white/[0.04]"
          }`}
        >
          <Users className={`w-5 h-5 md:w-4 md:h-4 shrink-0 ${isActive("/admin/users") ? "text-navy-bright" : "text-navy-sky"}`} />
          <span className="hidden md:block font-medium">Users</span>
        </Link>
      </nav>

      {/* User Card */}
      <div className="px-2 md:px-3 pb-6 border-t border-white/[0.06] pt-4">
        <div className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2.5 rounded-lg md:mb-2">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "Admin"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-white/10 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-navy-bright/30 border border-navy-bright/40 flex items-center justify-center shrink-0 font-bold font-body text-xs text-navy-sky">
              {user.name?.[0]?.toUpperCase() || "A"}
            </div>
          )}
          <div className="hidden md:block min-w-0">
            <p className="font-body font-semibold text-[13px] text-white-pure truncate">{user.name}</p>
            <p className="font-body text-[11px] text-white-muted truncate">Admin Mode</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

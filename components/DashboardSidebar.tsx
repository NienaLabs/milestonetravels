"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BellRing, HeadphonesIcon, Globe, LogOut, ChevronRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "My Trips", href: "/dashboard", icon: LayoutDashboard },
  { label: "Announcements", href: "/dashboard/announcements", icon: BellRing },
  { label: "Support", href: "/dashboard/support", icon: HeadphonesIcon },
];

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-16 md:w-64 bg-white/[0.02] backdrop-blur-xl border-r border-white/[0.05] shadow-[4px_0_24px_rgba(0,0,0,0.2)] flex flex-col z-50 transition-all duration-300">
      {/* Logo */}
      <div className="px-4 md:px-6 pt-8 pb-6 border-b border-white/[0.06] flex justify-center md:justify-start">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-md bg-navy-bright/20 border border-navy-bright/30 flex items-center justify-center shrink-0 group-hover:bg-navy-bright/30 transition-colors">
            <Globe className="w-4 h-4 text-navy-sky" />
          </div>
          <div className="hidden md:block">
            <span className="font-body font-semibold text-[12px] tracking-[0.14em] text-white-pure block">MILESTONE</span>
            <span className="font-body text-[10px] tracking-[0.1em] text-white-muted">TRAVELS</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 md:px-3 py-6 space-y-2 md:space-y-1 overflow-y-auto">
        <p className="text-[10px] font-body tracking-[0.14em] text-white-muted/50 uppercase px-2 md:px-3 mb-4 hidden md:block">Navigation</p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-center md:justify-start gap-3 px-0 md:px-3 py-3 md:py-2.5 rounded-lg text-sm font-body transition-all duration-200 group relative ${
                isActive
                  ? "bg-white/15 text-white-pure border border-white/25 shadow-inner"
                  : "text-white-muted hover:text-white-pure hover:bg-white/[0.04]"
              }`}
              title={label}
            >
              <Icon className={`w-5 h-5 md:w-4 md:h-4 shrink-0 transition-colors ${isActive ? "text-white-pure" : "text-white-muted group-hover:text-white-pure"}`} />
              <span className="font-medium hidden md:block">{label}</span>
              {isActive && <ChevronRight className="w-3 h-3 ml-auto text-white-pure hidden md:block" />}
            </Link>
          );
        })}
      </nav>

      {/* User profile + sign out */}
      <div className="px-2 md:px-3 pb-6 border-t border-white/[0.06] pt-4 space-y-2 md:space-y-1">
        {/* User info */}
        <div className="flex items-center justify-center md:justify-start gap-3 px-0 md:px-3 py-2.5 rounded-lg mb-2">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-white/10 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-navy-bright/30 border border-navy-bright/40 flex items-center justify-center font-bold font-body text-xs text-navy-sky shrink-0">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="min-w-0 hidden md:block">
            <p className="font-body font-semibold text-[13px] text-white-pure truncate">{user.name}</p>
            <p className="font-body text-[11px] text-white-muted truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="w-full flex items-center justify-center md:justify-start gap-3 px-0 md:px-3 py-3 md:py-2.5 rounded-lg text-sm font-body text-white-muted hover:text-white-pure hover:bg-red-500/10 transition-all duration-200 group border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5 md:w-4 md:h-4 shrink-0 group-hover:text-red-400 transition-colors" />
          <span className="hidden md:block group-hover:text-red-400 transition-colors">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

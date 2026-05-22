"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import { usePathname } from 'next/navigation';
import { isAdmin } from '@/lib/admin';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  // Make navbar solid on pages other than home
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = isHomePage 
    ? `fixed top-0 w-full z-[9999] transition-all duration-500 ${scrolled ? 'bg-navy-deep/95 backdrop-blur-md h-16 shadow-lg shadow-navy-deep/20 border-b border-white-ghost' : 'bg-transparent h-[72px]'}`
    : 'fixed top-0 w-full z-[9999] bg-navy-deep/95 backdrop-blur-md h-16 shadow-lg shadow-navy-deep/20 border-b border-white-ghost transition-all duration-500';

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/img/logo.png" alt="Milestone Travels Logo" width={32} height={32} className="w-8 h-8 object-contain filter brightness-0 invert" />
          <span className="font-body font-medium text-[13px] tracking-[0.1em] text-white-pure hidden md:block">MILESTONE TRAVELS</span>
        </Link>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-[13px] font-body font-medium text-white-pure hover:text-navy-sky transition-colors relative group">
              HOME
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-navy-sky scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <Link href="/tours" className="text-[13px] font-body font-medium text-white-pure hover:text-navy-sky transition-colors relative group">
              TOURS
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-navy-sky scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-[13px] font-body font-medium text-navy-sky hover:text-white-pure transition-colors relative group">
                  DASHBOARD
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white-pure scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </Link>
                {isAdmin(session.user?.email) && (
                  <Link href="/admin" className="text-[13px] font-body font-medium text-navy-sky hover:text-white-pure transition-colors relative group">
                    ADMIN PORTAL
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white-pure scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Link>
                )}
              </>
            ) : null}
          </div>
          
          {session ? (
            <div className="flex items-center gap-3">
              {session.user?.image ? (
                <Image src={session.user.image} alt={session.user.name || "User"} width={32} height={32} className="rounded-full border border-white-ghost" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-navy-sky text-white-pure flex items-center justify-center font-bold font-body text-xs">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/sign-in" className="px-5 py-2 border border-white-pure text-[13px] font-bold tracking-[0.12em] text-white-pure hover:bg-navy-bright hover:border-navy-bright transition-all">
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";

import React, { useState } from "react";
import { Search, User, Mail, Calendar, MapPin } from "lucide-react";
import Image from "next/image";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  bookingsCount: number;
}

export default function ManageUsersClient({ initialUsers }: { initialUsers: PlatformUser[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = initialUsers.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center bg-white/[0.02] border border-white/[0.07] rounded-xl p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user name or email..."
            className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-navy-sky/60 focus:ring-1 focus:ring-navy-sky/30 rounded-lg pl-10 pr-4 py-2.5 font-body text-sm text-white-pure placeholder:text-white-muted/40 outline-none transition-all duration-200"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="border border-white/[0.07] rounded-2xl px-10 py-16 text-center bg-white/[0.02]">
          <p className="font-display italic text-2xl text-white-pure/70 mb-2">No users found</p>
          <p className="font-body text-sm text-white-muted">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-body text-white-muted">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] text-white-pure uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Bookings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <Image src={user.image} alt={user.name} width={40} height={40} className="rounded-full w-10 h-10 object-cover border border-white/10" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-navy-bright/20 flex items-center justify-center font-bold font-body text-sm text-navy-sky border border-navy-bright/30">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-body font-semibold text-white-pure group-hover:text-navy-sky transition-colors">{user.name}</p>
                          <p className="text-xs text-white-muted flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase border ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-white/[0.05] text-white-muted border-white/[0.1]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-navy-sky" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-navy-bright/10 text-navy-sky font-bold border border-navy-bright/20">
                        {user.bookingsCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

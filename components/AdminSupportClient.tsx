"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface SupportMessage {
  id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string; image: string | null };
}

export default function AdminSupportClient({ initialMessages }: { initialMessages: SupportMessage[] }) {
  const [messages, setMessages] = useState<SupportMessage[]>(initialMessages);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const toggleStatus = async (msg: SupportMessage) => {
    const nextStatus = msg.status === "OPEN" ? "RESOLVED" : "OPEN";
    setUpdatingId(msg.id);
    try {
      const res = await fetch(`/api/admin/support/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(messages.map((m) => (m.id === msg.id ? { ...m, status: nextStatus } : m)));
      } else {
        throw new Error(data.error || "Failed to update status");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="border border-white/[0.07] rounded-2xl px-10 py-16 text-center bg-white/[0.02]">
        <Mail className="mx-auto mb-4 text-white-muted" size={32} />
        <p className="font-display italic text-2xl text-white-pure/70 mb-2">No enquiries yet</p>
        <p className="font-body text-sm text-white-muted">Messages submitted from the traveler dashboard will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              {msg.user.image ? (
                <Image src={msg.user.image} alt={msg.user.name} width={36} height={36} className="rounded-full w-9 h-9 object-cover border border-white/10 shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-navy-bright/20 flex items-center justify-center font-bold font-body text-xs text-navy-sky border border-navy-bright/30 shrink-0">
                  {msg.user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-body font-semibold text-white-pure truncate">{msg.user.name}</p>
                <p className="text-xs text-white-muted truncate">{msg.user.email}</p>
              </div>
            </div>
            <button
              onClick={() => toggleStatus(msg)}
              disabled={updatingId === msg.id}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-colors disabled:opacity-50 ${
                msg.status === "OPEN"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
              }`}
            >
              {msg.status === "OPEN" ? <Circle size={10} /> : <CheckCircle2 size={10} />}
              {msg.status === "OPEN" ? "Open" : "Resolved"}
            </button>
          </div>
          <h3 className="font-headline text-lg font-bold text-white-pure mb-1">{msg.subject}</h3>
          <p className="font-body text-sm text-white-muted whitespace-pre-wrap mb-3">{msg.message}</p>
          <span className="text-[10px] text-white-muted/50 uppercase tracking-wider">
            {new Date(msg.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

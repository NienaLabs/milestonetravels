"use client";

import React, { useState } from "react";
import { Trash2, Megaphone, Plus } from "lucide-react";
import { toast } from "sonner";

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export default function ManageAnnouncementsClient({ initialAnnouncements }: { initialAnnouncements: Announcement[] }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setIsSubmitting(true);
    toast.loading("Publishing announcement...");

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message }),
      });

      const data = await res.json();
      toast.dismiss();

      if (res.ok && data.success) {
        toast.success("Announcement published!");
        setAnnouncements([data.announcement, ...announcements]);
        setTitle("");
        setMessage("");
        setActiveTab("list");
      } else {
        throw new Error(data.error || "Failed to publish announcement");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    toast.loading("Deleting announcement...");

    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      toast.dismiss();

      if (res.ok && data.success) {
        toast.success("Announcement deleted.");
        setAnnouncements(announcements.filter(a => a.id !== id));
      } else {
        throw new Error(data.error || "Failed to delete announcement");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/[0.06] pb-px">
        <button
          onClick={() => setActiveTab("list")}
          className={`pb-4 px-2 font-body text-sm font-medium border-b-2 transition-all duration-200 ${
            activeTab === "list"
              ? "border-navy-sky text-white-pure"
              : "border-transparent text-white-muted hover:text-white-pure"
          }`}
        >
          Active Announcements ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`pb-4 px-2 font-body text-sm font-medium border-b-2 transition-all duration-200 ${
            activeTab === "add"
              ? "border-navy-sky text-white-pure"
              : "border-transparent text-white-muted hover:text-white-pure"
          }`}
        >
          Publish New
        </button>
      </div>

      {activeTab === "list" && (
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="border border-white/[0.07] rounded-2xl px-10 py-16 text-center bg-white/[0.02]">
              <p className="font-display italic text-2xl text-white-pure/70 mb-2">No announcements</p>
              <p className="font-body text-sm text-white-muted mb-6">Publish an announcement to notify your users.</p>
              <button
                onClick={() => setActiveTab("add")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white-pure text-navy-deep font-body font-semibold text-sm rounded-lg hover:bg-white-soft transition-colors"
              >
                Publish New <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-navy-bright/15 border border-navy-bright/20 flex items-center justify-center shrink-0 mt-1">
                  <Megaphone className="w-4 h-4 text-navy-sky" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-headline text-lg font-bold text-white-pure">{announcement.title}</h3>
                      <p className="font-body text-[10px] text-white-muted uppercase tracking-wider mt-1">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-body text-sm text-white-muted whitespace-pre-wrap mt-3">{announcement.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "add" && (
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl">
          <h2 className="font-headline text-2xl font-bold mb-6 text-white-pure">Publish Announcement</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-body text-[11px] tracking-[0.14em] text-white-muted uppercase mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. New Maldives Tour Available!"
                className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-navy-sky/60 focus:ring-1 focus:ring-navy-sky/30 rounded-lg px-4 py-3 font-body text-sm text-white-pure placeholder:text-white-muted/40 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-body text-[11px] tracking-[0.14em] text-white-muted uppercase mb-2">
                Message *
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Write the announcement details here..."
                className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-navy-sky/60 focus:ring-1 focus:ring-navy-sky/30 rounded-lg px-4 py-3 font-body text-sm text-white-pure placeholder:text-white-muted/40 outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-navy-bright text-white-pure font-body font-bold tracking-widest uppercase rounded-xl hover:bg-navy-sky transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSubmitting ? "Publishing..." : "Publish Now"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

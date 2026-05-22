"use client";

import React, { useState } from "react";
import { Send, MessageSquare, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent!", {
        description: "Our team will respond within 24 hours.",
      });
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div>
      <div className="mb-10">
        <p className="font-body text-[11px] tracking-[0.16em] text-navy-sky uppercase mb-3">Dashboard</p>
        <h1 className="font-display italic text-4xl font-light text-white-pure mb-2">Support</h1>
        <p className="font-body text-white-muted text-base">
          Have a question or need assistance? We&apos;re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact form — takes up 3/5 */}
        <div className="lg:col-span-3 bg-white/[0.025] border border-white/[0.07] rounded-2xl p-8">
          <h2 className="font-headline text-xl font-bold text-white-pure mb-6">Send an Enquiry</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-body text-[11px] tracking-[0.14em] text-white-muted uppercase mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Booking inquiry for Maldives tour"
                className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-navy-sky/60 focus:ring-1 focus:ring-navy-sky/30 rounded-lg px-4 py-3 font-body text-sm text-white-pure placeholder:text-white-muted/40 outline-none transition-all duration-200"
              />
            </div>
            <div>
              <label className="block font-body text-[11px] tracking-[0.14em] text-white-muted uppercase mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Describe your enquiry in detail..."
                className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-navy-sky/60 focus:ring-1 focus:ring-navy-sky/30 rounded-lg px-4 py-3 font-body text-sm text-white-pure placeholder:text-white-muted/40 outline-none transition-all duration-200 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-white-pure text-navy-deep font-body font-semibold text-sm rounded-lg hover:bg-white-soft transition-colors disabled:opacity-60 shadow-md"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact info — takes up 2/5 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/[0.025] border border-white/[0.07] rounded-2xl p-6">
            <h3 className="font-headline text-base font-bold text-white-pure mb-4">Other Ways to Reach Us</h3>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "hello@milestonetravels.com" },
                { icon: Phone, label: "Phone", value: "+1 (800) 555-0123" },
                { icon: MessageSquare, label: "WhatsApp", value: "+1 (800) 555-0199" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-navy-bright/15 border border-navy-bright/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-navy-sky" />
                  </div>
                  <div>
                    <p className="font-body text-[11px] text-white-muted uppercase tracking-wider">{label}</p>
                    <p className="font-body text-sm text-white-pure">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-navy-bright/10 border border-navy-bright/20 rounded-2xl p-6">
            <p className="font-body text-[11px] tracking-[0.12em] text-navy-sky uppercase mb-2">Response Time</p>
            <p className="font-headline text-2xl font-bold text-white-pure mb-1">Within 24 hrs</p>
            <p className="font-body text-sm text-white-muted leading-relaxed">
              Our team is available Monday through Saturday, 9 AM – 6 PM GMT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

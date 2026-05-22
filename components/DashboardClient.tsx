"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Send, Info, Lock, Unlock } from 'lucide-react';
import Image from 'next/image';

export default function DashboardClient({ bookings, announcements, user }: any) {
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject || !supportMessage) {
      toast.error('Please fill in all fields.');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Your enquiry has been sent. Our support team will get back to you shortly.');
      setSupportSubject('');
      setSupportMessage('');
      setIsSubmitting(false);
    }, 1500);
  };

  const handleJoinChat = (booking: any) => {
    const isUnlocked = booking.amountPaid >= (booking.totalPrice / 2);
    if (!isUnlocked) {
      toast.error('Please pay at least 50% of the tour price to unlock this group chat.');
      return;
    }
    // Redirect to group link
    if (booking.tour.groupChatLink) {
      window.open(booking.tour.groupChatLink, '_blank');
    } else {
      toast.info('The group chat link for this tour is not available yet.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Bookings */}
      <div className="lg:col-span-2 space-y-8">
        <h2 className="font-headline text-2xl font-bold border-b border-glass-border pb-4">My Booked Trips</h2>
        
        {bookings.length === 0 ? (
          <div className="bg-glass-card border border-glass-border rounded-2xl p-8 text-center backdrop-blur-md shadow-2xl">
            <p className="text-white-muted font-body mb-6">You haven&apos;t booked any tours yet.</p>
            <Link href="/tours" className="inline-block py-3 px-8 bg-white-pure text-navy-deep font-bold font-body text-xs tracking-widest uppercase rounded hover:bg-white-soft transition-colors shadow-lg">
              Explore Tours
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking: any) => {
              const progressPercentage = Math.min(100, Math.round((booking.amountPaid / booking.totalPrice) * 100));
              const isUnlocked = booking.amountPaid >= (booking.totalPrice / 2);
              
              return (
                <div key={booking.id} className="bg-glass-card border border-glass-border rounded-2xl p-6 backdrop-blur-md hover:border-glass-border-hover transition-colors shadow-xl">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 h-40 relative rounded-xl overflow-hidden shrink-0 border border-white-ghost">
                      {booking.tour.image ? (
                        <Image src={booking.tour.image} alt={booking.tour.title} fill className="object-cover" />
                      ) : (
                        <div className="bg-navy-deep w-full h-full" />
                      )}
                      <div className="absolute top-2 right-2 bg-navy-deep/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-white/10">
                        {booking.status}
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-headline text-xl font-bold mb-1">{booking.tour.title}</h3>
                        <p className="font-body text-white-muted text-sm mb-4">
                          {new Date(booking.tour.departureDate).toLocaleDateString()} - {new Date(booking.tour.returnDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-[11px] font-body text-white-muted mb-2 uppercase tracking-wider">
                            <span>Payment Progress</span>
                            <span className="text-navy-sky font-bold">${booking.amountPaid.toFixed(2)} / ${booking.totalPrice.toFixed(2)}</span>
                          </div>
                          <div className="w-full h-2.5 bg-navy-deep rounded-full overflow-hidden border border-white-ghost">
                            <div 
                              className={`h-full transition-all duration-1000 ${progressPercentage >= 100 ? 'bg-[#34A853]' : 'bg-navy-sky'}`} 
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <div className="mt-2 text-right text-[10px] text-white-muted font-body">
                            {progressPercentage}% Paid
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button 
                            onClick={() => handleJoinChat(booking)}
                            className={`flex items-center gap-2 py-2.5 px-4 rounded-lg text-[11px] font-bold font-body tracking-wider uppercase transition-colors shadow-md ${
                              isUnlocked 
                                ? 'bg-white-pure text-navy-deep hover:bg-white-soft' 
                                : 'bg-navy-deep text-white-muted border border-glass-border hover:border-white-muted'
                            }`}
                          >
                            {isUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            Join Tour Group
                          </button>
                          
                          {progressPercentage < 100 && (
                            <Link 
                              href={`/checkout/${booking.tour.id}`}
                              className="flex items-center gap-2 py-2.5 px-4 bg-navy-bright text-white-pure rounded-lg text-[11px] font-bold font-body tracking-wider uppercase hover:bg-navy-sky transition-colors shadow-md hover:shadow-navy-bright/30"
                            >
                              Pay Remaining
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column: Announcements & Support */}
      <div className="space-y-8">
        <div>
          <h2 className="font-headline text-2xl font-bold border-b border-glass-border pb-4 mb-6">Announcements</h2>
          <div className="bg-glass-card border border-glass-border rounded-2xl p-6 backdrop-blur-md space-y-4 shadow-xl">
            {announcements.length === 0 ? (
              <p className="text-white-muted font-body text-sm text-center py-4">No new announcements.</p>
            ) : (
              announcements.map((announcement: any) => (
                <div key={announcement.id} className="border-b border-white-ghost pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-navy-sky/20 flex items-center justify-center text-navy-sky border border-navy-sky/30">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-body font-bold text-sm mb-1">{announcement.title}</h4>
                      <p className="font-body text-white-muted text-[13px] leading-relaxed mb-2">{announcement.message}</p>
                      <span className="text-[10px] text-white-muted/50 uppercase tracking-wider">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold border-b border-glass-border pb-4 mb-6">Support & Enquiries</h2>
          <div className="bg-glass-card border border-glass-border rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white-muted font-bold mb-2">Subject</label>
                <input 
                  type="text" 
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className="w-full bg-navy-deep/80 border border-glass-border rounded-lg py-3 px-4 font-body text-sm text-white-pure outline-none focus:border-navy-sky focus:ring-1 focus:ring-navy-sky transition-all"
                  placeholder="What is your enquiry about?"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white-muted font-bold mb-2">Message</label>
                <textarea 
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-navy-deep/80 border border-glass-border rounded-lg py-3 px-4 font-body text-sm text-white-pure outline-none focus:border-navy-sky focus:ring-1 focus:ring-navy-sky transition-all resize-none"
                  placeholder="Type your message here..."
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3.5 bg-white-pure text-navy-deep font-bold font-body text-xs uppercase tracking-widest rounded-lg hover:bg-white-soft transition-colors disabled:opacity-50 shadow-lg"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#040a22] text-white-soft pt-24 pb-10 overflow-hidden border-t border-white/5">
      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,_var(--navy-sky)_0%,_transparent_70%)] opacity-10 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Brand */}
          <div className="col-span-1">
            <h2 className="text-3xl font-headline font-bold text-white-pure tracking-widest uppercase mb-6">
              Milestone<span className="text-navy-sky">.</span>
            </h2>
            <p className="font-body text-sm leading-relaxed mb-8 pr-4">
              We curate premium, unforgettable travel experiences. From luxury stays to expert guided tours, your journey to the extraordinary begins here.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-navy-sky hover:border-navy-sky hover:-translate-y-1 transition-all duration-300 text-white-pure">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-navy-sky hover:border-navy-sky hover:-translate-y-1 transition-all duration-300 text-white-pure">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-navy-sky hover:border-navy-sky hover:-translate-y-1 transition-all duration-300 text-white-pure">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-headline font-bold text-white-pure uppercase tracking-wider mb-8">Explore</h3>
            <ul className="flex flex-col gap-4 font-body text-sm">
              <li><a href="#" className="hover:text-navy-sky transition-colors flex items-center gap-3 group"><span className="w-1.5 h-1.5 bg-navy-sky rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Upcoming Tours</a></li>
              <li><a href="#" className="hover:text-navy-sky transition-colors flex items-center gap-3 group"><span className="w-1.5 h-1.5 bg-navy-sky rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Flight Bookings</a></li>
              <li><a href="#" className="hover:text-navy-sky transition-colors flex items-center gap-3 group"><span className="w-1.5 h-1.5 bg-navy-sky rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Luxury Stays</a></li>
              <li><a href="#" className="hover:text-navy-sky transition-colors flex items-center gap-3 group"><span className="w-1.5 h-1.5 bg-navy-sky rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> About Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-headline font-bold text-white-pure uppercase tracking-wider mb-8">Contact</h3>
            <ul className="flex flex-col gap-6 font-body text-sm">
              <li className="flex gap-4 items-start">
                <div className="text-navy-sky shrink-0 mt-1"><MapPin size={20} /></div>
                <div>
                  <span className="block text-white-pure font-medium mb-1">Head Office</span>
                  Airport Residential Area, Accra
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="text-navy-sky shrink-0 mt-1"><Phone size={20} /></div>
                <div>
                  <span className="block text-white-pure font-medium mb-1">Call / WhatsApp</span>
                  <a href="https://wa.me/233548133096" className="hover:text-navy-sky transition-colors block mb-1">054 813 3096</a>
                  <a href="tel:0240865502" className="hover:text-navy-sky transition-colors block">024 086 5502</a>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="text-navy-sky shrink-0 mt-1"><Mail size={20} /></div>
                <div>
                  <span className="block text-white-pure font-medium mb-1">Email</span>
                  <a href="mailto:hello@milestonetravels.com" className="hover:text-navy-sky transition-colors">hello@milestonetravels.com</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-headline font-bold text-white-pure uppercase tracking-wider mb-8">Newsletter</h3>
            <p className="font-body text-sm leading-relaxed mb-6">
              Subscribe to get exclusive access to our newest luxury tour packages and travel tips.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm text-white-pure focus:outline-none focus:border-navy-sky transition-colors"
              />
              <button aria-label="Subscribe" className="absolute right-2 top-2 bottom-2 aspect-square bg-navy-sky rounded-full flex items-center justify-center text-white-pure hover:scale-105 transition-transform duration-300">
                <Send size={16} className="-ml-1" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-body text-white-muted">
          <p>&copy; {new Date().getFullYear()} Milestone Travels. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white-pure transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white-pure transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

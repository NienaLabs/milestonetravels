"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRouter } from 'next/navigation';
import { usePaystackPayment } from 'react-paystack';
import { toast } from 'sonner';
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Globe2,
  Lock,
  MapPin,
  ShieldCheck,
  Loader2,
  Calendar,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CheckoutFormProps {
  tour: {
    id: string;
    title: string;
    price: number;
    image: string | null;
    departureDate: string;
    returnDate: string;
    destination?: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  booking?: {
    id: string;
    amountPaid: number;
  };
}

function fmtGhs(value: number) {
  return `GH₵${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CheckoutForm({ tour, user, booking }: CheckoutFormProps) {
  const router = useRouter();
  
  const amountPaidSoFar = booking?.amountPaid || 0;
  const remainingAmount = Math.max(0, tour.price - amountPaidSoFar);

  const [mode, setMode] = useState<'full' | 'deposit'>('deposit');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const minDeposit = Math.min(Math.max(0.1 * tour.price, 1), remainingAmount);
  const [deposit, setDeposit] = useState<string | number>(minDeposit);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.anim-left', 
      { opacity: 0, y: 18 }, 
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }
    );
    gsap.fromTo('.anim-right', 
      { opacity: 0, y: 18 }, 
      { opacity: 1, y: 0, duration: 0.6, delay: 0.08, ease: 'power2.out' }
    );
  }, { scope: containerRef });
  
  const depositValue = typeof deposit === 'string' ? (deposit === '' ? 0 : Number(deposit)) : deposit;
  const amount = mode === 'full' ? remainingAmount : depositValue;

  const config = {
    reference: `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    email: user.email,
    amount: Math.round(amount * 100), // amount in pesewas
    currency: 'GHS',
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: any) => {
    setIsProcessing(true);
    toast.loading('Verifying payment securely...', { id: 'payment-toast' });
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: reference.reference,
          tourId: tour.id,
          totalTourPrice: tour.price,
          amountToPay: amount
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Payment successful! Booking confirmed.', { id: 'payment-toast' });
        router.push('/dashboard');
      } else {
        throw new Error(data.error || 'Payment verification failed');
      }
    } catch (error: any) {
      toast.error(error.message, { id: 'payment-toast' });
      setIsProcessing(false);
    }
  };

  const onClose = () => {
    toast.error('Payment cancelled.');
    setIsProcessing(false);
  };

  const handlePayment = async () => {
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }

    if (amount < minDeposit) {
      toast.error(`Minimum deposit is ${fmtGhs(minDeposit)}`);
      return;
    }

    if (amount > remainingAmount) {
      toast.error(`Payment cannot exceed the remaining balance of ${fmtGhs(remainingAmount)}`);
      return;
    }

    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      toast.error("Paystack public key not found. Please check your environment variables.");
      return;
    }

    setIsProcessing(true);
    initializePayment({ onSuccess, onClose });
  };

  return (
    <div className="text-white" ref={containerRef}>
      <div className="relative py-8 lg:py-10">
      
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="anim-left space-y-6 opacity-0">
            
            {/* The woman image placed directly on top of the left card */}
            <div className="relative -mb-4 z-10 px-4 md:px-12 flex justify-center drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
              <Image
                src="/img/checkout-woman.png"
                alt="Smiling woman"
                width={1464}
                height={628}
                className="w-full max-w-lg object-contain"
                priority
              />
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a192f] shadow-2xl shadow-black/40 backdrop-blur-xl relative pt-16">
              <div className="relative p-6 md:p-8">
                {/* Subtle Background Effects */}
                <div className="absolute inset-0 bg-linear-to-t from-[#06111d] to-transparent opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(125,211,252,0.05),transparent_60%)]" />

                <div className="relative flex flex-col justify-between">
                  <div className="space-y-6 text-center">
                    <div className="max-w-2xl mx-auto space-y-3">
                      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl text-white">
                        Complete your trip with confidence.
                      </h1>
                      <p className="max-w-xl mx-auto text-sm leading-6 text-white/60 md:text-base">
                        A calmer, premium checkout experience from Milestones Travels.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-8 pt-6 border-t border-white/10">
                      <div className="flex flex-col items-center text-white/80 gap-1.5">
                        <MapPin className="h-5 w-5 text-cyan-400" />
                        <p className="text-sm font-medium">{tour.destination || 'Global'}</p>
                      </div>
                      <div className="flex flex-col items-center text-white/80 gap-1.5">
                        <Calendar className="h-5 w-5 text-cyan-400" />
                        <p className="text-sm font-medium">
                          {new Date(tour.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'})} - {new Date(tour.returnDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'})}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 px-4 pt-4">
              {[
                ['01', 'Choose your payment style'],
                ['02', 'Review your destination details'],
                ['03', 'Pay securely and confirm'],
              ].map(([step, desc]) => (
                <div key={desc} className="flex items-center gap-4">
                  <CheckCircle2 className="h-5 w-5 text-cyan-500 shrink-0" />
                  <span className="text-base text-white/70">{desc}</span>
                </div> 
              ))}
            </div>
          </div>

          <div className="anim-right space-y-6 lg:sticky lg:top-8 opacity-0">
            <Card className="overflow-hidden border-white/10 bg-[#0a192f] shadow-2xl shadow-black/40 backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="border-b border-white/10 p-6 bg-white/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-1">Booking summary</p>
                      <h2 className="text-xl font-semibold text-white/90">{tour.title}</h2>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-6">
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-4">
                    <span className="text-white/60">Total price</span>
                    <span className="font-semibold text-lg text-white">{fmtGhs(tour.price)}</span>
                  </div>
                  
                  {amountPaidSoFar > 0 && (
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-4">
                      <span className="text-white/60">Amount paid</span>
                      <span className="font-semibold text-lg text-emerald-400">-{fmtGhs(amountPaidSoFar)}</span>
                    </div>
                  )}

                  <div className="grid gap-3">
                    <ToggleCard
                      active={mode === 'full'}
                      title={amountPaidSoFar > 0 ? "Pay remaining balance" : "Pay in full"}
                      desc={amountPaidSoFar > 0 ? "Complete your payment now." : "Simple, complete booking flow."}
                      value={fmtGhs(remainingAmount)}
                      icon={<CreditCard className="h-4 w-4" />}
                      onClick={() => setMode('full')}
                    />
                    <ToggleCard
                      active={mode === 'deposit'}
                      title={amountPaidSoFar > 0 ? "Pay partial amount" : "Reserve with deposit"}
                      desc={amountPaidSoFar > 0 ? "Pay what you can now." : "Secure your booking now, pay the rest later."}
                      value={`From ${fmtGhs(minDeposit)}`}
                      icon={<Lock className="h-4 w-4" />}
                      onClick={() => setMode('deposit')}
                    />
                  </div>

                  {mode === 'deposit' && (
                    <div className="space-y-2 rounded-2xl border border-white/10 bg-[#06111d] p-4">
                      <div className="flex items-center justify-between text-sm text-white/70">
                        <span>Deposit amount</span>
                      </div>
                      <Input
                        type="number"
                        step="any"
                        min={minDeposit}
                        max={remainingAmount}
                        value={deposit}
                        onChange={(e) => setDeposit(e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                        onKeyDown={(e) => {
                          // Prevent arrow up/down from changing the value
                          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                            e.preventDefault();
                          }
                        }}
                        className="h-12 border-white/10 bg-[#0a192f] text-white placeholder:text-white/30 rounded-xl focus:border-cyan-500"
                      />
                      <p className="text-xs text-white/45 mt-1">
                        Minimum: {fmtGhs(minDeposit)}
                      </p>
                    </div>
                  )}

                  {/* Trust icons */}
                  <div className="flex items-center justify-around py-3 border-y border-white/10 bg-white/5 rounded-2xl">
                    <div className="flex flex-col items-center gap-1.5 text-white/50">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-white/50">
                      <Globe2 className="h-5 w-5 text-sky-400" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Global</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-white/50">
                      <Lock className="h-5 w-5 text-cyan-400" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Encrypted</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-white/60">
                    <Row label="Traveler" value={user.name} />
                    <Row label="Email" value={user.email} />
                  </div>

                  <div className="pt-4 flex items-end justify-between border-t border-white/10">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Due now</p>
                      <p className="text-2xl font-bold text-white">{fmtGhs(amount)}</p>
                    </div>
                    <Button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#06111d] transition-all font-semibold px-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay securely
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

function ToggleCard({
  active,
  title,
  desc,
  value,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  desc: string;
  value: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-3xl border p-4 text-left transition-all duration-200 ${
        active
          ? 'border-cyan-300/40 bg-cyan-300/10 shadow-lg shadow-cyan-500/10'
          : 'border-white/10 bg-white/5 hover:bg-white/8'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-white/75">
            {icon}
            <span className="font-medium">{title}</span>
          </div>
          <p className="text-sm leading-6 text-white/50">{desc}</p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <p className="text-sm font-medium text-white">{value}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/35">{active ? 'Selected' : 'Choose'}</p>
        </div>
      </div>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}

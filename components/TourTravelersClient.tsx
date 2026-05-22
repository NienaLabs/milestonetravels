"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeft, Search, Users, TrendingUp, CheckCircle2,
  Clock, XCircle, Plus, X, ArrowRight, ChevronLeft, ChevronRight,
  MapPin, Filter, Edit2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

interface Payment {
  id: string;
  amount: number;
  method: string;
  reference: string;
  createdAt: string;
}

interface Booking {
  id: string;
  userId: string;
  totalPrice: number;
  amountPaid: number;
  status: string;
  createdAt: string;
  user: { id: string; name: string; email: string; image: string | null };
  payments: Payment[];
}

interface Tour {
  id: string;
  title: string;
  destination: string;
  price: number;
  spots: number;
  bookings: Booking[];
}

const PAGE_SIZE = 20;

type FilterStatus = "all" | "paid" | "partial" | "unpaid";

function getPaymentStatus(b: Booking): FilterStatus {
  if (b.amountPaid >= b.totalPrice) return "paid";
  if (b.amountPaid > 0) return "partial";
  return "unpaid";
}

export default function TourTravelersClient({ tour: initialTour }: { tour: Tour }) {
  const router = useRouter();
  const [tour, setTour] = useState<Tour>(initialTour);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualEmail, setManualEmail] = useState("");
  const [manualAmountPaid, setManualAmountPaid] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Payment State
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editPaymentAmount, setEditPaymentAmount] = useState<number | "">("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // Derived stats
  const paid = tour.bookings.filter((b) => getPaymentStatus(b) === "paid").length;
  const partial = tour.bookings.filter((b) => getPaymentStatus(b) === "partial").length;
  const unpaid = tour.bookings.filter((b) => getPaymentStatus(b) === "unpaid").length;
  const totalRevenue = tour.bookings.reduce((s, b) => s + b.amountPaid, 0);
  const expectedRevenue = tour.bookings.reduce((s, b) => s + b.totalPrice, 0);
  const fillPct = tour.spots ? Math.round((tour.bookings.length / tour.spots) * 100) : 0;

  // Filtered + paginated bookings
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tour.bookings.filter((b) => {
      const matchesSearch =
        !q ||
        b.user.name.toLowerCase().includes(q) ||
        b.user.email.toLowerCase().includes(q);
      const matchesStatus =
        filterStatus === "all" || getPaymentStatus(b) === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [tour.bookings, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (f: FilterStatus) => {
    setFilterStatus(f);
    setPage(1);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail) return;
    setIsSubmitting(true);
    try {
      const payload = { 
        tourId: tour.id, 
        email: manualEmail,
        amountPaid: manualAmountPaid !== "" ? Number(manualAmountPaid) : 0
      };
      const res = await fetch("/api/admin/bookings/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Booking registered.");
        setTour((prev) => ({
          ...prev,
          bookings: [data.booking, ...prev.bookings],
        }));
        setIsModalOpen(false);
        setManualEmail("");
        setManualAmountPaid("");
      } else throw new Error(data.error || "Failed");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking || editPaymentAmount === "") return;
    setIsEditSubmitting(true);
    try {
      const res = await fetch("/api/admin/bookings/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: editingBooking.id,
          amountPaid: Number(editPaymentAmount)
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Payment updated successfully.");
        setTour((prev) => ({
          ...prev,
          bookings: prev.bookings.map(b => b.id === editingBooking.id ? data.booking : b),
        }));
        setIsEditPaymentOpen(false);
        setEditingBooking(null);
        setEditPaymentAmount("");
      } else throw new Error(data.error || "Failed");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const openEditModal = (booking: Booking) => {
    setEditingBooking(booking);
    setEditPaymentAmount(booking.amountPaid);
    setIsEditPaymentOpen(true);
  };

  return (
    <>

      <div className="tt-root">
        {/* Back */}
        <button className="back-btn" onClick={() => router.push("/admin")}>
          <ArrowLeft size={15} /> All Tours
        </button>

        {/* Header */}
        <div className="ph">
          <div className="ph-left">
            <div className="ph-dest"><MapPin size={10} /> {tour.destination}</div>
            <h1 className="ph-title">{tour.title}</h1>
          </div>
          <button className="register-btn" onClick={() => { setManualEmail(""); setIsModalOpen(true); }}>
            <Plus size={15} /> Register Manually
          </button>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat">
            <div className="stat-label">Total Travelers</div>
            <div className="stat-val">{tour.bookings.length}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Fully Paid</div>
            <div className="stat-val green">{paid}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Revenue Collected</div>
            <div className="stat-val"><sup>GH₵</sup>{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Outstanding</div>
            <div className="stat-val amber">
              <sup>GH₵</sup>{(expectedRevenue - totalRevenue).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="progress-card">
          <div className="progress-label-wrap">
            <div className="progress-title">Capacity — {tour.bookings.length} of {tour.spots} spots filled</div>
            <div className="progress-track">
              <div
                className={`progress-fill ${fillPct >= 100 ? "full" : fillPct >= 50 ? "half" : "low"}`}
                style={{ width: `${Math.min(fillPct, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="progress-pct">{fillPct}%</div>
            <div className="progress-sub">{Math.max(0, tour.spots - tour.bookings.length)} remaining</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="filter-group">
            {(["all", "paid", "partial", "unpaid"] as FilterStatus[]).map((f) => (
              <button
                key={f}
                className={`filter-btn ${filterStatus === f ? "active" : ""}`}
                onClick={() => handleFilterChange(f)}
              >
                {f === "all" ? `All (${tour.bookings.length})` :
                 f === "paid" ? `Paid (${paid})` :
                 f === "partial" ? `Partial (${partial})` :
                 `Unpaid (${unpaid})`}
              </button>
            ))}
          </div>
          <span className="result-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Traveler</th>
                <th>Total Price</th>
                <th>Amount Paid</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan={6}>
                    <div className="empty-inner">
                      <div className="empty-icon"><Users size={20} /></div>
                      <div className="empty-title">No travelers found</div>
                      <div className="empty-sub">Try adjusting your search or filter</div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((b) => {
                  const pct = Math.min(100, Math.round((b.amountPaid / b.totalPrice) * 100));
                  const status = getPaymentStatus(b);
                  const fillClass = pct >= 100 ? "full" : pct >= 50 ? "half" : "low";

                  return (
                    <tr key={b.id}>
                      <td>
                        <div className="user-cell">
                          <div className="avatar">
                            {b.user.image ? (
                              <Image
                                src={b.user.image}
                                alt={b.user.name}
                                width={34}
                                height={34}
                                className="avatar-img"
                              />
                            ) : (
                              b.user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="user-name">{b.user.name}</div>
                            <div className="user-email">{b.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="currency-cell"><sup>GH₵</sup>{b.totalPrice.toLocaleString()}</td>
                      <td className="currency-cell">
                        <div className="flex items-center gap-2">
                          <span><sup>GH₵</sup>{b.amountPaid.toLocaleString()}</span>
                          <button 
                            onClick={() => openEditModal(b)}
                            className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-md transition-colors"
                            title="Edit Payment"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="progress-mini-wrap">
                          <div className="progress-mini-header">
                            <span className="progress-mini-pct">
                              {pct}%
                            </span>
                          </div>
                          <div className="progress-mini-track">
                            <div
                              className={`progress-mini-fill ${fillClass}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${status === "paid" ? "pill-paid" : status === "partial" ? "pill-partial" : "pill-unpaid"}`}>
                          {status === "paid" ? <CheckCircle2 size={10} /> : status === "partial" ? <Clock size={10} /> : <XCircle size={10} />}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td className="date-cell">
                        {new Date(b.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <span className="page-info">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="page-btns">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
                    ) : (
                      <button
                        key={p}
                        className={`page-btn ${p === page ? "current" : ""}`}
                        onClick={() => setPage(p as number)}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030614]/80 backdrop-blur-md p-4" onClick={() => setIsModalOpen(false)}>
          <div 
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0a1646]/90 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5 bg-white/5">
              <h2 className="text-lg font-semibold text-white tracking-tight">Register Traveler Manually</h2>
              <button 
                className="rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleManualSubmit}>
              <div className="p-6 space-y-5">
                <div className="rounded-lg border-l-4 border-cyan-400 bg-cyan-400/10 p-3 text-sm text-white/80 leading-relaxed shadow-inner">
                  Creates a booking for <strong className="text-white font-semibold">{tour.title}</strong>. The traveler must already exist in the system.
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
                      Traveler Email Address <span className="text-amber-400">*</span>
                    </label>
                    <input
                      className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-cyan-400 focus:bg-black/40 focus:ring-2 focus:ring-cyan-400/20"
                      type="email"
                      required
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      placeholder="traveler@example.com"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
                      Amount Paid So Far
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/50">GH₵</span>
                      <input
                        className="w-full rounded-xl border border-white/10 bg-black/25 pl-12 pr-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-cyan-400 focus:bg-black/40 focus:ring-2 focus:ring-cyan-400/20"
                        type="number"
                        min="0"
                        step="0.01"
                        value={manualAmountPaid}
                        onChange={(e) => setManualAmountPaid(e.target.value ? Number(e.target.value) : "")}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 border-t border-white/10 bg-black/20 p-5">
                <button 
                  type="button" 
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-all" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-bold text-[#0a1646] hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><span className="h-4 w-4 rounded-full border-2 border-[#0a1646]/30 border-t-[#0a1646] animate-spin" /> Processing…</>
                  ) : (
                    <>Register <ArrowRight size={14} /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {isEditPaymentOpen && editingBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030614]/80 backdrop-blur-md p-4" onClick={() => setIsEditPaymentOpen(false)}>
          <div 
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0a1646]/90 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5 bg-white/5">
              <h2 className="text-lg font-semibold text-white tracking-tight">Update Payment</h2>
              <button 
                className="rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                onClick={() => setIsEditPaymentOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleEditPaymentSubmit}>
              <div className="p-6 space-y-5">
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex justify-between items-center text-sm text-white/70">
                    <span>Traveler:</span>
                    <span className="font-semibold text-white">{editingBooking.user.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-white/70">
                    <span>Total Tour Price:</span>
                    <span className="font-semibold text-white">GH₵{editingBooking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
                    New Amount Paid <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/50">GH₵</span>
                    <input
                      className="w-full rounded-xl border border-white/10 bg-black/25 pl-12 pr-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-cyan-400 focus:bg-black/40 focus:ring-2 focus:ring-cyan-400/20"
                      type="number"
                      min="0"
                      max={editingBooking.totalPrice}
                      step="0.01"
                      required
                      value={editPaymentAmount}
                      onChange={(e) => setEditPaymentAmount(e.target.value ? Number(e.target.value) : "")}
                      placeholder="0.00"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 border-t border-white/10 bg-black/20 p-5">
                <button 
                  type="button" 
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-all" 
                  onClick={() => setIsEditPaymentOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-bold text-[#0a1646] hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={isEditSubmitting}
                >
                  {isEditSubmitting ? (
                    <><span className="h-4 w-4 rounded-full border-2 border-[#0a1646]/30 border-t-[#0a1646] animate-spin" /> Saving…</>
                  ) : (
                    <>Save Changes <CheckCircle2 size={14} /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
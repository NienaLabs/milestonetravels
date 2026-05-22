"use client";

import React, { useState } from "react";
import { Search, Globe, MapPin, Users, TrendingUp, ArrowRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function BookingTrackerClient({ initialTours }: { initialTours: Tour[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const tours = initialTours;

  const totalBookings = tours.reduce((s, t) => s + t.bookings.length, 0);
  const totalRevenue = tours.reduce(
    (s, t) => s + t.bookings.reduce((bs, b) => bs + b.amountPaid, 0),
    0
  );
  const avgFill = tours.length
    ? Math.round(
        tours.reduce((s, t) => s + (t.bookings.length / (t.spots || 1)) * 100, 0) / tours.length
      )
    : 0;

  const filteredTours = tours.filter((tour) => {
    const q = searchTerm.toLowerCase();
    return (
      tour.title.toLowerCase().includes(q) ||
      tour.destination.toLowerCase().includes(q)
    );
  });

  return (
    <>

      <div className="bt-root">
        {/* Stats */}
        <div className="stats">
          <div className="stat">
            <div className="stat-icon"><Globe size={18} /></div>
            <div className="stat-content">
              <div className="stat-label">Active Tours</div>
              <div className="stat-val">{tours.length}</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon"><Users size={18} /></div>
            <div className="stat-content">
              <div className="stat-label">Total Bookings</div>
              <div className="stat-val">{totalBookings}</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon"><TrendingUp size={18} /></div>
            <div className="stat-content">
              <div className="stat-label">Revenue Collected</div>
              <div className="stat-val"><sup>GH₵</sup>{totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-wrap">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by tour name or destination…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="result-count">{filteredTours.length} tour{filteredTours.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Grid */}
        <div className="tour-grid">
          {filteredTours.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><Globe size={22} /></div>
              <div className="empty-title">No tours found</div>
              <div className="empty-sub">Try a different search term</div>
            </div>
          ) : (
            filteredTours.map((tour) => {
              const fillPct = tour.spots ? Math.round((tour.bookings.length / tour.spots) * 100) : 0;
              const fillClass = fillPct >= 100 ? "full" : fillPct >= 50 ? "half" : "low";

              const paid = tour.bookings.filter(
                (b) => b.amountPaid >= b.totalPrice
              ).length;
              const partial = tour.bookings.filter(
                (b) => b.amountPaid > 0 && b.amountPaid < b.totalPrice
              ).length;
              const unpaid = tour.bookings.filter((b) => b.amountPaid === 0).length;

              return (
                <div key={tour.id} className="tour-card">
                  <div className="card-top">
                    <div className="card-dest">
                      <MapPin size={10} />
                      {tour.destination}
                    </div>
                    <div className="card-title">{tour.title}</div>

                    <div className="card-meta">
                      <div className="meta-item">
                        <div className="meta-label">Price / Person</div>
                        <div className="meta-val">
                          <span className="currency">GH₵</span>
                          {tour.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="meta-item">
                        <div className="meta-label">Travelers</div>
                        <div className="meta-val">
                          {tour.bookings.length}
                          <span className="sub"> / {tour.spots || "∞"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="fill-section">
                      <div className="fill-header">
                        <span className="fill-header-label">Capacity</span>
                        <span className={`fill-pct ${fillClass}`}>{fillPct}%</span>
                      </div>
                      <div className="fill-track">
                        <div
                          className={`fill-bar ${fillClass}`}
                          style={{ width: `${Math.min(fillPct, 100)}%` }}
                        />
                      </div>
                    </div>

                    {tour.bookings.length > 0 && (
                      <div className="payment-pills">
                        {paid > 0 && <span className="ppill paid">{paid} Paid</span>}
                        {partial > 0 && <span className="ppill partial">{partial} Partial</span>}
                        {unpaid > 0 && <span className="ppill unpaid">{unpaid} Unpaid</span>}
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <span className="footer-note">
                      {tour.spots - tour.bookings.length > 0
                        ? `${tour.spots - tour.bookings.length} spot${tour.spots - tour.bookings.length !== 1 ? "s" : ""} remaining`
                        : "Fully booked"}
                    </span>
                    <a
                      href={`/admin/bookings/${tour.id}`}
                      className="view-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/admin/bookings/${tour.id}`);
                      }}
                    >
                      View Travelers <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
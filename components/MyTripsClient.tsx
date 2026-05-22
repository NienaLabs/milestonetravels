"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, Unlock, ArrowRight, MapPin, Calendar, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  tourId: string;
  totalPrice: number;
  amountPaid: number;
  status: string;
  createdAt: string;
  tour: {
    id: string;
    title: string;
    destination: string;
    image: string | null;
    departureDate: string;
    returnDate: string;
    groupChatLink: string | null;
  };
}


/* ─── Flight Arc ─────────────────────────────────────────── */
function FlightArc({ bookingCreatedAt, departureDate, id }: {
  bookingCreatedAt: string;
  departureDate: string;
  id: string;
}) {
  const now      = Date.now();
  const created  = new Date(bookingCreatedAt).getTime();
  const departs  = new Date(departureDate).getTime();

  const totalMs  = departs - created;
  const elapsed  = now - created;
  const progress = Math.min(1, Math.max(0, totalMs > 0 ? elapsed / totalMs : 1));

  const daysLeft = Math.max(0, Math.ceil((departs - now) / 86400000));
  const alreadyDeparted = now >= departs;

  const W = 320; const H = 70;
  const x0 = 16; const y0 = 54;
  const x1 = W - 16; const y1 = 54;
  const cx = W / 2; const cy = 8;

  const bezier = (t: number) => ({
    x: (1-t)*(1-t)*x0 + 2*(1-t)*t*cx + t*t*x1,
    y: (1-t)*(1-t)*y0 + 2*(1-t)*t*cy + t*t*y1,
  });

  const tangent = (t: number) => {
    const dx = 2*(1-t)*(cx-x0) + 2*t*(x1-cx);
    const dy = 2*(1-t)*(cy-y0) + 2*t*(y1-cy);
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const planePos   = bezier(progress);
  const planeAngle = tangent(progress);
  const fullArc    = `M ${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}`;

  const steps = 40;
  const traveledPoints = Array.from({ length: steps + 1 }, (_, i) => {
    const t = (i / steps) * progress;
    const p = bezier(t);
    return `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }).join(" ");

  const depLabel   = new Date(departureDate).toLocaleDateString("en-US", { day: "numeric", month: "short" });
  const todayLabel = new Date().toLocaleDateString("en-US", { day: "numeric", month: "short" });
  const gradId     = `arc-grad-${id}`;

  return (
    <div className="flight-arc" aria-label={alreadyDeparted ? "Trip has departed" : `${daysLeft} days until departure`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="flight-arc__svg"
        aria-hidden="true"
        overflow="visible"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <path d={fullArc} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4 5" strokeLinecap="round" />

        {progress > 0.01 && (
          <path d={traveledPoints} fill="none" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" />
        )}

        <circle cx={x0} cy={y0} r="3.5" fill="#38bdf8" opacity="0.7" />
        <circle cx={x0} cy={y0} r="6" fill="#38bdf8" opacity="0.1" />
        <circle cx={x1} cy={y1} r="3.5" fill={alreadyDeparted ? "#34d399" : "rgba(255,255,255,0.25)"} opacity="0.7" />
        <circle cx={x1} cy={y1} r="6" fill={alreadyDeparted ? "#34d399" : "white"} opacity="0.06" />

        <g
          transform={`translate(${planePos.x.toFixed(2)}, ${planePos.y.toFixed(2)}) rotate(${planeAngle.toFixed(1)})`}
          className="flight-arc__plane"
        >
          <g transform="translate(-7,-7) scale(0.9)">
            <path
              d="M8 2 C8 2 14 5 14 8 L14 9 L10 8 L10 14 L12 14 L12 15 L8 14 L4 15 L4 14 L6 14 L6 8 L2 9 L2 8 C2 5 8 2 8 2Z"
              fill="white" opacity="0.92"
            />
          </g>
        </g>

        <text x={x0} y={y0 + 13} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="var(--font-body, sans-serif)" letterSpacing="0.04em">{todayLabel}</text>
        <text x={x1} y={y1 + 13} textAnchor="middle" fontSize="8" fill={alreadyDeparted ? "rgba(52,211,153,0.7)" : "rgba(255,255,255,0.4)"} fontFamily="var(--font-body, sans-serif)" letterSpacing="0.04em">{depLabel}</text>
      </svg>

      <div className="flight-arc__label">
        {alreadyDeparted ? (
          <span className="flight-arc__label--departed">Departed</span>
        ) : daysLeft === 0 ? (
          <span className="flight-arc__label--urgent">Departs today</span>
        ) : (
          <>
            <span className="flight-arc__label--days">{daysLeft}</span>
            <span className="flight-arc__label--unit">day{daysLeft !== 1 ? "s" : ""} to departure</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Empty State ───────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="trips-empty">
      <div className="trips-empty__inner">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="trips-empty__icon" aria-hidden="true">
          <circle cx="28" cy="28" r="27" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <path d="M28 14 L32 24 L44 24 L34 31 L38 42 L28 35 L18 42 L22 31 L12 24 L24 24 Z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
        </svg>
        <p className="trips-empty__title">No trips booked yet</p>
        <p className="trips-empty__sub">Your next adventure is one click away.</p>
        <Link href="/tours" className="trips-empty__cta">
          Explore Tours <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

/* ─── Trip Card ─────────────────────────────────────────── */
function TripCard({ booking }: { booking: Booking }) {
  const pct        = Math.min(100, Math.round((booking.amountPaid / booking.totalPrice) * 100));
  const isUnlocked = booking.amountPaid >= booking.totalPrice / 2;
  const isPaidFull = pct >= 100;
  const remaining  = booking.totalPrice - booking.amountPaid;

  const handleJoinChat = () => {
    if (!isUnlocked) {
      toast.error("Pay at least 50% to unlock the community group.", {
        description: `You've paid ${pct}% so far.`,
      });
      return;
    }
    if (booking.tour.groupChatLink) {
      window.open(booking.tour.groupChatLink, "_blank");
    } else {
      toast.info("Group link hasn't been shared yet. Check back soon.");
    }
  };

  const dep    = new Date(booking.tour.departureDate);
  const ret    = new Date(booking.tour.returnDate);

  // ── Notch mask via ResizeObserver ───────────────────────────
  // objectBoundingBox distorts circle arcs on non-square elements.
  // Instead we measure the card's real pixel size and build a
  // precise SVG mask-image data URL in userSpace coordinates.
  const cardRef = React.useRef<HTMLElement>(null);
  const [maskUrl, setMaskUrl] = React.useState<string>("");

  React.useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const r = 20; // notch radius in px — large and clearly visible

    const rebuild = (w: number, h: number) => {
      // Notch sits at vertical midpoint of the card
      const ny = h / 2;
      const path = [
        `M0,0 L${w},0`,
        `L${w},${ny - r}`,
        // Right notch: arc bites inward from the right edge
        `A${r},${r},0,0,0,${w},${ny + r}`,
        `L${w},${h} L0,${h}`,
        `L0,${ny + r}`,
        // Left notch: arc bites inward from the left edge
        `A${r},${r},0,0,0,0,${ny - r}`,
        `Z`,
      ].join(" ");

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${path}" fill="white"/></svg>`;
      const encoded = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      setMaskUrl(encoded);
    };

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      rebuild(width, height);
    });
    ro.observe(el);
    // Initial paint
    rebuild(el.offsetWidth, el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      className="trip-card"
      style={
        maskUrl
          ? {
              WebkitMaskImage: maskUrl,
              maskImage: maskUrl,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
            }
          : undefined
      }
    >
      {/* Ambient glow */}
      <div
        className="trip-card__glow"
        style={{ opacity: isPaidFull ? 0.18 : isUnlocked ? 0.10 : 0.04 }}
      />

      {/* ── Left: image / visual panel ── */}
      <div className="trip-card__visual">
        {booking.tour.image ? (
          <Image
            src={booking.tour.image}
            alt={booking.tour.title}
            fill
            sizes="280px"
            className="trip-card__img"
          />
        ) : (
          <div className="trip-card__img-placeholder">
            <svg viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
              <defs>
                <linearGradient id={`ph-sky-${booking.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0a1628" />
                  <stop offset="60%" stopColor="#0d2145" />
                  <stop offset="100%" stopColor="#071120" />
                </linearGradient>
                <radialGradient id={`ph-glow-${booking.id}`} cx="50%" cy="65%" r="45%">
                  <stop offset="0%" stopColor="#1e6ea6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0a1628" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="240" height="320" fill={`url(#ph-sky-${booking.id})`} />
              <rect width="240" height="320" fill={`url(#ph-glow-${booking.id})`} />
              {[
                [30,40],[60,25],[95,50],[130,30],[165,20],[200,45],
                [45,80],[80,95],[115,75],[150,90],[185,65],[220,85],
              ].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r={Math.random()>0.5?1:0.6} fill="white" opacity={0.3+Math.random()*0.5} />
              ))}
              <circle cx="170" cy="55" r="18" fill="#fef3c7" opacity="0.12" />
              <circle cx="162" cy="50" r="15" fill={`url(#ph-sky-${booking.id})`} />
              <ellipse cx="120" cy="210" rx="90" ry="30" fill="#1e6ea6" opacity="0.15" />
              <polygon points="0,230 60,140 110,200 160,120 220,185 240,200 240,320 0,320" fill="#071120" opacity="0.9" />
              <polygon points="0,260 40,190 80,230 120,170 170,210 200,195 240,230 240,320 0,320" fill="#040d1a" />
              <text x="120" y="292" textAnchor="middle" fontSize="11" fill="white" opacity="0.35"
                fontFamily="var(--font-body, sans-serif)" letterSpacing="3">
                {booking.tour.destination.toUpperCase()}
              </text>
            </svg>
          </div>
        )}

        {/* Destination label — only location, no nights */}
        <div className="trip-card__dest">
          <MapPin className="w-2.5 h-2.5" aria-hidden="true" />
          {booking.tour.destination}
        </div>

        {/* Vertical status strip */}
        <div className={`trip-card__strip ${isPaidFull ? "trip-card__strip--full" : isUnlocked ? "trip-card__strip--half" : ""}`} />
      </div>

      {/* ── Right: content panel ── */}
      <div className="trip-card__body">

        {/* Header row — no status badge */}
        <div className="trip-card__header">
          <div className="flex-1 min-w-0">
            <h3 className="trip-card__title">{booking.tour.title}</h3>
            <div className="trip-card__dates">
              <Calendar className="w-3 h-3 shrink-0" aria-hidden="true" />
              {dep.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
              {" → "}
              {ret.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>

        <div className="trip-card__divider" />

        <FlightArc
          bookingCreatedAt={booking.createdAt}
          departureDate={booking.tour.departureDate}
          id={booking.id}
        />

        <div className="trip-card__divider" />

        {/* Payment section */}
        <div className="trip-card__payment">
          <div className="trip-card__payment-row">
            <div className="trip-card__payment-col">
              <span className="trip-card__label">
                <CreditCard className="w-3 h-3" aria-hidden="true" /> Paid
              </span>
              <span className="trip-card__amount-paid">
                GH₵{booking.amountPaid.toLocaleString()}
              </span>
            </div>
            <div className="trip-card__payment-col trip-card__payment-col--right">
              <span className="trip-card__label">Total</span>
              <span className="trip-card__amount-total">
                GH₵{booking.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="trip-card__progress-wrap">
            <div className="trip-card__progress-track">
              <div
                className={`trip-card__progress-fill ${isPaidFull ? "trip-card__progress-fill--full" : ""}`}
                style={{ width: `${pct}%` }}
              />
              <div className="trip-card__progress-marker" />
            </div>
            <div className="trip-card__progress-meta">
              <span className={`trip-card__progress-pct ${isPaidFull ? "trip-card__progress-pct--full" : isUnlocked ? "trip-card__progress-pct--half" : ""}`}>
                {pct}% complete
              </span>
              {!isPaidFull && (
                <span className="trip-card__progress-remain">
                  GH₵{remaining.toLocaleString()} left
                </span>
              )}
            </div>
          </div>

          {!isUnlocked && (
            <div className="trip-card__lock-hint">
              <Lock className="w-3 h-3 shrink-0" aria-hidden="true" />
              Pay 50% to unlock community access
            </div>
          )}
        </div>

        <div className="trip-card__divider" />

        {/* Actions */}
        <div className="trip-card__actions">
          <button
            onClick={handleJoinChat}
            className={`trip-card__btn ${isUnlocked ? "trip-card__btn--primary" : "trip-card__btn--locked"}`}
          >
            {isUnlocked
              ? <><Unlock className="w-3.5 h-3.5" /> Join Community</>
              : <><Lock className="w-3.5 h-3.5" /> Community Locked</>
            }
          </button>

          {!isPaidFull && (
            <Link
              href={`/checkout/${booking.tour.id}`}
              className="trip-card__btn trip-card__btn--pay"
            >
              Continue Paying <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

      </div>
    </article>
  );
}

/* ─── Main export ───────────────────────────────────────── */
export default function MyTripsClient({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) return <EmptyState />;

  return (
    <section className="trips-list" aria-label="Your bookings">
      <p className="trips-list__eyebrow">Your Bookings</p>
      <div className="trips-list__grid">
        {bookings.map((b) => <TripCard key={b.id} booking={b} />)}
      </div>
    </section>
  );
}
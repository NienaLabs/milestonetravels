"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface TourWithReviews {
  id: string;
  title: string;
  destination: string;
  reviews: Review[];
}

export default function AdminReviewsClient({ tour }: { tour: TourWithReviews }) {
  // Calculate average rating
  const avgRating = tour.reviews.length > 0
    ? (tour.reviews.reduce((acc, r) => acc + r.rating, 0) / tour.reviews.length).toFixed(1)
    : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        
        .admin-reviews-root { --gold: #C9A96E; --gold-pale: rgba(201,169,110,0.12); --gold-line: rgba(201,169,110,0.25); --surface: rgba(255,255,255,0.03); --border: rgba(255,255,255,0.07); --text: #F5F0E8; --muted: rgba(245,240,232,0.45); --ink: #0E0C09; }
        .admin-reviews-root { font-family: 'DM Sans', sans-serif; color: var(--text); }
        .font-display { font-family: 'Cormorant Garamond', serif; }

        .back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); text-decoration: none; margin-bottom: 2rem; transition: color 0.2s; }
        .back-link:hover { color: var(--gold); }

        .header-stats { display: flex; align-items: center; gap: 1.5rem; margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 1rem; }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-label { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }
        .stat-val { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; line-height: 1; color: var(--gold); display: flex; align-items: center; gap: 8px; }
        .stat-val span.sub { font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: var(--text); margin-left: 4px; }

        .reviews-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; margin-top: 3rem; }
        
        .review-card { background: #0E0C09; border: 1px solid var(--border); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .review-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .reviewer-name { font-size: 0.9rem; font-weight: 500; color: var(--text); margin-bottom: 4px; }
        .review-date { font-size: 0.65rem; color: var(--muted); letter-spacing: 0.05em; }
        .review-stars { display: flex; gap: 2px; color: var(--gold); }
        .review-comment { font-size: 0.8rem; line-height: 1.6; color: rgba(245,240,232,0.8); }

        .empty-state { padding: 5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-top: 2rem; background: var(--surface); border: 1px dashed var(--border); }
        .empty-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-style: italic; font-weight: 300; color: var(--muted); }
        .empty-sub { font-size: 0.8rem; color: var(--muted); opacity: 0.8; max-width: 400px; line-height: 1.5; }
      `}</style>

      <div className="admin-reviews-root">
        <Link href="/admin/tours" className="back-link">
          <ArrowLeft size={14} /> Back to Tours
        </Link>

        <div>
          <p className="font-body text-[11px] tracking-[0.16em] text-navy-sky uppercase mb-3" style={{ color: "var(--gold)" }}>
            Tour Feedback
          </p>
          <h1 className="font-display italic text-4xl font-light text-white-pure mb-2">
            Reviews for {tour.title}
          </h1>
          <p className="font-body text-white-muted text-base" style={{ color: "var(--muted)" }}>
            Destination: {tour.destination}
          </p>

          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">Total Reviews</span>
              <span className="stat-val">{tour.reviews.length}</span>
            </div>
            {tour.reviews.length > 0 && (
              <div className="stat-item">
                <span className="stat-label">Average Rating</span>
                <span className="stat-val">
                  {avgRating} <Star size={18} fill="currentColor" style={{ marginLeft: 4 }} />
                </span>
              </div>
            )}
          </div>
        </div>

        {tour.reviews.length === 0 ? (
          <div className="empty-state">
            <MessageSquare size={32} style={{ color: "var(--gold)", opacity: 0.5 }} />
            <p className="empty-title">No reviews yet</p>
            <p className="empty-sub">Share the public review link with your customers to start collecting feedback for this tour.</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {tour.reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div>
                    <div className="reviewer-name">{review.reviewerName}</div>
                    <div className="review-date">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="review-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? "currentColor" : "none"}
                        color={i < review.rating ? "currentColor" : "rgba(255,255,255,0.1)"}
                      />
                    ))}
                  </div>
                </div>
                <div className="review-comment">
                  &ldquo;{review.comment}&rdquo;
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

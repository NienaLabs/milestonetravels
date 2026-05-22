"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface TourPreview {
  id: string;
  title: string;
  destination: string;
  image: string | null;
}

export default function ReviewFormClient({ tour }: { tour: TourPreview }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please provide your name.");
    if (rating === 0) return toast.error("Please select a rating.");
    if (!comment.trim()) return toast.error("Please write a review comment.");

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${tour.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerName: name, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      setIsSuccess(true);
      toast.success("Thank you for your review!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="review-root">
        <div className="success-card">
          <div className="success-icon"><CheckCircle size={48} strokeWidth={1.5} /></div>
          <h1 className="success-title">Thank You</h1>
          <p className="success-text">Your review for {tour.title} has been submitted successfully. We appreciate your feedback!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-root">

      <div className="review-container">
        <div className="tour-sidebar">
          <div className="tour-image-wrap">
            {tour.image ? (
              <Image src={tour.image} alt={tour.title} fill className="tour-sidebar-img" />
            ) : (
              <div className="tour-img-fallback-dark" />
            )}
          </div>
          <div className="tour-overlay" />
          <div className="tour-content">
            <div className="tour-dest">{tour.destination}</div>
            <h2 className="tour-title">{tour.title}</h2>
            <p className="tour-desc">We hope you enjoyed your journey with Milestone Travels. Please share your experience.</p>
          </div>
        </div>

        <div className="form-section">
          <div className="form-header">
            <h1 className="form-title">Leave a Review</h1>
            <p className="form-subtitle">Your feedback helps us improve future journeys.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Overall Rating</label>
              <div className="rating-stars" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${(hoverRating || rating) >= star ? "active" : ""}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                  >
                    <Star size={28} fill={(hoverRating || rating) >= star ? "currentColor" : "none"} strokeWidth={1} />
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Your Name</label>
              <input
                type="text"
                className="field-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Your Review</label>
              <textarea
                className="field-input"
                placeholder="Tell us about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <><span className="spinner" /> Submitting...</>
              ) : (
                <>Submit Review <ArrowRight size={14} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

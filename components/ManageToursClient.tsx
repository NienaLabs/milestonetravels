"use client";

import React, { useState, useRef } from "react";
import { Plus, Trash2, Calendar, PhoneCall, Link2, MapPin, Users, Upload, X, ArrowRight, Sparkles, MessageSquare, Copy } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface Tour {
  id: string;
  title: string;
  destination: string;
  description: string;
  departureDate: string;
  returnDate: string;
  price: number;
  image: string | null;
  spots: number;
  groupChatLink: string | null;
  enquiryPhone: string | null;
}

const PRESET_IMAGES = [
  { label: "Default Maldives", url: "/img/auth-travel.png" },
  { label: "Tropical Beach Resort", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
  { label: "European Holiday", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" },
  { label: "African Safari", url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80" },
];

function getDuration(dep: string, ret: string) {
  const d1 = new Date(dep);
  const d2 = new Date(ret);
  const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? `${diff}D / ${diff - 1}N` : "—";
}

export default function ManageToursClient({ initialTours }: { initialTours: Tour[] }) {
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const copyReviewLink = (tourId: string) => {
    const link = `${window.location.origin}/review/${tourId}`;
    navigator.clipboard.writeText(link);
    toast.success("Review link copied to clipboard");
  };

  // Form State
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [spots, setSpots] = useState("20");
  const [groupChatLink, setGroupChatLink] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destination || !description || !departureDate || !returnDate || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);

    try {
      let finalImageUrl = image;

      if (imageFile) {
        setIsUploading(true);
        setUploadProgress(0);

        // Simulate progress while uploading
        const progressInterval = setInterval(() => {
          setUploadProgress((p) => {
            if (p >= 85) { clearInterval(progressInterval); return p; }
            return p + Math.random() * 12;
          });
        }, 200);

        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        clearInterval(progressInterval);
        setUploadProgress(100);
        await new Promise((r) => setTimeout(r, 400));
        setIsUploading(false);

        if (!uploadRes.ok) throw new Error(uploadData.error || "Failed to upload image");
        finalImageUrl = uploadData.url;
      }

      const res = await fetch("/api/admin/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, destination, description, departureDate, returnDate,
          price: parseFloat(price), image: finalImageUrl,
          spots: parseInt(spots),
          groupChatLink: groupChatLink || null,
          enquiryPhone: enquiryPhone || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Tour deployed successfully.");
        setTours([data.tour, ...tours]);
        setActiveTab("list");
        setTitle(""); setDestination(""); setDescription("");
        setDepartureDate(""); setReturnDate(""); setPrice("");
        setImage(PRESET_IMAGES[0].url); setSpots("20");
        setGroupChatLink(""); setEnquiryPhone(""); setImageFile(null);
        setUploadProgress(0);
      } else {
        throw new Error(data.error || "Failed to add tour");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tour and all associated bookings?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/tours/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Tour removed.");
        setTours(tours.filter((t) => t.id !== id));
      } else throw new Error(data.error || "Failed to delete tour");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>

      <div className="tours-root">
        {/* Tabs */}
        <div className="tab-rail">
          <button className={`tab-btn ${activeTab === "list" ? "active" : ""}`} onClick={() => setActiveTab("list")}>
            Active Tours <span className="tab-count">{tours.length}</span>
          </button>
          <button className={`tab-btn ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}>
            Deploy New Tour
          </button>
        </div>

        {/* ─── LIST ─── */}
        {activeTab === "list" && (
          <>
            {tours.length === 0 ? (
              <div className="empty-state">
                <Sparkles size={40} style={{ color: "var(--navy-bright)", opacity: 0.8 }} />
                <p className="empty-title">No journeys configured yet</p>
                <p className="empty-sub">Create your first highly curated tour to display it to travelers on the platform.</p>
                <button className="cta-btn" onClick={() => setActiveTab("add")}>
                  Deploy First Tour <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="tours-grid">
                {tours.map((tour) => (
                  <div key={tour.id} className="tour-card">
                    <div className="tour-card-img">
                      {tour.image ? (
                        <Image src={tour.image} alt={tour.title} fill style={{ objectFit: "cover" }} sizes="400px" />
                      ) : (
                        <div className="tour-img-fallback" />
                      )}
                      <div className="tour-card-img-overlay" />
                      <div className="tour-destination-badge">
                        <MapPin size={12} style={{ color: "var(--gold)" }} />
                        <span>{tour.destination}</span>
                      </div>
                      <div className="tour-price-badge">
                        <div className="currency">GH₵</div>
                        <div className="price">{tour.price.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="tour-card-body">
                      <div>
                        <h3 className="tour-title">{tour.title}</h3>
                        <p className="tour-desc">{tour.description}</p>
                      </div>

                      <div className="tour-meta">
                        <div className="meta-row">
                          <span className="meta-label"><Calendar size={14} /> Duration</span>
                          <span className="meta-val">
                            {new Date(tour.departureDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                            {" — "}
                            {new Date(tour.returnDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            <span className="tour-duration-chip">
                              {getDuration(tour.departureDate, tour.returnDate)}
                            </span>
                          </span>
                        </div>
                        <div className="meta-row">
                          <span className="meta-label"><Link2 size={14} /> Community</span>
                          <span className="meta-val">{tour.groupChatLink ? "Linked" : "Not set"}</span>
                        </div>
                        <div className="meta-row">
                          <span className="meta-label"><PhoneCall size={14} /> Enquiries</span>
                          <span className="meta-val">{tour.enquiryPhone || "—"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="tour-card-footer">
                      <div className="footer-row-1">
                        <span className="spots-tag">
                          <span className="dot" />
                          {tour.spots} spots remaining
                        </span>
                        <button
                          className="del-btn"
                          onClick={() => handleDelete(tour.id)}
                          disabled={deletingId === tour.id}
                        >
                          {deletingId === tour.id ? <span className="spinner spinner-del" /> : <Trash2 size={14} />}
                          Remove
                        </button>
                      </div>
                      <div className="footer-row-2">
                        <Link href={`/admin/tours/${tour.id}/reviews`} className="action-btn">
                          <MessageSquare size={14} /> Reviews
                        </Link>
                        <button className="action-btn" onClick={() => copyReviewLink(tour.id)}>
                          <Copy size={14} /> Copy Link
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ─── ADD FORM ─── */}
        {activeTab === "add" && (
          <div className="form-wrap">
            <div className="form-header">
              <h2 className="form-headline">Deploy a <em>New Journey</em></h2>
              <p className="form-subline">Complete the specifications below to publish an ultra-premium tour to travelers.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Section: Basics */}
              <div className="form-section">
                <div className="section-label">Tour Identity</div>
                <div className="field-row cols-2" style={{ marginBottom: "1.25rem" }}>
                  <div className="field-group">
                    <label className="field-label">Title <span className="field-required">*</span></label>
                    <input className="field-input" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Maldives Editorial Odyssey" />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Destination <span className="field-required">*</span></label>
                    <input className="field-input" type="text" required value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Maldives" />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Description <span className="field-required">*</span></label>
                  <textarea className="field-input" required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the itinerary highlights, luxury inclusions, and experience..." />
                </div>
              </div>

              {/* Section: Schedule */}
              <div className="form-section">
                <div className="section-label">Schedule & Pricing</div>
                <div className="field-row cols-2" style={{ marginBottom: "1.25rem" }}>
                  <div className="field-group">
                    <label className="field-label">Departure Date <span className="field-required">*</span></label>
                    <input className="field-input" type="date" required value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Return Date <span className="field-required">*</span></label>
                    <input className="field-input" type="date" required value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                  </div>
                </div>
                <div className="field-row cols-2">
                  <div className="field-group">
                    <label className="field-label">Price (GH₵) <span className="field-required">*</span></label>
                    <input className="field-input" type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 15000" />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Available Spots <span className="field-required">*</span></label>
                    <input className="field-input" type="number" required value={spots} onChange={(e) => setSpots(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Section: Contact */}
              <div className="form-section">
                <div className="section-label">Community & Contact</div>
                <div className="field-row cols-2">
                  <div className="field-group">
                    <label className="field-label">Group Chat Link</label>
                    <input className="field-input" type="url" value={groupChatLink} onChange={(e) => setGroupChatLink(e.target.value)} placeholder="WhatsApp / Telegram URL" />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Enquiry Phone</label>
                    <input className="field-input" type="tel" value={enquiryPhone} onChange={(e) => setEnquiryPhone(e.target.value)} placeholder="+233 55 123 4567" />
                  </div>
                </div>
              </div>

              {/* Section: Image */}
              <div className="form-section">
                <div className="section-label">Stunning Cover Image</div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setImageFile(e.target.files[0]);
                      const reader = new FileReader();
                      reader.onload = (ev) => setImage(ev.target?.result as string);
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
                <div
                  className={`upload-zone ${imageFile || image !== PRESET_IMAGES[0].url ? "has-image" : ""}`}
                  onClick={() => !imageFile && fileInputRef.current?.click()}
                >
                  {imageFile || image ? (
                    <>
                      <Image src={image} alt="Preview" fill style={{ objectFit: "cover" }} />
                      <div className="upload-overlay" />
                      <button
                        type="button"
                        className="upload-change"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      >
                        <Upload size={14} /> Change image
                      </button>
                      {imageFile && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setImageFile(null); setImage(PRESET_IMAGES[0].url); }}
                          className="upload-remove-btn"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="upload-icon"><Upload size={24} /></div>
                      <span className="upload-text">Upload High-Res Image</span>
                      <span className="upload-hint">JPG, PNG, WEBP · Max 10MB</span>
                    </>
                  )}
                </div>

                {/* Progress Bar */}
                {isUploading && (
                  <div className="progress-wrap">
                    <div className="progress-label">
                      <span>Uploading stunning visual</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner" />
                    {isUploading ? "Uploading..." : "Deploying Tour..."}
                  </>
                ) : (
                  <>Deploy Premium Tour <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
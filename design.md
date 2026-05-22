# MILESTONE TRAVELS — LANDING PAGE DESIGN SYSTEM
### "Milestones to Memories" · Scroll-Triggered Cinematic Experience

---

## 0. CONCEPT & VISION

**The Big Idea:** The entire page is a *journey*. The user doesn't scroll a website — they board a flight. From takeoff to destination, every section is a chapter in a single, unbroken cinematic timeline. GSAP's ScrollTrigger drives one master timeline that breathes, morphs, and reveals the world of Milestone Travels.

**The One Thing People Will Remember:** A horizontal flight path line — animated SVG — that traces across/through the page as you scroll, connecting every section like a boarding pass itinerary, with a small plane icon riding the path in real time.

**Tone:** *Luxury Editorial meets Cinematic Cartography* — bold navy authority, crisp white clarity, electric blue energy. Not a budget airline. Not a stiff corporate travel desk. A premium storytelling experience for people who believe travel is transformation.

---

## 1. BRAND EXTRACTION (from flyer)

### Logo & Tagline
- **Brand Name:** MILESTONE TRAVELS
- **Tagline:** "Milestones to Memories"
- **CTA Tagline:** "Let's Plan Your Next Journey"
- **Logo Style:** Geometric "M" formed by two overlapping triangular chevrons (like wings or mountain peaks), white on navy
- **Phone:** 0548133096 / 024 086 5502

### Services (8 total)
1. Flight Bookings — Domestic & international reservations at best fares
2. Hotel Reservations — Comfortable stays tailored to budget & preference
3. Visa Assistance — Guidance & support for visa applications made simple
4. Tour Packages — Exciting holiday packages for leisure, adventure & group travel
5. Travel Consultation — Personalized travel advice to plan your perfect trip
6. Group & Corporate Travel — Tailored solutions for businesses, conferences, events
7. Furnished Apartment Rentals — Fully furnished apartments for short & long stays
8. Car Rentals — Wide range of well-maintained vehicles at competitive rates

### Why Choose Us (5 points)
- Reliable & Professional Service
- Best Prices & Great Deals
- 24/7 Customer Support
- Fast & Hassle-Free Bookings
- Customer Satisfaction Guaranteed

---

## 2. COLOR SYSTEM

```css
:root {
  /* PRIMARY PALETTE — navy + white, true to the brand */
  --navy-deep:      #071135;   /* Deepest navy — hero bg, footer, preloader */
  --navy-core:      #0D1F6E;   /* Primary brand navy — headers, section bgs */
  --navy-mid:       #1A3399;   /* Mid navy — icon circles, card accents */
  --navy-bright:    #2B4FD4;   /* Electric royal blue — CTAs, hover states, glows */
  --navy-sky:       #3B6FE8;   /* Sky blue — gradient highlights, shimmer */
  --white-pure:     #FFFFFF;   /* Pure white — logo, headlines, primary text */
  --white-soft:     #EEF2FF;   /* Blue-tinted white — body text on dark */
  --white-muted:    rgba(238, 242, 255, 0.6);  /* Subdued text, captions */
  --white-ghost:    rgba(255, 255, 255, 0.08); /* Ghost card fills */

  /* ATMOSPHERIC / DEPTH */
  --glass-card:     rgba(13, 31, 110, 0.5);    /* Glassmorphism card fill */
  --glass-border:   rgba(255, 255, 255, 0.12); /* Glass card border */
  --glass-border-hover: rgba(59, 111, 232, 0.6); /* Hover border — electric blue */
  --deep-shadow:    rgba(7, 17, 53, 0.9);       /* Heavy card shadows */
  --blue-glow:      rgba(43, 79, 212, 0.35);    /* Glow for icons, flight path */

  /* SECTION BACKGROUNDS — alternating, all blue family */
  --bg-hero:     #071135;   /* Deepest — hero */
  --bg-story:    #0A1A55;   /* Story section */
  --bg-services: #0D1F6E;   /* Services — core navy */
  --bg-trust:    #071135;   /* Trust section — back to deep */
  --bg-cta:      #050D2A;   /* Near-black navy — maximum contrast for CTA */
  --bg-footer:   #050D2A;   /* Same as CTA, seamless */

  /* FUNCTIONAL */
  --text-primary:   #FFFFFF;
  --text-secondary: rgba(238, 242, 255, 0.75);
  --text-muted:     rgba(238, 242, 255, 0.45);
  --text-on-light:  #0D1F6E;
  --border-subtle:  rgba(255, 255, 255, 0.08);
  --border-active:  rgba(59, 111, 232, 0.7);

  /* ACCENT — the ONLY non-blue/white color, used ultra-sparingly */
  /* The checkmark icons on the flyer have a tiny yellow tick inside the blue circle */
  --tick-accent:  #F5D020;   /* Used ONLY for: checkmark ticks, active progress dots */
}
```

### Color Logic
- **Everything is navy + white.** The palette has depth through value — dark navy to electric royal blue, not through hue variety.
- **White is the accent.** On dark sections, white text and white borders do the work that gold was doing before.
- **Electric blue (`--navy-bright`, `--navy-sky`)** handles hover states, glows, the flight path line, and CTA buttons — it reads as vibrant against the deep navy without introducing a new color.
- **`--tick-accent` (yellow)** is used for exactly one thing: the checkmark tick marks in "Why Choose Us" — matching the flyer precisely. Nowhere else.
- **Glassmorphism cards** use a blue-tinted glass fill with white borders — they glow blue on hover, not gold.

---

## 3. TYPOGRAPHY SYSTEM

### Font Stack (3 fonts — Google Fonts)

```css
/* IMPORT */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');

:root {
  --font-display:  'Cormorant Garamond', Georgia, serif;
    /* Use for: hero headline, section numbers, pull quotes, italic accents */
    /* Character: old-world elegance, travel journals, cartographic */

  --font-headline: 'Playfair Display', Georgia, serif;
    /* Use for: section headings H2/H3, card titles, "Why Choose Us" */
    /* Character: editorial authority, high-end magazine, confident */

  --font-body:     'DM Sans', system-ui, sans-serif;
    /* Use for: body copy, nav, buttons, labels, service descriptions */
    /* Character: clean, modern, legible, premium without being stiff */
}
```

### Type Scale

```css
/* DISPLAY — Cormorant Garamond */
.type-hero        { font: 700 clamp(64px, 10vw, 140px)/0.9 var(--font-display); letter-spacing: -0.02em; }
.type-hero-italic { font: 300 italic clamp(48px, 7vw, 100px)/1.0 var(--font-display); }
.type-section-num { font: 300 clamp(120px, 18vw, 200px)/1 var(--font-display); opacity: 0.06; }

/* HEADLINE — Playfair Display */
.type-h2    { font: 700 clamp(36px, 5vw, 64px)/1.1 var(--font-headline); letter-spacing: -0.01em; }
.type-h3    { font: 700 clamp(22px, 3vw, 32px)/1.2 var(--font-headline); }
.type-card  { font: 700 clamp(18px, 2.5vw, 24px)/1.3 var(--font-headline); }

/* BODY — DM Sans */
.type-body   { font: 400 clamp(15px, 1.8vw, 18px)/1.7 var(--font-body); }
.type-label  { font: 500 11px/1 var(--font-body); letter-spacing: 0.15em; text-transform: uppercase; }
.type-nav    { font: 500 14px/1 var(--font-body); letter-spacing: 0.08em; }
.type-button { font: 700 13px/1 var(--font-body); letter-spacing: 0.12em; text-transform: uppercase; }
```

---

## 4. DESIGN STYLES — TWO SYSTEMS

The page alternates between two design languages that feel like two sides of the same coin:

---

### STYLE A — "DEEP NAVY EDITORIAL"
*Used in: Hero, Services, Why Choose Us, Footer*

- **Background:** Dark navy gradients (`--navy-deep` → `--navy-core`), optionally with subtle SVG noise texture overlay (opacity 0.04)
- **Cards:** Glassmorphism — `backdrop-filter: blur(20px)`, background `var(--glass-card)`, border `1px solid var(--glass-border)`
- **Text:** White headlines (Playfair), soft white body (DM Sans), white label tags with slight opacity
- **Accents:** White hairlines (`1px`, 12% opacity), electric blue icon halos (radial gradient glow), white underscores on H2s
- **Decorative:** Large ghost numerals (Cormorant, 6% opacity white), floating geometric shapes (circles, diagonal lines) in `--navy-bright` at low opacity
- **Depth trick:** Cards have `box-shadow: 0 30px 80px rgba(7,17,53,0.6), inset 0 1px 0 rgba(255,255,255,0.08)` — they float
- **Hover:** Cards lift with `transform: translateY(-8px) rotateX(2deg)` + border shifts from white to electric blue (`--glass-border-hover`) + blue glow expands beneath

---

### STYLE B — "ELECTRIC CARTOGRAPHIC"
*Used in: About/Story section, Tour Packages, Testimonials*

- **Background:** Deep navy with an overlaid SVG world map (line-art, opacity 0.05–0.07, white strokes) — feels like a captain's chart room
- **Cards:** Solid `--navy-core` with `border: 1px solid var(--border-subtle)`, NO blur — clean and grounded
- **Typography:** Cormorant Garamond for big quotes, italic, generous leading — editorial pull-quote feel
- **Accents:** Diagonal white stripe (CSS `clip-path`) as section divider, compass rose decorative element (pure CSS, white strokes)
- **Numbers/Stats:** Large Cormorant numerals in `--white-pure` with `--navy-bright` shadow — "500+ Destinations", "10K+ Happy Travelers"
- **Imagery:** Where real photos appear, they sit inside `clip-path: polygon(...)` — parallelogram or diagonal cuts, never plain rectangles
- **The Flight Path Line:** SVG `<path>` with animated `stroke-dashoffset` driven by GSAP ScrollTrigger — white/electric blue, dashed, with plane icon riding it

---

## 5. PAGE ARCHITECTURE — THE JOURNEY TIMELINE

```
SECTION 0 — PRELOADER (500ms)
  Milestone Travels logo assembles from paths + tagline fades

SECTION 1 — HERO: "BOARDING GATE"
  Full-screen. The world is your destination.

SECTION 2 — STORY: "WHO WE ARE"
  The journey begins. Cartographic style.

SECTION 3 — SERVICES: "YOUR ITINERARY"
  8 service cards in 3D CSS grid.

SECTION 4 — PACKAGES / WHY US: "WHY FLY WITH US"
  5 trust pillars + stats counter.

SECTION 5 — CTA: "DEPARTURE LOUNGE"
  Full-screen CTA with contact info.

FOOTER
  Minimal. Logo. Phone. Tagline.
```

---

## 6. SCROLL ANIMATION MASTER TIMELINE

### Philosophy
One GSAP `ScrollTrigger` master timeline. Sections are pinned, morphed, and cross-dissolved — the user never feels like they're "changing pages." They feel like they're *moving through space*.

### Library Stack
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/SplitText.min.js"></script>
```
> Note: SplitText is a GSAP Club plugin. If unavailable, use a lightweight custom char-splitter (20 lines of JS).

---

### SECTION 1 HERO — "BOARDING GATE"

**Layout:**
- Full viewport height, pinned for ~200vh of scroll
- Background: deep navy → dusk gradient, with CSS animated star-field (tiny `box-shadow` dots, 0.5px, twinkling via keyframes)
- Center: Giant headline split into two lines
- Bottom: Boarding pass strip (airline-ticket aesthetic) with phone numbers

**GSAP Animations:**

```javascript
// HERO ENTRANCE — on page load (not scroll)
const heroTL = gsap.timeline({ delay: 0.3 });

heroTL
  // Background gradient expands from center
  .from('.hero-bg', { scale: 1.08, duration: 1.4, ease: 'power3.out' })

  // "MILESTONE" — each letter drops from above, staggered
  .from('.hero-word-1 .char', {
    y: -120, opacity: 0, rotationX: 90,
    stagger: 0.04, duration: 0.8, ease: 'back.out(1.5)'
  }, '-=0.8')

  // "TRAVELS" — italic Cormorant, slides from right
  .from('.hero-word-2', {
    x: 80, opacity: 0, duration: 0.9, ease: 'power4.out'
  }, '-=0.5')

  // Tagline "Milestones to Memories" — typewriter effect
  .from('.hero-tagline', {
    clipPath: 'inset(0 100% 0 0)', duration: 1.1, ease: 'power2.inOut'
  }, '-=0.3')

  // Gold divider line draws itself
  .from('.hero-divider', {
    scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: 'power3.inOut'
  }, '-=0.5')

  // Boarding pass slides up from bottom
  .from('.hero-boarding-pass', {
    y: 100, opacity: 0, duration: 0.9, ease: 'power3.out'
  }, '-=0.4')

  // Floating plane icon enters
  .from('.hero-plane', {
    x: -200, opacity: 0, duration: 1.2, ease: 'power2.out'
  }, '-=0.8');

// HERO SCROLL EXIT — as user scrolls into Section 2
ScrollTrigger.create({
  trigger: '#hero',
  start: 'top top',
  end: '+=100%',
  pin: true,
  onUpdate: (self) => {
    // Headline scales down and fades
    gsap.set('.hero-headline', {
      scale: 1 - (self.progress * 0.15),
      opacity: 1 - (self.progress * 1.8)
    });
    // Parallax: background moves slower
    gsap.set('.hero-bg', { y: self.progress * 60 });
    // Boarding pass slides out
    gsap.set('.hero-boarding-pass', { y: self.progress * 120, opacity: 1 - self.progress * 2 });
  }
});
```

**Hero Visual Details:**
- The "M" logo SVG draws its path via `stroke-dashoffset` animation on load
- A CSS-only animated particle field: 80 `<span>` elements positioned randomly, 1–3px, white, with randomized `animation-delay` and `animation-duration` for gentle fade in/out
- Bottom border: SVG wave divider (navy-to-next-section color)

---

### SECTION 2 STORY — "WHO WE ARE"

**Layout:**
- `min-height: 100vh`, Style B (Cartographic)
- Left: Large italic Cormorant pull quote + 2-line body paragraph + gold horizontal rule
- Right: Stats cluster (3 big numbers) + decorative compass rose (CSS only)
- Background SVG world-map line art (hand-coded paths, opacity 5%)

**GSAP Animations:**

```javascript
const storyTL = gsap.timeline({
  scrollTrigger: {
    trigger: '#story',
    start: 'top 75%',
    end: 'bottom 25%',
    toggleActions: 'play none none reverse'
  }
});

storyTL
  // Section number ghost ("02") rises from below
  .from('.story-num', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' })

  // Quote mark descends dramatically
  .from('.story-quotemark', { y: -40, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.5')

  // Pull quote: word-by-word reveal
  .from('.story-quote .word', {
    opacity: 0, y: 20,
    stagger: 0.06, duration: 0.5, ease: 'power2.out'
  }, '-=0.3')

  // Gold rule draws left to right
  .from('.story-rule', { scaleX: 0, transformOrigin: 'left', duration: 0.8, ease: 'power3.inOut' }, '-=0.2')

  // Body text fades + rises
  .from('.story-body', { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out' }, '-=0.4')

  // Stats: each number counts up (using GSAP's snap)
  .from('.stat-number', {
    textContent: 0,
    duration: 2,
    ease: 'power1.out',
    snap: { textContent: 1 },
    stagger: 0.2,
  }, '-=0.3')

  // Compass rose rotates in
  .from('.compass', { rotation: -180, opacity: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' }, '-=1.5')

  // World map SVG: country paths fade in staggered
  .from('.map-path', { opacity: 0, stagger: 0.01, duration: 0.3 }, '<');
```

---

### SECTION 3 SERVICES — "YOUR ITINERARY"

**Layout:**
- Pinned for `400vh` of scroll — this is the SHOWPIECE section
- Header is fixed at top while 8 cards animate in
- Cards arranged in a 4×2 grid that "lands" from above, one by one
- Each card: Style A glassmorphism, with a 3D CSS hover effect

**Card 3D CSS Setup:**
```css
.service-card {
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
.service-card:hover {
  transform: translateY(-12px) rotateX(6deg) rotateY(-3deg);
}
.service-card-inner {
  transform: translateZ(0);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
.service-card:hover .service-card-inner {
  transform: translateZ(20px); /* Icon appears to float off card */
}
.service-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(200,150,10,0.15) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s;
}
.service-card:hover::before { opacity: 1; }
```

**GSAP — Card Scroll Choreography:**

```javascript
// Pin the services section
ScrollTrigger.create({
  trigger: '#services',
  start: 'top top',
  end: '+=400%',
  pin: true,
  pinSpacing: true,
});

// Cards land in 2 waves: row 1 (cards 1-4), then row 2 (cards 5-8)
const cardsTL = gsap.timeline({
  scrollTrigger: {
    trigger: '#services',
    start: 'top top',
    end: '+=400%',
    scrub: 1.5, // Smooth scrub tied to scroll
  }
});

cardsTL
  // Section title assembles
  .from('.services-title .char', {
    y: 80, opacity: 0, rotationX: -60,
    stagger: 0.03, ease: 'back.out(1.7)'
  }, 0)

  // Cards 1–4: drop from above in stagger
  .from('.card-1', { y: -300, opacity: 0, rotationX: 45, ease: 'power4.out' }, 0.3)
  .from('.card-2', { y: -300, opacity: 0, rotationX: 45, ease: 'power4.out' }, 0.45)
  .from('.card-3', { y: -300, opacity: 0, rotationX: 45, ease: 'power4.out' }, 0.6)
  .from('.card-4', { y: -300, opacity: 0, rotationX: 45, ease: 'power4.out' }, 0.75)

  // Cards 5–8: rise from below
  .from('.card-5', { y: 300, opacity: 0, rotationX: -45, ease: 'power4.out' }, 0.5)
  .from('.card-6', { y: 300, opacity: 0, rotationX: -45, ease: 'power4.out' }, 0.65)
  .from('.card-7', { y: 300, opacity: 0, rotationX: -45, ease: 'power4.out' }, 0.8)
  .from('.card-8', { y: 300, opacity: 0, rotationX: -45, ease: 'power4.out' }, 0.95)

  // Hold all cards visible (maintain progress)
  .to({}, { duration: 1.5 })

  // Cards SCATTER as we scroll out — each card flies to its corner
  .to('.card-1', { x: -150, y: -150, opacity: 0, rotation: -15, ease: 'power3.in' }, 3)
  .to('.card-2', { x: 0, y: -200, opacity: 0, rotation: 5, ease: 'power3.in' }, 3.1)
  .to('.card-3', { x: 150, y: -150, opacity: 0, rotation: 12, ease: 'power3.in' }, 3.2)
  .to('.card-4', { x: 250, y: -100, opacity: 0, rotation: 20, ease: 'power3.in' }, 3.3)
  .to('.card-5', { x: -250, y: 100, opacity: 0, rotation: -20, ease: 'power3.in' }, 3.1)
  .to('.card-6', { x: -100, y: 200, opacity: 0, rotation: -8, ease: 'power3.in' }, 3.2)
  .to('.card-7', { x: 100, y: 200, opacity: 0, rotation: 10, ease: 'power3.in' }, 3.3)
  .to('.card-8', { x: 200, y: 150, opacity: 0, rotation: 18, ease: 'power3.in' }, 3.4);
```

**Service Card Anatomy:**
```
┌─────────────────────────────────────┐
│  ╭──────╮                           │
│  │ ICON │   ← Gold halo radial glow │
│  ╰──────╯                           │
│                                     │
│  FLIGHT BOOKINGS          ← Playfair│
│  ─────────────────                  │
│  Domestic and international         │
│  reservations at best fares.  ← DM │
│                                     │
│  EXPLORE →                ← DM 500 │
└─────────────────────────────────────┘
  Glass card: blur(20px), navy-glass bg
  Bottom: 2px gold gradient bar (0% opacity → gold → 0%)
  Hover: entire card tilts 3D, icon floats forward
```

---

### THE FLIGHT PATH LINE

The signature visual element — a living SVG that crosses the entire page vertically.

```javascript
// SVG is absolutely positioned, spans full page height
// Path is a gentle S-curve connecting section midpoints

const flightPath = document.querySelector('#flight-path-svg path');
const totalLength = flightPath.getTotalLength();

// Set initial state: fully dashed/invisible
gsap.set(flightPath, {
  strokeDasharray: totalLength,
  strokeDashoffset: totalLength,
});

// Animate as user scrolls entire page
gsap.to(flightPath, {
  strokeDashoffset: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
  }
});

// Plane icon rides the path
ScrollTrigger.create({
  trigger: 'body',
  start: 'top top',
  end: 'bottom bottom',
  scrub: 0.5,
  onUpdate: (self) => {
    const point = flightPath.getPointAtLength(self.progress * totalLength);
    const nextPoint = flightPath.getPointAtLength(Math.min((self.progress + 0.001) * totalLength, totalLength));
    const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
    gsap.set('.path-plane', {
      x: point.x - 12,
      y: point.y - 12,
      rotation: angle,
    });
  }
});
```

**Flight path CSS:**
```css
#flight-path-svg {
  position: fixed;
  top: 0; right: 60px;
  width: 120px;
  height: 100vh;
  pointer-events: none;
  z-index: 10;
}
#flight-path-svg path {
  stroke: var(--navy-sky);
  stroke-width: 1.5;
  stroke-dasharray: 8 6;
  fill: none;
  filter: drop-shadow(0 0 5px rgba(59, 111, 232, 0.7));
}
.path-plane {
  position: fixed;
  width: 24px;
  height: 24px;
  z-index: 11;
  pointer-events: none;
  filter: drop-shadow(0 0 6px var(--navy-bright));
}
```

---

### SECTION 4 WHY CHOOSE US — "TRUST ALTITUDE"

**Layout:**
- Style A (dark editorial)
- 5 trust pillars arranged in a horizontal scroll that's scroll-mapped (no native scroll — GSAP scrub moves them)
- Each pillar: large icon (CSS-drawn), bold DM Sans label, brief Cormorant italic descriptor

**GSAP:**
```javascript
// Horizontal march: pillars slide in from right as section scrolls
gsap.to('.trust-track', {
  x: () => -(document.querySelector('.trust-track').scrollWidth - window.innerWidth + 100),
  ease: 'none',
  scrollTrigger: {
    trigger: '#trust',
    pin: true,
    start: 'top top',
    end: '+=250%',
    scrub: 1,
  }
});

// Each pillar's checkmark icon pops (scale spring)
gsap.from('.trust-icon', {
  scale: 0,
  ease: 'elastic.out(1, 0.5)',
  stagger: 0.15,
  scrollTrigger: {
    trigger: '#trust',
    start: 'top center',
    toggleActions: 'play none none reverse'
  }
});
```

---

### SECTION 5 CTA — "DEPARTURE LOUNGE"

**Layout:**
- Full screen, pinned briefly
- Style A — deepest navy (`--navy-deep`)
- Giant centered Cormorant headline: *"Your Next Journey Awaits"*
- Below: Two phone numbers styled as boarding pass segments
- Gold animated border around the CTA box (border traces itself via `clip-path` animation)
- Background: CSS radial gradient sunrise effect behind headline

**GSAP:**
```javascript
const ctaTL = gsap.timeline({
  scrollTrigger: { trigger: '#cta', start: 'top 60%', toggleActions: 'play none none reverse' }
});

ctaTL
  // Sunrise glow expands
  .from('.cta-glow', { scale: 0, opacity: 0, duration: 1.5, ease: 'power2.out' })
  // Headline: word by word, with slight vertical offset alternating
  .from('.cta-headline .word', {
    y: 60, opacity: 0, stagger: { each: 0.12, from: 'center' },
    duration: 0.8, ease: 'power3.out'
  }, '-=0.8')
  // Gold border draws around the contact block
  .from('.cta-border-trace', {
    strokeDashoffset: 600, duration: 1.2, ease: 'power2.inOut'
  }, '-=0.4')
  // Phone numbers flip in like departure board
  .from('.phone-number .digit', {
    opacity: 0, y: -20, rotation: -90, transformOrigin: 'bottom',
    stagger: 0.03, duration: 0.4, ease: 'back.out(2)'
  }, '-=0.5');
```

---

## 7. COMPONENT SPECIFICATIONS

### 7.1 Navbar

```
Position: fixed, top-0, full-width
Height: 72px desktop / 60px mobile
Background: transparent → `rgba(7, 17, 53, 0.95)` + blur(16px) on scroll
Left: M logo SVG (28px)  |  "MILESTONE TRAVELS" (DM Sans 500, 13px, 0.1em tracking)
Right: nav links (DM Sans 500, 13px) + "BOOK NOW" pill button (white border, transparent fill → `--navy-bright` fill on hover)

Scroll behavior:
  gsap.to('.nav', { backgroundColor: 'rgba(7,17,53,0.95)', backdropFilter: 'blur(16px)', duration: 0.4 })
  when scrollY > 80

Active link: electric blue underline (scaleX 0→1 on hover, via ::after pseudo, `background: var(--navy-sky)`)
```

### 7.2 Service Cards (Glassmorphism Spec)

```css
.service-card {
  background: var(--glass-card);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 36px 28px;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 800px;
  cursor: pointer;
  transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1);
}

/* Noise texture overlay */
.service-card::after {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.03;
  border-radius: inherit;
  pointer-events: none;
}

/* Blue shimmer on hover */
.service-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, var(--navy-bright), transparent 40%, transparent 60%, var(--navy-sky));
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.45s;
  z-index: -1;
}
.service-card:hover::before { opacity: 0.6; }
.service-card:hover {
  transform: translateY(-10px) rotateX(5deg);
  box-shadow: 0 40px 80px rgba(7,17,53,0.6), 0 0 0 1px rgba(59,111,232,0.5);
}
```

### 7.3 Icon Style (CSS-drawn, no assets)

Each service icon is a CSS/SVG icon inside a circular container:

```css
.icon-wrap {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: var(--navy-mid);
  border: 1px solid rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  position: relative;
  margin-bottom: 20px;
}
/* Electric blue halo on hover */
.icon-wrap::after {
  content: '';
  position: absolute; inset: -6px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--blue-glow) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s, transform 0.4s;
  transform: scale(0.8);
}
.service-card:hover .icon-wrap::after {
  opacity: 1;
  transform: scale(1.2);
}
```

Icons: Use inline SVG (Phosphor Icons or Feather Icons CDN, both free). Map each service to icon:
- Flight Bookings → `ph-airplane-takeoff`
- Hotel Reservations → `ph-buildings`
- Visa Assistance → `ph-identification-badge`
- Tour Packages → `ph-map-trifold`
- Travel Consultation → `ph-compass`
- Group & Corporate → `ph-users-three`
- Apartment Rentals → `ph-house`
- Car Rentals → `ph-car`

### 7.4 Boarding Pass CTA (Hero Bottom + Footer)

```
Visual: Airline boarding pass aesthetic
- Serrated left edge (CSS: repeating radial gradient)
- Left segment: phone numbers in large DM Sans 700
- Right segment: "CALL US TODAY" in label style + decorative barcode lines
- Divider: vertical dashed gold line with two circles (punch-holes)
- Border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.3)
```

### 7.5 Section Transition Dividers

Alternate between two types:
- **Type 1:** SVG wave (`<path>` with `d="M0,0 C250,60 750,-60 1000,0 L1000,40 L0,40 Z"`) filled with next section's background color
- **Type 2:** CSS diagonal clip (`clip-path: polygon(0 0, 100% 8%, 100% 100%, 0 100%)`)

---

## 8. MOTION PRINCIPLES

| Principle | Rule |
|-----------|------|
| **Easing vocabulary** | Entrances: `power3.out` or `back.out(1.7)`. Exits: `power3.in`. Elastic: only for icons/decorative, never text. |
| **Scrub tightness** | Hero: `scrub: 0.8`. Cards: `scrub: 1.5`. Flight path: `scrub: 0.5`. |
| **Stagger max** | Never exceed `stagger: 0.12` for word reveals. Icon grids: `stagger: 0.08`. |
| **Duration range** | Micro (icon pulse): 0.3s. UI reveal: 0.6–0.9s. Cinematic: 1.2–1.8s. |
| **Reduced motion** | All animations wrapped: `@media (prefers-reduced-motion: reduce) { ScrollTrigger.disable() }` |
| **Performance** | Only animate `transform` and `opacity`. Never `width`, `height`, `top`, `left`. Use `will-change: transform` on pinned elements. |
| **Momentum feel** | Cards don't pop — they *arrive*. Use `power4.out` for heavy elements landing. `power2.out` for light text. |

---

## 9. RESPONSIVE BREAKPOINTS

```css
/* Mobile-first */
--bp-sm:  480px;   /* Large phones */
--bp-md:  768px;   /* Tablets */
--bp-lg:  1024px;  /* Small desktop */
--bp-xl:  1280px;  /* Standard desktop */
--bp-2xl: 1600px;  /* Large screens */
```

**Mobile scroll strategy:**
- Disable card-scatter animation on mobile (too heavy)
- Replace with sequential `fadeInUp` on `toggleActions: 'play none none none'`
- Flight path line moves to bottom of viewport, horizontal
- Keep hero entrance and CTA animations (they're the best ones)
- Pinned sections: reduce pin duration by 50%

---

## 10. ADDITIONAL POLISH DETAILS

### Cursor
```css
/* Custom cursor — small circle that expands on hovering interactive elements */
.cursor {
  width: 10px; height: 10px;
  background: var(--navy-sky);
  border-radius: 50%;
  position: fixed; pointer-events: none; z-index: 9999;
  transition: width 0.3s, height 0.3s, background 0.3s;
  mix-blend-mode: difference;
}
.cursor.hover { width: 40px; height: 40px; background: white; }
```
*(Disable on touch devices)*

### Scroll Progress Indicator
```css
/* Fixed right side: thin vertical line that fills as page scrolls */
.scroll-progress {
  position: fixed; right: 20px; top: 10%; height: 80%;
  width: 1px; background: rgba(255,255,255,0.1);
}
.scroll-progress-fill {
  width: 100%; background: var(--navy-sky);
  height: 0%; /* Driven by GSAP ScrollTrigger */
  box-shadow: 0 0 8px var(--navy-bright);
}
```

### Page Load Sequence
```
0ms     — Page black
0–400ms — Preloader: "M" logo SVG path-draws itself (stroke-dashoffset anim)
400–700ms — Tagline fades in beneath logo
700–900ms — Preloader slides up (clip-path: inset(0 0 100% 0))
900ms+  — Hero entrance begins
```

### Background Particle Field (Hero)
```javascript
// 60 dots, randomly placed, pure CSS animation
// No canvas, no library — just DOM spans with keyframes
function createStars(count = 60) {
  const container = document.querySelector('.hero-stars');
  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    star.style.cssText = `
      position: absolute;
      width: ${Math.random() * 2 + 0.5}px;
      height: ${Math.random() * 2 + 0.5}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      background: white;
      border-radius: 50%;
      animation: twinkle ${2 + Math.random() * 4}s ${Math.random() * 5}s infinite alternate;
      opacity: ${0.3 + Math.random() * 0.5};
    `;
    container.appendChild(star);
  }
}
```

---

## 11. SECTION-BY-SECTION BACKGROUND COLORS

| Section | Background | Style |
|---------|-----------|-------|
| Preloader | `#000000` → `--navy-deep` | Full black to navy |
| Hero | `linear-gradient(160deg, #071135 0%, #0D1F6E 55%, #071135 100%)` | Deep space navy |
| Story | `#0A1A55` + SVG map (white, 5% opacity) | Cartographic |
| Services | `#0D1F6E` | Core brand navy |
| Trust/Why Us | `linear-gradient(180deg, #071135 0%, #050D2A 100%)` | Deepest navy |
| CTA | `#050D2A` | Near black navy, maximum contrast |
| Footer | `#050D2A` | Same as CTA, seamless |

---

## 12. FONTS CDN LINK (ready to paste)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap" rel="stylesheet">
```

---

## 13. ICONS CDN (Phosphor Icons)

```html
<script src="https://unpkg.com/@phosphor-icons/web"></script>
<!-- Usage: <i class="ph ph-airplane-takeoff"></i> -->
```

---

## 14. FILE STRUCTURE (when building)

```
milestone-travels/
├── index.html          ← Single file (all CSS + JS inlined or linked)
├── css/
│   ├── reset.css
│   ├── variables.css   ← All CSS custom properties
│   ├── typography.css
│   ├── components.css  ← Cards, nav, boarding pass
│   └── animations.css  ← @keyframes, transitions
├── js/
│   ├── preloader.js
│   ├── gsap-init.js    ← ScrollTrigger registration
│   ├── hero.js
│   ├── services.js     ← Card animations
│   ├── flight-path.js  ← SVG path + plane
│   └── utils.js        ← Star generator, cursor, split-text helper
└── assets/
    └── (none required — no external images)
```

---

*Design System Version: 1.0 | Brand: Milestone Travels | "Milestones to Memories"*

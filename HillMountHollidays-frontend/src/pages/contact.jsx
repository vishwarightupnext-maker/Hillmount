import { useState, useEffect, useRef } from "react";
import { ShieldCheck, Mail, Phone, Monitor, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import Contactbg from "../assets/ContactBg.webp";
import HeroSkeleton, { useImageLoaded } from "../components/HeroSkeleton";

const API_BASE = import.meta.env.VITE_API_BASE;


// ── Helpers ────
const toUrl   = (img) => img.imageUrl?.startsWith('/') ? `${API_BASE}${img.imageUrl}` : img.imageUrl;
const toItem  = (img) => ({ src: toUrl(img), alt: img.alt });

const SOCIAL = [
  {
    label: "Facebook", href: "https://www.facebook.com/HillMountHolidays/",
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram", href: "https://www.instagram.com/hillmount_holidays",
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "LinkedIn", href: "https://www.linkedin.com/company/hillmountholidays/",
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "YouTube", href: "https://www.youtube.com/@hillmountholidays",
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: "WhatsApp", href: "https://wa.me/914224366522",
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: "Twitter/X", href: "#",
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l16 16M20 4L4 20" />
      </svg>
    ),
  },
  {
    label: "Pinterest", href: "#",
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.43 7.63 11.17-.09-.78-.17-1.98.03-2.83.19-.77 1.27-5.37 1.27-5.37s-.32-.65-.32-1.61c0-1.51.88-2.63 1.97-2.63.93 0 1.38.7 1.38 1.54 0 .94-.6 2.34-.91 3.64-.26 1.08.54 1.96 1.6 1.96 1.93 0 3.41-2.03 3.41-4.97 0-2.6-1.87-4.42-4.54-4.42-3.09 0-4.91 2.32-4.91 4.71 0 .93.36 1.93.8 2.48.09.11.1.2.08.31l-.3 1.23c-.05.2-.16.24-.36.15-1.35-.63-2.19-2.61-2.19-4.2 0-3.42 2.49-6.56 7.17-6.56 3.77 0 6.7 2.69 6.7 6.28 0 3.75-2.36 6.76-5.63 6.76-1.1 0-2.14-.57-2.49-1.24l-.68 2.58c-.24.94-.9 2.12-1.35 2.84.86.27 1.77.4 2.72.4 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
      </svg>
    ),
  },
];

const FormField = ({ label, children }) => (
  <div className="group">
    <label className="text-black text-[12px] font-semibold block mb-1.5 transition-all duration-200 group-focus-within:translate-x-0.5">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full bg-white text-black text-[13px] px-4 py-3 rounded-lg outline-none placeholder-gray-400 border-2 border-gray-200 focus:border-[#1E88E5] transition-all duration-200 shadow-sm focus:shadow-md";

// ── Component ────────────────────────────────────────────────────────────────
const Contact = () => {
  const [mounted, setMounted]   = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const [sideImages, setSideImages] = useState([]);
  const [row1,       setRow1]       = useState([]);
  const [row2,       setRow2]       = useState([]);

  const [ctName,    setCtName]    = useState("");
  const [ctEmail,   setCtEmail]   = useState("");
  const [ctMessage, setCtMessage] = useState("");
  const [ctLoading, setCtLoading] = useState(false);
  const [ctSuccess, setCtSuccess] = useState(false);
  const [ctError,   setCtError]   = useState("");
  const submittingRef = useRef(false);

  const handleContact = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setCtLoading(true);
    setCtError("");
    try {
      const res  = await fetch(`${API_BASE}/api/contact`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: ctName, email: ctEmail, message: ctMessage }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to send.");
      setCtSuccess(true);
      setCtName(""); setCtEmail(""); setCtMessage("");
    } catch (err) {
      setCtError(err.message);
    } finally {
      setCtLoading(false);
      submittingRef.current = false;
    }
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/gallery`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.success || !d.data?.length) return;
        const side = d.data.filter((i) => i.section === 'side');
        const r1   = d.data.filter((i) => i.section === 'row1');
        const r2   = d.data.filter((i) => i.section === 'row2');
        if (side.length) setSideImages(side.map(toUrl));
        if (r1.length)   setRow1(r1.map(toItem));
        if (r2.length)   setRow2(r2.map(toItem));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

 

  const heroSlide = (delay) => ({
    opacity:   mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
  });

  // Marquee needs at least 2 copies for seamless loop
  const marqueeRow1 = row1.length ? [...row1, ...row1] : [];
  const marqueeRow2 = row2.length ? [...row2, ...row2] : [];
  const heroBgLoaded = useImageLoaded(Contactbg);

  return (
    <div className="w-full font-inter overflow-x-hidden">

      {/* ── Hero ── */}
      <div className="relative w-full h-[400px] md:h-[520px] bg-cover bg-center"
        style={{ backgroundImage: `url(${Contactbg})` }}>
        <div className="absolute inset-0 bg-black/35" />
        <HeroSkeleton show={!heroBgLoaded} />
        <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center md:justify-start text-white text-center md:text-left px-4 md:px-10 pt-10 z-10">
          <p style={heroSlide(0.1)} className="text-[#1E88E5] text-[11px] font-bold uppercase tracking-[0.3em] mb-4">Get In Touch</p>
          <h1 style={heroSlide(0.25)} className="text-2xl md:text-4xl lg:text-[54px] font-extrabold leading-tight max-w-3xl tracking-tight mb-5">
            We're Always Here<br className="hidden md:block" /> to Help You
          </h1>
          <p style={heroSlide(0.4)} className="text-gray-300 text-sm md:text-[15px] max-w-xl leading-relaxed mb-8 font-light">
            Whether it's a question, a plan, or simply the start of your next great journey — our team is ready.
          </p>
          <div style={heroSlide(0.55)} className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a href="tel:+919994666522">
              <button className="bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white font-semibold text-[14px] py-2.5 px-7 rounded-sm transition shadow-md cursor-pointer">
                Call me Now
              </button>
            </a>
            <a href="https://www.google.com/maps/place/Veena+World+-+HillMount+Holidays/@11.0103472,76.9501920,17z" target="_blank" rel="noopener noreferrer">
              <button className="border border-white/50 hover:bg-white hover:text-black text-white font-semibold text-[14px] px-7 py-2.5 rounded-sm transition backdrop-blur-sm cursor-pointer">
                Locate Us
              </button>
            </a>
          </div>
          <div style={heroSlide(0.7)} className="flex items-center justify-center md:justify-start gap-3 mt-4">
            {[
              { href: "https://www.facebook.com/veenaworldcoimbatore/", label: "Facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
              { href: "https://www.instagram.com/veena_world_hillmount_holidays/", label: "Instagram", paths: ["rect x='2' y='2' width='20' height='20' rx='5' ry='5'", "path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'", "line x1='17.5' y1='6.5' x2='17.51' y2='6.5'"] },
               { href: "https://www.linkedin.com/company/hillmountholidays/", label: "LinkedIn", isLI: true },
              { href: "https://www.youtube.com/@hillmountholidays", label: "YouTube", paths2: true },
              { href: "https://wa.me/914224366522", label: "WhatsApp", isWA: true },
              { href: "#", label: "Twitter/X", isX: true },
              { href: "#", label: "Pinterest", isPinterest: true },
            ].map(({ href, label, path, paths, paths2, isWA, isLI, isX, isPinterest }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E88E5] !text-white hover:bg-[#084298] hover:!text-white transition"
                title={label}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  {isWA && <path fill="currentColor" stroke="none" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>}
                  {isLI && <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>}
                  {isX && <path d="M4 4l16 16M20 4L4 20" />}
                  {isPinterest && <path fill="currentColor" stroke="none" d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.43 7.63 11.17-.09-.78-.17-1.98.03-2.83.19-.77 1.27-5.37 1.27-5.37s-.32-.65-.32-1.61c0-1.51.88-2.63 1.97-2.63.93 0 1.38.7 1.38 1.54 0 .94-.6 2.34-.91 3.64-.26 1.08.54 1.96 1.6 1.96 1.93 0 3.41-2.03 3.41-4.97 0-2.6-1.87-4.42-4.54-4.42-3.09 0-4.91 2.32-4.91 4.71 0 .93.36 1.93.8 2.48.09.11.1.2.08.31l-.3 1.23c-.05.2-.16.24-.36.15-1.35-.63-2.19-2.61-2.19-4.2 0-3.42 2.49-6.56 7.17-6.56 3.77 0 6.7 2.69 6.7 6.28 0 3.75-2.36 6.76-5.63 6.76-1.1 0-2.14-.57-2.49-1.24l-.68 2.58c-.24.94-.9 2.12-1.35 2.84.86.27 1.77.4 2.72.4 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>}
                  {paths2 && <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.6c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></>}
                  {path && !isWA && !isLI && !isX && !paths2 && !isPinterest && <path d={path} />}
                  {paths && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Official Communication Policy ── */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-200" />

          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-200" />
        </div>

        <div className="grid md:grid-cols-[1fr_1.7fr] gap-0 rounded-3xl overflow-hidden shadow-lg border border-gray-100">

          {/* LEFT PANEL – yellow */}
          <div className="relative bg-[#1E88E5] px-7 py-10 flex flex-col justify-between overflow-hidden">
            <div className="absolute -bottom-14 -left-14 w-52 h-52 rounded-full border-[28px] border-black/[0.06] pointer-events-none" />
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-[18px] border-black/[0.04] pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#0d1f3c] flex items-center justify-center mb-6 shadow-md">
                <ShieldCheck size={26} className="text-[#1E88E5]" strokeWidth={1.8} />
              </div>
              <h3 className="text-white text-2xl font-extrabold leading-tight tracking-tight mb-3">
                Official<br />Communication<br />Policy
              </h3>
              <p className="text-white/70 text-[12.5px] leading-relaxed font-medium">
                For the safety &amp; protection of our valued customers.
              </p>
            </div>

            <p className="relative z-10 mt-8 text-[11px] text-white/60 font-semibold uppercase tracking-widest">
              HillMount Holidays
            </p>
          </div>

          {/* RIGHT PANEL – white */}
          <div className="bg-white px-4 sm:px-7 py-8 flex flex-col gap-6 min-w-0">
            <p className="text-gray-600 text-[13px] leading-relaxed">
              We communicate <span className="font-bold text-gray-900">only through authorised channels</span>. Treat a message as official only when it comes from one of the following:
            </p>

            {/* Channels – numbered rows */}
            <div className="divide-y divide-gray-100">
              {[
                {
                  num: "01",
                  icon: <Mail size={15} className="text-[#0d1f3c]" strokeWidth={1.8} />,
                  label: "Primary Email",
                  value: "sales@hillmountholidays.com",
                },
                {
                  num: "02",
                  icon: <Mail size={15} className="text-[#0d1f3c]" strokeWidth={1.8} />,
                  label: "Domain Email",
                  value: "Any address ending with @hillmountholidays.com",
                },
                {
                  num: "03",
                  icon: <Phone size={15} className="text-[#0d1f3c]" strokeWidth={1.8} />,
                  label: "Telephone",
                  value: "+91 99946 66522  ·  +91 97911 66522  ·  +91 99521 05822",
                },
                {
                  num: "04",
                  icon: <Monitor size={15} className="text-[#0d1f3c]" strokeWidth={1.8} />,
                  label: "Digital Handles",
                  value: `Verified accounts under "HillMount Holidays"`,
                },
              ].map((ch) => (
                <div key={ch.num} className="flex items-start gap-4 py-3 group">
                  <span className="text-[10px] font-black text-gray-200 leading-none pt-1 w-5 shrink-0 group-hover:text-[#1E88E5] transition-colors">
                    {ch.num}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                    {ch.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{ch.label}</p>
                    <p className="text-[13px] font-semibold text-gray-800 leading-snug [overflow-wrap:anywhere]">{ch.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Warning – amber left-border */}
            <div className="flex items-start gap-3 border-l-4 border-[#1E88E5] bg-amber-50/60 rounded-r-xl px-4 py-3.5">
              <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-gray-600 text-[11.5px] leading-relaxed">
                <span className="font-bold text-gray-800">HillMount Holidays shall not be responsible</span> for loss, fraud, or unauthorised transactions from unverified sources. Always verify payment requests from unknown contacts before acting.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Authorised Partner (small strip) ── */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-4 sm:gap-5 bg-blue-50/60 border border-blue-100 rounded-2xl px-5 sm:px-7 py-5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#1E88E5] flex items-center justify-center shrink-0">
            <ShieldCheck size={22} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#1E88E5] mb-1">Authorised Partner</p>
            <p className="text-gray-800 text-[13.5px] sm:text-[14px] font-semibold leading-snug">
              HillMount Holidays is Authorised Sales Partner of Veena World Group Tours
            </p>
          </div>
        </div>
      </div>

      {/* ── Get In Touch ── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
          <div className="flex-1 w-full">
            <p className="text-[#ea580c] text-[11px] font-bold uppercase tracking-widest mb-3">Get In Touch</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4 leading-tight">
              REACH &amp; CONTACT US!
            </h2>
            <p className="text-gray-500 text-[13.5px] leading-relaxed mb-6 max-w-sm">
              Have a question about your journey or need help planning? Reach out to us — our travel experts are always happy to help.
            </p>
            <div className="flex gap-3 mb-7">
              {SOCIAL.map(({ svg, label, href }, i) => (
                <a key={i} href={href} aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#1E88E5] text-white hover:bg-[#084298] transition-colors">
                  {svg}
                </a>
              ))}
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2809.796263421527!2d76.9501919750453!3d11.010341889152986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859a42b6c8099%3A0xd07d39f9b149f9ae!2sVeena%20World%20-%20HillMount%20Holidays!5e1!3m2!1sen!2sin!4v1780288934456!5m2!1sen!2sin"
                width="100%" height="280" style={{ border: 0, display: "block" }}
                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="HillMount Holidays Location" />
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-white border-2 border-[#1E88E5] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-extrabold text-black mb-6">Send Us a Message</h3>
              {ctSuccess ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <CheckCircle size={44} className="text-green-500" strokeWidth={1.5} />
                  <p className="text-[15px] font-semibold text-gray-800">Message sent successfully!</p>
                  <p className="text-[13px] text-gray-500">We'll get back to you shortly.</p>
                  <button
                    onClick={() => setCtSuccess(false)}
                    className="mt-3 text-[12px] font-bold text-amber-600 hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleContact}>
                  <FormField label="First Name..">
                    <input
                      type="text"
                      placeholder="Your Name*"
                      required
                      value={ctName}
                      onChange={(e) => setCtName(e.target.value)}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Email Address">
                    <input
                      type="email"
                      placeholder="Your Email*"
                      required
                      value={ctEmail}
                      onChange={(e) => setCtEmail(e.target.value)}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Comments / Questions">
                    <textarea
                      placeholder="Your Message*"
                      required
                      value={ctMessage}
                      onChange={(e) => setCtMessage(e.target.value)}
                      className={`${inputCls} h-36 resize-none`}
                    />
                  </FormField>
                  {ctError && (
                    <p className="text-[12px] text-red-500 font-medium">{ctError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={ctLoading}
                    className={`w-full flex items-center justify-center gap-2 font-bold text-[13px] uppercase tracking-widest py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md
                      ${ctLoading ? "bg-yellow-300 text-gray-500 cursor-not-allowed" : "bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white cursor-pointer"}`}
                  >
                    {ctLoading && <Loader2 size={15} className="animate-spin" />}
                    {ctLoading ? "Sending…" : "Submit Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact Story ── */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 relative">
            <div className="absolute -bottom-4 -left-4 opacity-[0.045] pointer-events-none select-none" aria-hidden="true">
              <svg width="260" height="260" viewBox="0 0 100 120" fill="currentColor" className="text-gray-900">
                <path d="M50 80 Q50 95 50 115 Q48 115 48 80Z" /><path d="M50 80 Q40 60 20 55 Q25 65 50 80Z" />
                <path d="M50 80 Q60 60 80 55 Q75 65 50 80Z" /><path d="M50 80 Q30 65 10 75 Q18 80 50 80Z" />
                <path d="M50 80 Q70 65 90 75 Q82 80 50 80Z" /><path d="M50 80 Q38 55 30 30 Q40 40 50 80Z" />
                <path d="M50 80 Q62 55 70 30 Q60 40 50 80Z" /><path d="M50 80 Q50 50 50 20 Q52 20 52 80Z" />
              </svg>
            </div>
            <div className="relative z-10">
              <p className="text-[#ea580c] text-[11px] font-bold uppercase tracking-widest mb-4">Our Contact</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black leading-tight">
                We're Here to<br className="hidden md:block" />Help You Plan<br className="hidden md:block" />Your Journey.
              </h2>
              <p className="text-gray-500 text-[13.5px] mt-5 leading-relaxed max-w-[360px]">
                Have questions about your next adventure? Our team is always here to listen and craft the perfect travel experience for you.
              </p>
            </div>
          </div>

          {/* Side expanding image cards — dynamic */}
          <div className="hidden md:flex gap-3 sm:gap-4 items-end flex-shrink-0">
            {sideImages.map((src, i) => (
              <div key={i} onClick={() => setLightbox(src)}
                className={`overflow-hidden rounded-2xl cursor-pointer flex-shrink-0 transition-[width] duration-500 ease-in-out ${
                  i === 1
                    ? "h-[260px] sm:h-[320px] lg:h-[360px] w-[120px] sm:w-[155px] hover:w-[260px]"
                    : "h-[200px] sm:h-[250px] lg:h-[290px] w-[108px] sm:w-[140px] hover:w-[260px]"
                }`}>
                <img src={src} alt={`gallery-${i}`}
                  className="h-full object-cover pointer-events-none"
                  style={{ width: "260px", minWidth: "260px" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Marquee Gallery — dynamic ── */}
      <style>{`
        @keyframes marquee-left  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
        .marquee-left  { animation: marquee-left  40s linear infinite; }
        .marquee-right { animation: marquee-right 40s linear infinite; }
        .marquee-left:hover, .marquee-right:hover { animation-play-state: paused; }
      `}</style>

      <div className="w-full overflow-hidden py-8 space-y-3">
        {/* Row 1 — scrolls left */}
        {marqueeRow1.length > 0 && (
          <div className="marquee-left flex gap-3" style={{ width: "max-content" }}>
            {marqueeRow1.map((img, i) => (
              <div key={i} className="flex-shrink-0 w-[320px] h-[200px] rounded-2xl overflow-hidden shadow-md cursor-pointer"
                onClick={() => setLightbox(img.src)}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        )}
        {/* Row 2 — scrolls right */}
        {marqueeRow2.length > 0 && (
          <div className="marquee-right flex gap-3" style={{ width: "max-content" }}>
            {marqueeRow2.map((img, i) => (
              <div key={i} className="flex-shrink-0 w-[320px] h-[200px] rounded-2xl overflow-hidden shadow-md cursor-pointer"
                onClick={() => setLightbox(img.src)}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="full view"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()} />
          <button onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-white bg-black/50 hover:bg-black rounded-full w-10 h-10 flex items-center justify-center text-xl transition">
            ×
          </button>
        </div>
      )}

    </div>
  );
};

export default Contact;


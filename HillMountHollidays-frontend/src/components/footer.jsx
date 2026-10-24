import { useState, useRef, useEffect } from "react";
import { Building2, Phone, Mail, Lock, Edit, CheckCircle, ChevronDown, Search } from "lucide-react";
import Logo from "../assets/logo.png";
import { API } from "./adminComponents/apiHelper";
import { COUNTRIES, INDIA } from "../data/countries";
import FooterBg from "../assets/footer-bg.webp";
/* ── Dark-themed country picker for footer ── */
const FooterCountryPicker = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef(null);

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setSearch(""); }}
        className="flex items-center gap-1.5 h-full px-3 bg-[#5c5c5c] border border-gray-400 border-r-0 rounded-l-sm hover:bg-[#686868] transition"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <ChevronDown size={11} className={`text-gray-300 transition-transform ${open ? "rotate-180" : ""}`} />
        <span className="text-[11px] text-gray-200 font-medium">{selected.dial}</span>
      </button>

      {open && (
        <div className="absolute left-0 bottom-full mb-1 z-50 w-64 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden max-h-56 flex flex-col">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 flex-shrink-0">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code…"
              className="flex-1 text-[12px] outline-none placeholder-gray-400 text-gray-800"
            />
          </div>
          {/* List */}
          <ul className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-[12px] text-gray-400">No results</li>
            )}
            {filtered.map((c) => (
              <li key={c.name}>
                <button
                  type="button"
                  onClick={() => { onChange(c); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12px] hover:bg-yellow-50 transition text-left
                    ${selected.name === c.name ? "bg-yellow-50 font-semibold" : ""}`}
                >
                  <span className="text-base leading-none w-6 text-center flex-shrink-0">{c.flag}</span>
                  <span className="flex-1 text-gray-800 truncate">{c.name}</span>
                  <span className="text-gray-400 text-[11px] flex-shrink-0">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2809.7962131782574!2d76.95019197317332!3d11.010347154839174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859a42b6c8099%3A0xd07d39f9b149f9ae!2sVeena%20World%20-%20HillMount%20Holidays!5e1!3m2!1sen!2sin!4v1779885869894!5m2!1sen!2sin";

const CompassIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const MapIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const PlaneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 4H5c-2 0-2 2 0 3.5L8.2 11 6 19.2c-.4 1.6 1.5 2.4 2.5 1.4l3.4-3.1 3.4 3.1c1 1 2.9.2 2.5-1.4z" />
  </svg>
);

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const footerTabs = [
  {
    id: "explore",
    label: "Explore HillMount",
    tagline: "Crafting unforgettable journeys from Coimbatore to the world.",
    Icon: CompassIcon,
    columns: [
      {
        heading: "About",
        links: [
          { label: "Our Company", href: "/about-us#our-journey" },
          { label: "Our Team", href: "/about-us#meet-the-team" },
          { label: "Testimonial", href: "/#trusted-guests" },
          { label: "Contact Us", href: "/contact" },
          { label: "Blogs", href: "/blog" },
          { label: "Career", href: "/careers", badge: "Hiring!" },
        ],
      },
      {
        heading: "Services",
        links: [
          { label: "Passport", href: "#" },
          { label: "Visa", href: "#" },
          { label: "Ticket", href: "#" },
          { label: "Hotel", href: "#" },
          { label: "Insurance", href: "#" },
          { label: "Currency", href: "#" },
        ],
      },
     
      // {
      //   heading: "Legal Links",
      //   links: [
      //     { label: "Privacy Policy", href: "#" },
      //     { label: "Terms & Conditions", href: "/terms-conditions" },
      //     { label: "Refund & Cancellation Policy", href: "#" },
      //     { label: "Quality Policy", href: "#" },
      //   ],
      // },
    ],
  },
  {
    id: "india",
    label: "India Tour Packages",
    tagline: "From Kashmir to Kanyakumari — discover incredible India.",
    Icon: MapIcon,
    columns: [
      {
        heading: "North India",
        links: [
          { label: "Himachal Tour Packages", href: "#" },
          { label: "Kashmir Tour Packages", href: "#" },
          { label: "Leh Ladakh Tour Packages", href: "#" },
          { label: "Nainital Tour Packages", href: "#" },
          { label: "Amritsar Tour Packages", href: "#" },
          { label: "Agra Tour Packages", href: "#" },
          { label: "Uttarakhand Tour Packages", href: "#" },
          { label: "Dharamshala Tour Packages", href: "#" },
        ],
      },
      {
        heading: "South India",
        links: [
          { label: "Andaman & Nicobar Packages", href: "#" },
          { label: "Kerala Tour Packages", href: "#" },
          { label: "Coorg Tour Packages", href: "#" },
          { label: "Mysore Tour Packages", href: "#" },
          { label: "Pondicherry Tour Packages", href: "#" },
          { label: "Karnataka Tour Packages", href: "#" },
          { label: "Tamil Nadu Tour Packages", href: "#" },
          { label: "Andhra Pradesh Packages", href: "#" },
          { label: "Telangana Tour Packages", href: "#" },
        ],
      },
      {
        heading: "East & North East India",
        links: [
          { label: "Sikkim Darjeeling Packages", href: "#" },
          { label: "Orrisa Tour Packages", href: "#" },
          { label: "Assam Tour Packages", href: "#" },
          { label: "Meghalaya Tour Packages", href: "#" },
          { label: "Imphal Tour Packages", href: "#" },
          { label: "Arunachal Pradesh Packages", href: "#" },
          { label: "Shillong Tour Packages", href: "#" },
          { label: "Nagaland Tour Packages", href: "#" },
        ],
      },
      {
        heading: "West & Central India",
        links: [
          { label: "Gujarat Tour Packages", href: "#" },
          { label: "Rajasthan Tour Packages", href: "#" },
          { label: "Madhya Pradesh Packages", href: "#" },
          { label: "Maharashtra Tour Packages", href: "#" },
          { label: "Goa Tour Packages", href: "#" },
          { label: "Rann of Kutch Packages", href: "#" },
          { label: "Indore Tour Packages", href: "#" },
          { label: "Ranthambore Tour Packages", href: "#" },
        ],
      },
    ],
  },
  {
    id: "world",
    label: "World Tour Packages",
    tagline: "190+ countries. Curated itineraries. Zero hassle.",
    Icon: GlobeIcon,
    columns: [
      {
        heading: "Europe",
        links: [
          { label: "Paris Tour Packages", href: "#" },
          { label: "Austria Tour Packages", href: "#" },
          { label: "Switzerland Tour Packages", href: "#" },
          { label: "Central & Eastern Europe", href: "#" },
          { label: "Greece Tour Packages", href: "#" },
          { label: "Italy Tour Packages", href: "#" },
          { label: "Germany Tour Packages", href: "#" },
          { label: "England Tour Packages", href: "#" },
        ],
      },
      {
        heading: "America",
        links: [
          { label: "New York Tour Packages", href: "#" },
          { label: "Chicago Tour Packages", href: "#" },
          { label: "Los Angeles Tour Packages", href: "#" },
          { label: "Canada Tour Packages", href: "#" },
          { label: "Niagara Falls Packages", href: "#" },
          { label: "Washington Tour Packages", href: "#" },
          { label: "Argentina Tour Packages", href: "#" },
          { label: "Brazil Tour Packages", href: "#" },
        ],
      },
      {
        heading: "South & Far East Asia",
        links: [
          { label: "Thailand Tour Packages", href: "#" },
          { label: "Vietnam Tour Packages", href: "#" },
          { label: "Bali Tour Packages", href: "#" },
          { label: "Japan Tour Packages", href: "#" },
          { label: "China Tour Packages", href: "#" },
          { label: "South Korea Tour Packages", href: "#" },
          { label: "Hong Kong Tour Packages", href: "#" },
          { label: "Sri Lanka Tour Packages", href: "#" },
        ],
      },
      {
        heading: "Africa & Middle East",
        links: [
          { label: "Kenya Tour Packages", href: "#" },
          { label: "Mauritius Tour Packages", href: "#" },
          { label: "South Africa Tour Packages", href: "#" },
          { label: "Dubai Tour Packages", href: "#" },
          { label: "Abu Dhabi Tour Packages", href: "#" },
          { label: "Qatar Tour Packages", href: "#" },
          { label: "Saudi Arabia Tour Packages", href: "#" },
          { label: "Australia & NZ Packages", href: "#" },
        ],
      },
    ],
  },
  {
    id: "tourism",
    label: "Tourism",
    tagline: "Tailored tourism experiences for every kind of traveller.",
    Icon: PlaneIcon,
    columns: [
     
      
      {
        heading: "India Destinations",
        links: [
          { label: "Maharashtra Tourism", href: "#" },
          { label: "Jaipur Tourism", href: "#" },
          { label: "Ahmedabad Tourism", href: "#" },
          { label: "Udaipur Tourism", href: "#" },
          { label: "Tamil-Nadu Tourism", href: "#" },
          { label: "Himachal-Pradesh Tourism", href: "#" },
          { label: "Gujarat Tourism", href: "#" },
          { label: "Munnar Tourism", href: "#" },
          { label: "Cochin Tourism", href: "#" },
          { label: "Assam Tourism", href: "#" },
        ],
      },
      {
        heading: "More India Destinations",
        links: [
          { label: "Chandigarh Tourism", href: "#" },
          { label: "Uttarakhand Tourism", href: "#" },
          { label: "Guwahati Tourism", href: "#" },
          { label: "Rishikesh Tourism", href: "#" },
          { label: "Haridwar Tourism", href: "#" },
          { label: "Mussoorie Tourism", href: "#" },
          { label: "Shimla Tourism", href: "#" },
          { label: "Varanasi Tourism", href: "#" },
          { label: "Alleppey Tourism", href: "#" },
          { label: "Chittorgarh Tourism", href: "#" },
          { label: "Ayodhya Tourism", href: "#" },
        ],
      },
      {
        heading: "Popular States & Cities",
        links: [
          { label: "Madhya-Pradesh Tourism", href: "#" },
          { label: "Lucknow Tourism", href: "#" },
          { label: "Meghalaya Tourism", href: "#" },
          { label: "Nainital Tourism", href: "#" },
          { label: "West-Bengal Tourism", href: "#" },
          { label: "Shillong Tourism", href: "#" },
          { label: "Karnataka Tourism", href: "#" },
          { label: "Manali Tourism", href: "#" },
          { label: "Amritsar Tourism", href: "#" },
        ],
      },
      {
        heading: "International Destinations",
        links: [
          { label: "Paris Tourism", href: "#" },
          { label: "Italy Tourism", href: "#" },
          { label: "Australia Tourism", href: "#" },
          { label: "Japan Tourism", href: "#" },
          { label: "London Tourism", href: "#" },
          { label: "Singapore Tourism", href: "#" },
          { label: "Vietnam Tourism", href: "#" },
          { label: "Dubai Tourism", href: "#" },
          { label: "Bali Tourism", href: "#" },
          { label: "Nepal Tourism", href: "#" },
        ],
      },
      {
        heading: "More International Destinations",
        links: [
          { label: "Bhutan Tourism", href: "#" },
          { label: "South Korea Tourism", href: "#" },
          { label: "Turkey Tourism", href: "#" },
          { label: "Thailand Tourism", href: "#" },
          { label: "Europe Tourism", href: "#" },
          { label: "India Tourism", href: "#", pill: true },
          { label: "World Tourism", href: "#", pill: true },
        ],
      },
    ],
  },
  {
    id: "speciality",
    label: "Speciality Tours",
    tagline: "Curated experiences for every kind of traveller.",
    Icon: StarIcon,
    columns: [
      {
        heading: "Bestselling Tours",
        links: [
          { label: "Womens' Special Tour Packages", href: "#" },
          { label: "Seniors' Special Tour Packages", href: "#" },
          { label: "Honeymoon Special Packages", href: "#" },
          { label: "Family Tour Packages", href: "#" },
        ],
      },
      {
        heading: "Curated Holidays from HillMount",
        links: [
          { label: "Personalised Holidays", href: "#" },
          { label: "Cruise", href: "#" },
          { label: "Weekend Getaway", href: "#" },
          { label: "Day Out", href: "#" },
        
        ],
      },
      
    ],
  },
];

const Footer = () => {
  const [showMap,    setShowMap]    = useState(false);
  const [activeTab,  setActiveTab]  = useState("explore");
  const [subName,    setSubName]    = useState("");
  const [subEmail,   setSubEmail]   = useState("");
  const [subPhone,   setSubPhone]   = useState("");
  const [subCountry, setSubCountry] = useState(INDIA);
  const [subLoading, setSubLoading] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [subError,   setSubError]   = useState("");
  const submittingRef = useRef(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubLoading(true);
    setSubError("");
    try {
      const res  = await fetch(`${API}/api/newsletter`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: subName, email: subEmail, phone: subPhone ? `${subCountry.dial} ${subPhone}` : "" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed.");
      setSubSuccess(true);
      setSubName(""); setSubEmail(""); setSubPhone("");
    } catch (err) {
      setSubError(err.message);
    } finally {
      setSubLoading(false);
      submittingRef.current = false;
    }
  };

  const currentTab = footerTabs.find((t) => t.id === activeTab);
  const colCount = currentTab?.columns.length ?? 3;
  const gridColsClass =
    colCount >= 5 ? "grid-cols-2 sm:grid-cols-4"
    : colCount === 4 ? "grid-cols-2 sm:grid-cols-4"
    : "grid-cols-2 sm:grid-cols-3";

  return (
    <footer
      className="w-full flex flex-col mt-auto"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* TOP WHITE SECTION */}
      <div className="bg-white py-8 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 relative">

          <div className="absolute top-0 left-0 text-[80px] font-bold text-gray-100 -z-10 tracking-tighter leading-none -translate-y-6 select-none pointer-events-none">
            Margin
          </div>

          {/* Our Offices */}
          <div className="flex-1 w-full md:max-w-[260px]">
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={20} className="text-black" strokeWidth={1.5} />
              <h3 className="text-[15px] font-bold text-black">Our Offices</h3>
            </div>
            <p className="text-[12px] text-gray-700 mb-3 leading-relaxed">
              Step into a space where every journey begins with a warm conversation and thoughtful
              guidance. Visit us at our Coimbatore office and let's create travel experiences that
              feel personal, comforting, and as welcoming as home.
            </p>
            <button
              onClick={() => setShowMap((v) => !v)}
              className="text-black font-bold text-[12px] hover:text-[#1E88E5] hover:underline underline-offset-4 transition"
            >
              {showMap ? "Hide Map ↑" : "Locate Us →"}
            </button>
            <a
              href="https://www.google.com/maps/search/51+East+TV+Samy+Road+RS+Puram+Coimbatore+641002"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-gray-600 leading-snug hover:text-[#1E88E5] hover:underline underline-offset-2 transition cursor-pointer block mt-1"
            >
              51, Ground Floor, East TV Samy Road, RS Puram, Coimbatore - 641 002
            </a>
            {showMap && (
              <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <iframe
                  src={MAP_SRC}
                  width="100%"
                  height="220"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="HillMount Holidays Location"
                />
              </div>
            )}
          </div>

          {/* Call Us */}
          <div className="flex-1 w-full md:max-w-[260px]">
            <div className="flex items-center gap-2 mb-3">
              <Phone size={20} className="text-black" strokeWidth={1.5} />
              <h3 className="text-[15px] font-bold text-black">Call us</h3>
            </div>
            <p className="text-[12px] text-gray-700 mb-4 leading-relaxed">
              Whether you're planning your next escape or simply exploring possibilities, we're
              always here to help. Speak with your travel experts and start a journey designed to
              feel warm, effortless, and as familiar as home.
            </p>
            <div className="flex flex-col gap-1.5">
              <a href="tel:+919994666522" className="text-black font-bold text-[13px] hover:text-[#1E88E5] transition">
                +91 99946 66522
              </a>
              <a href="tel:+919791166522" className="text-black font-bold text-[13px] hover:text-[#1E88E5] transition">
                +91 97911 66522
              </a>
              <a href="tel:04224366522" className="text-black font-bold text-[13px] hover:text-[#1E88E5] transition">
                +91 422 43 66522
              </a>
            </div>
          </div>

          {/* Write to us */}
          <div className="flex-1 w-full md:max-w-[300px]">
            <div className="flex items-center gap-2 mb-3">
              <Mail size={20} className="text-black" strokeWidth={1.5} />
              <h3 className="text-[15px] font-bold text-black">Write to us</h3>
            </div>
            <p className="text-[12px] text-gray-700 mb-3 leading-relaxed">
              We're always happy to hear from you—whether it's a travel enquiry, feedback, or just
              the beginning of your next journey. Reach out anytime, and we'll make sure your
              experience starts with care and attention.
            </p>
            <div className="text-[11px] text-gray-700 space-y-1.5">
              <p>
                For Feedback:{" "}
                <a href="mailto:feedback@hillmountholidays.com" className="text-black font-bold hover:underline">
                  feedback@hillmountholidays.com
                </a>
              </p>
              <p>
                For Enquiries:{" "}
                <a href="mailto:sales@hillmountholidays.com" className="text-black font-bold hover:underline">
                  sales@hillmountholidays.com
                </a>
              </p>
            </div>
          </div>

          {/* Connect with us */}
          <div className="flex-1 w-full md:max-w-[200px]">
            <h3 className="text-[15px] font-bold text-black mb-4">Connect with us</h3>
            <div className="flex flex-wrap items-center gap-3 text-black">
              {[
                { href: "https://www.facebook.com/veenaworldcoimbatore/", label: "Facebook", svg: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
                { href: "https://www.instagram.com/veena_world_hillmount_holidays/", label: "Instagram", svg: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
                { href: "https://www.linkedin.com/company/hillmountholidays/", label: "LinkedIn", svg: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
                { href: "https://www.youtube.com/@hillmountholidays", label: "YouTube", svg: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg> },
                { href: "https://wa.me/914224366522", label: "WhatsApp", svg: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
              
              ].map(({ href, label, svg }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="hover:text-gray-500 transition" title={label}>
                  {svg}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM DARK SECTION — footer bg image */}
      <div
        className="pt-12 pb-8 px-4 text-white relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${FooterBg})` }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-14">

          {/* Newsletter Section — unchanged */}
          <div className="flex-shrink-0 w-full lg:max-w-[360px]">
            <div className="mb-5 -ml-4">
              <img src={Logo} alt="HillMount Holidays" className="h-[80px] object-contain" />
            </div>
            <h3 className="text-[15px] font-bold mb-2">Keep travelling all year round!</h3>
            <p className="text-[11px] text-gray-300 mb-5 leading-relaxed">
              Subscribe to our newsletter to find travel inspiration in your inbox.
            </p>
            {subSuccess ? (
              <div className="flex items-center gap-2 bg-green-800/30 border border-green-500 rounded px-4 py-3 mt-2">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                <p className="text-[12px] text-green-300 font-medium">Subscribed! We'll be in touch.</p>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubscribe}>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Full Name*"
                    required
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="w-full bg-[#5c5c5c] border border-gray-400 rounded-sm px-3 py-2 text-[12px] text-white placeholder-gray-300 outline-none focus:border-white transition"
                  />
                  <input
                    type="email"
                    placeholder="Email ID*"
                    required
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    className="w-full bg-[#5c5c5c] border border-gray-400 rounded-sm px-3 py-2 text-[12px] text-white placeholder-gray-300 outline-none focus:border-white transition"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-1 relative">
                    <FooterCountryPicker selected={subCountry} onChange={setSubCountry} />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={subPhone}
                      onChange={(e) => setSubPhone(e.target.value)}
                      className="w-full bg-[#5c5c5c] border border-gray-400 rounded-r-sm px-3 py-2 text-[12px] text-white placeholder-gray-300 outline-none focus:border-white transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={subLoading}
                    className={`font-semibold text-[12px] px-6 py-2 rounded-sm transition flex-1 max-w-[120px]
                      ${subLoading ? "bg-yellow-300 text-gray-500 cursor-not-allowed" : "bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white cursor-pointer"}`}
                  >
                    {subLoading ? "Sending…" : "Subscribe"}
                  </button>
                </div>
                {subError && (
                  <p className="text-[11px] text-red-400">{subError}</p>
                )}
              </form>
            )}
          </div>

          {/* RIGHT: Tabbed Links Navigation */}
          <div className="flex-1 min-w-0">
            {/* Tab Buttons */}
            <div className="flex flex-wrap gap-2 mb-5 border-b border-gray-500 pb-4">
              {footerTabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                    activeTab === id
                      ? "bg-[#1E88E5] text-white"
                      : "border border-gray-500 text-gray-300 hover:border-gray-300 hover:text-white"
                  }`}
                >
                  <Icon />
                  {label}
                </button>
              ))}
            </div>

            {/* Tagline */}
            {currentTab?.tagline && (
              <p className="text-[11px] text-gray-300 mb-5 italic">{currentTab.tagline}</p>
            )}

            {/* Columns — min-h holds the tallest tab so the disclaimer never shifts */}
            <div className={`grid gap-x-4 gap-y-6 ${gridColsClass} min-h-[260px]`}>
              {currentTab?.columns.map((col) => (
                <div key={col.heading}>
                  <h4 className="font-bold mb-3 text-[10px] text-[#1E88E5] uppercase tracking-wider">
                    {col.heading}
                  </h4>
                  <ul className="space-y-2">
                    {col.links.map((link) =>
                      link.pill ? (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            className="inline-block text-[10px] text-gray-300 hover:text-white hover:border-gray-300 transition leading-snug border border-gray-500 rounded-full px-3 py-1 mt-1"
                          >
                            {link.label}
                          </a>
                        </li>
                      ) : (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            className="text-[10px] text-gray-300 hover:text-white transition leading-snug flex items-start gap-1.5"
                          >
                            <span className="text-gray-500 mt-[3px] text-[7px] flex-shrink-0">●</span>
                            <span>
                              {link.label}
                              {link.badge && (
                                <span className="ml-1.5 text-[#1E88E5] font-semibold text-[9px]">
                                  {link.badge}
                                </span>
                              )}
                            </span>
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Disclaimer */}
        <div className="relative z-10 max-w-7xl mx-auto border-t border-gray-600 pt-4 pb-4">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            <span className="font-bold text-gray-200">*Caution: Beware of Fake Promotions or Offers</span>{" "}
            *Please do not believe or engage with any promotional emails, SMS or Web-link which ask
            you to click on a link and fill in your details. All HillMount authorized email
            communications are delivered from domain @hillmountholidays.com. *HillMount bears no
            liability or responsibility whatsoever for any communication which is fraudulent or
            misleading in nature and not received from registered domain.
          </p>
        </div>

        {/* Copyright & Bottom Links */}
        <div className="relative z-10 max-w-7xl mx-auto border-t border-gray-600 pt-5 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-300 gap-4">
          <div className="flex-1 text-center md:text-left">
            HillMount Holidays India Pvt Ltd. All Rights Reserved.
          </div>
          <div className="flex items-center gap-8 justify-center">
            <a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a>
            <a href="/terms-conditions" className="hover:text-white transition">Terms &amp; Conditions</a>
            <a href="#" className="hover:text-white transition">Site Map</a>
          </div>
          <div className="flex-1 flex justify-center md:justify-end items-center gap-1.5 text-gray-400">
            <Lock size={12} strokeWidth={2.5} />
            <span>Payments on website are secure</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;


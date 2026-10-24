import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight, ChevronDown, MapPin, X,
  BedDouble, Utensils, Plane, Camera, Bus,
  Info, Loader2, Download, Sparkles, ArrowRight, Check,
} from "lucide-react";
import TravelBlogNewsletter from "../components/TravelBlogNewsletter";
import { API } from "../components/adminComponents/apiHelper";

/* ── icon name → component map ── */
const ICON_MAP = {
  Hotel:       BedDouble,
  Meals:       Utensils,
  Flight:      Plane,
  Sightseeing: Camera,
  Transport:   Bus,
  Guide:       MapPin,
  Insurance:   Info,
};
const resolveIcon = (name) => ICON_MAP[name] || BedDouble;

const MAIN_TABS   = ["Itinerary", "Tour Information", "Need to Know"];
const INFO_TABS   = ["Tour Inclusions", "Tour Exclusions"];

/* ── Itinerary accordion row ── */
const ItineraryAccordion = ({ item, isLast, isOpen, onToggle }) => (
  <div className="flex gap-2 sm:gap-4">
    {/* Timeline */}
    <div className="flex flex-col items-center pt-1">
      <div
        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition ${
          isOpen ? "bg-[#1E88E5] shadow-md shadow-blue-200" : "bg-blue-100"
        }`}
      >
        <MapPin size={12} className={isOpen ? "text-white" : "text-[#1E88E5]"} />
      </div>
      {!isLast && <div className="w-[2px] flex-1 bg-gradient-to-b from-blue-200 to-gray-100 my-1 min-h-[24px]" />}
    </div>

    {/* Content */}
    <div className={`flex-1 min-w-0 mb-4 rounded-xl border transition ${
      isOpen ? "border-blue-200 bg-blue-50/40 shadow-sm" : "border-gray-100 hover:border-gray-200"
    }`}>
      {/* Header */}
      <div
        className="flex items-start justify-between gap-3 cursor-pointer p-4"
        onClick={onToggle}
      >
        <div className="min-w-0">
          <p className="text-[11px] text-[#1E88E5] font-bold tracking-wide mb-1">
            {item.dayLabel}{item.date ? ` · ${item.date}` : ""}
          </p>
          <p className="text-[14px] font-semibold text-gray-800 leading-snug">
            {item.title}
          </p>
        </div>
        <button
          className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition mt-0.5 ${
            isOpen ? "border-[#1E88E5] bg-[#1E88E5] text-white" : "border-gray-300 text-gray-500 hover:border-[#1E88E5] hover:bg-[#fffbeb]"
          }`}
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Expanded body */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-blue-100 pt-3">
          {item.sections?.map((sec, i) => {
            if (sec.type === "heading")
              return (
                <p key={i} className="text-[12.5px] font-bold text-gray-800 mt-2">
                  {sec.text}
                </p>
              );
            if (sec.type === "text") {
              const isHtml = /<[a-z][\s\S]*>/i.test(sec.text);
              return isHtml
                ? <div key={i} className="prose-content text-[12.5px] text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: sec.text }} />
                : <p key={i} className="text-[12.5px] text-gray-600 leading-relaxed">{sec.text}</p>;
            }
            if (sec.type === "list")
              return (
                <ul key={i} className="space-y-1.5">
                  {sec.items.map((li, j) => (
                    <li key={j} className="flex items-start gap-2 text-[12.5px] text-gray-600 leading-relaxed">
                      <span className="text-gray-400 shrink-0 mt-0.5">•</span>
                      {li}
                    </li>
                  ))}
                </ul>
              );
            return null;
          })}

          {/* Amenities */}
          {item.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-3 border-t border-blue-100 mt-2">
              {item.amenities.map(({ label, icon }, i) => {
                const Icon = resolveIcon(icon);
                return (
                  <div key={i} className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-3 py-1.5 text-gray-600 shadow-sm">
                    <Icon size={13} className="text-[#1E88E5]" />
                    <span className="text-[11.5px] font-medium">{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

/* ── highlights modal ── */
const HighlightsModal = ({ highlights, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[320px] max-h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-[13.5px] font-bold text-gray-900 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#1E88E5]" /> Tour Highlights
          </h3>
          <button onClick={onClose} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition cursor-pointer">
            <X size={12} />
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-3 space-y-2.5">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-blue-400 text-[9px] shrink-0 mt-1">◆</span>
              <span className="text-[12.5px] text-gray-700 leading-snug">{h}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-[10.5px] text-gray-400 leading-relaxed italic">
            <strong className="not-italic text-gray-500">Note:</strong> Highlights may change based on selected dates.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── main component ── */
const CustomizedHolidaySingle = () => {
  const { slug } = useParams();
  const [pkg,           setPkg]           = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [notFound,      setNotFound]      = useState(false);
  const [activeTab,     setActiveTab]     = useState("Itinerary");
  const [activeInfoTab, setActiveInfoTab] = useState("Tour Inclusions");
  const [showModal,     setShowModal]     = useState(false);
  const [expandedDay,   setExpandedDay]   = useState(-1);
  const [showTooltip,   setShowTooltip]   = useState(false);

  const itineraryRef  = useRef(null);
  const infoRef       = useRef(null);
  const needToKnowRef = useRef(null);

  const sectionRefs = {
    "Itinerary":        itineraryRef,
    "Tour Information": infoRef,
    "Need to Know":     needToKnowRef,
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/customized-holidays/slug/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setPkg(d.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const ref = sectionRefs[tab];
    if (ref?.current) setTimeout(() => ref.current.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const scrollToItinerary = () => {
    setActiveTab("Itinerary");
    itineraryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleDay = (i) => setExpandedDay((prev) => (prev === i ? -1 : i));

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={32} className="animate-spin text-[#1E88E5]" />
      </div>
    );
  }

  if (notFound || !pkg) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-gray-500 text-sm">Package not found.</p>
        <Link to="/personalised-holidays" className="text-[#1E88E5] font-semibold text-sm hover:underline">
          ← Back to Personalised Holidays
        </Link>
      </div>
    );
  }

  const heroSrc = pkg.heroImage ? `${API}${pkg.heroImage}` : null;

  return (
    <div className="w-full bg-gray-50 font-inter min-h-screen pb-16">
      {showModal && <HighlightsModal highlights={pkg.highlights || []} onClose={() => setShowModal(false)} />}

      <div className="max-w-7xl mx-auto px-4 pt-4">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-[11.5px] text-gray-400 mb-4 flex-wrap">
          {["Home", "Personalised Holidays"].map((c) => (
            <span key={c} className="flex items-center gap-1">
              <Link to={c === "Home" ? "/" : "/personalised-holidays"} className="hover:text-gray-600 transition">{c}</Link>
              <ChevronRight size={10} className="text-gray-300" />
            </span>
          ))}
          <span className="text-gray-700 font-medium truncate">{pkg.title}</span>
        </nav>

        {/* ── HERO ── */}
        <div className="relative">
          <div className="w-full h-[240px] md:h-[360px] rounded-2xl overflow-hidden bg-slate-200">
            {heroSrc
              ? <img src={heroSrc} alt={pkg.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-400 text-sm">No image</div>
            }
          </div>

          {/* Floating info card overlapping the hero */}
          <div className="relative -mt-12 md:-mt-16 mx-2 md:mx-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="min-w-0 flex-1">
                {/* Badges — tour code → interests → tags */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {pkg.tourCode && (
                    <span className="text-[9.5px] font-extrabold text-white bg-[#1e3a5f] px-2.5 py-1 rounded-sm uppercase tracking-widest">
                      {pkg.tourCode}
                    </span>
                  )}
                  {(pkg.interests || []).map((ex) => (
                    <span key={ex} className="text-[11px] text-gray-500 border border-gray-200 px-2 py-0.5 rounded-sm">
                      {ex}
                    </span>
                  ))}
                  {(pkg.tags || []).map((b) => (
                    <span key={b} className="text-[9.5px] font-bold text-orange-700 border border-orange-300 bg-orange-50 px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      {b}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-[21px] md:text-[26px] font-extrabold text-gray-900 leading-tight mb-2.5">
                  {pkg.title}
                </h1>

                {/* Subtitle / tour info */}
                {pkg.tourInfo && (() => {
                  const isHtml = /<[a-z][\s\S]*>/i.test(pkg.tourInfo);
                  return isHtml
                    ? <div className="prose-content text-[12.5px] text-gray-500 leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: pkg.tourInfo }} />
                    : <p className="text-[12.5px] text-gray-500 leading-relaxed mb-3">{pkg.tourInfo}</p>;
                })()}

                {/* Stats */}
                <div className="flex items-center gap-2 text-[12.5px] text-gray-600 font-medium mb-3 flex-wrap">
                  <span className="bg-gray-100 rounded-full px-2.5 py-1">{pkg.days} Days</span>
                  <span className="bg-gray-100 rounded-full px-2.5 py-1">{pkg.states} States</span>
                  <span className="relative bg-gray-100 rounded-full px-2.5 py-1 flex items-center gap-1">
                    {pkg.cities} Cities
                    <span
                      className="relative cursor-pointer flex items-center"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <Info size={13} className="text-gray-400 hover:text-gray-600 transition" />
                      {showTooltip && (
                        <div className="absolute left-0 top-6 w-60 bg-blue-50 border border-blue-100 rounded-lg shadow-lg px-3 py-2.5 z-20">
                          <p className="text-[11.5px] text-gray-600 leading-relaxed">
                            Cities and night stays may change based on the selected departure date.
                          </p>
                        </div>
                      )}
                    </span>
                  </span>
                </div>

                {/* Destinations */}
                {(pkg.destRow?.length > 0 || pkg.destination) && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-gray-500">
                    <div className="flex items-center gap-1 shrink-0">
                      <MapPin size={11} className="text-amber-500" />
                      <span className="font-semibold text-gray-600">{pkg.destination || pkg.destRow?.[0]}</span>
                    </div>
                    {(pkg.destRow || []).map((d, i) => (
                      <span key={i} className="flex items-center gap-1.5">
                        <ChevronRight size={11} className="text-gray-300" />
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick action */}
              <div className="shrink-0 flex md:flex-col gap-2 md:w-[180px]">
                <button
                  onClick={scrollToItinerary}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white text-[12.5px] font-bold px-4 py-2.5 rounded-lg transition cursor-pointer"
                >
                  View Itinerary <ArrowRight size={13} />
                </button>
               
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY: main + sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-6 items-start">

          {/* ── MAIN CONTENT ── */}
          <div className="min-w-0">

            {/* ── HIGHLIGHTS ── */}
            {pkg.highlights?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5 shadow-sm">
                <h3 className="text-[14px] font-bold text-gray-900 mb-4 flex items-center gap-1.5">
                  <Sparkles size={15} className="text-[#1E88E5]" /> Tour Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-4">
                  {pkg.highlights.slice(0, 6).map((h, i) => (
                    <div key={i} className="flex items-center gap-2 bg-blue-50 border border-[#1E88E5] rounded-lg px-3 py-2 min-w-0">
                      <span className="text-[#1E88E5] shrink-0 text-[10px]">◆</span>
                      <span className="text-[12px] text-gray-700 leading-snug break-words">{h}</span>
                    </div>
                  ))}
                </div>
                {pkg.highlights.length > 6 && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-[12px] font-bold text-[#1E88E5] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    View all {pkg.highlights.length} highlights <ChevronRight size={12} />
                  </button>
                )}
              </div>
            )}

            {/* ── MAIN TABS ── */}
            <div className="flex gap-1 mb-6 overflow-x-auto bg-white border border-gray-100 rounded-full p-1.5 shadow-sm" style={{ scrollbarWidth: "none" }}>
              {MAIN_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-4 py-2 text-[12.5px] font-semibold whitespace-nowrap rounded-full transition cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#1E88E5] text-white"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ── ITINERARY ── */}
            <div className="mb-6 scroll-mt-24 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm" ref={itineraryRef}>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-extrabold text-gray-900">Itinerary</h2>
                  <span className="text-gray-400 text-[12.5px] font-medium">(Day Wise)</span>
                </div>
                <button
                  onClick={() => setExpandedDay(expandedDay === -1 ? 0 : -1)}
                  className="text-[12px] text-[#1E88E5] font-semibold hover:underline cursor-pointer"
                >
                  {expandedDay === -1 ? "Collapse all" : "View all days"}
                </button>
              </div>

              {/* Accordion days */}
              <div>
                {(pkg.itinerary || []).map((item, i) => (
                  <ItineraryAccordion
                    key={i}
                    item={item}
                    isLast={i === (pkg.itinerary.length - 1)}
                    isOpen={expandedDay === i}
                    onToggle={() => toggleDay(i)}
                  />
                ))}
              </div>
            </div>

            {/* ── TOUR INFORMATION ── */}
            {(pkg.inclusions?.length > 0 || pkg.exclusions?.length > 0) && (
              <div className="mb-6 scroll-mt-24 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm" ref={infoRef}>
                <h2 className="text-[16px] font-extrabold text-gray-900 mb-4">Tour Information</h2>

                <div className="flex gap-2 mb-5 flex-wrap">
                  {INFO_TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveInfoTab(tab)}
                      className={`px-4 py-2 rounded-full text-[12px] font-semibold transition cursor-pointer ${
                        activeInfoTab === tab
                          ? "bg-[#1E88E5] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeInfoTab === "Tour Inclusions" && (
                  <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-3">
                    {(pkg.inclusions || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="shrink-0 w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center mt-0.5">
                          <Check size={11} className="text-green-500" strokeWidth={2.5} />
                        </div>
                        <p className="text-[12.5px] text-gray-700 leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                )}

                {activeInfoTab === "Tour Exclusions" && (
                  <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-3">
                    {(pkg.exclusions || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="shrink-0 w-5 h-5 rounded-full border-2 border-red-400 flex items-center justify-center mt-0.5">
                          <span className="text-red-400 text-[11px] font-bold leading-none">✕</span>
                        </div>
                        <p className="text-[12.5px] text-gray-700 leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* ── NEED TO KNOW ── */}
            {pkg.needToKnow && (
              <div className="mb-6 scroll-mt-24 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm" ref={needToKnowRef}>
                <h2 className="text-[16px] font-extrabold text-gray-900 mb-1">Need to Know</h2>
                <p className="text-[11.5px] text-gray-400 mb-5">Things to consider before the trip</p>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  {/<[a-z][\s\S]*>/i.test(pkg.needToKnow)
                    ? <div className="prose-content text-[12.5px] text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: pkg.needToKnow }} />
                    : <p className="text-[12.5px] text-gray-600 leading-relaxed whitespace-pre-line">{pkg.needToKnow}</p>
                  }
                </div>
              </div>
            )}

          </div>

          {/* ── SIDEBAR ── */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-6">
            {/* Tour Includes */}
            {pkg.includes?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-[13px] font-bold text-gray-900 mb-4">Tour Includes</h3>
                <div className="grid grid-cols-3 gap-3">
                  {pkg.includes.map(({ icon, label }) => {
                    const Icon = resolveIcon(icon);
                    return (
                      <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                        <div className="w-10 h-10 rounded-full bg-[#1E88E5]/10 flex items-center justify-center">
                          <Icon size={16} className="text-[#1E88E5]" />
                        </div>
                        <span className="text-[10px] text-gray-600 font-medium">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price + callback form — below Quick Facts on mobile, above on desktop */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm order-last lg:order-none">
              {pkg.price > 0 && (
                <div className="mb-4 pb-3 border-b border-gray-100">
                  <p className="text-[10px] text-gray-400 mb-0.5">Starts From</p>
                  <p className="text-[22px] font-extrabold text-gray-900 leading-none">
                    ₹{pkg.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Per Person</p>
                </div>
              )}

              <h3 className="text-[13px] font-bold text-gray-900 mb-4 leading-tight">Want us to call you?</h3>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[10.5px] text-gray-500 font-semibold mb-1 block">Full Name</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#1E88E5] transition" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-[10.5px] text-gray-500 font-semibold mb-1 block">Phone</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#1E88E5] transition">
                    <div className="bg-gray-50 border-r border-gray-200 px-2 py-2 flex items-center gap-1 shrink-0">
                      <span className="text-[14px]">🇮🇳</span>
                      <span className="text-[11px] text-gray-600 font-semibold">+91</span>
                    </div>
                    <input type="tel" className="flex-1 px-2 py-2 text-[12px] outline-none bg-white min-w-0" placeholder="Mobile number" />
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white font-bold text-[12.5px] py-2.5 rounded-lg transition cursor-pointer">
                Request Call Back
              </button>
            </div>

            {/* Quick facts */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-[13px] font-bold text-gray-900 mb-3">Quick Facts</h3>
              <ul className="space-y-2.5 text-[12px] text-gray-600">
                <li className="flex items-center justify-between">
                  <span>Duration</span>
                  <span className="font-semibold text-gray-800">{pkg.days} Days</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>States Covered</span>
                  <span className="font-semibold text-gray-800">{pkg.states}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Cities Covered</span>
                  <span className="font-semibold text-gray-800">{pkg.cities}</span>
                </li>
                {pkg.tourCode && (
                  <li className="flex items-center justify-between">
                    <span>Tour Code</span>
                    <span className="font-semibold text-gray-800">{pkg.tourCode}</span>
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* ── TESTIMONIALS / BLOG / NEWSLETTER ── */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <TravelBlogNewsletter />
      </div>
    </div>
  );
};

export default CustomizedHolidaySingle;

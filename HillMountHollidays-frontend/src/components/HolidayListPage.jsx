import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, SlidersHorizontal, X, MapPin, Heart, Star,
  BedDouble, Utensils, Plane, Camera, Bus, Info,
} from "lucide-react";
import EnquiryModal from "./EnquiryModal";
import HeroSkeleton, { useImageLoaded } from "./HeroSkeleton";
import { API } from "./adminComponents/apiHelper";
import { fetchProductList } from "../services/veenaWorldApi";
import { CUSTOMIZED_HOLIDAY_PACKAGES } from "../data/customizedPackagesData";

const RevealItem = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(50px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
};

const DAY_TABS = ["2-14 Days", "3-14 Days", "4-14 Days", "5-14 Days", "7-14 Days"];

/* Curved arch card shape (scales with the card via objectBoundingBox units) */
const ARCH_PATH =
  "M 0.045 1 Q 0 1 0 0.965 L 0 0.27 Q 0 0.235 0.03 0.215 L 0.455 0.018 Q 0.5 0 0.545 0.018 L 0.97 0.215 Q 1 0.235 1 0.27 L 1 0.965 Q 1 1 0.955 1 Z";

const ArchClipDefs = () => (
  <svg width="0" height="0" className="absolute" aria-hidden="true">
    <defs>
      <clipPath id="pkgArchClip" clipPathUnits="objectBoundingBox">
        <path d={ARCH_PATH} />
      </clipPath>
    </defs>
  </svg>
);

const SkeletonCard = () => (
  <div style={{ clipPath: "url(#pkgArchClip)" }} className="bg-gray-100 overflow-hidden flex flex-col">
    <div className="w-full h-[190px] skeleton-shimmer" />
    <div className="px-3.5 py-3 space-y-2">
      <div className="h-4 skeleton-shimmer rounded w-3/4" />
      <div className="h-3 skeleton-shimmer rounded w-1/2" />
    </div>
  </div>
);

/* icon name (from backend `includes`) → lucide component */
const ICON_MAP = {
  Hotel:       BedDouble,
  Meals:       Utensils,
  Flight:      Plane,
  Sightseeing: Camera,
  Transport:   Bus,
  Guide:       MapPin,
  Insurance:   Info,
};
const DEFAULT_INCLUDES = ["Flight", "Hotel", "Meals", "Sightseeing", "Transport", "Insurance"]
  .map((icon) => ({ icon, label: icon }));

const PackageCard = ({ pkg, delay, onClick }) => {
  const imgSrc = pkg.heroImage
    ? (pkg.heroImage.startsWith("http") ? pkg.heroImage : `${API}${pkg.heroImage}`)
    : pkg.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=500&auto=format&fit=crop";
  const includes = pkg.includes?.length ? pkg.includes : DEFAULT_INCLUDES;
  const emiText = pkg.bannerEMI ? `EMI ₹${Number(pkg.bannerEMI).toLocaleString("en-IN")}/mo` : null;

  return (
    <RevealItem delay={delay}>
      <div
        onClick={onClick}
        style={{ clipPath: "url(#pkgArchClip)", background: "#1E88E5" }}
        className="hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col h-full"
      >
        {/* blue border on all sides of the card */}
        <div
          style={{
            clipPath: "url(#pkgArchClip)",
            background: "#1E88E5",
          }}
          className="p-[4px] h-full flex flex-col"
        >
        <div
          style={{ clipPath: "url(#pkgArchClip)" }}
          className="bg-white flex flex-col h-full"
        >
        <div className="relative w-full h-[190px] overflow-hidden bg-slate-100 shrink-0">
          <img src={imgSrc} alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          
          {emiText && (
            <div className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              {emiText}
            </div>
          )}

          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
            <Star size={10} className="text-[#1E88E5] fill-[#1E88E5]" />
            <span className="text-[11px] font-bold text-gray-800 leading-none">{pkg.days}D</span>
          </div>
        </div>
        <div className="px-3.5 pt-3 pb-4 flex flex-col flex-1">
          {/* single-line fixed-height tag row so every card's title aligns */}
          <div className="flex items-center gap-1 h-[21px] mb-1.5 overflow-hidden">
            {(pkg.interests || []).slice(0, 2).map((tag) => (
              <span key={tag}
                className="text-[9.5px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full whitespace-nowrap truncate min-w-0">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-[14px] font-bold text-gray-900 leading-snug line-clamp-1">{pkg.title}</h3>
          <p className="text-[11.5px] text-gray-500 mt-0.5">{pkg.days} Days / {pkg.nights || (pkg.days > 1 ? pkg.days - 1 : 1)} Nights</p>

          {pkg.visits?.length > 0 && (
            <p className="text-[10.5px] text-gray-400 mt-1 truncate">
              📍 {pkg.visits.map((v) => v.city).filter(Boolean).join(" · ")}
            </p>
          )}

          {/* includes icons — driven by backend `includes` */}
          <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
            {includes.map(({ icon, label }, i) => {
              const IconComp = ICON_MAP[icon] || BedDouble;
              return (
                <span key={`${icon}-${i}`} title={label || icon}
                  className="w-7 h-7 border border-gray-200 rounded-md flex items-center justify-center text-[#1E88E5]">
                  <IconComp size={13} />
                </span>
              );
            })}
          </div>

          <div className="border-t border-gray-100 mt-auto pt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 mb-0.5 whitespace-nowrap">Starting from</p>
              <p className="text-[15px] font-extrabold text-[#1E88E5] leading-none whitespace-nowrap">
                {pkg.price > 0 ? `₹${pkg.price.toLocaleString("en-IN")}` : "On Request"}
              </p>
            </div>
            <button
              className="shrink-0 border border-[#1E88E5] text-[#1E88E5] text-[10.5px] font-bold px-3 py-1.5 rounded-full hover:bg-[#1E88E5] hover:text-white transition cursor-pointer">
              View Details →
            </button>
          </div>
        </div>
        </div>
        </div>
      </div>
    </RevealItem>
  );
};


const HolidayListPage = ({
  packageType,
  heroImageSrc,
  heroTagline,
  heroTitle = [],
  heroDesc,
  ctaLabel = "Enquire Now",
  detailPath,
}) => {
  const navigate = useNavigate();
  const [mounted,         setMounted]         = useState(false);
  const [packages,        setPackages]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [searchTerm,      setSearchTerm]      = useState("");
  const [activeCountries, setActiveCountries] = useState([]);
  const [activeDayTab,    setActiveDayTab]    = useState(null);
  const [activeInterests, setActiveInterests] = useState([]);
  const [sidebarOpen,     setSidebarOpen]     = useState(false);
  const [showEnquiry,     setShowEnquiry]     = useState(false);
  const heroLoaded = useImageLoaded(heroImageSrc);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setLoading(true);
    const localUrl = packageType
      ? `${API}/api/customized-holidays?type=${packageType}`
      : `${API}/api/customized-holidays`;

    const normalizeVeena = (p) => {
      const firstVisit = p.visits?.[0];
      const destName = firstVisit?.country || p.sectorName || (p.type === "Indian" ? "India" : "International");
      const nights = p.days > 1 ? p.days - 1 : 1;
      const priceVal = typeof p.price === "number" ? p.price : (p.price?.[0]?.discountedAmount || p.price?.[0]?.basicINR || 0);
      const tags = (p.subCategories || []).map((s) => (typeof s === "string" ? s : s.subCategoryName)).filter(Boolean);
      if (!tags.length && p.sectorName) tags.push(p.sectorName);

      return {
        _id: `veena-${p.code || p.id}`,
        id: p.id,
        code: p.code,
        title: p.title,
        days: p.days,
        nights: nights,
        destination: destName,
        heroImage: p.image,
        price: priceVal,
        bannerEMI: p.bannerEMI || p.emiData?.bannerEMI,
        interests: tags,
        isVeenaWorld: true,
        visits: p.visits || [],
        startingLocation: p.startingLocation || "Ex-Mumbai",
        type: p.type || "World",
        travelType: p.travelType || "FIT",
      };
    };

    const staticFallbackMapped = CUSTOMIZED_HOLIDAY_PACKAGES.map(normalizeVeena);

    Promise.allSettled([
      fetch(localUrl).then((r) => r.json()),
      fetchProductList({ TravelType: "FIT", PageSize: 100 }),
    ]).then(([localRes, veenaRes]) => {
      let combined = [];

      // 1. Local backend packages
      if (localRes.status === "fulfilled" && localRes.value?.success && Array.isArray(localRes.value.data)) {
        combined = [...localRes.value.data];
      }

      // 2. Veena World live API packages
      let veenaItems = [];
      if (veenaRes.status === "fulfilled" && veenaRes.value?.products?.length) {
        veenaItems = veenaRes.value.products.map(normalizeVeena);
      }

      // Fallback if live API returned 0 items
      if (!veenaItems.length) {
        veenaItems = staticFallbackMapped;
      }

      // Merge avoiding duplicate package codes
      const existingCodes = new Set(combined.map((cp) => cp.code || cp.slug));
      veenaItems.forEach((vp) => {
        if (!existingCodes.has(vp.code)) {
          combined.push(vp);
        }
      });

      setPackages(combined);
    }).finally(() => {
      setLoading(false);
    });
  }, [packageType]);

  const heroSlide = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  const countries = useMemo(() => {
    const map = {};
    packages.forEach((p) => { if (p.destination) map[p.destination] = (map[p.destination] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [packages]);

  const interests = useMemo(() => {
    const set = new Set();
    packages.forEach((p) => (p.interests || []).forEach((i) => set.add(i)));
    return [...set].sort();
  }, [packages]);

  const toggleCountry  = (n) => setActiveCountries((p) => p.includes(n) ? p.filter((c) => c !== n) : [...p, n]);
  const toggleInterest = (n) => setActiveInterests((p) => p.includes(n) ? p.filter((i) => i !== n) : [...p, n]);
  const clearAll = () => { setActiveCountries([]); setActiveInterests([]); setSearchTerm(""); setActiveDayTab(null); };

  const filtered = useMemo(() => {
    let r = packages;
    if (activeCountries.length) r = r.filter((p) => activeCountries.includes(p.destination));
    if (activeDayTab) { const min = parseInt(activeDayTab); r = r.filter((p) => p.days >= min); }
    if (activeInterests.length) r = r.filter((p) => activeInterests.some((i) => (p.interests || []).includes(i)));
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      r = r.filter((p) =>
        p.title.toLowerCase().includes(t) ||
        (p.destination || "").toLowerCase().includes(t) ||
        (p.interests || []).some((i) => i.toLowerCase().includes(t))
      );
    }
    return r;
  }, [packages, activeCountries, activeDayTab, activeInterests, searchTerm]);

  const hasFilters = activeCountries.length > 0 || activeInterests.length > 0 || searchTerm || activeDayTab;

  const SidebarContent = () => (
    <>
      <div className="relative mb-5">
        <input type="text" placeholder="Search..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-8 pl-3 py-2 text-[12px] border border-gray-200 rounded-lg outline-none focus:border-[#1E88E5] transition" />
        <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {countries.length > 0 && (
        <>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Destinations</p>
          <div className="space-y-3 mb-5">
            {countries.map((c) => (
              <label key={c.name} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2.5">
                  <input type="checkbox" checked={activeCountries.includes(c.name)}
                    onChange={() => toggleCountry(c.name)} className="accent-[#1E88E5] w-4 h-4 cursor-pointer rounded" />
                  <span className="text-[12.5px] text-gray-700 group-hover:text-black transition">{c.name} ({c.count})</span>
                </div>
              </label>
            ))}
          </div>
        </>
      )}

      {interests.length > 0 && (
        <>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Interest</p>
          <div className="space-y-3">
            {interests.map((interest) => (
              <label key={interest} className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={activeInterests.includes(interest)}
                  onChange={() => toggleInterest(interest)} className="accent-[#1E88E5] w-4 h-4 cursor-pointer rounded" />
                <span className="text-[12.5px] text-gray-700 group-hover:text-black transition">{interest}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="w-full font-inter bg-white min-h-screen pb-20">
      <ArchClipDefs />

      {/* HERO */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {heroImageSrc ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }} />
        ) : (
          <div className="absolute inset-0 bg-gray-800" />
        )}
        <HeroSkeleton show={!heroLoaded} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />

        <div className="absolute inset-0 flex items-center z-10">
          <div className="w-full max-w-7xl mx-auto px-8 md:px-12">
            <div className="max-w-lg">
              {heroTagline && (
                <p style={heroSlide(0.1)} className="text-[#1E88E5] text-[11px] font-bold uppercase tracking-[0.3em] mb-4">
                  {heroTagline}
                </p>
              )}
              <h1 style={heroSlide(0.25)}
                className="text-4xl md:text-4xl lg:text-[54px] font-extrabold leading-tight text-white tracking-tight mb-4">
                {heroTitle.map((line, i) => (
                  <span key={i}>{line}{i < heroTitle.length - 1 && <br />}</span>
                ))}
              </h1>
              {heroDesc && (
                <p style={heroSlide(0.4)} className="text-gray-300 text-sm md:text-[15px] leading-relaxed mb-8 font-light">
                  {heroDesc}
                </p>
              )}
              <div style={heroSlide(0.55)}>
                <button onClick={() => setShowEnquiry(true)}
                  className="bg-white hover:bg-[#1E88E5] text-black hover:text-white font-bold text-[13.5px] py-2.5 px-7 rounded-sm transition shadow-md cursor-pointer">
                  {ctaLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PACKAGES */}
      <div className="max-w-7xl mx-auto px-4 mt-10">

        <div className="flex md:hidden items-center justify-end mb-4">
          <button onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 bg-[#1E88E5] hover:bg-[#084298] text-white font-bold text-[13px] px-4 py-2 rounded-lg transition cursor-pointer">
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>

        <div className="flex gap-6">
          {/* SIDEBAR — desktop */}
          <aside className="hidden md:block w-52 shrink-0">
            <div className="sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-gray-700" />
                  <span className="text-[14px] font-bold text-gray-900">Filters</span>
                </div>
                {hasFilters && (
                  <button onClick={clearAll} className="text-[12px] text-blue-600 font-semibold hover:underline cursor-pointer">Clear all</button>
                )}
              </div>
              <SidebarContent />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Day tabs */}
            <div className="mb-6">
              <p className="text-[12.5px] font-semibold text-gray-600 mb-2.5">No of Days</p>
              <div className="flex flex-wrap gap-2">
                {DAY_TABS.map((tab) => (
                  <button key={tab} onClick={() => setActiveDayTab(activeDayTab === tab ? null : tab)}
                    className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition cursor-pointer ${
                      activeDayTab === tab ? "bg-[#1E88E5] border-[#1E88E5] text-white" : "bg-white border-gray-200 text-gray-600 hover:border-[#1E88E5]"
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-16 text-center border border-gray-100">
                <p className="text-gray-500 font-medium text-[15px] mb-3">
                  {packages.length === 0 ? "No packages available yet." : "No packages match your filters."}
                </p>
                {packages.length > 0 && (
                  <button onClick={clearAll} className="text-blue-600 hover:underline font-bold text-sm">Clear filters</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* {filtered.map((pkg, i) => (
                  <PackageCard key={pkg._id} pkg={pkg} delay={i * 0.06}
                    onClick={() => {
                      if (pkg.isVeenaWorld || pkg.code) {
                        navigate(`/tour-package/${pkg.code}?travelType=FIT`);
                      } else {
                        navigate(`${detailPath}/${pkg.slug}`);
                      }
                    }} />
                ))} */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative ml-auto w-72 h-full bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={15} />
                <span className="font-bold text-[14px] text-gray-900">Filters</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <SidebarContent />
            <div className="flex gap-3 mt-8">
              <button onClick={clearAll}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold text-[13px] py-2 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                Clear
              </button>
              <button onClick={() => setSidebarOpen(false)}
                className="flex-1 bg-[#1E88E5] text-white hover:text-white font-bold text-[13px] py-2 rounded-lg hover:bg-[#084298] transition cursor-pointer">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <EnquiryModal isOpen={showEnquiry} onClose={() => setShowEnquiry(false)} />
    </div>
  );
};

export default HolidayListPage;

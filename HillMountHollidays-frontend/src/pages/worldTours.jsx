import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronDown, Star, Moon, MapPin, Headphones, BadgeCheck,
  Clock, Wallet, Compass, Search, Globe, Loader2, Calendar
} from "lucide-react";
import { fetchProductList } from "../services/veenaWorldApi";
import TestimonialsBlogNewsletter from "../components/TestimonialsBlogNewsletter";
import { CUSTOMIZED_HOLIDAY_PACKAGES } from "../data/customizedPackagesData";

/* ─── scroll-reveal ─── */
const SlideIn = ({ children, delay = 0 }) => {
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
    <div
      ref={ref}
      className="h-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(30px)",
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const FILTER_FIELDS = [
  {
    key: "sector", label: "Continent / Sector", icon: MapPin,
    options: ["All Sectors", "Europe", "America", "South East Asia", "Middle East", "Australia", "Africa"],
  },
  {
    key: "duration", label: "Duration", icon: Clock,
    options: ["Any Duration", "4-7 Days", "8-12 Days", "13+ Days"],
  },
  {
    key: "budget", label: "Budget Range", icon: Wallet,
    options: ["Any Budget", "Under ₹1,00,000", "₹1,00,000 - ₹3,00,000", "Above ₹3,00,000"],
  },
];

const DEFAULT_FILTERS = {
  sector: "All Sectors",
  duration: "Any Duration",
  budget: "Any Budget",
};

const matchesDuration = (days, f) =>
  f === "Any Duration" ? true
  : f === "4-7 Days" ? days >= 4 && days <= 7
  : f === "8-12 Days" ? days >= 8 && days <= 12
  : days >= 13;

const matchesBudget = (price, f) =>
  f === "Any Budget" ? true
  : f === "Under ₹1,00,000" ? price < 100000
  : f === "₹1,00,000 - ₹3,00,000" ? price >= 100000 && price <= 300000
  : price > 300000;

/* ─── Search Filter Bar ─── */
const SearchFilterBar = ({ filters, onSelect, onSearch, searchTerm, setSearchTerm }) => {
  const [openKey, setOpenKey] = useState(null);
  const barRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) setOpenKey(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={barRef}
      className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 mb-6 p-3 flex flex-col lg:flex-row lg:items-center gap-3"
    >
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 lg:gap-0 lg:divide-x lg:divide-gray-100">
        {/* Search Query Input */}
        <div className="relative flex items-center px-3 py-2">
          <Search size={16} className="text-[#1E88E5] shrink-0 mr-2" />
          <input
            type="text"
            placeholder="Search country, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-[12.5px] font-medium text-gray-800 placeholder-gray-400 bg-transparent outline-none"
          />
        </div>

        {FILTER_FIELDS.map(({ key, label, icon: Icon, options }) => (
          <div key={key} className="relative">
            <button
              onClick={() => setOpenKey(openKey === key ? null : key)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-gray-50 transition cursor-pointer"
            >
              <Icon size={16} className="text-[#1E88E5] shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-gray-900">{label}</p>
                <p className="text-[11px] text-gray-500 truncate">{filters[key]}</p>
              </div>
              <ChevronDown
                size={13}
                className={`text-gray-400 shrink-0 transition-transform duration-200 ${openKey === key ? "rotate-180" : ""}`}
              />
            </button>
            {openKey === key && (
              <div className="absolute left-0 top-full mt-1 w-full min-w-[190px] bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-1 max-h-60 overflow-y-auto">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { onSelect(key, opt); setOpenKey(null); }}
                    className={`w-full text-left px-3.5 py-2 text-[12px] transition cursor-pointer ${
                      filters[key] === opt
                        ? "bg-blue-50 text-[#1E88E5] font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => { setOpenKey(null); onSearch(); }}
        className="shrink-0 bg-[#1E88E5] hover:bg-[#084298] text-white text-[13px] font-bold px-6 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
      >
        <Search size={15} />
        Find World Tours
      </button>
    </div>
  );
};

/* ─── World Tour Card ─── */
const TourCard = ({ pkg, delay }) => {
  const navigate = useNavigate();
  const priceVal = pkg.price?.[0]?.discountedAmount || pkg.price?.[0]?.asPerTourPrice || pkg.price?.[0]?.basicINR || 0;
  const depDate = pkg.departureDateAsString || pkg.departureDates?.[0]?.departureDate || pkg.startingLocation || "Upcoming";
  const nights = pkg.days > 1 ? pkg.days - 1 : 1;

  return (
    <SlideIn delay={delay}>
      <div
        onClick={() => navigate(`/tour-package/${pkg.code}`)}
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col cursor-pointer group"
      >
        <div className="relative w-full h-48 overflow-hidden bg-slate-100">
          <img
            src={pkg.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=400&fit=crop"}
            alt={pkg.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {pkg.sectorName && (
            <span className="absolute top-3 left-3 bg-[#1E88E5]/90 text-white text-[10.5px] font-extrabold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm">
              {pkg.sectorName}
            </span>
          )}
          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            4.9
          </span>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-[14.5px] font-extrabold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#1E88E5] transition">
              {pkg.title}
            </h3>
            {pkg.code && (
              <span className="shrink-0 text-[9.5px] font-extrabold text-[#1E88E5] border border-blue-200 bg-blue-50/80 rounded px-1.5 py-0.5 leading-none whitespace-nowrap">
                {pkg.code}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11.5px] text-gray-500 mb-3">
            <Moon size={12} className="shrink-0 text-[#1E88E5]" />
            <span>{pkg.days} Days / {nights} Nights</span>
          </div>

          <div className="flex items-start justify-between gap-2 mb-4 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <div className="min-w-0">
              <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">Starting Price</p>
              <p className="text-[16.5px] font-extrabold text-[#1E88E5] leading-tight">
                {priceVal > 0 ? `₹${priceVal.toLocaleString("en-IN")}` : "On Request"}
                <span className="text-[11px] font-semibold text-gray-500"> /-</span>
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">Departure</p>
              <p className="text-[11.5px] font-semibold text-gray-700 flex items-center justify-end gap-1">
                <Calendar size={12} className="text-[#1E88E5] shrink-0" />
                {depDate}
              </p>
            </div>
          </div>

          <div className="mt-auto">
            <Link
              to={`/tour-package/${pkg.code}`}
              className="w-full flex items-center justify-center gap-2 text-center text-[12px] font-bold text-white bg-[#1E88E5] group-hover:bg-[#084298] px-3 py-2.5 rounded-xl transition cursor-pointer shadow-sm"
            >
              Explore World Package →
            </Link>
          </div>
        </div>
      </div>
    </SlideIn>
  );
};

/* ─── Main WorldTours Component ─── */
const WorldTours = () => {
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState("");
  const resultsRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetchProductList({ ProductType: "World", PageSize: 200 }),
      fetchProductList({ TravelType: "FIT", PageSize: 100 }),
    ]).then(([gitRes, fitRes]) => {
      let combined = [];
      if (gitRes.status === "fulfilled" && gitRes.value?.products?.length) {
        combined = [...gitRes.value.products];
      }
      if (fitRes.status === "fulfilled" && fitRes.value?.products?.length) {
        const worldFit = fitRes.value.products.filter(p => p.type === "World");
        const existingCodes = new Set(combined.map(p => p.code));
        worldFit.forEach(p => {
          if (!existingCodes.has(p.code)) combined.push(p);
        });
      }

      // Merge static fallback World customized packages if missing
      const staticWorld = CUSTOMIZED_HOLIDAY_PACKAGES.filter(p => p.type === "World");
      const existingCodes = new Set(combined.map(p => p.code));
      staticWorld.forEach(p => {
        if (!existingCodes.has(p.code)) {
          combined.push({
            id: p.id,
            code: p.code,
            title: p.title,
            days: p.days,
            sectorName: p.sectorName,
            startingLocation: p.startingLocation,
            image: p.image,
            type: p.type,
            travelType: p.travelType,
            visits: p.visits,
            price: [{ discountedAmount: p.price }],
            subCategories: p.subCategories.map(s => ({ subCategoryName: s }))
          });
        }
      });

      setPackages(combined);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = searchParams.get("search") || searchParams.get("sector") || searchParams.get("destination");
    if (q) {
      setSearchTerm(q);
      const matchOpt = FILTER_FIELDS[0].options.find(
        (opt) => opt.toLowerCase() === q.toLowerCase()
      );
      if (matchOpt) {
        setFilters((f) => ({ ...f, sector: matchOpt }));
      } else {
        setFilters((f) => ({ ...f, sector: "All Sectors" }));
      }
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [searchParams]);

  const handleFilterSelect = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const matchesSearch = (pkg, query, sectorFilter) => {
    const pPrice = pkg.price?.[0]?.discountedAmount || pkg.price?.[0]?.asPerTourPrice || pkg.price?.[0]?.basicINR || 0;
    
    if (!matchesDuration(pkg.days, filters.duration)) return false;
    if (!matchesBudget(pPrice, filters.budget)) return false;

    const visitsText = (pkg.visits || [])
      .map(v => `${v.city || ""} ${v.state || ""} ${v.country || ""}`)
      .join(" ");

    const sectorMatch =
      !sectorFilter || sectorFilter === "All Sectors" ||
      (pkg.sectorName || "").toLowerCase().includes(sectorFilter.toLowerCase()) ||
      (pkg.title || "").toLowerCase().includes(sectorFilter.toLowerCase()) ||
      visitsText.toLowerCase().includes(sectorFilter.toLowerCase());

    if (!sectorMatch) return false;

    if (!query || !query.trim()) return true;

    const normalize = (str) => (str || "").toLowerCase().replace(/[-_&,/]/g, " ").replace(/\s+/g, " ").trim();
    const q = normalize(query);
    const t = normalize(pkg.title);
    const s = normalize(pkg.sectorName);
    const l = normalize(pkg.startingLocation);
    const v = normalize(visitsText);
    const tg = normalize((pkg.subCategories || []).map(sc => typeof sc === 'string' ? sc : sc.subCategoryName).join(" "));

    if (t.includes(q) || s.includes(q) || l.includes(q) || v.includes(q) || tg.includes(q)) return true;

    const words = q.split(" ").filter(w => w.length > 1);
    if (words.length === 0) return true;

    if (words.some(w => t.includes(w) || s.includes(w) || l.includes(w) || v.includes(w) || tg.includes(w))) return true;

    // Known alias mappings to international sectors
    const seaAliases = ["thailand", "bangkok", "phuket", "pattaya", "bali", "indonesia", "malaysia", "kuala lumpur", "vietnam", "cambodia", "singapore", "japan", "tokyo", "krabi"];
    if (seaAliases.some(alias => q.includes(alias)) && (s.includes("south east asia") || s.includes("japan") || v.includes("thailand") || v.includes("singapore") || v.includes("malaysia") || v.includes("vietnam"))) {
      return true;
    }

    const europeAliases = ["paris", "rome", "venice", "barcelona", "athens", "swiss", "switzerland", "italy", "austria", "germany", "france", "spain", "england", "london", "scotland", "edinburgh", "prague", "vienna", "budapest", "amsterdam", "brussels", "iceland", "reykjavik", "zurich", "lucerne", "interlaken"];
    if (europeAliases.some(alias => q.includes(alias)) && (s.includes("europe") || v.includes("switzerland") || v.includes("france") || v.includes("italy") || v.includes("spain") || v.includes("uk") || v.includes("scotland"))) {
      return true;
    }

    const americasAliases = ["new york", "las vegas", "los angeles", "toronto", "vancouver", "canada", "hawaii", "mexico", "usa", "america", "banff", "jasper"];
    if (americasAliases.some(alias => q.includes(alias)) && (s.includes("america") || v.includes("canada") || v.includes("usa"))) {
      return true;
    }

    const africaAliases = ["africa", "kenya", "tanzania", "uganda", "rwanda", "morocco", "madagascar", "cairo", "egypt"];
    if (africaAliases.some(alias => q.includes(alias)) && (s.includes("africa") || v.includes("africa") || v.includes("kenya") || v.includes("tanzania") || v.includes("madagascar") || v.includes("morocco"))) {
      return true;
    }

    const meAliases = ["dubai", "abu dhabi", "petra", "cairo", "luxor", "jordan", "egypt", "baku", "azerbaijan", "istanbul", "turkey", "cappadocia"];
    if (meAliases.some(alias => q.includes(alias)) && (s.includes("middle east") || s.includes("africa") || s.includes("europe") || v.includes("turkey") || v.includes("azerbaijan"))) {
      return true;
    }

    return false;
  };

  const filteredPackages = packages.filter((p) => matchesSearch(p, searchTerm, filters.sector));

  return (
    <div className="w-full bg-slate-50/50 font-inter min-h-screen pb-16">
      {/* Hero Banner Header */}
      <div className="relative w-full h-[280px] md:h-[340px] bg-gray-900 overflow-hidden flex items-center justify-center text-center px-4">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&h=700&fit=crop"
          alt="World Tour Packages"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#1E88E5] text-[12px] font-extrabold uppercase tracking-[0.25em] mb-2">
            Explore International Destinations
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
            World Tour Packages
          </h1>
          <p className="text-sm md:text-base text-gray-200 font-medium max-w-xl mx-auto">
            Discover Europe, South East Asia, America, Middle East and scenic global destinations with guided itineraries & best pricing.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        {/* Search & Filter Bar */}
        <SearchFilterBar
          filters={filters}
          onSelect={handleFilterSelect}
          onSearch={scrollToResults}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Results Header */}
        <div ref={resultsRef} className="flex items-center justify-between mb-5 flex-wrap gap-2 scroll-mt-24">
          <span className="text-[14px] font-bold text-gray-800">
            {loading ? "Loading World Packages..." : `Showing ${filteredPackages.length} Live International Packages`}
          </span>
          <div className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-xs cursor-pointer hover:border-[#1E88E5] transition">
            <span className="text-[12px] text-gray-500">Sort:</span>
            <span className="text-[12px] font-bold text-gray-800">Featured</span>
            <ChevronDown size={13} className="text-gray-600" />
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-2xl shadow-xs">
            <Loader2 size={36} className="animate-spin text-[#1E88E5]" />
            <p className="text-sm font-semibold text-gray-600">Fetching live international packages from Veena World API...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5">
            {filteredPackages.map((pkg, i) => (
              <TourCard key={pkg.code || pkg.id || i} pkg={pkg} delay={i * 0.04} />
            ))}
          </div>
        )}

        {!loading && filteredPackages.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xs">
            <Globe size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-base font-bold text-gray-700">No international packages matched your search.</p>
            <p className="text-xs text-gray-500 mt-1">Try clearing your filters or searching for another country.</p>
          </div>
        )}

        {/* Testimonials / Newsletter section */}
        <div className="mt-14">
          <TestimonialsBlogNewsletter />
        </div>
      </div>
    </div>
  );
};

export default WorldTours;

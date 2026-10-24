import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronDown, Star, Phone, Mail,
  Calendar, Users, Moon, MapPin, Headphones, BadgeCheck,
  Clock, CalendarDays, Wallet, Compass, Search, Globe, Loader2
} from "lucide-react";
import { fetchProductList } from "../services/veenaWorldApi";
import IndiaByZone from "../components/IndiaByZone";
import HorizontalScroller from "../components/HorizontalScroller";
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
        transform: visible ? "translateX(0)" : "translateX(40px)",
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const FILTER_FIELDS = [
  {
    key: "destination", label: "Destination", icon: MapPin,
    options: ["Any Destination", "Rajasthan", "Himachal Pradesh", "Jammu & Kashmir", "Kerala", "Uttarakhand", "Gujarat", "Leh-Ladakh"],
  },
  {
    key: "duration", label: "Duration", icon: Clock,
    options: ["Any Duration", "4-5 Days", "6-7 Days", "8+ Days"],
  },
  {
    key: "budget", label: "Budget", icon: Wallet,
    options: ["Any Budget", "Under ₹25,000", "₹25,000 - ₹50,000", "Above ₹50,000"],
  },
];

const DEFAULT_FILTERS = {
  destination: "Any Destination",
  duration: "Any Duration",
  budget: "Any Budget",
};

const matchesDuration = (days, f) =>
  f === "Any Duration" ? true
  : f === "4-5 Days" ? days >= 4 && days <= 5
  : f === "6-7 Days" ? days >= 6 && days <= 7
  : days >= 8;

const matchesBudget = (price, f) =>
  f === "Any Budget" ? true
  : f === "Under ₹25,000" ? price < 25000
  : f === "₹25,000 - ₹50,000" ? price >= 25000 && price <= 50000
  : price > 50000;

const WHY_CHOOSE = [
  { icon: Compass,    title: "Trusted Travel Expertise",           text: "Destination knowledge and practical experience with our destination specialist." },
  { icon: BadgeCheck, title: "Carefully Selected Experiences",     text: "Quality accommodation, convenient travel and meaningful experiences." },
  { icon: Headphones, title: "End-to-End 24/7 Travel Assistance",  text: "From your initial enquiry and booking to your return home." },
  { icon: Wallet,     title: "Zero Hidden Costs",                  text: "We clearly explain the applicable charges before you confirm your booking." },
  { icon: Globe,      title: "Domestic & International Holidays",  text: "Wide selection of holidays across the world for families, women, couples, seniors and solo travellers." },
  { icon: Users,      title: "Multiple Group Tour Options",        text: "Different destinations, multiple departure dates and durations." },
];

/* ─── search filter bar ─── */
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
      className="bg-white rounded-2xl shadow-[0_2px_14px_rgba(0,0,0,0.08)] mb-5 p-3 flex flex-col lg:flex-row lg:items-center gap-3"
    >
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 lg:gap-0 lg:divide-x lg:divide-gray-100">
        {/* Search query input */}
        <div className="relative flex items-center px-3 py-2">
          <Search size={16} className="text-[#1E88E5] shrink-0 mr-2" />
          <input
            type="text"
            placeholder="Search state, city, tour..."
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
                <p className="text-[11.5px] font-bold text-gray-900">{label}</p>
                <p className="text-[11px] text-gray-500 truncate">{filters[key]}</p>
              </div>
              <ChevronDown
                size={13}
                className={`text-gray-400 shrink-0 transition-transform duration-200 ${openKey === key ? "rotate-180" : ""}`}
              />
            </button>
            {openKey === key && (
              <div className="absolute left-0 top-full mt-1 w-full min-w-[185px] bg-white border border-gray-100 rounded-xl shadow-lg z-30 py-1 max-h-60 overflow-y-auto">
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
        className="shrink-0 bg-[#1E88E5] hover:bg-[#084298] text-white text-[12.5px] font-bold px-6 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
      >
        <Search size={14} />
        Search Tours
      </button>
    </div>
  );
};

/* ─── tour card (live API format) ─── */
const TourCard = ({ pkg, delay }) => {
  const navigate = useNavigate();
  const priceVal = pkg.price?.[0]?.discountedAmount || pkg.price?.[0]?.asPerTourPrice || pkg.price?.[0]?.basicINR || 0;
  const depDate = pkg.departureDateAsString || pkg.departureDates?.[0]?.departureDate || pkg.startingLocation || "Upcoming";
  const nights = pkg.days > 1 ? pkg.days - 1 : 1;

  return (
    <SlideIn delay={delay}>
      <div 
        onClick={() => navigate(`/tour-package/${pkg.code}`)}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col cursor-pointer group"
      >
        <div className="relative w-full h-44 overflow-hidden bg-slate-100">
          <img
            src={pkg.image || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=400&fit=crop"}
            alt={pkg.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {pkg.sectorName && (
            <span className="absolute top-2 left-2 bg-[#1E88E5]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
              {pkg.sectorName}
            </span>
          )}
          <span className="absolute top-2 right-2 bg-black/70 text-white text-[10.5px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <Star size={10} className="text-[#1E88E5] fill-[#1E88E5]" />
            4.8
          </span>
        </div>

        <div className="p-3.5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-[14px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#1E88E5] transition">
              {pkg.title}
            </h3>
            {pkg.code && (
              <span className="shrink-0 text-[9px] font-bold text-[#1E88E5] border border-blue-200 bg-blue-50 rounded px-1.5 py-0.5 leading-none whitespace-nowrap">
                {pkg.code}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-3">
            <Moon size={11} className="shrink-0 text-gray-400" />
            {pkg.days} Days / {nights} Nights
          </div>

          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="min-w-0">
              <p className="text-[9.5px] text-gray-400">Starting from</p>
              <p className="text-[16px] font-extrabold text-[#1E88E5] leading-tight">
                {priceVal > 0 ? `₹${priceVal.toLocaleString("en-IN")}` : "On Request"}
                <span className="text-[11px] font-semibold text-gray-500"> /-</span>
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[9.5px] text-gray-400">Next Departure</p>
              <p className="text-[11px] font-semibold text-gray-700 flex items-center justify-end gap-1">
                <Calendar size={11} className="text-[#1E88E5] shrink-0" />
                {depDate}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
            <Link
              to={`/tour-package/${pkg.code}`}
              className="flex-1 text-center text-[11px] font-bold text-[#1E88E5] border border-[#1E88E5] px-2 py-2 rounded-lg hover:bg-[#1E88E5] hover:text-white transition cursor-pointer"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </SlideIn>
  );
};

/* ─── main component ─── */
const IndiaTours = () => {
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState("");
  const resultsRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetchProductList({ ProductType: "Indian", PageSize: 200 }),
      fetchProductList({ TravelType: "FIT", PageSize: 100 }),
    ]).then(([gitRes, fitRes]) => {
      let combined = [];
      if (gitRes.status === "fulfilled" && gitRes.value?.products?.length) {
        combined = [...gitRes.value.products];
      }
      if (fitRes.status === "fulfilled" && fitRes.value?.products?.length) {
        const indianFit = fitRes.value.products.filter(p => p.type === "Indian");
        const existingCodes = new Set(combined.map(p => p.code));
        indianFit.forEach(p => {
          if (!existingCodes.has(p.code)) combined.push(p);
        });
      }

      // Also merge static fallback Indian customized packages if missing
      const staticIndian = CUSTOMIZED_HOLIDAY_PACKAGES.filter(p => p.type === "Indian");
      const existingCodes = new Set(combined.map(p => p.code));
      staticIndian.forEach(p => {
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
    const q = searchParams.get("search") || searchParams.get("destination") || searchParams.get("sector");
    if (q) {
      setSearchTerm(q);
      const matchOpt = FILTER_FIELDS[0].options.find(
        (opt) => opt.toLowerCase() === q.toLowerCase()
      );
      if (matchOpt) {
        setFilters((f) => ({ ...f, destination: matchOpt }));
      } else {
        setFilters((f) => ({ ...f, destination: "Any Destination" }));
      }
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } else {
      setSearchTerm("");
      setFilters(DEFAULT_FILTERS);
    }
  }, [searchParams]);

  const handleFilterSelect = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const matchesSearch = (p, query, destFilter) => {
    const pPrice = p.price?.[0]?.discountedAmount || p.price?.[0]?.asPerTourPrice || p.price?.[0]?.basicINR || 0;
    
    if (!matchesDuration(p.days, filters.duration)) return false;
    if (!matchesBudget(pPrice, filters.budget)) return false;

    const visitsText = (p.visits || [])
      .map(v => `${v.city || ""} ${v.state || ""} ${v.country || ""}`)
      .join(" ");

    const destMatch =
      !destFilter || destFilter === "Any Destination" ||
      (p.sectorName || "").toLowerCase().includes(destFilter.toLowerCase()) ||
      (p.title || "").toLowerCase().includes(destFilter.toLowerCase()) ||
      visitsText.toLowerCase().includes(destFilter.toLowerCase());

    if (!destMatch) return false;

    if (!query || !query.trim()) return true;

    const normalize = (str) => (str || "").toLowerCase().replace(/[-_&,/]/g, " ").replace(/\s+/g, " ").trim();
    const q = normalize(query);
    const t = normalize(p.title);
    const s = normalize(p.sectorName);
    const l = normalize(p.startingLocation);
    const v = normalize(visitsText);
    const tg = normalize((p.subCategories || []).map(sc => typeof sc === 'string' ? sc : sc.subCategoryName).join(" "));

    const fullText = `${t} ${s} ${l} ${v} ${tg}`;

    if (fullText.includes(q)) return true;

    const words = q.split(" ").filter(w => w.length > 1);
    if (words.length > 0 && words.every(w => fullText.includes(w))) return true;

    // Comprehensive State & Region Aliases for India
    const regionAliases = [
      {
        keys: ["agra", "ayodhya", "fatehpur", "jhansi", "lucknow", "mathura", "prayagraj", "sarnath", "varanasi", "vrindavan", "uttar pradesh", "braj"],
        matches: ["uttar pradesh", "braj", "agra", "varanasi", "lucknow", "mathura", "vrindavan", "golden triangle", "fatehpur"]
      },
      {
        keys: ["dharamshala", "dalhousie", "manali", "shimla", "spiti", "kaza", "chandrataal", "kasol", "kullu", "himachal"],
        matches: ["himachal", "manali", "shimla", "dalhousie", "dharamshala", "spiti", "kullu", "solang"]
      },
      {
        keys: ["gulmarg", "pahalgam", "sonmarg", "srinagar", "kashmir", "jammu"],
        matches: ["kashmir", "jammu", "gulmarg", "srinagar", "pahalgam", "sonmarg"]
      },
      {
        keys: ["leh", "ladakh", "kargil", "nubra", "pangong", "turtuk"],
        matches: ["ladakh", "leh", "kargil", "nubra", "pangong", "turtuk"]
      },
      {
        keys: ["haridwar", "rishikesh", "nainital", "mussoorie", "dehradun", "uttarakhand", "uttaranchal", "kedarnath", "badrinath", "yatra", "char dham"],
        matches: ["uttarakhand", "uttaranchal", "char dham", "haridwar", "rishikesh", "nainital", "mussoorie", "kedarnath", "badrinath"]
      },
      {
        keys: ["jaipur", "udaipur", "jodhpur", "jaisalmer", "pushkar", "bikaner", "rajasthan"],
        matches: ["rajasthan", "jaipur", "udaipur", "jodhpur", "jaisalmer", "pushkar", "bikaner"]
      },
      {
        keys: ["kochi", "cochin", "munnar", "alleppey", "thekkady", "trivandrum", "wayanad", "kerala"],
        matches: ["kerala", "munnar", "kochi", "cochin", "alleppey", "thekkady", "trivandrum", "wayanad"]
      },
      {
        keys: ["chennai", "pondicherry", "puducherry", "trichy", "madurai", "tirupati", "tamil nadu"],
        matches: ["tamil nadu", "chennai", "madurai", "pondicherry", "tirupati", "rameshwaram"]
      },
      {
        keys: ["solapur", "tuljapur", "nashik", "shirdi", "aurangabad", "kolhapur", "maharashtra", "mumbai", "pune"],
        matches: ["maharashtra", "solapur", "nashik", "shirdi", "kolhapur", "mumbai", "pune"]
      },
      {
        keys: ["indore", "ujjain", "mahakal", "omkareshwar", "madhya pradesh", "pachmarhi"],
        matches: ["madhya pradesh", "indore", "mahakal", "omkareshwar", "ujjain", "pachmarhi"]
      },
      {
        keys: ["ahmedabad", "dwarka", "somnath", "junagadh", "gir", "rann of kutch", "gujarat"],
        matches: ["gujarat", "dwarka", "somnath", "ahmedabad", "gir", "kutch"]
      },
      {
        keys: ["gangtok", "darjeeling", "pelling", "kalimpong", "sikkim"],
        matches: ["sikkim", "darjeeling", "gangtok", "pelling", "kalimpong"]
      },
      {
        keys: ["amritsar", "chandigarh", "punjab", "haryana"],
        matches: ["punjab", "haryana", "amritsar", "chandigarh"]
      }
    ];

    for (const group of regionAliases) {
      if (group.keys.some(k => q.includes(k))) {
        if (group.matches.some(m => fullText.includes(m))) return true;
      }
    }

    return false;
  };

  const filteredPackages = packages.filter((p) => matchesSearch(p, searchTerm, filters.destination));

  return (
    <div className="w-full bg-white font-inter min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-5">

        {/* Breadcrumb */}
        <p className="text-[11px] text-gray-400 mb-3">
          Home &gt; <span className="text-gray-600">India Tour Packages</span>
        </p>

        {/* ── SEARCH FILTER BAR ── */}
        <SearchFilterBar
          filters={filters}
          onSelect={handleFilterSelect}
          onSearch={scrollToResults}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* ── RESULTS HEADER ── */}
        <div ref={resultsRef} className="flex items-center justify-between mb-4 flex-wrap gap-2 scroll-mt-24">
          <span className="text-[13.5px] font-semibold text-gray-700">
            {loading
              ? "Loading Tours..."
              : searchTerm
              ? `Showing ${filteredPackages.length} Live Tours for "${searchTerm}"`
              : `Showing ${filteredPackages.length} Live Indian Tours`}
          </span>
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:border-[#1E88E5] transition">
            <span className="text-[12px] text-gray-500">Sort by:</span>
            <span className="text-[12px] font-bold text-gray-800">Popularity</span>
            <ChevronDown size={13} className="text-gray-600" />
          </div>
        </div>

        {/* ── TOUR GRID ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={32} className="animate-spin text-[#1E88E5]" />
            <p className="text-sm font-medium text-gray-600">Loading live India packages from Veena World API...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {filteredPackages.map((pkg, i) => (
              <TourCard key={pkg.code || pkg.id || i} pkg={pkg} delay={i * 0.04} />
            ))}
          </div>
        )}
        {!loading && filteredPackages.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl my-4">
            <p className="text-[15px] font-bold text-gray-700 mb-1">
              No live packages matched "{searchTerm || filters.destination}".
            </p>
            <p className="text-[12.5px] text-gray-500 mb-4">
              Try clearing your search or explore all available Indian tour packages.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters(DEFAULT_FILTERS);
              }}
              className="bg-[#1E88E5] hover:bg-[#084298] text-white text-[12px] font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              Show All India Tours
            </button>
          </div>
        )}

      <hr className="mt-10 border-t border-gray-200" />

      {/* Article */}
          <div className="flex-1 mt-10 overflow-hidden">
            <h1 className="text-[24px] font-extrabold text-gray-900 mb-3 leading-tight">
              India Tour Packages
            </h1>
            <p className="text-[12.5px] text-gray-600 leading-relaxed mb-2">
              The unique spirit of this land comes with ethnic evolutionary life, completely different from
              anywhere on the globe, is the land where your soul truly be revived.
            </p>


                <h2 className="text-[13.5px] font-bold text-gray-900 mb-2 mt-3">
                  What kind of diversity can you expect when visiting India?
                </h2>
                <p className="text-[12.5px] text-gray-600 leading-relaxed mb-3">
                  India is from head to foot, the diversity of India's regions that you can expect from nature. Gems and
                  cities will each hold its unique appeal, everything its really wanted has India offers from type of that
                  land to this. It is an exploration of the vast variety that India offers, from bustling cultural
                  destinations full of history and variety of culture and India's true nature. So if you are looking for
                  top-of-the-line Indian experiences we can also offer a wide variety of international experiences to help
                  you plan a trip in India like no other!
                </p>

                <h2 className="text-[13.5px] font-bold text-gray-900 mb-2">
                  How to enjoy a memorable trip in India?
                </h2>
                <p className="text-[12.5px] text-gray-600 leading-relaxed mb-3">
                  Among the countless attractions in these top cities there are also many sites you might've encountered
                  while visiting India's cultural heritage. Additionally, there are several recommended tours and beaches,
                  road activities, ancient ruins and temples, gaping deserts, the world of Himalaya and its tall glaciers.
                  Be thorough to see a wide variety of what India has to offer which includes all the grand local activities
                  and natural locations that the country contributes and cherishes to.
                </p>
 {showMore && (
              <>
                <h2 className="text-[13.5px] font-bold text-gray-900 mb-2">
                  Why Choose HillMount for Exciting India Tour packages?
                </h2>
                <p className="text-[12.5px] text-gray-600 leading-relaxed mb-2">
                  HillMount offers a wide range of India tour packages that are designed to turn your travel dreams into
                  reality. Whether you're planning a history trip, a romantic getaway or seeking adventure, there's a
                  HillMount package for everyone. Our holidays are designed with comfortable hotels, enjoyable activities,
                  handpicked local guides and great experts that ensure you're visiting historic sites right across the
                  country that contributes and cherishes its cultural heritage.
                </p>
              </>
            )}

            <button
              onClick={() => setShowMore(!showMore)}
              className="text-[12px] text-blue-600 font-semibold hover:underline cursor-pointer mt-1"
            >
              {showMore ? "Show Less ▲" : "Show More ▼"}
            </button>
          </div>
        {/* ── WHY CHOOSE HILLMOUNT HOLIDAYS ── */}
        <div className="mt-12 bg-gray-50 rounded-2xl px-6 py-10">
          <h2 className="text-center text-[19px] md:text-[22px] font-bold text-gray-900 mb-8">
            <span className="text-[#1E88E5]">⇝</span> Why Choose HillMount Holidays? <span className="text-[#1E88E5]">⇜</span>
          </h2>
          {(() => {
            const renderCard = ({ icon: Icon, title, text }, wrapCls) => (
              <div key={title} className={`flex flex-col items-center text-center ${wrapCls}`}>
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                  <Icon size={20} className="text-[#1E88E5]" />
                </div>
                <h3 className="text-[12px] font-bold text-gray-900 mb-1 leading-snug">{title}</h3>
                <p className="text-[10.5px] text-gray-500 leading-relaxed">{text}</p>
              </div>
            );
            return (
              <>
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {WHY_CHOOSE.map((c) => renderCard(c, ""))}
                </div>
                <HorizontalScroller>
                  {WHY_CHOOSE.map((c) => renderCard(c, "flex-shrink-0 w-[160px] snap-start"))}
                </HorizontalScroller>
              </>
            );
          })()}
        </div>

        {/* ── TESTIMONIALS / BLOG / NEWSLETTER ── */}
        <div className="mt-10">
          <TestimonialsBlogNewsletter />
        </div>

      </div>

      {/* ── INDIA TOUR PACKAGE BY ZONE — full width ── */}
      <div className="mt-10">
        <IndiaByZone />
      </div>
    </div>
  );
};

export default IndiaTours;

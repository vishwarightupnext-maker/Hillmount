import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ChevronDown, ChevronRight, Search, Phone } from "lucide-react";
import MobileMenu from "./MobileMenu";

const PLACEHOLDERS = [
  'Search "Gulmarg"',
  'Search "Manali"',
  'Search "Kerala"',
  'Search "Ladakh"',
  'Search "Maldives"',
  'Search "Rajasthan"',
];

const SearchShell = ({ pillHeight = 38 }) => {
  const s = pillHeight / 38;             // uniform scale factor (applied once, via the SVG viewBox)
  const capR = 18;
  const raise = 9;                       // how far the peak rises above the bar (design units)
  const topY = raise + 1;
  const botY = raise + 38 - 1;
  const H = raise + 38;
  const xp = 27;                         // x of the peak apex
  const x2 = xp + 20;                    // where the short slope meets the top edge
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setW(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const D = w / s;                       // bar width in design units
  const d =
    `M ${x2} ${topY} ` +
    `L ${D - capR - 1} ${topY} ` +
    `A ${capR} ${capR} 0 0 1 ${D - capR - 1} ${botY} ` + // right cap
    `L ${18} ${botY} ` +
    `C ${7} ${botY} 1 ${botY - 8} 1 ${topY + 17} ` +           // smooth round bottom-left
    `C 1 ${topY + 9} ${xp - 12} ${1 + 12} ${xp - 5.5} ${1 + 6.5} ` + // one smooth even sweep up into the peak
    `Q ${xp} 1 ${xp + 7} ${1 + 3.5} ` +    // rounded peak
    `L ${x2 - 6} ${topY - 2} ` +           // short steep slope down
    `Q ${x2 - 2} ${topY} ${x2} ${topY} Z`; // blend into the top edge
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute left-0 right-0 bottom-0 pointer-events-none"
      style={{ top: -raise * s }}
    >
      {w > 0 && (
        <svg className="absolute left-0 top-0" width={w} height={H * s} viewBox={`0 0 ${D} ${H}`}>
          <path d={d} fill="#fff" stroke="#1E88E5" strokeWidth={2 / s} strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
};

/* ─── mega menu shared bits ─── */
const MegaSection = ({ heading, items, isIndia, onItemClick }) => (
  <div className="mb-5">
    <h4 className="text-[15px] font-bold text-[#16324f] pb-1.5 mb-2 border-b border-gray-300">
      <Link
        to={isIndia ? `/india-tours?search=${encodeURIComponent(heading)}` : `/world-tours?search=${encodeURIComponent(heading)}`}
        onClick={onItemClick}
        className="hover:text-[#1E88E5] transition"
      >
        {heading}
      </Link>
    </h4>
    <ul>
      {items.map((c) => (
        <li key={c}>
          <Link
            to={isIndia ? `/india-tours?search=${encodeURIComponent(c)}` : `/world-tours?search=${encodeURIComponent(c)}`}
            onClick={onItemClick}
            className="flex items-center gap-2 py-[4.5px] text-[13px] text-gray-800 hover:text-[#1E88E5] hover:translate-x-0.5 transition-all"
          >
            <span className="w-[5px] h-[5px] rounded-full bg-gray-900 shrink-0" />
            {c}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const MegaPanel = ({ columns, promoImg, promoAlt, viewAllPath, isIndia, onItemClick }) => (
  <div className="max-w-7xl mx-auto px-5">
    <div className="flex">
      {/* Link columns */}
      <div className="flex-1 grid grid-cols-4 gap-x-8 py-5 pr-6">
        {columns.map((col, i) => (
          <div key={i}>
            {col.map(({ heading, items }) => (
              <MegaSection
                key={heading}
                heading={heading}
                items={items}
                isIndia={isIndia}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Promo panel */}
      <div className="hidden lg:flex w-[230px] shrink-0 relative flex-col justify-end overflow-hidden">
        <img
          src={promoImg}
          alt={promoAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <Link
          to={viewAllPath}
          onClick={onItemClick}
          className="relative m-4 bg-black text-[#1E88E5] text-[13px] font-bold text-center py-2.5 px-4 hover:bg-gray-900 transition"
        >
          View All Packages
        </Link>
      </div>
    </div>
  </div>
);

/* ─── India dropdown (State-based list) ─── */
const INDIA_COLUMNS = [
  [
    {
      heading: "Himachal Pradesh",
      items: ["Dalhousie", "Dharamshala", "Manali", "Shimla"],
    },
    {
      heading: "Jammu & Kashmir",
      items: ["Gulmarg", "Pahalgam", "Sonmarg", "Srinagar"],
    },
    {
      heading: "Leh-Ladakh",
      items: ["Kargil", "Leh", "Nubra Valley", "Pangong Tso"],
    },
  ],
  [
    {
      heading: "Uttarakhand",
      items: ["Haridwar", "Mussoorie", "Nainital", "Rishikesh", "Char Dham Yatra"],
    },
    {
      heading: "Uttar Pradesh",
      items: ["Agra", "Ayodhya", "Fatehpur Sikri", "Lucknow", "Mathura", "Prayagraj", "Varanasi", "Vrindavan"],
    },
    {
      heading: "Punjab, Haryana & Delhi",
      items: ["Amritsar", "Chandigarh", "Delhi"],
    },
  ],
  [
    {
      heading: "Rajasthan",
      items: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar", "Bikaner"],
    },
    {
      heading: "Gujarat",
      items: ["Dwarka", "Somnath", "Ahmedabad", "Gir & Kutch"],
    },
    {
      heading: "Madhya Pradesh",
      items: ["Indore", "Ujjain", "Pachmarhi", "Khajuraho"],
    },
    {
      heading: "Maharashtra",
      items: ["Mumbai", "Pune", "Nashik & Shirdi", "Solapur"],
    },
  ],
  [
    {
      heading: "Kerala",
      items: ["Munnar", "Alleppey Houseboat", "Cochin", "Thekkady", "Trivandrum"],
    },
    {
      heading: "Tamil Nadu & South India",
      items: ["Chennai", "Madurai", "Rameshwaram", "Tirupati"],
    },
    {
      heading: "Sikkim & North East",
      items: ["Gangtok", "Darjeeling", "Pelling", "Kalimpong"],
    },
    {
      heading: "Goa",
      items: ["Goa"],
    },
  ],
];

const IndiaDropdown = ({ onItemClick }) => (
  <MegaPanel
    columns={INDIA_COLUMNS}
    promoImg="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=700&fit=crop"
    promoAlt="India Tours"
    viewAllPath="/india-tours"
    isIndia={true}
    onItemClick={onItemClick}
  />
);

/* ─── World dropdown ─── */
const WORLD_COLUMNS = [
  [
    {
      heading: "Thailand",
      items: [
        "Bangkok",
        // "Chiang Mai",
        // "Phuket",
        // "Koh Samui",
        "Pattaya",
      ],
    },
    {
      heading: "Bali / Indonesia",
      items: [
        // "Bali",
        // "Lombok",
        // "Raja Ampat",
        // "Komodo",
      ],
    },
  ],
  [
    {
      heading: "Malaysia",
      items: [
        "Kuala Lumpur",
        // "Langkawi",
        // "Penang",
        // "Sabah",
      ],
    },
    {
      heading: "Vietnam & Cambodia",
      items: [
        // "Hanoi",
        // "Ho Chi Minh City",
        // "Da Nang",
        // "Ha Long Bay",
        // "Siem Reap",
      ],
    },
    {
      heading: "Japan",
      items: [
        // "Tokyo",
        // "Kyoto",
        // "Osaka",
        // "Hiroshima",
      ],
    },
  ],
  [
    {
      heading: "Europe",
      items: [
        "Paris",
        "Rome",
        "Venice",
        "Interlaken",
        "Barcelona",
        // "Athens",
        "London",
        "Vienna",
        // "Salzburg",
        // "Innsbruck",
        "Lucerne",
        "Bern",
        // "Geneva",
      ],
    },
    {
      heading: "Africa",
      items: [
        // "Dubai",
        // "Abu Dhabi",
        // "Petra (Jordan)",
        // "Cairo",
        // "Luxor",
        "Kenya",
        "Tanzania",
        "Uganda",
        "Rwanda",
        "Morocco",
      ],
    },
  ],
  [
    {
      heading: "Americas",
      items: [
        "New York",
        "Las Vegas",
        "Los Angeles",
        "Vancouver",
        // "Chicago",
        // "Boston",
        // "Calgary",
        "Hawaii",
        "Mexico",
        // "Toronto",
      ],
    },
    {
      heading: "Australia & New Zealand",
      items: [
        "Sydney",
        "Melbourne",
        "Auckland",
        "Queenstown",
        "Milford Sound",
        "Christchurch",
      ],
    },
  ],
];

const WorldDropdown = ({ onItemClick }) => (
  <MegaPanel
    columns={WORLD_COLUMNS}
    promoImg="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=700&fit=crop"
    promoAlt="World Tours"
    viewAllPath="/world-tours"
    isIndia={false}
    onItemClick={onItemClick}
  />
);

/* ─── Speciality Tours dropdown ─── */
const SPECIALITY_LINKS = [
  "Honeymoon Special",
  "Senior Special",
  "Women's Special",
  "Family Tours",
  "Short Stay",
];

const SpecialityDropdown = ({ onItemClick }) => (
  <div className="max-w-7xl mx-auto px-5 py-6">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {SPECIALITY_LINKS.map((label) => (
        <Link
          key={label}
          to="/speciality-tours"
          onClick={onItemClick}
          className="group flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-[#1E88E5] px-4 py-4 cursor-pointer transition"
        >
          <span className="text-[13.5px] font-extrabold text-gray-900 uppercase tracking-wide whitespace-nowrap group-hover:text-[#1E88E5] transition">
            {label}
          </span>
          <ChevronRight
            size={16}
            strokeWidth={3}
            className="text-[#1E88E5] shrink-0 group-hover:translate-x-1 transition-transform"
          />
        </Link>
      ))}
    </div>
  </div>
);

/* ─── Personalised Holidays dropdown ─── */
const PERSONALISED_LINKS = [
  "Tailor made Holidays",
  "Weekend Getaway",
  "Day Outing",
];

const PersonalisedDropdown = ({ onItemClick }) => (
  <div className="max-w-7xl mx-auto px-5 py-6">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {PERSONALISED_LINKS.map((label) => (
        <Link
          key={label}
          to="/personalised-holidays"
          onClick={onItemClick}
          className="group flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-[#1E88E5] px-4 py-4 cursor-pointer transition"
        >
          <span className="text-[13.5px] font-extrabold text-gray-900 uppercase tracking-wide whitespace-nowrap group-hover:text-[#1E88E5] transition">
            {label}
          </span>
          <ChevronRight
            size={16}
            strokeWidth={3}
            className="text-[#1E88E5] shrink-0 group-hover:translate-x-1 transition-transform"
          />
        </Link>
      ))}
    </div>
  </div>
);

/* ─── Nav items config ─── */
const ALL_NAV = [
  { name: "India", path: "/india-tours", dropdown: true },
  { name: "World", path: "/world-tours", dropdown: true },
  { name: "Speciality Tour", path: "/speciality-tours", dropdown: true },
  { name: "Personalised Holidays", path: "/personalised-holidays", dropdown: true },
  { name: "Cruise", path: "/cruise", dropdown: false },
  { name: "MICE", path: "/mice", dropdown: false },
  { name: "About Us", path: "/about-us", dropdown: false },
  { name: "Blog", path: "/blog", dropdown: false },
  { name: "Contact Us", path: "/contact", dropdown: false },
];

/* ─── Navbar ─── */
const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [phIndex, setPhIndex] = useState(0);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [searchText, setSearchText] = useState("");
  const closeRef = useRef(null);
  const stickyRef = useRef(null);

  const openMenu = (name) => { clearTimeout(closeRef.current); setHoveredMenu(name); };
  const scheduleClose = () => { closeRef.current = setTimeout(() => setHoveredMenu(null), 500); };
  const cancelClose = () => { clearTimeout(closeRef.current); };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    const term = searchText.trim();
    const worldKeywords = ["thailand", "bali", "europe", "dubai", "paris", "japan", "singapore", "america", "london", "rome", "swiss", "australia", "canada", "maldives"];
    const isWorld = worldKeywords.some((kw) => term.toLowerCase().includes(kw));
    setHoveredMenu(null);
    if (isWorld) {
      navigate(`/world-tours?search=${encodeURIComponent(term)}`);
    } else {
      navigate(`/india-tours?search=${encodeURIComponent(term)}`);
    }
  };

  /* Close dropdown when clicking outside the nav+dropdown area */
  useEffect(() => {
    if (!hoveredMenu) return;
    const handleMouseDown = (e) => {
      if (stickyRef.current && !stickyRef.current.contains(e.target)) {
        setHoveredMenu(null);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [hoveredMenu]);


  useEffect(() => {
    let lastY = window.scrollY;
    const DELTA = 10;
    const handleScroll = () => {
      const y = window.scrollY;
      if (y <= 80) {
        setScrolled(false);
        lastY = y;
        return;
      }
      const diff = y - lastY;
      if (Math.abs(diff) < DELTA) return; // ignore small jumps (incl. the bar's own collapse)
      setScrolled(diff > 0);
      lastY = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { if (scrolled) setHoveredMenu(null); }, [scrolled]);

  useEffect(() => {
    const iv = setInterval(() => setPhIndex((p) => (p + 1) % PLACEHOLDERS.length), 2500);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      <div ref={stickyRef} className="sticky top-0 z-50 w-full" onMouseLeave={scheduleClose}>

        {/* ===== DESKTOP ===== */}
        <div className="hidden md:block">

          {/* GREY BAR */}
          <div className="bg-[#bcd6e3] text-white">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 pt-4 pb-3 gap-8">
              <div className="flex items-center gap-5 flex-1 min-w-0">
                <Link to="/" className="flex-shrink-0 no-underline">
                  <span className="font-extrabold text-[22px] leading-tight whitespace-nowrap tracking-tight">
                    <span className="text-[#1E88E5]">HillMount</span>{" "}
                    <span className="text-[#1f2937]">Holidays</span>
                  </span>
                </Link>
                <form onSubmit={handleSearchSubmit} className="relative flex items-center h-[38px] pl-5 pr-1 w-full max-w-md text-gray-500">
                  <SearchShell pillHeight={38} />
                  <Search size={16} className="relative mr-2.5 flex-shrink-0 text-[#1E88E5]" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={PLACEHOLDERS[phIndex]}
                    className="relative flex-1 bg-transparent outline-none text-black text-[13px] min-w-0 placeholder-gray-400"
                  />
                  <button type="submit" className="relative flex-shrink-0 bg-[#1E88E5] hover:bg-[#084298] text-white font-semibold text-[13px] px-5 py-1.5 rounded-full transition cursor-pointer">
                    Search
                  </button>
                </form>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">

                <a href="tel:04224366522" className="flex items-center gap-2.5 bg-white border border-[#1E88E5] px-4 py-1 rounded-full hover:bg-gray-100 transition no-underline text-[#1E88E5]">
                  <div className="bg-white border border-[#1E88E5] rounded-full p-1 flex items-center justify-center">
                    <Phone size={14} className="text-[#1E88E5] fill-[#1E88E5]" />
                  </div>
                  <span className="font-semibold text-[15px] whitespace-nowrap">0422 43 66522</span>
                </a>

              </div>
            </div>
          </div>

          {/* MENU BAR — hidden via transform/opacity only (no layout change → no scroll jitter) */}
          <div className={`transition-all duration-300 overflow-visible ${scrolled ? "opacity-0 -translate-y-3 pointer-events-none" : "opacity-100 translate-y-0"}`}>
            <div
              className="bg-[#546e7a] relative"
              onMouseEnter={cancelClose}
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 whitespace-nowrap">
                {ALL_NAV.map((item) => (
                  <div
                    key={item.name}
                    onMouseEnter={() => item.dropdown ? openMenu(item.name) : scheduleClose()}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setHoveredMenu(null)}
                      className={`flex items-center gap-1 py-2 transition font-medium text-[13.5px] ${hoveredMenu === item.name ? "text-[#bcd6e3]" : "text-white hover:text-[#bcd6e3]"
                        }`}
                    >
                      {item.name}
                      {item.dropdown && (
                        <ChevronDown
                          size={14}
                          strokeWidth={2.5}
                          className={`transition-transform duration-200 ${hoveredMenu === item.name ? "rotate-180" : ""}`}
                        />
                      )}
                    </Link>
                  </div>
                ))}
              </div>
              {/* Transparent bridge — fills gap between yellow bar and dropdown so onMouseLeave doesn't fire */}
              {hoveredMenu && (
                <div
                  className="absolute left-0 right-0 z-40"
                  style={{ top: "100%", height: "8px" }}
                  onMouseEnter={cancelClose}
                />
              )}
            </div>
          </div>
        </div>

        {/* ===== MOBILE ===== */}
        <div className="md:hidden bg-[#546e7a] text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpen(true)} className="p-1 -ml-1">
                <Menu size={28} />
              </button>
              <Link to="/" className="no-underline">
                <span className="font-extrabold text-[17px] leading-tight whitespace-nowrap tracking-tight">
                  <span className="text-[#1E88E5]">HillMount</span>{" "}
                  <span className="text-[#1f2937]">Holidays</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <a href="tel:04224366522" className="flex items-center bg-[#f8fafc] px-3 py-1.5 rounded-full text-[13px] font-semibold gap-1.5 no-underline text-[#1E88E5] hover:bg-gray-200 transition">
                <div className="bg-white border border-[#1E88E5] rounded-full p-0.5 flex items-center justify-center">
                  <Phone size={12} className="text-[#1E88E5] fill-[#1E88E5]" />
                </div>
                <span className="whitespace-nowrap">0422 43 66522</span>
              </a>

            </div>
          </div>
          <form onSubmit={handleSearchSubmit} className="relative mt-5 h-11 pl-4 pr-1 flex items-center">
            <SearchShell pillHeight={44} />
            <Search size={20} className="relative text-[#1E88E5] mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={PLACEHOLDERS[phIndex]}
              className="relative flex-1 bg-transparent outline-none text-black text-[14px] placeholder-gray-400 min-w-0"
            />
            <button
              type="submit"
              aria-label="Search"
              className="relative flex-shrink-0 flex items-center justify-center w-9 h-9 my-auto bg-[#1E88E5] hover:bg-[#084298] text-white rounded-full transition cursor-pointer"
            >
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* ===== MEGA DROPDOWN ===== */}
        {hoveredMenu && !scrolled && (
          <>
            {/* Dark backdrop — pointer-events-none so it never blocks clicks */}
            <div className="fixed inset-0 bg-black/40 z-40 hidden md:block pointer-events-none" />
            {/* Dropdown panel */}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 w-screen bg-white shadow-xl border-t-2 border-[#1E88E5] z-50 hidden md:block max-h-[calc(100vh-150px)] overflow-y-auto overscroll-contain"
              onMouseEnter={cancelClose}
            >
              {hoveredMenu === "India" && <IndiaDropdown onItemClick={() => setHoveredMenu(null)} />}
              {hoveredMenu === "World" && <WorldDropdown onItemClick={() => setHoveredMenu(null)} />}
              {hoveredMenu === "Speciality Tour" && <SpecialityDropdown onItemClick={() => setHoveredMenu(null)} />}
              {hoveredMenu === "Personalised Holidays" && <PersonalisedDropdown onItemClick={() => setHoveredMenu(null)} />}
            </div>
          </>
        )}

      </div>

      <MobileMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbar;

import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronRight, ChevronDown } from "lucide-react";
import Logo from "../assets/logo.png";
import fallbackImg from "../assets/blogs/blog.webp";

/* ─── India data ─── */
const INDIA_TOP_RECS = [
  { label: "Leh Ladakh",        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop&crop=center" },
  { label: "Kerala",            img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=120&h=120&fit=crop&crop=center" },
  { label: "Jammu & Kashmir",   img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=120&h=120&fit=crop&crop=center" },
  { label: "Andaman & Nicobar", img: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=120&h=120&fit=crop&crop=center" },
  { label: "Sikkim Darjeeling", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop&crop=center" },
  { label: "North East",        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop&crop=center" },
  { label: "Rajasthan",         img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=120&h=120&fit=crop&crop=center" },
];

const INDIA_SECTIONS = [
  {
    id: "north",
    label: "NORTH INDIA",
    defaultOpen: true,
    groups: [
      { type: "viewall", label: "All of North India", href: "#" },
      { type: "city",    label: "Delhi" },
      { type: "group",   state: "Himachal Pradesh",  cities: [/* "Chandrataal", */ "Dalhousie", "Dharamshala", /* "Kaza", */ "Manali", "Shimla" /*, "Spiti Valley" */] },
      { type: "group",   state: "Kashmir",            cities: ["Gulmarg", "Pahalgam", "Sonmarg", "Srinagar"] },
      { type: "group",   state: "Leh-Ladakh",         cities: ["Kargil", "Leh", "Nubra Valley", "Pangong Tso", "Turtuk"] },
      { type: "city",    label: "Amritsar" },
      { type: "city",    label: "Chandigarh" },
      // { type: "group",   state: "Punjab & Haryana",   cities: ["Kurukshetra","Panipat"] },
      { type: "group",   state: "Uttarakhand",        cities: [/* "Jim Corbett Park", */ "Haridwar", "Mussoorie", "Nainital", "Rishikesh", "Chardham Yatra"], badges: { "Chardham Yatra": "New" } },
      { type: "group",   state: "Uttar Pradesh",      cities: ["Agra", "Ayodhya", "Fatehpur Sikri", "Jhansi", "Lucknow", "Mathura", "Prayagraj", "Sarnath", "Varanasi", "Vrindavan"] },
    ],
  },
  {
    id: "south",
    label: "SOUTH INDIA",
    defaultOpen: false,
    groups: [
      { type: "viewall", label: "All of South India", href: "#" },
      { type: "group", state: "Kerala",        cities: ["Alleppey", "Cochin", "Trivandrum", "Kanyakumari", "Rameswaram", "Madurai"] },
      // { type: "group", state: "Tamil Nadu",    cities: ["Chennai","Madurai","Ooty","Rameswaram","Thanjavur"] },
      // { type: "group", state: "Karnataka",     cities: ["Bangalore","Coorg","Hampi","Mysore","Udupi"] },
      // { type: "group", state: "Andhra Pradesh",cities: ["Tirupati","Vizag","Araku Valley"] },
      // { type: "group", state: "Andaman & Nicobar", cities: ["Port Blair","Havelock Island","Neil Island"] },
    ],
  },
  {
    id: "east",
    label: "EAST & NORTH EAST INDIA",
    defaultOpen: false,
    groups: [
      { type: "viewall", label: "All of East & North East", href: "#" },
      { type: "group", state: "Sikkim & Darjeeling", cities: ["Gangtok", "Pelling", "Darjeeling", "Kalimpong"] },
      // { type: "group", state: "Assam",     cities: ["Guwahati","Kaziranga","Majuli"] },
      // { type: "group", state: "Meghalaya", cities: ["Shillong","Cherrapunji","Dawki"] },
      // { type: "city",  label: "Arunachal Pradesh" },
      // { type: "city",  label: "Nagaland" },
    ],
  },
  {
    id: "west",
    label: "RAJASTHAN, WEST & CENTRAL INDIA",
    defaultOpen: false,
    groups: [
      { type: "viewall", label: "All of West & Central India", href: "#" },
      { type: "group", state: "Rajasthan",       cities: ["Jaipur", "Jodhpur", "Udaipur", "Jaisalmer", "Mandawa", "Kumbhalgarh"] },
      { type: "group", state: "Gujarat",         cities: ["Ahmedabad"] },
      { type: "group", state: "Madhya Pradesh",  cities: ["Indore", "Ujjain", "Bhopal", "Gwalior", "Jabalpur"] },
      // { type: "group", state: "Goa",             cities: ["North Goa","South Goa"] },
      // { type: "group", state: "Maharashtra",     cities: ["Mumbai","Pune","Aurangabad","Lonavala","Mahabaleshwar"] },
    ],
  },
];

/* ─── World data ─── */
const WORLD_TOP_RECS = [
  // { label: "Bali",        img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=120&h=120&fit=crop&crop=center" },
  { label: "Paris",       img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=120&h=120&fit=crop&crop=center" },
  // { label: "Dubai",       img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=120&h=120&fit=crop&crop=center" },
  // { label: "Singapore",   img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=120&h=120&fit=crop&crop=center" },
  { label: "Switzerland", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop&crop=center" },
  // { label: "Japan",       img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=120&h=120&fit=crop&crop=center" },
  { label: "New Zealand", img: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=120&h=120&fit=crop&crop=center" },
];

const WORLD_SECTIONS = [
  {
    id: "sea",
    label: "SOUTH EAST ASIA",
    defaultOpen: true,
    groups: [
      { type: "viewall", label: "All of South East Asia", href: "#" },
      { type: "group", state: "Thailand",          cities: ["Bangkok", "Pattaya"] },
      // { type: "group", state: "Bali / Indonesia",  cities: ["Bali","Lombok","Raja Ampat","Komodo"] },
      { type: "group", state: "Malaysia",          cities: ["Kuala Lumpur", "Sabah"] },
      // { type: "group", state: "Vietnam & Cambodia",cities: ["Hanoi","Ho Chi Minh City","Da Nang","Ha Long Bay","Siem Reap"] },
      // { type: "group", state: "Japan",             cities: ["Tokyo","Kyoto","Osaka","Hiroshima"] },
    ],
  },
  {
    id: "europe",
    label: "EUROPE",
    defaultOpen: false,
    groups: [
      { type: "viewall", label: "All of Europe", href: "#" },
      { type: "group", state: "Western Europe", cities: ["Paris", "Rome", "Venice", "Barcelona", "Interlaken"] },
      { type: "group", state: "England",        cities: ["London"] },
      { type: "group", state: "Austria & Germany", cities: ["Vienna", "Salzburg", "Innsbruck"] },
      { type: "group", state: "Switzerland",    cities: ["Geneva", "Lucerne", "Interlaken", "Bern"] },
    ],
  },
  {
    id: "mideast",
    label: "MIDDLE EAST & AFRICA",
    defaultOpen: false,
    groups: [
      { type: "viewall", label: "All of Middle East & Africa", href: "#" },
      // { type: "group", state: "Middle East", cities: ["Dubai","Abu Dhabi","Petra","Cairo","Luxor","Qatar"] },
      { type: "group", state: "Africa",      cities: ["Kenya", "Tanzania", "Uganda", "Rwanda", "Morocco"] },
    ],
  },
  {
    id: "americas",
    label: "AMERICAS & PACIFIC",
    defaultOpen: false,
    groups: [
      { type: "viewall", label: "All of Americas & Pacific", href: "#" },
      { type: "group", state: "Americas",              cities: ["New York", "Las Vegas", "Los Angeles", "Vancouver", "Chicago", "Boston", "Calgary", "Hawaii", "Mexico"] },
      { type: "group", state: "Australia & New Zealand",cities: ["Sydney", "Melbourne", "Auckland", "Queenstown", "Milford Sound", "Christchurch"] },
    ],
  },
];

/* ─── Sub panel ─── */
const SubPanel = ({ title, viewAllPath, topRecs, sections, isIndia, onBack, onClose }) => {
  const [openSection, setOpenSection] = useState(
    sections.find((s) => s.defaultOpen)?.id ?? sections[0]?.id ?? null
  );

  const toggle = (id) => setOpenSection((prev) => (prev === id ? null : id));
  const basePath = isIndia ? "/india-tours" : "/world-tours";

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Sub-panel header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-gray-200 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[14px] font-semibold text-gray-800 active:opacity-60 cursor-pointer"
        >
          <ChevronRight size={16} className="rotate-180 text-gray-600" />
          {title}
        </button>
        <Link
          to={viewAllPath}
          onClick={onClose}
          className="text-[12px] font-bold text-gray-900 underline underline-offset-2"
        >
          View all Tours
        </Link>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {/* Top recommended destinations */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
          <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-3">
            Top Recommended Destinations
          </p>
          <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {topRecs.map(({ label, img }) => (
              <Link
                key={label}
                to={`${basePath}?search=${encodeURIComponent(label)}`}
                onClick={onClose}
                className="flex flex-col items-center flex-shrink-0 w-[60px]"
              >
                <div className="w-[54px] h-[54px] rounded-full overflow-hidden border-2 border-gray-200 mb-1.5">
                  <img src={img} alt={label} className="w-full h-full object-cover" onError={(e) => { e.target.src = fallbackImg; }} />
                </div>
                <span className="text-[9.5px] text-gray-700 text-center leading-tight font-medium">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Accordion sections */}
        {sections.map(({ id, label, groups }) => (
          <div key={id}>
            {/* Section header */}
            <button
              onClick={() => toggle(id)}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-[#eef2fb] border-b border-gray-200 text-left"
            >
              <span className="text-[12.5px] font-bold text-[#0f1b3a] tracking-wide">{label}</span>
              {openSection === id ? (
                <ChevronDown size={16} className="text-gray-600 flex-shrink-0" />
              ) : (
                <ChevronRight size={16} className="text-gray-600 flex-shrink-0" />
              )}
            </button>

            {/* Section content */}
            {openSection === id && groups.length > 0 && (
              <div className="bg-white px-4 py-3 space-y-3 border-b border-gray-100">
                {groups.map((g, i) => {
                  if (g.type === "viewall") {
                    return (
                      <Link
                        key={i}
                        to={basePath}
                        onClick={onClose}
                        className="flex items-center gap-1 text-[13px] font-bold text-gray-900"
                      >
                        {g.label}
                        <ChevronRight size={13} />
                      </Link>
                    );
                  }
                  if (g.type === "city") {
                    return (
                      <Link
                        key={i}
                        to={`${basePath}?search=${encodeURIComponent(g.label)}`}
                        onClick={onClose}
                        className="block text-[13px] font-bold text-gray-900 hover:text-[#1E88E5]"
                      >
                        {g.label}
                      </Link>
                    );
                  }
                  if (g.type === "group") {
                    return (
                      <div key={i}>
                        <Link
                          to={`${basePath}?search=${encodeURIComponent(g.state)}`}
                          onClick={onClose}
                          className="block text-[12px] font-bold text-gray-800 pb-1 mb-1.5 border-b border-gray-200 hover:text-[#1E88E5]"
                        >
                          {g.state}
                        </Link>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {g.cities.map((city) => (
                            <Link
                              key={city}
                              to={`${basePath}?search=${encodeURIComponent(city)}`}
                              onClick={onClose}
                              className="text-[12px] text-[#b45309] hover:text-amber-900 transition"
                            >
                              {city}
                              {g.badges?.[city] && (
                                <span className="ml-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded leading-none">
                                  {g.badges[city]}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Flat accordion data (Speciality Tours / Personalised Holidays) ─── */
const SPECIALITY_LINKS = [
  "Honeymoon Special",
  "Senior Special",
  "Women's Special",
  "Family Tours",
  "Short Stay",
];

const PERSONALISED_LINKS = [
  "Tailor made Holidays",
  "Weekend Getaway",
  "Day Outing",
];

/* ─── Menu config ─── */
const menuItems = [
  { label: "India",              sub: "india", path: "/india-tours" },
  { label: "World",              sub: "world", path: "/world-tours" },
  { label: "Speciality Tours",   path: "/speciality-tours", items: SPECIALITY_LINKS },
  { label: "Personalised Holidays",path: "/personalised-holidays", items: PERSONALISED_LINKS },
  { label: "Cruise",             path: "/cruise" },
  { label: "MICE",               path: "/mice" },
  { label: "Contact Us",         path: "/contact" },
];

const bottomItems = [
  { label: "About Us", path: "/about-us" },
  { label: "Blog",     path: "/blog" },
  { label: "Careers",  path: "/careers" },
  { label: "FAQ's",    path: "/faq" },
];

/* ─── MobileMenu ─── */
const MobileMenu = ({ open, setOpen }) => {
  const [activePanel, setActivePanel] = useState(null);
  const [openFlat, setOpenFlat] = useState(null);

  const handleClose = () => {
    setActivePanel(null);
    setOpenFlat(null);
    setOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleClose}
        />
      )}

      {/* Drawer — overflow-hidden so sub-panels clip correctly */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-50 flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header — fixed at top */}
        <div className="flex items-center justify-between bg-[#546e7a] text-white px-4 py-4 flex-shrink-0">
          <button onClick={handleClose} className="p-1 -ml-1">
            <X size={24} />
          </button>
       
          <img src={Logo} alt="logo" className="h-6" />
        </div>

        {/* Content area — relative container for sliding panels */}
        <div className="flex-1 relative overflow-hidden">

          {/* ── Main menu (slides left when sub-panel opens) ── */}
          <div
            className={`absolute inset-0 overflow-y-auto bg-white transition-transform duration-300 ${
              activePanel ? "-translate-x-full" : "translate-x-0"
            }`}
            style={{ scrollbarWidth: "none" }}
          >
            <div className="py-2">
              {menuItems.map(({ label, path, sub, items }, i) =>
                sub ? (
                  <div
                    key={i}
                    className="w-full flex justify-between items-center border-b border-gray-100 text-gray-800 font-semibold text-[15px] hover:bg-gray-50 active:bg-gray-100 transition"
                  >
                    {/* Label — navigates to the page */}
                    <Link
                      to={path}
                      onClick={handleClose}
                      className="flex-1 px-5 py-3.5 text-left"
                    >
                      {label}
                    </Link>
                    {/* Arrow — opens the sub-panel */}
                    <button
                      onClick={() => setActivePanel(sub)}
                      aria-label={`Open ${label} submenu`}
                      className="px-5 py-3.5 border-l border-gray-100"
                    >
                      <ChevronRight size={18} className="text-gray-400" />
                    </button>
                  </div>
                ) : items ? (
                  <div key={i} className="border-b border-gray-100">
                    <div className={`w-full flex justify-between items-center text-gray-800 font-semibold text-[15px] hover:bg-gray-50 active:bg-gray-100 transition ${openFlat === label ? "bg-gray-50" : ""}`}>
                      <Link
                        to={path}
                        onClick={handleClose}
                        className="flex-1 px-5 py-3.5 text-left"
                      >
                        {label}
                      </Link>
                      <button
                        onClick={() => setOpenFlat((prev) => (prev === label ? null : label))}
                        aria-label={`Toggle ${label} list`}
                        className="px-5 py-3.5 border-l border-gray-100"
                      >
                        <ChevronDown
                          size={18}
                          className={`text-gray-400 transition-transform ${openFlat === label ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    {openFlat === label && (
                      <div className="flex flex-wrap gap-2 px-5 pt-0 pb-4 -mt-1 bg-gray-50">
                        {items.map((it) => (
                          <Link
                            key={it}
                            to={path}
                            onClick={handleClose}
                            className="text-[12.5px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 hover:border-[#1E88E5] hover:text-[#1E88E5] transition"
                          >
                            {it}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={i}
                    to={path}
                    onClick={handleClose}
                    className="flex items-center px-5 py-3.5 border-b border-gray-100 text-gray-800 font-semibold text-[15px] hover:bg-gray-50 active:bg-gray-100 transition"
                  >
                    <span>{label}</span>
                  </Link>
                )
              )}
            </div>

            <div className="px-5 py-4 text-gray-500 text-[15px] font-medium">
              {bottomItems.map(({ label, path }, i) => (
                <Link
                  key={i}
                  to={path}
                  onClick={handleClose}
                  className="block mb-4 hover:text-[#0F3596] transition"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── India sub-panel (slides in from right) ── */}
          <div
            className={`absolute inset-0 transition-transform duration-300 ${
              activePanel === "india" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <SubPanel
              title="India"
              viewAllPath="/india-tours"
              topRecs={INDIA_TOP_RECS}
              sections={INDIA_SECTIONS}
              isIndia={true}
              onBack={() => setActivePanel(null)}
              onClose={handleClose}
            />
          </div>

          {/* ── World sub-panel (slides in from right) ── */}
          <div
            className={`absolute inset-0 transition-transform duration-300 ${
              activePanel === "world" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <SubPanel
              title="World"
              viewAllPath="/world-tours"
              topRecs={WORLD_TOP_RECS}
              sections={WORLD_SECTIONS}
              isIndia={false}
              onBack={() => setActivePanel(null)}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;


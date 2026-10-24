import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, X, Loader2, MapPin, Compass, Building2 } from "lucide-react";
import Img1 from "../assets/blogs/blog.webp";

const API = import.meta.env.VITE_API_BASE;

// Strip HTML tags to get plain text for card previews
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

// ── Scroll-reveal wrapper ──────────────────────────────────────────────────────
const RevealItem = ({ children, delay = 0, from = "bottom" }) => {
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
  const t = {
    bottom: visible ? "translateY(0)" : "translateY(50px)",
    left:   visible ? "translateX(0)" : "translateX(-50px)",
    right:  visible ? "translateX(0)" : "translateX(50px)",
  };
  return (
    <div ref={ref} className="h-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: t[from] || t.bottom,
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}>
      {children}
    </div>
  );
};

// ── Blog Card ──────────────────────────────────────────────────────────────────
const BlogCard = ({ blog }) => {
  const imgSrc = blog.coverImage
    ? (blog.coverImage.startsWith('/') ? `${API}${blog.coverImage}` : blog.coverImage)
    : Img1;

  const avatarLetter = blog.author?.[0]?.toUpperCase() || 'A';
  const dateStr = blog.createdAt
    ? `Updated on ${new Date(blog.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`
    : '';

  const slug = blog.slug || blog._id;

  return (
    <Link to={`/blog/${slug}`} className="block h-full">
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition duration-300 group cursor-pointer h-full">
        <div className="relative w-full h-48 overflow-hidden bg-slate-100 shrink-0">
          <img src={imgSrc} alt={blog.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => { e.target.src = Img1; }} />
        </div>
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              <div className="bg-[#fffbeb] border border-amber-100 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-sm uppercase tracking-wider">
                {blog.tag}
              </div>
           
            </div>
            <h3 className="text-[15.5px] font-bold text-gray-900 leading-snug group-hover:text-[#1E88E5] transition duration-200 line-clamp-2">
              {blog.title}
            </h3>
            {blog.city && (
              <div className="flex flex-wrap gap-1.5">
                {blog.city.split(',').map((c) => c.trim()).filter(Boolean).map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                    <Building2 size={9} />
                    {c}
                  </span>
                ))}
              </div>
            )}
            <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3">{stripHtml(blog.excerpt)}</p>
          </div>
          <div className="flex items-center gap-3 pt-5 mt-4 border-t border-gray-50 shrink-0">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-extrabold border border-slate-200">
              {avatarLetter}
            </div>
            <div className="flex flex-col">
              <span className="text-[11.5px] font-bold text-gray-900 leading-none">{blog.author}</span>
              <span className="text-[10px] text-gray-400 mt-1">{dateStr}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Returns all interest flags for a blog — handles both new array field and legacy string
const blogFlags = (b) =>
  Array.isArray(b.interests) && b.interests.length ? b.interests :
  (b.interest ? [b.interest] : []);

// ── Main page ──────────────────────────────────────────────────────────────────
const Blogs = () => {
  const [allBlogs,           setAllBlogs]           = useState([]);
  const [loading,            setLoading]            = useState(true);
  const [fetchError,         setFetchError]         = useState('');
  const [searchTerm,         setSearchTerm]         = useState('');
  const [activeDestFilters,  setActiveDestFilters]  = useState([]);
  const [activeInterFilters, setActiveInterFilters] = useState([]);
  const [activeCityFilters,  setActiveCityFilters]  = useState([]);
  const [mobileFilterOpen,   setMobileFilterOpen]   = useState(false);
  const [mounted,            setMounted]            = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/blogs`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setAllBlogs(d.data);
        else setFetchError('Failed to load articles.');
      })
      .catch(() => setFetchError('Cannot connect to server.'))
      .finally(() => setLoading(false));
  }, []);

  const heroSlide = (delay) => ({
    opacity:   mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  // Build unique destinations — split comma-separated values into individual flags
  const destinations = useMemo(() => {
    const seen = new Set();
    allBlogs.forEach((b) => {
      if (b.destination)
        b.destination.split(',').map((s) => s.trim()).filter(Boolean).forEach((d) => seen.add(d));
    });
    return [...seen].sort();
  }, [allBlogs]);

  // Build unique interests
  const interests = useMemo(() => {
    const seen = new Set();
    allBlogs.forEach((b) => blogFlags(b).forEach((f) => seen.add(f)));
    return [...seen].sort();
  }, [allBlogs]);

  // Build unique cities — split comma-separated values
  const cities = useMemo(() => {
    const seen = new Set();
    allBlogs.forEach((b) => {
      if (b.city)
        b.city.split(',').map((s) => s.trim()).filter(Boolean).forEach((c) => seen.add(c));
    });
    return [...seen].sort();
  }, [allBlogs]);

  // Count per destination — each comma-separated tag counted individually
  const destCount = useMemo(() => {
    const map = {};
    allBlogs.forEach((b) => {
      if (b.destination)
        b.destination.split(',').map((s) => s.trim()).filter(Boolean).forEach((d) => {
          map[d] = (map[d] || 0) + 1;
        });
    });
    return map;
  }, [allBlogs]);

  // Count per interest flag
  const interCount = useMemo(() => {
    const map = {};
    allBlogs.forEach((b) => blogFlags(b).forEach((f) => { map[f] = (map[f] || 0) + 1; }));
    return map;
  }, [allBlogs]);

  // Count per city
  const cityCount = useMemo(() => {
    const map = {};
    allBlogs.forEach((b) => {
      if (b.city)
        b.city.split(',').map((s) => s.trim()).filter(Boolean).forEach((c) => {
          map[c] = (map[c] || 0) + 1;
        });
    });
    return map;
  }, [allBlogs]);

  const toggleDest  = (v) => setActiveDestFilters((p)  => p.includes(v)  ? p.filter((d) => d !== v)  : [...p, v]);
  const toggleInter = (v) => setActiveInterFilters((p) => p.includes(v) ? p.filter((d) => d !== v) : [...p, v]);
  const toggleCity  = (v) => setActiveCityFilters((p)  => p.includes(v)  ? p.filter((d) => d !== v)  : [...p, v]);
  const clearAll    = () => { setActiveDestFilters([]); setActiveInterFilters([]); setActiveCityFilters([]); };

  const activeFilterCount = activeDestFilters.length + activeInterFilters.length + activeCityFilters.length;

  // Filter + search
  const filteredBlogs = useMemo(() => {
    let result = allBlogs;
    if (activeDestFilters.length > 0)
      result = result.filter((b) => {
        const tags = b.destination ? b.destination.split(',').map((s) => s.trim()).filter(Boolean) : [];
        return activeDestFilters.some((f) => tags.includes(f));
      });
    if (activeCityFilters.length > 0)
      result = result.filter((b) => {
        const tags = b.city ? b.city.split(',').map((s) => s.trim()).filter(Boolean) : [];
        return activeCityFilters.some((f) => tags.includes(f));
      });
    if (activeInterFilters.length > 0)
      result = result.filter((b) => activeInterFilters.some((f) => blogFlags(b).includes(f)));
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(term) ||
          b.excerpt?.toLowerCase().includes(term) ||
          b.tag?.toLowerCase().includes(term) ||
          b.destination?.toLowerCase().includes(term) ||
          b.city?.toLowerCase().includes(term) ||
          blogFlags(b).some((f) => f.toLowerCase().includes(term))
      );
    }
    return result;
  }, [allBlogs, searchTerm, activeDestFilters, activeInterFilters, activeCityFilters]);

  const scrollToArticles = () =>
    document.getElementById("articles-section")?.scrollIntoView({ behavior: "smooth" });

  // Shared filter section renderer
  const FilterSection = ({ title, icon: Icon, items, activeItems, onToggle, countMap }) => (
    items.length > 0 && (
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-3">
          <Icon size={13} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</span>
        </div>
        <div className="space-y-2.5">
          {items.map((item) => (
            <label key={item} className="flex items-start gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={activeItems.includes(item)}
                onChange={() => onToggle(item)}
                className="w-4 h-4 mt-0.5 accent-[#1E88E5] rounded cursor-pointer flex-shrink-0" />
              <span className="text-sm text-gray-700 group-hover:text-black transition leading-snug break-words">{item}</span>
              <span className="text-xs text-gray-400 flex-shrink-0 ml-auto">({countMap[item] || 0})</span>
            </label>
          ))}
        </div>
      </div>
    )
  );

  const hasSidebarFilters = destinations.length > 0 || interests.length > 0 || cities.length > 0;

  return (
    <div className="w-full font-inter bg-white pb-20 overflow-x-hidden">

      {/* HERO */}
      <div className="relative w-full h-[420px] md:h-[520px] bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${Img1})` }}>
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center md:justify-start text-white text-center md:text-left px-6 md:px-10 pt-10 z-10">
          <p style={heroSlide(0.1)} className="text-[#1E88E5] text-[11px] font-bold uppercase tracking-[0.3em] mb-4">
            Travel Stories
          </p>
          <h1 style={heroSlide(0.25)} className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl tracking-tight mb-5">
            Stories That Feel<br className="hidden md:block" /> Like Home.
          </h1>
          <p style={heroSlide(0.4)} className="text-gray-300 text-sm md:text-[15px] max-w-xl leading-relaxed mb-8 font-light">
            Real journeys, thoughtful experiences, and travel inspiration from around the world.
          </p>
          <div style={heroSlide(0.55)}>
            <button onClick={scrollToArticles}
              className="bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white font-semibold text-[14px] py-2.5 px-7 rounded-sm transition shadow-md cursor-pointer">
              Explore Stories
            </button>
          </div>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div id="articles-section" className="max-w-7xl mx-auto px-4 mt-16 scroll-mt-6">

        {/* Header row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-100 pb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Latest Articles</h2>
          <div className="w-full md:w-80 flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button onClick={() => setMobileFilterOpen((p) => !p)}
              className="md:hidden flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-2 text-sm font-medium text-gray-600 hover:border-[#1E88E5] transition flex-shrink-0">
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#1E88E5] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {/* Search */}
            <div className="relative flex items-center bg-white border border-gray-200 rounded-full px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[#1E88E5] focus-within:border-transparent transition flex-1">
              <Search size={16} className="text-gray-400 mr-2 flex-shrink-0" />
              <input type="text" placeholder="Search articles" value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-black text-[13.5px]" />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600 px-1">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile filter panel */}
        {mobileFilterOpen && hasSidebarFilters && (
          <div className="md:hidden bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-gray-800">Filter Articles</span>
              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="text-xs text-[#1E88E5] font-bold hover:underline">Clear All</button>
              )}
            </div>
            <FilterSection title="Destination" icon={MapPin} items={destinations} activeItems={activeDestFilters} onToggle={toggleDest} countMap={destCount} />
            <FilterSection title="City" icon={Building2} items={cities} activeItems={activeCityFilters} onToggle={toggleCity} countMap={cityCount} />
            <FilterSection title="Interest" icon={Compass} items={interests} activeItems={activeInterFilters} onToggle={toggleInter} countMap={interCount} />
          </div>
        )}

        {/* Content: sidebar + grid */}
        <div className="flex gap-8 items-start">

          {/* Desktop sidebar */}
          {hasSidebarFilters && (
            <aside className="hidden md:block w-56 flex-shrink-0 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-900">Filter Articles</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll} className="text-xs text-[#1E88E5] font-bold hover:underline">Clear All</button>
                )}
              </div>

              <FilterSection title="Destination" icon={MapPin} items={destinations} activeItems={activeDestFilters} onToggle={toggleDest} countMap={destCount} />
              {destinations.length > 0 && cities.length > 0 && <div className="border-t border-gray-100 my-4" />}
              <FilterSection title="City" icon={Building2} items={cities} activeItems={activeCityFilters} onToggle={toggleCity} countMap={cityCount} />
              {cities.length > 0 && interests.length > 0 && <div className="border-t border-gray-100 my-4" />}
              <FilterSection title="Interest" icon={Compass} items={interests} activeItems={activeInterFilters} onToggle={toggleInter} countMap={interCount} />

              {activeFilterCount > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Active filters:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDestFilters.map((f) => (
                      <span key={f}
                        className="flex items-center gap-1 bg-[#fffbeb] border border-amber-200 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {f}
                        <button onClick={() => toggleDest(f)} className="hover:text-red-500 transition"><X size={10} /></button>
                      </span>
                    ))}
                    {activeCityFilters.map((f) => (
                      <span key={f}
                        className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {f}
                        <button onClick={() => toggleCity(f)} className="hover:text-red-500 transition"><X size={10} /></button>
                      </span>
                    ))}
                    {activeInterFilters.map((f) => (
                      <span key={f}
                        className="flex items-center gap-1 bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {f}
                        <button onClick={() => toggleInter(f)} className="hover:text-red-500 transition"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          )}

          {/* Blog grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={32} className="animate-spin text-yellow-400" />
              </div>
            ) : fetchError ? (
              <p className="text-center text-red-400 text-sm py-12">{fetchError}</p>
            ) : filteredBlogs.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-16 text-center space-y-4 border border-gray-100">
                <p className="text-gray-500 font-medium text-[15px]">
                  No articles found{searchTerm ? ` matching "${searchTerm}"` : activeFilterCount ? " for selected filters" : ""}.
                </p>
                <button onClick={() => { setSearchTerm(""); clearAll(); }}
                  className="text-[#0F3596] hover:underline font-bold text-sm">
                  Show all articles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog, i) => (
                  <RevealItem key={blog._id} delay={i * 0.07} from={i % 2 === 0 ? "left" : "right"}>
                    <BlogCard blog={blog} />
                  </RevealItem>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Blogs;


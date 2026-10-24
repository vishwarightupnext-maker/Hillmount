import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE;

/* Image with skeleton shown until it loads */
const SeasonImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative h-56 sm:h-60 md:h-64 rounded-2xl overflow-hidden bg-gray-200">
      {!loaded && <div className="absolute inset-0 skeleton-shimmer" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="w-full h-full object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
      />
    </div>
  );
};

const useReveal = (delay = 0) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  }];
};

const CuratedLivingSpaces = () => {
  const sliderRef = useRef(null);
  const [seasons, setSeasons] = useState([]);
  const [titleRef, titleStyle] = useReveal(0);
  const [descRef,  descStyle]  = useReveal(0.15);

  useEffect(() => {
    fetch(`${API}/api/seasons`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.length) {
          const active = data.data
            .filter((s) => s.active)
            .map((s) => ({
              label:    s.label,
              subtitle: s.subtitle || '',
              img:      `${API}${s.image}`,
              path:     `/season/${s._id}`,
            }));
          if (active.length) setSeasons(active);
        }
      })
      .catch(() => {});
  }, []);

  const scroll = (dir) => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = (card?.offsetWidth ?? 300) + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">

        <h2 ref={titleRef} style={titleStyle} className="text-[22px] md:text-[28px] font-bold text-black mb-5">
          Curated Journeys for Every Season
        </h2>

        <div ref={descRef} style={descStyle} className="border-l-4 border-[#1E88E5] pl-4 mb-10 max-w-3xl">
          <p className="text-gray-500 text-sm leading-relaxed">
            Every season brings a different way to travel, feel, and explore. From summer escapes to winter
            wonders, discover journeys thoughtfully crafted around the perfect time to experience them.
            Choose the season that speaks to you—and find a destination that feels like home.
          </p>
        </div>

        <div className="relative">
          {/* Arrows — mobile only */}
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous"
            className="block md:hidden absolute left-10 top-[38%] -translate-y-1/2 z-10 text-[#1E88E5] hover:scale-110 transition-transform"
          >
            <ChevronLeft size={34} strokeWidth={2.5} />
          </button>

          {/* Mobile: horizontal scroll | Desktop: 3-column grid */}
          <div
            ref={sliderRef}
            className="flex md:grid md:grid-cols-3 gap-6
                       overflow-x-auto md:overflow-visible
                       scroll-smooth snap-x snap-mandatory md:snap-none
                       px-8 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {seasons.map((season, i) => (
              <div key={i} className="flex-shrink-0 snap-start w-[85vw] md:w-auto">
                <SeasonImage src={season.img} alt={season.label} />
                <Link to={season.path}>
                  <div className="relative -mt-10 mx-3 bg-white rounded-2xl shadow-md p-5 z-10 cursor-pointer hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-[12px] sm:text-[13px] font-extrabold text-black uppercase tracking-wide leading-snug mb-1">
                          {season.label}
                        </h3>
                        {season.subtitle && (
                          <p className="text-[11px] text-gray-500 leading-relaxed">{season.subtitle}</p>
                        )}
                      </div>
                      <ChevronRight size={22} strokeWidth={3} className="text-[#1E88E5] shrink-0 mt-0.5" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Arrows — mobile only */}
          <button
            onClick={() => scroll(1)}
            aria-label="Next"
            className="block md:hidden absolute right-10 top-[38%] -translate-y-1/2 z-10 text-[#1E88E5] hover:scale-110 transition-transform"
          >
            <ChevronRight size={34} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default CuratedLivingSpaces;

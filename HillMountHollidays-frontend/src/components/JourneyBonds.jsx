import { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import HoneymoonImg from "../assets/special/honeymoon.svg";
import SeniorImg from "../assets/special/couples.svg";
import WomenImg from "../assets/special/women.svg";
import GrandparentsImg from "../assets/special/grandparents.svg";
import ShortStayImg from "../assets/special/short-stay.svg";
const bonds = [
  { label: "HONEYMOON\nSPECIAL", imgSlot: HoneymoonImg },
  { label: "SENIOR\nSPECIAL", imgSlot: SeniorImg },
  { label: "WOMEN'S\nSPECIAL", imgSlot: WomenImg },
  { label: "FAMILY\nTOURS", imgSlot: GrandparentsImg },
  { label: "SHORT\nSTAY", imgSlot: ShortStayImg },
];

const ARCH_CLIP = "polygon(50% 0%, 100% 18%, 100% 100%, 0% 100%, 0% 18%)";

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

const BondCard = ({ label, imgSlot, animStyle }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
  <div className="flex flex-col items-start gap-3 cursor-pointer group flex-shrink-0 snap-start" style={animStyle}>
    <div
      className="relative overflow-hidden bg-white w-[195px] h-[210px] md:w-[220px] md:h-[235px]"
      style={{ clipPath: ARCH_CLIP }}
    >
      {/* Skeleton while image loads */}
      {!imgLoaded && <div className="absolute inset-0 skeleton-shimmer" style={{ clipPath: ARCH_CLIP }} />}
      <img
        src={imgSlot}
        alt={label}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        className="absolute bottom-0 w-full object-contain object-bottom"
        style={{ height: "100%", opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
      />
    </div>
    <div className="flex items-start gap-1.5 px-2">
      <p className="font-black text-[12px] md:text-[13px] text-black uppercase leading-tight whitespace-pre-line text-left">
        {label}
      </p>
      <ChevronRight
        size={18}
        strokeWidth={3}
        className="text-[#1E88E5] flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform"
      />
    </div>
  </div>
  );
};

const JourneyBonds = () => {
  const sliderRef = useRef(null);
  const [titleRef, titleStyle] = useReveal(0);
  const [descRef, descStyle] = useReveal(0.15);
  const [cardsRef, cardsVisible] = useReveal(0.1);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (dir) => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = (card?.offsetWidth ?? 220) + 12;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">

        <h2 ref={titleRef} style={titleStyle} className="text-[22px] md:text-[28px] font-bold text-black mb-5">
          Journeys Made for Every Bond
        </h2>

        <div ref={descRef} style={descStyle} className="border-l-4 border-[#1E88E5] pl-4 mb-10 max-w-2xl">
          <p className="text-gray-500 text-sm leading-relaxed">
            From Women Only Group Tour escapes to Romantic Honeymoons Group Tours, Senior Only Group Tour,
            Grandparent Grandchild Group tours and much more Group tours. The best journeys are the ones
            shared with those who make every place feel like home.
          </p>
        </div>

        <div className="relative px-10" ref={cardsRef}>
          {canScrollLeft && (
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous"
              className="absolute left-0 top-[105px] -translate-y-1/2 z-10 text-[#1E88E5] hover:scale-110 transition-transform"
            >
              <ChevronLeft size={38} strokeWidth={2.5} />
            </button>
          )}

          <div
            ref={sliderRef}
            className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {bonds.map((bond, i) => (
              <BondCard
                key={i}
                {...bond}
                animStyle={{
                  opacity: cardsVisible ? 1 : 0,
                  transform: cardsVisible ? "translateY(0)" : "translateY(30px)",
                  transition: `opacity 0.6s ease ${0.1 + i * 0.12}s, transform 0.6s ease ${0.1 + i * 0.12}s`,
                }}
              />
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll(1)}
              aria-label="Next"
              className="absolute right-0 top-[105px] -translate-y-1/2 z-10 text-[#1E88E5] hover:scale-110 transition-transform"
            >
              <ChevronRight size={38} strokeWidth={2.5} />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};

export default JourneyBonds;

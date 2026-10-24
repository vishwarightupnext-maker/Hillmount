import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";
import HeroImg from "../assets/home/banner.webp";

const Banner = () => {
  const [mounted,   setMounted]   = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const slide = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateX(0)" : "translateX(-55px)",
    transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
  });

  return (
    <div className="relative w-full min-h-[88vh] overflow-hidden bg-gray-900">
      {/* Skeleton — shown until image loads */}
      {!imgLoaded && (
        <div className="absolute inset-0 z-20 bg-gray-800 flex items-end sm:items-center min-h-[88vh] pb-10 sm:pb-0 px-6">
          <div className="max-w-[520px] w-full space-y-4">
            <div className="h-10 sm:h-14 bg-gray-700 rounded-md skeleton-shimmer-dark w-4/5" />
            <div className="h-10 sm:h-14 bg-gray-700 rounded-md skeleton-shimmer-dark w-3/5" />
            <div className="h-4 bg-gray-700/70 rounded skeleton-shimmer-dark w-full mt-2" />
            <div className="h-5 bg-gray-700/70 rounded skeleton-shimmer-dark w-2/3" />
            <div className="flex gap-3 mt-3">
              <div className="h-10 bg-gray-700 rounded w-40 skeleton-shimmer-dark" />
              <div className="h-10 bg-gray-700/60 rounded w-48 skeleton-shimmer-dark" />
            </div>
          </div>
        </div>
      )}

      {/* Yellow top strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1E88E5] z-10 block sm:hidden" />

      {/* Hero background image */}
      <OptimizedImage
        src={HeroImg}
        alt="Hill Mount Holidays"
        priority={true}
        lazy={false}
        onLoadingChange={setImgLoaded}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex items-end sm:items-center min-h-[88vh] pb-10 sm:pb-0">
        <div className="max-w-[520px]">
          <h1
            style={slide(0.15)}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-[1.15] mb-3 sm:mb-4"
          >
            <span className="whitespace-nowrap">More Than a Journey -</span>
            <br />Welcome Home.
          </h1>
          <p style={slide(0.35)} className="text-[11px] sm:text-[13px] text-gray-300 mb-2 leading-relaxed">
            We don't just plan trips. We craft moments that stay with you forever.
          </p>
          <p style={slide(0.5)} className="text-[13px] sm:text-[17px] font-semibold text-white mb-6 sm:mb-8">
            Where Travel Feels Like Home.
          </p>
          <div style={slide(0.65)} className="flex flex-wrap gap-2 sm:gap-3">
            <Link to="/india-tours" className="flex-1 flex">
              <button className="cursor-pointer bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white font-semibold text-[12px] sm:text-[14px] py-2 sm:py-2.5 px-3 sm:px-6 rounded-sm transition flex items-center justify-center gap-1 w-full whitespace-nowrap">
                Explore Destination
              </button>
            </Link>
            <a href="https://wa.me/+919994666522" target="_blank" rel="noopener noreferrer" className="flex-1 flex">
              <button className="border cursor-pointer border-white/60 hover:bg-white hover:text-black text-white font-semibold text-[12px] sm:text-[14px] py-2 sm:py-2.5 px-3 sm:px-6 rounded-sm transition flex items-center justify-center gap-1 backdrop-blur-sm w-full whitespace-nowrap">
                <span className="sm:hidden">Travel Advice</span>
                <span className="hidden sm:inline">Get Custom Travel Advice</span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;


// src/components/ad1.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
const API = import.meta.env.VITE_API_BASE;

const Ad1 = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides]   = useState([]);
  const timerRef              = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/ad-banners`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.length) {
          const active = data.data
            .filter((b) => b.active)
            .map((b) => ({
              desktop: `${API}${b.desktopImage}`,
              mobile:  `${API}${b.mobileImage}`,
              alt:     b.title,
              linkUrl: b.linkUrl || "",
            }));
          setSlides(active);
        }
      })
      .catch(() => {});
  }, []);

  const goTo = useCallback((idx) => {
    setCurrent(idx);
  }, []);

  const next = useCallback(() => {
    if (slides.length) setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length) setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (slides.length < 2) return; // nothing to rotate yet
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4500);
  }, [slides.length]);

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, [startTimer]);

  const handleNext = () => { clearInterval(timerRef.current); next(); startTimer(); };
  const handlePrev = () => { clearInterval(timerRef.current); prev(); startTimer(); };

  return (
    <div className="w-full px-4 py-4 bg-gray-50">
      <div className="relative max-w-7xl mx-auto rounded-xl overflow-hidden shadow-lg select-none">
        
        {/* CSS styles for the premium shine effect */}
        <style>{`
          @keyframes bannerShine {
            0% {
              left: -100%;
            }
            20% {
              left: 130%;
            }
            100% {
              left: 130%;
            }
          }
          .animate-banner-shine {
            animation: bannerShine 6s infinite ease-in-out;
          }
        `}</style>

        {/* Sliding images container */}
        <div className="relative w-full h-[300px] md:h-[460px] overflow-hidden">
          <div 
            className="flex h-full w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, idx) => {
              const inner = (
                <>
                  <img
                    src={slide.mobile}
                    alt={slide.alt}
                    className="absolute inset-0 w-full h-full object-cover object-center block md:hidden"
                  />
                  <img
                    src={slide.desktop}
                    alt={slide.alt}
                    className="absolute inset-0 w-full h-full object-cover object-center hidden md:block"
                  />
                </>
              );
              return (
                <div key={idx} className="min-w-full h-full relative overflow-hidden shrink-0">
                  {slide.linkUrl
                    ? <a href={slide.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">{inner}</a>
                    : inner}
                </div>
              );
            })}
          </div>

          {/* Shining Effect Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            <div className="absolute top-0 h-full w-[40%] bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-banner-shine" />
          </div>

          {/* Slide indicator dots — centered at bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { clearInterval(timerRef.current); goTo(i); startTimer(); }}
                className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-[#1E88E5]" : "w-2 bg-white/60"}`}
              />
            ))}
          </div>

          {/* Left chevron — inside image container so it stays within bounds */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-transparent transition-transform hover:scale-110 active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft size={44} strokeWidth={3.5} className="text-[#1E88E5] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          </button>

          {/* Right chevron — inside image container so it stays within bounds */}
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-transparent transition-transform hover:scale-110 active:scale-95"
            aria-label="Next"
          >
            <ChevronRight size={44} strokeWidth={3.5} className="text-[#1E88E5] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Ad1;

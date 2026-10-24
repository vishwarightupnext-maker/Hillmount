import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* Mobile-only horizontal scroll row with left/right arrow buttons.
   Desktop layout is left untouched — render your normal grid separately
   with a "hidden md:grid" wrapper alongside this. */
const HorizontalScroller = ({ children, className = "", edgePadding = true, topPad = "" }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className={`md:hidden ${className}`}>
      {/* overflow-x-auto forces overflow-y to clip too, so any child that pops
          above the row (e.g. a negative-margin badge) needs topPad to stay visible */}
      <div
        ref={scrollRef}
        className={`flex overflow-x-auto gap-4 snap-x snap-mandatory pb-1 ${edgePadding ? "px-4" : ""} ${topPad}`}
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#1E88E5] hover:text-[#1E88E5] transition cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#1E88E5] hover:text-[#1E88E5] transition cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default HorizontalScroller;

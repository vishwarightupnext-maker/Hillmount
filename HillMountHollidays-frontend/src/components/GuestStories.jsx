import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, User, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_BASE;

const GuestStories = () => {
  const sliderRef = useRef(null);
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`${API}/api/reviews`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setReviews(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = (card?.offsetWidth ?? 300) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="trusted-guests" className="w-full bg-[#f8fafc] py-12 px-4">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-center text-black text-xl md:text-[26px] font-bold mb-8">
          Real Stories from Real Travelers
        </h2>

        {/* Scroll row */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={28} className="animate-spin text-[#1E88E5]" />
          </div>
        ) : reviews.length === 0 ? null : (
          <div className="relative">

            {/* Left arrow — overlaid on the slider */}
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous"
              className="absolute left-0 cursor-pointer top-1/2 -translate-y-1/2 z-10 bg-transparent text-[#1E88E5] hover:scale-110 transition-transform"
            >
              <ChevronLeft size={34} strokeWidth={2.5} />
            </button>

            {/* Cards */}
            <div
              ref={sliderRef}
              className="flex gap-4 overflow-x-auto scroll-smooth px-10"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="flex-shrink-0 w-[240px] border-1 border-[#1E88E5] rounded-lg  sm:w-[260px] md:w-[300px] bg-white rounded-xl p-5 flex flex-col justify-between min-h-[210px]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star size={13} className="fill-[#1E88E5] text-[#1E88E5]" />
                        <span className="text-sm font-bold text-black">{review.rating}</span>
                      </div>
                      <span className="bg-pink-50 border border-pink-200 text-pink-500 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                        {review.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-black text-base mb-2">{review.destination}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
                      "{review.text}"
                    </p>
                  </div>

                  <div className="flex items-end justify-between mt-4 pt-3 border-t border-gray-100">
                    <div>
                      <p className="font-semibold text-black text-sm">{review.reviewer}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{review.date}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {review.image
                        ? <img src={`${API}${review.image}`} alt={review.reviewer} className="w-full h-full object-cover" />
                        : <User size={14} className="text-gray-400" />
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right arrow — overlaid on the slider */}
            <button
              onClick={() => scroll(1)}
              aria-label="Next"
              className="absolute right-0 cursor-pointer top-1/2 -translate-y-1/2 z-10 bg-transparent text-[#1E88E5] hover:scale-110 transition-transform"
            >
              <ChevronRight size={34} strokeWidth={2.5} />
            </button>

          </div>
        )}
      </div>
    </section>
  );
};

export default GuestStories;

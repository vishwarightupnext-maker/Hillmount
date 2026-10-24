import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, UserCircle2 } from "lucide-react";
import { API } from "./adminComponents/apiHelper";

const CATEGORY_COLORS = {
  'Women Special':                { bg: '#FCE7F3', text: '#9D174D' },
  'Honeymoon Special':            { bg: '#FEF3C7', text: '#92400E' },
  'Senior Special':               { bg: '#E0F2FE', text: '#0C4A6E' },
  'Personalised Holidays':        { bg: '#F3E8FF', text: '#6B21A8' },
  'Customised Holidays':          { bg: '#F3E8FF', text: '#6B21A8' }, // legacy reviews saved before rename
  'International Family Group Tour': { bg: '#FFE4E6', text: '#9F1239' },
  'Domestic Family Group Tour':   { bg: '#DCFCE7', text: '#166534' },
  'Solo Trip':                    { bg: '#FFF7ED', text: '#9A3412' },
  'Family':                       { bg: '#FFE4E6', text: '#9F1239' },
  'Couple':                       { bg: '#FEF3C7', text: '#92400E' },
};
const defaultColor = { bg: '#F1F5F9', text: '#475569' };

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const MAX = 120;
  const isLong = review.text.length > MAX;
  const displayText = expanded ? review.text : review.text.slice(0, MAX);
  const color = CATEGORY_COLORS[review.category] || defaultColor;
  const imgSrc = review.image ? (review.image.startsWith('/') ? `${API}${review.image}` : review.image) : null;

  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-[#1E88E5] flex flex-col h-full min-h-[260px]">
      {/* Top row */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-1 flex-shrink-0">
          <Star size={13} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-gray-800">{review.rating}</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded font-bold"
          style={{ backgroundColor: color.bg, color: color.text }}>
          {review.category}
        </span>
        <span className="text-[11px] text-gray-400 underline ml-auto cursor-default whitespace-nowrap">
          Upcoming Tour Dates
        </span>
      </div>

      {/* Destination */}
      <p className="text-[13px] font-bold text-gray-900 mb-2 leading-snug">{review.destination}</p>

      {/* Review text — image floats right if exists */}
      <div className="flex-1 text-[12.5px] text-gray-600 leading-relaxed mb-4">
      
        "{displayText}{!expanded && isLong ? '…' : '"'}
        {isLong && (
          <button onClick={() => setExpanded((v) => !v)}
            className="block text-[11px] font-bold underline text-gray-600 hover:text-gray-900 mt-1 transition-colors">
            {expanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between pt-3 border-t border-gray-100 mt-auto">
        <div>
          <p className="text-[13px] font-bold text-gray-800 leading-tight">{review.reviewer}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{review.date}</p>
        </div>
        {imgSrc ? (
          <div className="flex items-center gap-1.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-gray-100">
              <img src={imgSrc} alt={review.reviewer} className="w-full h-full object-cover" />
            </div>
          </div>
        ) : (
          <UserCircle2 size={30} className="text-gray-300 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/reviews`)
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data.length) setReviews(d.data); })
      .catch(() => {});
  }, []);

  if (!reviews.length) return null;

  const scroll = (dir) => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = (card?.offsetWidth ?? 300) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="w-full py-14 relative overflow-hidden" style={{ backgroundColor: '#bcd6e3' }}>

      {/* Decorative quote marks */}
      <span className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 select-none pointer-events-none font-serif leading-none text-black/[0.05]"
        style={{ fontSize: 'clamp(120px, 15vw, 220px)' }}>
        "
      </span>
      <span className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 select-none pointer-events-none font-serif leading-none text-black/[0.05]"
        style={{ fontSize: 'clamp(120px, 15vw, 220px)', transform: 'translateY(-50%) scaleX(-1)' }}>
        "
      </span>

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 mb-2 tracking-tight">
            HillMount Holidays Reviews
          </h2>
          <p className="text-gray-500 text-[13px] font-medium">
            What are you waiting for?{' '}
            <span className="text-[#1E88E5]">Pack your bags and set off!</span>
          </p>
        </div>

        {/* Slider row — GuestStories-style horizontal scroll with overlaid arrows */}
        <div className="relative">
          {/* Left arrow */}
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
            {reviews.map((r) => (
              <div key={r._id} className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[300px]">
                <ReviewCard review={r} />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll(1)}
            aria-label="Next"
            className="absolute right-0 cursor-pointer top-1/2 -translate-y-1/2 z-10 bg-transparent text-[#1E88E5] hover:scale-110 transition-transform"
          >
            <ChevronRight size={34} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

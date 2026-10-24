import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { API } from "./adminComponents/apiHelper";

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

const ReelSection = () => {
  const sliderRef     = useRef(null);
  const modalVideoRef = useRef(null);
  const [stories, setStories]       = useState([]);
  const [modalIndex, setModalIndex] = useState(null);
  const [titleRef, titleStyle]      = useReveal(0);
  const [descRef,  descStyle]       = useReveal(0.15);

  useEffect(() => {
    fetch(`${API}/api/reels`)
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data.length) setStories(d.data); })
      .catch(() => {});
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    if (modalIndex === null) return;
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modalIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalIndex]);

  const openModal  = (i) => setModalIndex(i);
  const closeModal = () => {
    if (modalVideoRef.current) modalVideoRef.current.pause();
    setModalIndex(null);
  };

  const scroll = (dir) => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = (card?.offsetWidth ?? 260) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const videoSrc = (s) => `${API}${s.videoUrl}`;
  const thumbSrc = (s) => s.thumbnailUrl ? `${API}${s.thumbnailUrl}` : null;

  const activeStory = modalIndex !== null ? stories[modalIndex] : null;

  return (
    <section className="w-full bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">

        <h2 ref={titleRef} style={titleStyle} className="text-[22px] md:text-[28px] font-bold text-black mb-5">
          Curated Living Spaces
        </h2>

        <div ref={descRef} style={descStyle} className="border-l-4 border-[#1E88E5] pl-4 mb-10 max-w-2xl">
          <p className="text-gray-500 text-sm leading-relaxed">
            "Handpicked stays that go beyond accommodation. Thoughtfully chosen spaces that offer
            warmth, comfort, and character—so wherever you go, you never feel far from home."
          </p>
        </div>

        {/* Single render — flex scroll on mobile, CSS grid (5-col) on desktop */}
        <div className="relative">
          {/* Arrows — mobile only */}
          <button onClick={() => scroll(-1)} aria-label="Previous"
            className="block md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 text-[#1E88E5] hover:scale-110 transition-transform">
            <ChevronLeft size={38} strokeWidth={2.5} />
          </button>

          <div
            ref={sliderRef}
            className="
              flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory px-10
              md:px-0
              lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0
            "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {stories.map((story, i) => (
              <div
                key={story._id}
                className="
                  relative flex-shrink-0 snap-start rounded-2xl overflow-hidden shadow-md bg-black cursor-pointer
                  w-[48vw]   max-w-[150px]
                  sm:w-[44vw] sm:max-w-[180px]
                  md:w-[28vw] md:max-w-[180px]
                  aspect-[9/16]
                  lg:w-auto lg:max-w-none lg:aspect-auto lg:h-[380px]
                "
                onClick={() => openModal(i)}
              >
                {/* Thumbnail image or video poster frame */}
                {thumbSrc(story) ? (
                  <img
                    src={thumbSrc(story)}
                    alt={story.title || 'reel'}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={videoSrc(story)}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                  />
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/25 pointer-events-none" />

                {/* Play button */}
                <div className="absolute top-3 right-3 bg-[#546e7a] rounded-full w-9 h-9 flex items-center justify-center">
                  <Play size={14} className="text-[#bcd6e3] fill-[#bcd6e3] ml-0.5" />
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => scroll(1)} aria-label="Next"
            className="block md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 text-[#1E88E5] hover:scale-110 transition-transform">
            <ChevronRight size={38} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ── MODAL ── */}
      {activeStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={closeModal}
        >
          {/* Modal container — stop propagation so clicking video doesn't close */}
          <div
            className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={modalVideoRef}
              key={activeStory._id}
              src={videoSrc(activeStory)}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              loop
              controls
            />

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full w-9 h-9 flex items-center justify-center transition z-10"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReelSection;

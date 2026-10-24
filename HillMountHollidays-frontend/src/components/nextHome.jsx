import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import SeasonImage from "../assets/season-card.webp";

const ARCH_CLIP = "polygon(50% 0%, 100% 18%, 100% 100%, 0% 100%, 0% 18%)";

const seasons = [
  { lines: ["MARCH TO", "JUNE"], image: SeasonImage },
  { lines: ["JULY TO", "OCTOBER"], image: SeasonImage },
  { lines: ["NOVEMBER TO", "FEBRUARY"], image: SeasonImage },
];

const useVisible = (delay = 0) => {
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
  return [ref, visible, {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  }];
};

const SeasonCard = ({ lines, image, animStyle }) => (
  <div
    className="flex flex-col items-start gap-3 cursor-pointer group flex-shrink-0 snap-start"
    style={animStyle}
  >
    <div
      className="relative overflow-hidden bg-[#1E88E5] w-[195px] h-[210px] md:w-[220px] md:h-[235px]"
      style={{ clipPath: ARCH_CLIP }}
    >
      <img
        src={image}
        alt={lines.join(" ")}
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
    </div>

    <div className="flex items-start gap-1.5 px-2">
      <div>
        {lines.map((line, j) => (
          <p
            key={j}
            className="text-[12px] font-extrabold text-[#1a1a1a] tracking-widest uppercase leading-snug"
          >
            {line}
          </p>
        ))}
      </div>
      <ChevronRight
        size={18}
        strokeWidth={3}
        className="text-[#1E88E5] flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform"
      />
    </div>
  </div>
);

const NextHome = () => {
  const [titleRef, , titleStyle] = useVisible(0);
  const [descRef, , descStyle] = useVisible(0.15);
  const [cardsRef, cardsVisible] = useVisible(0.1);

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">

        <h2 ref={titleRef} style={titleStyle} className="text-[26px] md:text-[34px] font-bold text-black mb-5">
          Curated Journeys for Every Season
        </h2>

        <div ref={descRef} style={descStyle} className="border-l-4 border-[#1E88E5] pl-4 mb-14 max-w-2xl">
          <p className="text-gray-500 text-sm leading-relaxed">
            Every season brings a different way to travel, feel, and explore. From summer escapes
            to winter wonders, discover journeys thoughtfully crafted around the perfect time to
            experience them. Choose the season that speaks to you—and find a destination that feels
            like home.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="flex overflow-x-auto gap-6 pb-4 md:pb-0 md:overflow-visible md:justify-center md:gap-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {seasons.map((season, i) => (
            <SeasonCard
              key={i}
              {...season}
              animStyle={{
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.6s ease ${0.1 + i * 0.15}s, transform 0.6s ease ${0.1 + i * 0.15}s`,
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default NextHome;

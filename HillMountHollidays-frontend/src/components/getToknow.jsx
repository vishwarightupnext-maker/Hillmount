import { useState, useEffect, useRef } from 'react';
import OptimizedImage from './OptimizedImage';
import Image from "../assets/get-to-know.webp";
import homeIcon from '../assets/outline.png';
import HorizontalScroller from './HorizontalScroller';

const features = [
  {
    title: "Affordable Budget",
    description: "Travel beautifully without compromising on comfort or experience. We create group tours with value-driven journeys that feel rich in memories and light on stress.",
  },
  {
    title: "Crafted with Care",
    description: "From stays to experiences, every detail is chosen with attention and warmth. Because the best journeys are the ones planned with heart.",
  },
  {
    title: "Personalised Approach",
    description: "Every traveler is unique, and so is every journey we design. We tailor personalised holidays experiences around your preferences, pace, and travel dreams.",
  },
  {
    title: "Luxury Trip",
    description: "Indulge in refined travel experiences designed with elegance and exclusivity. Enjoy seamless comfort, premium stays, and unforgettable moments worldwide.",
  },
  {
    title: "Best Value Itinerary",
    description: "Thoughtfully planned itineraries that balance experiences, comfort, and time perfectly. So every moment of your journey feels meaningful and worthwhile for both Group Tours and Personalised Holidays.",
  },
  {
    title: "Comfort Like Home",
    description: "Wherever you travel, we ensure you feel welcomed, relaxed, and cared for. The true travel comfort begins when a journey feels like home.",
  },
];

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
    left: visible ? "translateX(0)" : "translateX(-50px)",
    right: visible ? "translateX(0)" : "translateX(50px)",
  };
  return (
    <div
      ref={ref}
      className="h-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: t[from] || t.bottom,
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const FeatureCard = ({ title, description }) => (
  <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col gap-1.5 sm:gap-2 h-full">
    <img src={homeIcon} alt="" loading="lazy" className="w-7 h-7 sm:w-9 sm:h-9 object-contain" />
    <h3 className="text-[13px] sm:text-[15px] font-bold text-[#1a1a1a]">{title}</h3>
    <p className="text-[11px] sm:text-[12px] text-gray-500 leading-relaxed">{description}</p>
  </div>
);

const names = [  "HillMount Holidays","Ram", "Balaji", "Tharini"];

const useTypewriter = (words, typingSpeed = 100, deletingSpeed = 60, pauseTime = 1600) => {
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    const current = words[wordIdx];
    if (phase === 'typing') {
      if (text.length < current.length) {
        const t = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('deleting'), pauseTime);
      return () => clearTimeout(t);
    }
    if (text.length > 0) {
      const t = setTimeout(() => setText(current.slice(0, text.length - 1)), deletingSpeed);
      return () => clearTimeout(t);
    }
    setWordIdx((i) => (i + 1) % words.length);
    setPhase('typing');
  }, [text, phase, wordIdx, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
};

const GetToKnow = () => {
  const typedName = useTypewriter(names);
  const [leftRef, leftStyle] = useReveal(0);

  return (
    <section className="bg-[#bcd6e3] py-9 px-4 text-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-stretch">

        <div ref={leftRef} style={leftStyle} className="lg:w-[38%] flex flex-col gap-5">
          <div>
            <p className="text-[#1E88E5] font-bold text-[11px] tracking-widest uppercase mb-3">
              Get To Know Us
            </p>
            <h2 className="text-[#1f2937] text-[28px] md:text-[36px] font-bold leading-tight">
              Experience the World<br />
              With{" "}
              <span className="text-[#1E88E5] inline-block">
                {typedName}
                <span className="inline-block w-[2px] h-[0.85em] bg-[#1E88E5] ml-[1px] animate-pulse align-middle" />
              </span>
            </h2>
          </div>

          <div className="flex-1 rounded-xl overflow-hidden min-h-[220px]">
            <OptimizedImage
              src={Image}
              alt="People Traveling"
              lazy={true}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        <div className="lg:flex-1 hidden sm:grid sm:grid-cols-2 gap-3 sm:gap-4 content-start">
          {features.map((f, i) => (
            <RevealItem key={i} delay={i * 0.1} from={i % 2 === 0 ? "left" : "right"}>
              <FeatureCard {...f} />
            </RevealItem>
          ))}
        </div>

        <div className="lg:flex-1 sm:hidden">
          <HorizontalScroller>
            {features.map((f, i) => (
              <div key={i} className="flex-shrink-0 w-[220px] snap-start">
                <FeatureCard {...f} />
              </div>
            ))}
          </HorizontalScroller>
        </div>

      </div>
    </section>
  );
};

export default GetToKnow;


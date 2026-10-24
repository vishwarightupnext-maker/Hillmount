import { useState, useEffect } from "react";
import AdBg from "../assets/adBanner3.webp";

const questions = [
  "Where Will Be Your Next Home?",
  "What Journey Feels Meant for You?",
  "Who Will You Share Your Next Story With?",
  "Which Destination Will Welcome You Next?",
];

const useTypewriter = (words, typingSpeed = 60, deletingSpeed = 35, pauseTime = 2000) => {
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

const StartPlanAdBanner = () => {
  const typedQuestion = useTypewriter(questions);

  return (
    <div className="relative w-full min-h-[340px] md:min-h-[420px] overflow-hidden flex items-center">
      <img
        src={AdBg}
        alt="Start Planning"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <h2 className="text-2xl md:text-4xl lg:text-[42px] font-bold text-white leading-tight mb-1">
          Start Planning your experience today
        </h2>

        <p className="text-lg md:text-xl font-semibold text-[#1E88E5] mb-4 min-h-[32px]">
          {typedQuestion}
          <span className="inline-block w-[2px] h-[0.85em] bg-[#1E88E5] ml-[1px] animate-pulse align-middle" />
        </p>

        <button className="cursor-pointer bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white font-semibold text-[14px] py-2.5 px-6 rounded-sm transition flex items-center justify-center gap-1">
          Get started
        </button>
      </div>
    </div>
  );
};

export default StartPlanAdBanner;


import { useRef, useState, useEffect } from "react";
import HillMountLogo from "../assets/logo.png";
import VeenaWorldLogo from "../assets/veena-world.jpg";
import OutlineIcon from "../assets/outline.png";

const RevealItem = ({ children, delay = 0, from = "bottom" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
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
      style={{
        opacity: visible ? 1 : 0,
        transform: t[from] || t.bottom,
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

/* Gold-outlined shield badge holding the "authorised partner" mark */
const PartnerShield = () => (
  <div className="relative w-[220px] sm:w-[260px]">
    <svg viewBox="0 0 220 250" className="w-full h-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
      <path
        d="M110 4 L206 34 V118 C206 178 168 218 110 246 C52 218 14 178 14 118 V34 Z"
        fill="#ffffff"
        stroke="#D4AF37"
        strokeWidth="5"
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center pt-4 sm:pt-10 px-6 text-center">
      <div className="border border-gray-200 rounded px-1  mb-4">
        <img src={HillMountLogo} alt="HillMount Holidays" className="h-14 sm:h-13 w-auto object-contain" />
      </div>
      <p className="text-[#0b2545] font-extrabold text-[13px] sm:text-[14px] leading-tight tracking-wide">
        AUTHORISED
        <br />
        SALES PARTNER
      </p>
      <div className="flex items-center gap-2 my-2 w-full max-w-[120px]">
        <span className="h-px flex-1 bg-gray-300" />
        <span className="text-[10px] text-gray-400 font-semibold">OF</span>
        <span className="h-px flex-1 bg-gray-300" />
      </div>
      <img src={VeenaWorldLogo} alt="Veena World" className="h-14 sm:h-20 w-auto object-contain mb-0.5" />
    </div>
    {/* Ribbon banner */}
    <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-[130%] flex justify-center">
      <div className="relative bg-gradient-to-b from-[#E8C766] to-[#C9A227] text-[#0b2545] font-extrabold text-[13px] sm:text-[14px] tracking-wide px-8 py-2 shadow-md"
        style={{ clipPath: "polygon(4% 0%, 96% 0%, 100% 50%, 96% 100%, 4% 100%, 0% 50%)" }}>
        GROUP TOURS
      </div>
    </div>
  </div>
);

const AuthorisedPartnerPanel = () => (
  <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
    <RevealItem delay={0} from="bottom">
      <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_rgba(11,37,69,0.15)] grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">

        {/* Left — dark badge panel */}
        <div className="relative bg-gradient-to-br from-[#1E88E5] to-[#084298] px-6 py-14 sm:py-16 flex items-center justify-center overflow-hidden">
          {/* Decorative dotted grid */}
          <div
            className="absolute top-6 right-6 w-24 h-24 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "10px 10px" }}
          />
          <PartnerShield />
        </div>

        {/* Right — copy */}
        <div className="px-6 sm:px-10 py-12 sm:py-14 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-[32px] font-extrabold leading-tight mb-4">
            <span className="text-[#0b2545]">We are an</span>
            <br />
            <span className="text-[#1E88E5]">Authorised Sales Partner</span>
            <br />
            <span className="text-[#0b2545]">of Veena World Group Tours</span>
          </h2>
          <p className="text-gray-500 text-[13.5px] leading-relaxed mb-8 max-w-xl">
            HillMount Holidays is proud to be an Authorised Sales Partner of Veena World Group tours, offering wide range of destination with multiple departure dates for domestic and international group tours and also have speciality tour for Womens only group, Seniors only group and Honeymoon group tours.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mb-9">
            {[
              "Professionally Managed Veena World Group Tours",
              "Best Itineraries to cover maximum Sightseeing",
              "Experienced Veena World Tour Manager",
              "Domestic & International Group Tours",
              "All-Inclusive Option & Zero Hidden cost",
              "Local Dedicated Support at RS Puram, Coimbatore",
            ].map((label) => (
              <div key={label} className="flex items-start gap-3">
                <img src={OutlineIcon} alt="" className="w-6 h-6 shrink-0 mt-0.5 object-contain" />
                <span className="text-[#0b2545] text-[13px] font-semibold leading-snug">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="cursor-pointer bg-gradient-to-r from-[#1E88E5] to-[#42a5f5] hover:from-[#1669b3] hover:to-[#1E88E5] text-white font-semibold text-[13px] px-6 py-2.5 rounded-sm transition whitespace-nowrap">
              Domestic Group Tours
            </button>
            <button className="cursor-pointer bg-white border border-gray-300 hover:border-[#1E88E5] hover:text-[#1E88E5] text-[#0b2545] font-semibold text-[13px] px-6 py-2.5 rounded-sm transition whitespace-nowrap">
              International Group Tours
            </button>
          </div>
        </div>
      </div>
    </RevealItem>
  </div>
);

export default AuthorisedPartnerPanel;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import RoomImg from "../assets/counterImg.webp";
import HolidaysImg from "../assets/customised.webp";
import CruiseImg from "../assets/cruised.webp";
import WeekendImg from "../assets/weekend.webp";
import DayOutImg from "../assets/dayOuting.png";
import TailorMadeImg from "../assets/customholidays.webp";
import { API } from "./adminComponents/apiHelper";
import HorizontalScroller from "./HorizontalScroller";
const LINKS = [
  { label: "Personalised Holidays", to: "/personalised-holidays", img: HolidaysImg, tab: "#1E88E5" },
  { label: "Cruise", to: "/cruise", img: CruiseImg, tab: "#14b8a6" },
    { label: "Weekend Getaway", to: "/short-stay", img: WeekendImg, tab: "#f5b301" },
  { label: "Day Out", to: "#", img: DayOutImg, tab: "#ef4444" },

];

const CounterBanner = () => {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/home-banner`)
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data) setBanner(d.data); })
      .catch(() => {});
  }, []);

  const bannerSrc = banner ? `${API}${banner.image}` : RoomImg;
  const bannerAlt = banner?.alt || "Cozy home";

  return (
  <section className="w-full flex flex-col md:flex-row min-h-[280px]">

    {/* Image — top on mobile, left on desktop; admin-editable via Home Banner in the admin panel */}
    <div className="w-full md:w-1/2 h-[220px] md:h-auto relative overflow-hidden flex-shrink-0">
      <img src={bannerSrc} alt={bannerAlt} loading="lazy" className="w-full h-full object-cover object-top md:object-center" />
      <div className="absolute inset-0 bg-[#2a1a00]/15" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
      {/* Overlay text — bottom right, kept within the wall area of the photo */}
      <p className="absolute bottom-10 sm:bottom-12 md:bottom-8 right-4 sm:right-6 md:right-10 text-white font-bold leading-snug text-right text-[15px] sm:text-[26px] md:text-[28px] lg:text-[34px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] max-w-[80%]">
        We Don&apos;t Take Trips
        <br />
        Our Trips take People
      </p>
    </div>

    {/* Content — bottom on mobile, right on desktop */}
    <div className="w-full md:w-1/2 bg-[#d7ecfa] px-6 md:px-5 lg:px-6 py-12 md:py-10 flex items-center justify-center relative overflow-visible">

      <div className="w-full max-w-[560px] xl:max-w-[640px] relative">

        {/* Heading */}
        <p className="text-center text-[14px] sm:text-[16px] font-extrabold text-[#16324f] uppercase tracking-[3px] mb-10 sm:mb-10">
          Curated Holidays From HillMount Holidays
        </p>

        {/* Outer white panel */}
        <div className="bg-white rounded-3xl shadow-[0_18px_45px_rgba(22,50,79,0.08)] px-5 sm:px-8 pt-9 sm:pt-11 pb-8">
          {(() => {
            const card = ({ label, to, img, tab }, wrapCls = "") => (
              <Link
                key={label}
                to={to}
                className={`group flex flex-col items-center no-underline bg-white rounded-2xl shadow-[0_8px_26px_rgba(22,50,79,0.10)] border border-gray-100 px-3 pb-6 hover:shadow-[0_14px_34px_rgba(22,50,79,0.16)] transition-shadow duration-300 ${wrapCls}`}
              >

                {/* Circle badge + colored arrow tab */}
                <div className="relative -mt-8 sm:-mt-10 mb-4">
             
                  <span
                    className="absolute top-1/2 -translate-y-1/2 left-1/2 w-[52px] sm:w-[62px] h-8 rounded-lg flex items-center justify-end pr-1.5 transition-transform duration-300 group-hover:translate-x-1"
                    style={{ backgroundColor: tab }}
                  >
                    <ChevronRight size={13} strokeWidth={3} className="text-white" />
                  </span>
                  {/* White circle with illustration */}
                  <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-[0_10px_30px_rgba(22,50,79,0.14)] ring-4 ring-white flex items-center justify-center">
                    <img
                      src={img}
                      alt={label}
                      loading="lazy"
                      className="w-9 h-9 sm:w-11 sm:h-11 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Label */}
                <p className="text-[15px] sm:text-[16px] font-extrabold text-[#16324f] text-center leading-snug">
                  {label}
                </p>
                {/* Underline accent */}
                <span className="mt-2 h-[3px] w-10 rounded-full bg-[#1E88E5] group-hover:w-14 transition-all duration-300" />
              </Link>
            );
            return (
              <>
                <div className="hidden sm:grid sm:grid-cols-4 gap-y-12 gap-x-4">
                  {LINKS.map((l) => card(l))}
                </div>
                <HorizontalScroller className="sm:hidden" edgePadding={false} topPad="pt-10">
                  {LINKS.map((l) => card(l, "flex-shrink-0 w-[152px] snap-start"))}
                </HorizontalScroller>
              </>
            );
          })()}
        </div>

        {/* Script tagline */}
        <div className="mt-6 flex items-center justify-center gap-3 text-[#1E88E5]">
          <span className="text-[15px] tracking-widest select-none">&#8250;&#8250;</span>
          <p
            className="text-[20px] sm:text-[22px] italic"
            style={{ fontFamily: '"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive' }}
          >
            Journeys crafted for you
          </p>
          <span className="text-[15px] tracking-widest select-none">&#8249;&#8249;</span>
        </div>
      </div>

    </div>

  </section>
  );
};

export default CounterBanner;

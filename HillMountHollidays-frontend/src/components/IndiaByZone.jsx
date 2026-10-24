import { useState } from "react";
import SeasonImg from "../assets/season.png";

const ZONES = ["Region", "City", "States", "Seasons"];

const IndiaByZone = () => {
  const [activeZone, setActiveZone] = useState("Region");

  return (
    <section className="w-full bg-white py-14 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-[12px] font-bold text-[#16324f] tracking-wide mb-2">Top Selling</p>
        <h2 className="text-[22px] md:text-[28px] font-extrabold text-[#16324f] mb-6">
          India Tour Package By Zone
        </h2>

        {/* Tab pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {ZONES.map((label) => (
            <button
              key={label}
              onClick={() => setActiveZone(label)}
              className={`px-5 py-1.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                activeZone === label
                  ? "bg-[#1E88E5] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* House-shaped zone cards — image inside, label below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {ZONES.map((label) => (
            <button
              key={label}
              onClick={() => setActiveZone(label)}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <div className="relative w-full h-[180px] md:h-[210px] transition-transform duration-300 group-hover:-translate-y-1">
                <img
                  src={SeasonImg}
                  alt={label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[14px] md:text-[15px] font-extrabold text-[#16324f] uppercase tracking-wide">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndiaByZone;

import { useState, useEffect } from "react";

import Africa from "../assets/worldicons/Africa.webp";
import Australia from "../assets/worldicons/Australia.webp";
import China from "../assets/worldicons/China.webp";
import Europe from "../assets/worldicons/Europe.webp";
import Jammu from "../assets/worldicons/Jammu.webp";
import Japan from "../assets/worldicons/Japan.webp";
import Kerala from "../assets/worldicons/Kerala.webp";
import Ladakh from "../assets/worldicons/LehLadakh.webp";
import NorthEast from "../assets/worldicons/NorthEast.webp";
import Rajasthan from "../assets/worldicons/Rajasthan.webp";
import SouthEast from "../assets/worldicons/SouthEast.webp";
import USA from "../assets/worldicons/USA.webp";

const circles = [
  { label: "Europe",          img: Europe    },
  { label: "South East Asia", img: SouthEast },
  { label: "Japan",           img: Japan     },
  { label: "Australia Newzealand",    img: Australia },
  { label: "China",           img: China     },
  { label: "North East",      img: NorthEast },
  { label: "Africa",          img: Africa    },
  { label: "Jammu & Kashmir", img: Jammu     },
  { label: "Leh Ladakh",      img: Ladakh    },
  { label: "Kerala",          img: Kerala    },
  { label: "USA",             img: USA       },
  { label: "Rajasthan",       img: Rajasthan },
];

const SkeletonCircle = () => (
  <div className="flex flex-col items-center gap-2 flex-shrink-0">
    <div className="w-[80px] h-[80px] rounded-full skeleton-shimmer" />
    <div className="w-[60px] h-3 skeleton-shimmer rounded" />
  </div>
);

const CircleItem = ({ label, img }) => (
  <div className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0 relative">
    {/* Hover tooltip */}
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#222] text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
      {label}
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#222]" />
    </div>

    {/* Circle */}
    <div className="w-[80px] h-[80px] overflow-hidden">
      <img src={img} alt={label} className="w-full h-full object-cover" />
    </div>

    {/* Truncated label */}
    <span className="text-[11px] font-medium text-gray-700 group-hover:text-black transition text-center w-[80px] truncate">
      {label}
    </span>
  </div>
);

const WorldCircle = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const topRow    = circles.slice(0, 6);
  const bottomRow = circles.slice(6, 12);

  if (loading) {
    return (
      <div className="bg-white py-8 px-4">
        {/* Mobile skeleton — 2 rows */}
        <div className="xl:hidden overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
          <div className="flex flex-col gap-6 w-max px-2">
            <div className="flex gap-5">
              {[...Array(6)].map((_, i) => <SkeletonCircle key={i} />)}
            </div>
            <div className="flex gap-5">
              {[...Array(6)].map((_, i) => <SkeletonCircle key={i} />)}
            </div>
          </div>
        </div>
        {/* Desktop skeleton */}
        <div className="hidden xl:flex max-w-7xl mx-auto justify-between items-start">
          {[...Array(12)].map((_, i) => <SkeletonCircle key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 px-4">
      {/* Mobile / tablet — 2 rows of 6, horizontal scroll */}
      <div className="xl:hidden overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-6 w-max px-2">
          <div className="flex gap-5">
            {topRow.map((item, i) => <CircleItem key={i} {...item} />)}
          </div>
          <div className="flex gap-5">
            {bottomRow.map((item, i) => <CircleItem key={i} {...item} />)}
          </div>
        </div>
      </div>

      {/* Desktop — all 12 in one row */}
      <div className="hidden xl:flex max-w-7xl mx-auto justify-between items-start">
        {circles.map((item, i) => <CircleItem key={i} {...item} />)}
      </div>
    </div>
  );
};

export default WorldCircle;

import { useState, useEffect } from "react";

const destinations = [
  {
    label: "India",
    tours: [
      "Mathura Vrindavan Gokul Govardhan(4D)",
      "Shimla Manali(6D)",
      "Coorg Mysore Bengaluru(6D)",
      "Assam Meghalaya(7D)",
      "Sikkim Darjeeling Gangtok(7D)",
    ],
  },
  {
    label: "South East Asia",
    tours: [
      "Kuala Lumpur Malaysia(4D)",
      "Phuket Krabi(5D)",
      "Best of Singapore(5D)",
      "Singapore Malaysia(7D)",
      "Hong Kong Macao Shenzhen(7D)",
    ],
  },
  {
    label: "Far East",
    tours: [
      "Highlights of Japan(5D)",
      "Best of China(9D)",
      "Japan Explorer(10D)",
      "Japan with Alpine Route(10D)",
      "Japan China Korea(18D)",
    ],
  },
  {
    label: "Australia NZ",
    tours: [
      "Highlights of Australia(7D)",
      "Best of New Zealand(10D)",
      "All of Australia(15D)",
      "All of New Zealand(15D)",
      "Australia New Zealand(17D)",
    ],
  },
  {
    label: "Africa",
    tours: [
      "Kenya Jewels(6D)",
      "Best of Kenya(8D)",
      "Tanzania Zanzibar(8D)",
      "Uganda Rwanda(8D)",
      "South Africa with Cape(9D)",
    ],
  },
  {
    label: "Middle East",
    tours: [
      "Dubai City Break(4D)",
      "Abu Dhabi Explorer(5D)",
      "Jordan & Petra(7D)",
      "Oman Discovery(7D)",
      "Dubai & Egypt(10D)",
    ],
  },
  {
    label: "Europe",
    tours: [
      "Paris Highlights(5D)",
      "Swiss Alps(7D)",
      "Italy Explorer(8D)",
      "Eastern Europe(10D)",
      "Grand Europe(14D)",
    ],
  },
];

const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100 ${className}`}>
    <div className="h-8 skeleton-shimmer" />
    <div className="p-3 flex flex-col gap-2 flex-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`h-3 skeleton-shimmer rounded ${i === 4 ? "w-3/4" : "w-full"}`} />
      ))}
      <div className="h-7 skeleton-shimmer rounded-sm mt-3" />
    </div>
  </div>
);

const CardItem = ({ dest, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100 ${className}`}>
    <div className="bg-[#1E88E5] px-3 py-1.5 text-center">
      <span className="text-white font-bold text-[12px]">{dest.label}</span>
    </div>
    <div className="p-3 flex-1 flex flex-col justify-between">
      <ul className="space-y-1.5">
        {dest.tours.map((tour, i) => (
          <li key={i} className="text-[10px] text-gray-600 leading-snug">
            {tour}
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white font-semibold text-[11px] py-1.5 px-3 rounded-sm transition flex items-center justify-center gap-1">
        Explore More <span className="text-[12px]">→</span>
      </button>
    </div>
  </div>
);

const WorldCard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-gray-50 py-6 px-4">
        <div className="xl:hidden overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          <div className="flex gap-3 w-max px-2">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} className="w-[185px] flex-shrink-0" />)}
          </div>
        </div>
        <div className="hidden xl:flex max-w-7xl mx-auto gap-4">
          {[...Array(7)].map((_, i) => <SkeletonCard key={i} className="flex-1" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 py-6 px-4">
      {/* Mobile / tablet — horizontal scroll */}
      <div className="xl:hidden overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-3 w-max px-2">
          {destinations.map((dest, idx) => (
            <CardItem key={idx} dest={dest} className="w-[185px] flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Desktop — centered row */}
      <div className="hidden xl:flex max-w-7xl mx-auto gap-4">
        {destinations.map((dest, idx) => (
          <CardItem key={idx} dest={dest} className="flex-1" />
        ))}
      </div>
    </div>
  );
};

export default WorldCard;

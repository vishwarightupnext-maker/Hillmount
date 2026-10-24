import { useParams } from "react-router-dom";

const seasonMeta = {
  "mar-jun": {
    title: "March to June",
    subtitle: "Spring & Summer Escapes",
    desc: "Experience blooming landscapes, pleasant weather, and vibrant festivals across the world's most beautiful destinations.",
    color: "#a3e635",
  },
  "jul-oct": {
    title: "July to October",
    subtitle: "Monsoon & Autumn Adventures",
    desc: "From lush green valleys to golden autumn forests—discover destinations at their most dramatic and alive.",
    color: "#38bdf8",
  },
  "nov-feb": {
    title: "November to February",
    subtitle: "Winter Wonderland Journeys",
    desc: "Snowy peaks, cozy retreats, and festive celebrations. The best time to explore Europe, Kashmir, and beyond.",
    color: "#818cf8",
  },
  "year-round": {
    title: "Year Round Specials",
    subtitle: "Always a Perfect Time to Travel",
    desc: "Handpicked destinations that welcome you in any season—beach paradises, cultural cities, and timeless landscapes.",
    color: "#1E88E5",
  },
};

const SeasonTours = () => {
  const { season } = useParams();
  const meta = seasonMeta[season] ?? {
    title: "Season Tours",
    subtitle: "Explore our curated journeys",
    desc: "Discover amazing destinations crafted for every season.",
    color: "#1E88E5",
  };

  return (
    <div className="min-h-screen bg-white">
      <div
        className="w-full py-16 px-6 text-center"
        style={{ backgroundColor: meta.color + "22", borderBottom: `4px solid ${meta.color}` }}
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Curated Journeys
        </p>
        <h1 className="text-3xl md:text-5xl font-black text-black mb-3">{meta.title}</h1>
        <p className="text-lg md:text-xl font-semibold text-gray-700 mb-4">{meta.subtitle}</p>
        <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">{meta.desc}</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16 text-center text-gray-400">
        <p className="text-lg font-medium">Tour packages for this season coming soon.</p>
        <p className="text-sm mt-2">Contact us to plan your perfect {meta.title} journey.</p>
      </div>
    </div>
  );
};

export default SeasonTours;

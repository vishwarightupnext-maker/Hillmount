import Logo from "../assets/logo.png";

/* Full-screen loading overlay shown on initial load and route changes */
const PageLoader = () => (
  <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
    <img
      src={Logo}
      alt="HillMount Holidays"
      className="h-20 sm:h-24 object-contain animate-pulse"
    />
    {/* Sliding progress bar */}
    <div className="mt-5 h-1 w-28 rounded-full bg-blue-100 overflow-hidden">
      <div
        className="h-full w-1/2 rounded-full bg-[#1E88E5]"
        style={{ animation: "pageloader-slide 1s ease-in-out infinite" }}
      />
    </div>
    <style>{`
      @keyframes pageloader-slide {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }
    `}</style>
  </div>
);

export default PageLoader;

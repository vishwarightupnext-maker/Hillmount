import { useRef, useState, useEffect } from "react";
import HeroSkeleton, { useImageLoaded } from "../components/HeroSkeleton";
import {
  Users,
  Award,
  Megaphone,
  MonitorPlay,
  MapPin,
  User,
  FileText,
  Settings,
  Headphones,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Rocket,
  Building2,
  Gift,
  Mic,
  Compass,
  Leaf,
  Target,
  Check,
  ArrowUpRight,
} from "lucide-react";
import BG from "../assets/mice/mice-bg.webp";
import IncentiveImg from "../assets/mice/Incentive.webp";
import ConferenceImg from "../assets/mice/Conferences.webp";
import ExhibitionImg from "../assets/mice/Exhibitions.webp";
import Coorporate from "../assets/mice/CorporateMeetings.webp";
import { API } from "../components/adminComponents/apiHelper";
import EnquiryModal from "../components/EnquiryModal";
import FaqComponent from "../components/faqComponent";
import HorizontalScroller from "../components/HorizontalScroller";
const IconWithCircle = ({ icon: Icon }) => (
  <div className="relative inline-block mb-4 mt-2">
    <div className="absolute top-0 right-0 w-[22px] h-[22px] bg-[#1E88E5] rounded-full transform translate-x-1.5 -translate-y-1.5"></div>
    <div className="relative z-10 text-black">
      <Icon size={36} strokeWidth={1.5} />
    </div>
  </div>
);

const IconChip = ({ icon: Icon, bg, color }) => (
  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
    <Icon size={20} strokeWidth={2} className={color} />
  </div>
);


const CollageEnquiryButton = ({ onClick }) => (
  <button
    type="button"
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="absolute bottom-3 right-3 z-20 flex items-center h-9 rounded-full bg-white text-[#1E88E5] shadow-md pl-2.5 pr-2.5 gap-0 group-hover:gap-1.5 transition-all duration-300 cursor-pointer"
    aria-label="Enquiry Now"
  >
    <span className="max-w-0 group-hover:max-w-[100px] overflow-hidden whitespace-nowrap text-[11.5px] font-semibold transition-all duration-300">
      Enquiry Now
    </span>
    <ArrowUpRight size={16} strokeWidth={2.5} className="shrink-0" />
  </button>
);

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

const WA_NUMBER = "+919994666522";

/* ── MICE enquiry form ── */
const DESTINATIONS = [
  "India", "Bali", "Thailand", "Malaysia", "Phu Quoc",
  "Sri Lanka", "Europe", "Dubai", "Hong Kong", "Others / Not Decided",
];

const MiceFormField = ({ label, required, children }) => (
  <div className="group">
    <label className="text-white/90 text-[12px] font-semibold block mb-1.5 transition-all duration-200 group-focus-within:translate-x-0.5">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const miceInputCls =
  "w-full bg-white/10 text-white text-[13px] px-4 py-3 rounded-lg outline-none placeholder-white/50 border-2 border-[#1E88E5]/50 focus:border-[#1E88E5] transition-all duration-200";

const MiceEnquiryForm = () => {
  const [form, setForm] = useState({
    companyName: "", contactPerson: "", phone: "", travellers: "",
    destination: "", travelMonth: "", budget: "", requirement: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");
  const submittingRef = useRef(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/mice-enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to send.");
      setSuccess(true);
      setForm({
        companyName: "", contactPerson: "", phone: "", travellers: "",
        destination: "", travelMonth: "", budget: "", requirement: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <RevealItem delay={0} from="bottom">
      <div className="relative overflow-hidden rounded-[24px] shadow-xl bg-gradient-to-br from-[#0a2540] via-[#123b5e] to-[#1E88E5] px-6 py-10 md:px-12 md:py-14">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left — copy */}
          <div>
            <span className="inline-block bg-sky-400/15 text-sky-300 border border-sky-400/30 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider mb-6">
              Corporate Enquiry
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Start planning your next MICE experience.
            </h2>
            <p className="text-white/70 text-[14px] leading-relaxed max-w-md">
              Share your basic requirements and our team can prepare a suitable corporate travel proposal for your company.
            </p>
          </div>

          {/* Right — form */}
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MiceFormField label="Company Name" required>
                <input required value={form.companyName} onChange={update("companyName")}
                  placeholder="Your company" className={miceInputCls} />
              </MiceFormField>
              <MiceFormField label="Contact Person" required>
                <input required value={form.contactPerson} onChange={update("contactPerson")}
                  placeholder="Your name" className={miceInputCls} />
              </MiceFormField>

              <MiceFormField label="Contact Number" required>
                <input required type="tel" value={form.phone} onChange={update("phone")}
                  placeholder="Your phone number" className={miceInputCls} />
              </MiceFormField>
              <MiceFormField label="Number of Travellers" required>
                <input required type="number" min="1" value={form.travellers} onChange={update("travellers")}
                  placeholder="Example: 50" className={miceInputCls} />
              </MiceFormField>

              <MiceFormField label="Preferred Destination" required>
                <select required value={form.destination} onChange={update("destination")}
                  className={`${miceInputCls} appearance-none cursor-pointer`}>
                  <option value="" className="text-black">Select Destination</option>
                  {DESTINATIONS.map((d) => (
                    <option key={d} value={d} className="text-black">{d}</option>
                  ))}
                </select>
              </MiceFormField>
              <MiceFormField label="Travel Month">
                <input type="month" value={form.travelMonth} onChange={update("travelMonth")}
                  className={`${miceInputCls} [color-scheme:dark]`} />
              </MiceFormField>

              <div className="sm:col-span-2">
                <MiceFormField label="Approximate Budget">
                  <input value={form.budget} onChange={update("budget")}
                    placeholder="Example: ₹25 lakh" className={miceInputCls} />
                </MiceFormField>
              </div>

              <div className="sm:col-span-2">
                <MiceFormField label="Requirement">
                  <textarea rows={3} value={form.requirement} onChange={update("requirement")}
                    placeholder="Meeting, incentive tour, conference, exhibition, dealer meet or company offsite"
                    className={`${miceInputCls} resize-none`} />
                </MiceFormField>
              </div>
            </div>

            {error && (
              <p className="flex items-center gap-2 text-red-300 text-[12.5px]">
                <AlertTriangle size={14} className="shrink-0" /> {error}
              </p>
            )}
            {success && (
              <p className="flex items-center gap-2 text-emerald-300 text-[12.5px]">
                <CheckCircle size={14} className="shrink-0" /> Thanks! Our team will reach out shortly.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1E88E5] to-[#42a5f5] hover:from-[#1669b3] hover:to-[#1E88E5] text-white font-bold text-[14px] py-3 rounded-lg transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Sending..." : "Request MICE Proposal"}
            </button>
          </form>
        </div>
      </div>
    </RevealItem>
  );
};

const Mice = () => {
  const [mounted, setMounted] = useState(false);
  const collageRef = useRef(null);
  const formRef = useRef(null);
  const [slotMap, setSlotMap] = useState({});
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/mice-gallery`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.length) {
          const map = {};
          d.data.forEach((item) => { map[item.slot] = item; });
          setSlotMap(map);
        }
      })
      .catch(() => {});
  }, []);

  // Slot images/text are managed only from the admin MICE Gallery panel —
  // no hardcoded stock images/text are shown when a slot hasn't been uploaded yet.
  const NO_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%25' height='100%25' fill='%23e2e8f0'/></svg>";
  const imgSrc = (slot) =>
    slotMap[slot] ? `${API}${slotMap[slot].imageUrl}` : NO_IMAGE;
  const imgLabel = (slot) => slotMap[slot]?.label || '';
  const imgSub = (slot) => slotMap[slot]?.sublabel || '';

  // Nights badge (top-right pill) shown only when the admin has filled in
  // destination info for this slot's image.
  const destTopBadge = (slot) => {
    const info = slotMap[slot];
    if (!info?.destination || !info.nights) return null;
    return (
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-white/90 text-[#16324f] text-[10px] md:text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
          {info.nights}N
        </span>
      </div>
    );
  };

  // Bottom overlay: destination name stacked above "Starts from ₹X" when
  // destination info is set, otherwise the label/sub-label set in the admin
  // panel. Nothing shows for a slot that hasn't been uploaded/filled in yet.
  const bottomOverlay = (slot, _fallbackLabel, _fallbackSub, titleCls, subCls) => {
    const info = slotMap[slot];
    if (!info) return null;
    if (info.destination) {
      return (
        <>
          <h3 className="text-xl md:text-2xl font-extrabold leading-none mb-1.5 drop-shadow-md">{info.destination}</h3>
          <p className={`${subCls} opacity-80`}>Starts from</p>
          <p className={`${titleCls} font-extrabold`}>
            {info.startingFrom ? `₹${Number(info.startingFrom).toLocaleString('en-IN')}` : 'On Request'}
          </p>
        </>
      );
    }
    if (!imgLabel(slot) && !imgSub(slot)) return null;
    return (
      <>
        {imgLabel(slot) && <h3 className={titleCls}>{imgLabel(slot)}</h3>}
        {imgSub(slot) && <p className={subCls}>{imgSub(slot)}</p>}
      </>
    );
  };

  const heroSlide = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
  });

  const heroBgLoaded = useImageLoaded(BG);

  return (
    <div className="w-full font-inter">
      {/* 1. HERO SECTION */}
      <div
        className="relative w-full h-[500px] md:h-[600px]"
        style={{ backgroundImage: `url(${BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <HeroSkeleton show={!heroBgLoaded} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-10">
          <h1 style={heroSlide(0.15)} className="text-2xl md:text-4xl lg:text-[54px] font-extrabold mb-6 leading-tight max-w-4xl tracking-tight">
            Where Business Meets Perfect
          </h1>
          <p style={heroSlide(0.35)} className="text-sm md:text-[15px] text-gray-200 mb-10 max-w-2xl mx-auto font-medium opacity-90 leading-relaxed">
            Seamless Corporate Travel Experience, designed with care, precision, and a dash of magic.
          </p>
          <div style={heroSlide(0.5)} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full max-w-[280px] sm:max-w-none mx-auto">
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex">
              <button className="cursor-pointer bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white font-semibold text-[14px] py-2.5 px-6 rounded-sm transition flex items-center justify-center gap-1 w-full sm:w-auto whitespace-nowrap">
                Get Custom Travel Advice
              </button>
            </a>
            <button
              onClick={() => collageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="w-full sm:w-auto bg-transparent cursor-pointer border border-white/50 hover:bg-white hover:text-black text-white font-semibold text-[14px] px-6 py-2.5 rounded-sm transition backdrop-blur-sm whitespace-nowrap">
              Explore Destinations
            </button>
          </div>
        </div>
      </div>

      {/* 2. WHAT IS MICE SECTION */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-12 lg:pt-12 lg:pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-[28px] font-bold text-black mb-1">
            What is MICE (Simplified)
          </h2>
          <h3 className="text-xl md:text-[22px] font-bold text-black mb-3">
            Designed with the Comfort of Home.
          </h3>
          <p className="text-[13px] text-gray-500">
            Business Travel, Designed with the Comfort of Home.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { icon: Users, title: "Meetings", desc: "Motivation, corporate travel and cost terms." },
            { icon: Award, title: "Incentives", desc: "Incentivize experiences, rewarding teams." },
            { icon: Megaphone, title: "Conferences", desc: "Gathering business and collaboratives." },
            { icon: MonitorPlay, title: "Exhibitions", desc: "Exhibiting innovations worldwide." },
          
          ].map((item, idx) => (
            <RevealItem key={idx} delay={idx * 0.1} from="bottom">
              <div className="flex flex-col items-center text-center max-w-[140px]">
                <IconWithCircle icon={item.icon} />
                <h4 className="font-bold text-black text-[15px] mb-1.5">{item.title}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </RevealItem>
          ))}
        </div>
      </div>

      {/* 2b. CORPORATE IMPACT SECTION */}
      <div className="max-w-7xl mx-auto px-4 pb-10 lg:pb-16">
        <RevealItem delay={0} from="bottom">
          <div
            className="relative overflow-hidden rounded-[24px] shadow-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${Coorporate})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a2540]/95 via-[#123b5e]/92 to-[#1E88E5]/85" />

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center px-6 py-10 md:px-12 md:py-16">

              {/* Left — copy */}
              <div>
                <span className="inline-block bg-sky-400/15 text-sky-300 border border-sky-400/30 rounded-full px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-wider mb-6">
                  MICE Travel Solutions from Coimbatore
                </span>
                <h2 className="text-3xl md:text-[42px] font-extrabold text-white leading-tight mb-5">
                  Corporate journeys designed for{" "}
                  <span className="text-sky-300">business impact.</span>
                </h2>
                <p className="text-white/70 text-[14px] leading-relaxed max-w-lg mb-8">
                  Plan meetings, incentive tours, conferences, exhibitions, dealer meets and company offsites with end-to-end travel support across India and worldwide.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer">
                    <button className="cursor-pointer w-full sm:w-auto bg-[#1E88E5] hover:bg-[#084298] text-white font-semibold text-[13.5px] py-2.5 px-6 rounded-sm transition whitespace-nowrap">
                      Request a Corporate Proposal
                    </button>
                  </a>
                  <button
                    onClick={() => collageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="cursor-pointer w-full sm:w-auto bg-transparent border border-white/40 hover:bg-white hover:text-black text-white font-semibold text-[13.5px] py-2.5 px-6 rounded-sm transition whitespace-nowrap">
                    Explore MICE Services
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {["Dedicated MICE Coordinator", "Domestic & International", "Custom Corporate Itineraries"].map((label) => (
                    <span key={label} className="flex items-center gap-1.5 text-white/85 text-[12px] font-medium">
                      <Check size={13} className="text-sky-300 shrink-0" strokeWidth={3} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — command centre card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-bold text-[15px] leading-snug">Your MICE Command Centre</h3>
                  <span className="flex items-center gap-1.5 text-sky-300 text-[10.5px] font-semibold whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    Ready to plan
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { stat: "24×7", desc: "Travel assistance throughout the journey" },
                    { stat: "100%", desc: "Customised around your corporate goals" },
                    { stat: "One",  desc: "Single point of contact for coordination" },
                    { stat: "India +", desc: "International destination network" },
                  ].map(({ stat, desc }) => (
                    <div key={stat} className="bg-white/10 border border-white/10 rounded-xl p-4">
                      <p className="text-white font-extrabold text-xl mb-1.5">{stat}</p>
                      <p className="text-white/65 text-[11px] leading-snug">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealItem>
      </div>

      {/* 4. OUR MICE EXPERTISE SECTION */}
      <div className="max-w-7xl mx-auto px-4 pt-14 lg:pt-20 pb-10 lg:pb-16">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-14">
          <h2 className="text-2xl md:text-[28px] font-bold text-black mb-3 leading-tight">
            Everything your company needs, managed under one roof.
          </h2>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            From the first planning call to the final airport transfer, every detail is coordinated for a seamless corporate travel experience.
          </p>
        </div>

        {(() => {
          const MICE_CARDS = [
            { title: "Corporate Meetings", icon: Building2, bg: "bg-blue-100",   color: "text-blue-600",   desc: "Board meetings, strategy sessions, leadership meets and regional sales meetings with venue and travel coordination." },
            { title: "Incentive Travel", icon: Gift, bg: "bg-amber-100",  color: "text-amber-600",  desc: "Reward high-performing teams with thoughtfully designed domestic or international travel experiences." },
            { title: "Conferences & Events", icon: Mic, bg: "bg-violet-100", color: "text-violet-600", desc: "Conference travel, accommodation, transfers, meals, gala evenings and on-ground support for corporate groups." },
            { title: "Exhibitions & Trade Shows", icon: Compass, bg: "bg-orange-100", color: "text-orange-600", desc: "Business travel support for exhibitors, delegates and corporate teams attending global trade events." },
            { title: "Product Launches", icon: Rocket, bg: "bg-pink-100",   color: "text-pink-600",   desc: "Destination selection, guest movement, venue planning and coordinated travel for memorable product showcases." },
            { title: "Dealer Meets", icon: Users, bg: "bg-indigo-100", color: "text-indigo-600", desc: "Structured dealer and distributor engagement programmes with comfortable travel and event arrangements." },
            { title: "Team Offsites", icon: Leaf, bg: "bg-green-100",  color: "text-green-600",  desc: "Corporate retreats, leadership offsites and team-building getaways designed for stronger collaboration." },
            { title: "Employee Engagement", icon: Target, bg: "bg-red-100",    color: "text-red-600",    desc: "Family days, annual celebrations, recognition trips and employee engagement experiences across destinations." },
          ];
          const card = (c, wrapCls = "") => (
            <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 h-full ${wrapCls}`}>
              <div className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full bg-blue-50 blur-md pointer-events-none" />
              <div className="relative">
                <IconChip icon={c.icon} bg={c.bg} color={c.color} />
                <h3 className="font-bold text-black text-[15px] mb-1.5 leading-snug">{c.title}</h3>
                <p className="text-gray-500 text-[12px] leading-relaxed">{c.desc}</p>
              </div>
            </div>
          );
          return (
            <>
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MICE_CARDS.map((c, idx) => (
                  <RevealItem key={idx} delay={(idx % 4) * 0.1} from="bottom">{card(c)}</RevealItem>
                ))}
              </div>
              <HorizontalScroller className="sm:hidden">
                {MICE_CARDS.map((c, idx) => (
                  <div key={idx} className="flex-shrink-0 w-[240px] snap-start">{card(c)}</div>
                ))}
              </HorizontalScroller>
            </>
          );
        })()}
      </div>

      {/* 5. EXPERIENCE FLOW SECTION */}
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-15 lg:pt-14 lg:pb-28">
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-black mb-1">
            Experience Flow
          </h2>
          <p className="text-[14px] text-gray-500">
            (Process Section)
          </p>
        </div>

        <div className="relative w-full">
          <div className="absolute left-[10%] right-[10%] h-[1px] bg-[#FDD000] top-[24px] -z-10"></div>
          <div className="absolute left-[10%] w-[30%] h-[1.5px] bg-[#1E88E5] top-[24px] -z-10"></div>

          <div className="flex flex-row justify-between items-center gap-0">
            {[
              { title: "Understand\nyour\nrequirement", icon: User },
              { title: "Plan &\ncustomize", icon: FileText },
              { title: "Execute\nseamlessly", icon: Settings },
              { title: "Support\nthroughout", icon: Headphones }
            ].map((step, idx) => (
              <RevealItem key={idx} delay={idx * 0.15} from="bottom">
                <div className="flex flex-col items-center text-center relative bg-white px-1 sm:px-2">
                  <div className="relative w-[42px] h-[38px] sm:w-[54px] sm:h-[48px] mb-3 drop-shadow-md">
                    <svg viewBox="0 0 54 48" className="w-full h-full" aria-hidden="true">
                      <path
                        d="M8 42 V20 L27 6 L46 20 V42 Z"
                        fill="#1E88E5"
                        stroke="#1E88E5"
                        strokeWidth="8"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center pt-1.5 text-white">
                      <step.icon size={16} strokeWidth={2.5} className="sm:hidden" />
                      <step.icon size={20} strokeWidth={2.5} className="hidden sm:block" />
                    </div>
                  </div>
                  <p className="text-[8px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-wider whitespace-pre-line leading-tight text-black">
                    {step.title}
                  </p>
                </div>
              </RevealItem>
            ))}
          </div>
        </div>
      </div>

      {/* 3. TRAVEL COLLAGE SECTION */}
      <div ref={collageRef} className="max-w-7xl mx-auto px-4 pb-14 lg:pb-20 scroll-mt-24">

        {/* Mobile collage: 2-col × 3-row, all 6 cells */}
        <div
          className="md:hidden grid gap-3"
          style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "200px 150px 150px" }}
        >
          {/* Row 1, Col 1: left slot */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img src={imgSrc('left', BG)} alt="MICE Travel" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            {destTopBadge('left')}
            <div className="absolute bottom-4 left-3 right-3 text-white">
              {bottomOverlay('left', '"More Than a Journey –\nWelcome Home."', 'Seamless corporate experiences.', 'text-xs font-bold leading-snug mb-1', 'text-[9px] text-gray-300 leading-relaxed')}
            </div>
            <CollageEnquiryButton onClick={() => setEnquiryOpen(true)} />
          </div>
          {/* Row 1, Col 2: center-tl */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img src={imgSrc('center-tl', ConferenceImg)} alt="Corporate Events" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {destTopBadge('center-tl')}
            <div className="absolute bottom-3 left-3 text-white">
              {bottomOverlay('center-tl', 'Corporate Events', 'Strategy & Meetings', 'text-[10px] font-bold', 'text-[9px] text-gray-300')}
            </div>
            <CollageEnquiryButton onClick={() => setEnquiryOpen(true)} />
          </div>
          {/* Row 2, Col 1: center-tr */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img src={imgSrc('center-tr', ExhibitionImg)} alt="Exhibitions" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {destTopBadge('center-tr')}
            <div className="absolute bottom-3 left-3 text-white">
              {bottomOverlay('center-tr', 'Exhibitions', 'Global showcases', 'text-[10px] font-bold', 'text-[9px] text-gray-300')}
            </div>
            <CollageEnquiryButton onClick={() => setEnquiryOpen(true)} />
          </div>
          {/* Row 2, Col 2: center-bl */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img src={imgSrc('center-bl', IncentiveImg)} alt="Incentive Travel" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {destTopBadge('center-bl')}
            <div className="absolute bottom-3 left-3 text-white">
              {bottomOverlay('center-bl', 'Incentive Travel', 'Rewarding teams', 'text-[10px] font-bold', 'text-[9px] text-gray-300')}
            </div>
            <CollageEnquiryButton onClick={() => setEnquiryOpen(true)} />
          </div>
          {/* Row 3, Col 1: center-br */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img src={imgSrc('center-br', Coorporate)} alt="Corporate Meetings" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {destTopBadge('center-br')}
            <div className="absolute bottom-3 left-3 text-white">
              {bottomOverlay('center-br', 'Corporate Meetings', 'End-to-end support', 'text-[10px] font-bold', 'text-[9px] text-gray-300')}
            </div>
            <CollageEnquiryButton onClick={() => setEnquiryOpen(true)} />
          </div>
          {/* Row 3, Col 2: right slot */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img src={imgSrc('right', BG)} alt="MICE Solutions" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {destTopBadge('right')}
            <div className="absolute bottom-3 left-3 text-white">
              {bottomOverlay('right', 'MICE Solutions', 'Tailored perfectly', 'text-[10px] font-bold', 'text-[9px] text-gray-300')}
            </div>
            <CollageEnquiryButton onClick={() => setEnquiryOpen(true)} />
          </div>
        </div>

        {/* Desktop collage: 6-cell — left tall + 2×2 center + right tall */}
        <div
          className="hidden md:grid gap-3"
          style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "250px 250px" }}
        >
          {/* Col 1 — left tall, spans both rows */}
          <div className="relative rounded-2xl overflow-hidden group" style={{ gridRow: "1 / 3" }}>
            <img src={imgSrc('left', BG)} alt="MICE Travel" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {destTopBadge('left')}
            <div className="absolute bottom-8 left-6 right-6 text-white">
              {bottomOverlay('left', '"More Than a Journey –\nWelcome Home."', 'Seamless corporate experiences crafted with care.', 'text-lg font-bold leading-snug mb-2', 'text-xs text-gray-300 leading-relaxed')}
            </div>
            <CollageEnquiryButton onClick={() => setEnquiryOpen(true)} />
          </div>
          {/* Col 2 row 1: center-tl */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img src={imgSrc('center-tl', ConferenceImg)} alt="Corporate Events" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {destTopBadge('center-tl')}
            <div className="absolute bottom-4 left-4 text-white">
              {bottomOverlay('center-tl', 'Corporate Events', 'Strategy & Meetings', 'text-xs font-bold', 'text-[10px] text-gray-300')}
            </div>
            <CollageEnquiryButton onClick={() => setEnquiryOpen(true)} />
          </div>
          {/* Col 3 row 1: center-tr */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img src={imgSrc('center-tr', ExhibitionImg)} alt="Exhibitions" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {destTopBadge('center-tr')}
            <div className="absolute bottom-4 left-4 text-white">
              {bottomOverlay('center-tr', 'Exhibitions & More', 'Global showcases', 'text-xs font-bold', 'text-[10px] text-gray-300')}
            </div>
            <CollageEnquiryButton onClick={() => setEnquiryOpen(true)} />
          </div>
          {/* Col 4 — right tall, spans both rows */}
          <div className="relative rounded-2xl overflow-hidden group" style={{ gridColumn: "4", gridRow: "1 / 3" }}>
            <img src={imgSrc('right', IncentiveImg)} alt="Incentive Travel" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {destTopBadge('right')}
            <div className="absolute bottom-8 left-5 right-5 text-white">
              {bottomOverlay('right', 'Incentive Travel', 'Reward your team with unforgettable experiences.', 'text-base font-bold leading-snug mb-1', 'text-xs text-gray-300 leading-relaxed')}
            </div>
            <CollageEnquiryButton onClick={() => setEnquiryOpen(true)} />
          </div>
          {/* Col 2 row 2: center-bl */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img src={imgSrc('center-bl', Coorporate)} alt="Corporate Meetings" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {destTopBadge('center-bl')}
            <div className="absolute bottom-4 left-4 text-white">
              {bottomOverlay('center-bl', 'Corporate Meetings', 'End-to-end support', 'text-xs font-bold', 'text-[10px] text-gray-300')}
            </div>
            <CollageEnquiryButton onClick={() => setEnquiryOpen(true)} />
          </div>
          {/* Col 3 row 2: center-br */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img src={imgSrc('center-br', BG)} alt="MICE Solutions" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {destTopBadge('center-br')}
            <div className="absolute bottom-4 left-4 text-white">
              {bottomOverlay('center-br', 'MICE Solutions', 'Tailored to perfection', 'text-xs font-bold', 'text-[10px] text-gray-300')}
            </div>
            <CollageEnquiryButton onClick={() => setEnquiryOpen(true)} />
          </div>
        </div>
      </div>

      {/* 5b. MICE ENQUIRY FORM SECTION */}
      <div ref={formRef} className="max-w-6xl mx-auto px-4 pb-10 lg:pb-16 scroll-mt-24">
        <MiceEnquiryForm />
      </div>

      {/* 5c. FAQ SECTION */}
      <FaqComponent filterParam="mice" />

      {/* 6. CALL TO ACTION SECTION */}
      <div className="max-w-5xl mx-auto px-4 pt-4 pb-10">
        <RevealItem delay={0} from="bottom">
          <div className="bg-[#1E88E5] rounded-[24px] text-center py-10 px-6 shadow-xl">
            
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2 leading-tight max-w-2xl mx-auto tracking-tight">
              Let's Plan Your Next Corporate Experience
            </h2>
            <p className="text-[15px] font-medium text-white  opacity-90">
              From boardrooms to beaches—we handle everything.
            </p>
         
          </div>
        </RevealItem>
      </div>

      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </div>
  );
};

export default Mice;


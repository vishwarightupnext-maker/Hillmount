import { useState, useRef, useEffect } from "react";
import { User, Sofa, HeartHandshake, Compass, ShieldCheck, ArrowRight, Target, Rocket } from "lucide-react";
import HeroSkeleton, { useImageLoaded } from "../components/HeroSkeleton";
import AboutImg from "../assets/about/about-bg1.webp";
import JourneyFallbackImg from "../assets/about/team.jpeg";
import RamImg from "../assets/about/Ram.svg";
import SubbiahImg from "../assets/about/Subbiah.svg";
import ThariniImg from "../assets/about/Tharini.svg";
import HorizontalScroller from "../components/HorizontalScroller";
import AuthorisedPartnerPanel from "../components/AuthorisedPartnerPanel";
import { API } from "../components/adminComponents/apiHelper";

// Shown until the admin panel's Team / About Journey data loads (or if it's ever empty).

const TEAM_FALLBACK = [
    { name: "Subbiah",  role: "Team Member", img: SubbiahImg },
  { name: "Ram",      role: "Team Member", img: RamImg },
    { name: "Tharini",  role: "Team Member", img: ThariniImg },
  // { name: "Balaji",   role: "Team Member", img: BalajiImg },

];

const CYCLE_WORDS = ["Home", "City", "State", "Country"];
const ARCH_CLIP = "polygon(50% 0%, 100% 18%, 100% 100%, 0% 100%, 0% 18%)";

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

const useCycleTyped = (words) => {
  const [wordIdx, setWordIdx] = useState(0);
  const [text, setText] = useState(words[0]);
  const [phase, setPhase] = useState("pause");

  useEffect(() => {
    let t;
    if (phase === "pause") {
      t = setTimeout(() => setPhase("deleting"), 2000);
    } else if (phase === "deleting" && text.length > 0) {
      t = setTimeout(() => setText(p => p.slice(0, -1)), 65);
    } else if (phase === "deleting" && text.length === 0) {
      setWordIdx(i => (i + 1) % words.length);
      setPhase("typing");
    } else if (phase === "typing" && text.length < words[wordIdx].length) {
      t = setTimeout(() => setText(words[wordIdx].slice(0, text.length + 1)), 100);
    } else if (phase === "typing" && text.length === words[wordIdx].length) {
      setPhase("pause");
    }
    return () => clearTimeout(t);
  }, [text, phase, wordIdx, words]);

  return text;
};

/* ─── Components ─────────────────────────────────────────── */

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

const TypedWord = ({ word, startDelay = 0.8 }) => {
  const ref = useRef(null);
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setPhase("typing"), startDelay * 1000);
          obs.disconnect();
        }
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [startDelay]);

  useEffect(() => {
    if (phase === "idle") return;
    let t;
    if (phase === "typing" && chars < word.length) {
      t = setTimeout(() => setChars(c => c + 1), 75);
    } else if (phase === "typing" && chars === word.length) {
      t = setTimeout(() => setPhase("pause"), 1600);
    } else if (phase === "pause") {
      setPhase("deleting");
    } else if (phase === "deleting" && chars > 0) {
      t = setTimeout(() => setChars(c => c - 1), 50);
    } else if (phase === "deleting" && chars === 0) {
      t = setTimeout(() => setPhase("typing"), 350);
    }
    return () => clearTimeout(t);
  }, [phase, chars, word]);

  return (
    <span ref={ref} className="text-[#1E88E5]">
      {word.slice(0, chars)}
      {phase !== "idle" && (
        <span className="inline-block w-[1.5px] h-[0.85em] bg-[#1E88E5] ml-[0.5px] animate-pulse align-middle" />
      )}
    </span>
  );
};

const IconWithCircle = ({ icon: Icon }) => (
  <div className="relative inline-block mb-5 mt-2">
    <div className="absolute top-0 right-0 w-[18px] h-[18px] bg-[#1E88E5] rounded-full transform translate-x-1.5 -translate-y-1.5"></div>
    <div className="relative z-10 text-black">
      <Icon size={32} strokeWidth={1.5} />
    </div>
  </div>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ─── Page ────── */

const AboutUs = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const journeyHeadingRef = useRef(null);
  const journeySectionRef = useRef(null);
  const storyButtonRef = useRef(null);
  const hasInteracted = useRef(false);
  const ctaWord = useCycleTyped(CYCLE_WORDS);
  const [team, setTeam] = useState(TEAM_FALLBACK);
  const [journeyImg, setJourneyImg] = useState(JourneyFallbackImg);

  useEffect(() => {
    // Static fallback images in use — admin-panel API fetch disabled until image hosting is fixed.
    // fetch(`${API}/api/team`)
    //   .then((r) => r.json())
    //   .then((d) => {
    //     if (d.success && d.data?.length) {
    //       setTeam(d.data.map((m) => ({
    //         name: m.name,
    //         role: m.role,
    //         img: `${API}${m.image}`,
    //         linkedin: m.linkedin || undefined,
    //       })));
    //     }
    //   })
    //   .catch(() => {});

    // fetch(`${API}/api/about-journey`)
    //   .then((r) => r.json())
    //   .then((d) => {
    //     if (d.success && d.data?.image) setJourneyImg(`${API}${d.data.image}`);
    //   })
    //   .catch(() => {});
  }, []);

  useEffect(() => {
    if (!hasInteracted.current) return;
    if (isExpanded) {
      setTimeout(() => journeySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 150);
    } else {
      setTimeout(() => {
        const el = journeyHeadingRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }, 50);
    }
  }, [isExpanded]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const heroSlide = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  const [journeyRef, journeyStyle] = useReveal(0);
  const [journeyImgRef, journeyImgStyle] = useReveal(0.2);
  const [mvRef, mvStyle] = useReveal(0);
  const [believeTitleRef, believeTitleStyle] = useReveal(0);
  const [teamRef, teamStyle] = useReveal(0);
  const [ctaRef, ctaStyle] = useReveal(0);
  const heroBgLoaded = useImageLoaded(AboutImg);

  return (
    <div className="w-full">
      
      {/* 1. HERO SECTION */}
      <div
        className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${AboutImg})` }}
      >
        <div className="absolute inset-0 bg-black/35"></div>
        <HeroSkeleton show={!heroBgLoaded} />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pt-10">
          <h1 style={heroSlide(0.15)} className="text-3xl md:text-4xl lg:text-[54px] font-extrabold mb-6 leading-[1.1] tracking-tight">
            You're Not a customer.<br />You're Our Guest
          </h1>
          <p style={heroSlide(0.35)} className="text-sm md:text-base text-gray-200 mb-10 max-w-lg mx-auto font-medium opacity-90">
            At HillMount Holidays, every journey begins with trust and ends
            with memories.
          </p>
     
          {/* Secondary CTAs */}
          <div style={heroSlide(0.6)} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-5 w-full max-w-[280px] sm:max-w-none mx-auto">
            <a href="https://wa.me/919994666522" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex">
              <button className="cursor-pointer bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white font-semibold text-[14px] py-2.5 px-6 rounded-sm transition flex items-center justify-center gap-1 w-full sm:w-auto whitespace-nowrap">
                Get Custom Travel Advice
              </button>
            </a>
            <a
              href="https://www.google.com/maps/place/Veena+World+-+HillMount+Holidays/@11.0103472,76.9501920,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex"
            >
              <button className="border cursor-pointer border-white/60 hover:bg-white hover:text-black text-white font-semibold text-[14px] py-2.5 px-6 rounded-sm transition flex items-center justify-center gap-1 backdrop-blur-sm w-full sm:w-auto whitespace-nowrap">
                Locate Us
              </button>
            </a>
          </div>
      
        </div>
      </div>
  {/* 4b. AUTHORISED PARTNER STRIP */}
      <AuthorisedPartnerPanel />
      {/* 2. OUR JOURNEY SECTION */}
      <div id="our-journey" className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <h2
          ref={journeyHeadingRef}
          className="text-center text-2xl sm:text-3xl md:text-[36px] font-bold text-[#1E88E5] mb-8"
        >
          Our Journey Crafting Meaningful Travel
        </h2>

        <div ref={journeySectionRef} className="flex flex-col lg:flex-row gap-16 items-start">
          <div ref={journeyRef} style={journeyStyle} className="flex-1 space-y-5 text-gray-800 text-[15px] leading-relaxed">
            <p>
              Travel, for us, was never just about reaching a destination. We don't just plan travel – We welcome people into experiences that feel like home.
            </p>
            <p>
              With over 15+ years of industry experience, HillMount Holidays was built on a simple belief: Travel should never feel unfamiliar - it should feel like home. We began our journey with this vision and formally became a Private Limited Company on November 2, 2017. From day one, our goal was clear - not to sell packages, but to create meaningful, personal experiences for every guest.
            </p>
            <p>
              By the end of 2018, we had already welcomed 100+ happy guests, each journey crafted with care. In December 2019, we strengthened our expertise by becoming a Sales Partner of Veena World, expanding our ability to deliver trusted and curated travel experiences with multiple departures to most of the country in the world.
            </p>

            {isExpanded && (
              <>
                <p>
                  Then came 2020, a year that challenged the entire travel industry. But instead of stepping back, we adapted, stayed resilient and crossed the COVID barrier - emerging stronger, more thoughtful and even more committed to our guest.
                </p>
                <p>
                  As we grew, in 2022, we marked a major milestone by successfully handling our first MICE group of 173 guests, delivering a seamless large-scale corporate travel experience and In 2023, we took it even further by hosting the prestigious NHRD National Conference, managing a gathering of 200 C-level HR leaders from across India - a testament to the trust we've built and the standards we uphold.
                </p>
                <p>
                  Through every step of our journey, one thing has remained unchanged: Our commitment to creating travel experiences that feel personal, effortless and deeply meaningful. Today, HillMount Holidays stands as more than just a travel company.
                </p>
                <p>
                  We are a team that listens, understands and designs journeys around you - so wherever you go, you feel welcomed, cared for and completely at ease.
                </p>
              </>
            )}

            <button
              ref={storyButtonRef}
              onClick={() => {
                hasInteracted.current = true;
                setIsExpanded(prev => !prev);
              }}
              className="flex items-center gap-2 text-black font-bold mt-4 hover:text-[#1E88E5] transition border-b-[2.5px] border-black hover:border-[#1E88E5] pb-0.5 w-fit text-sm tracking-wide"
            >
              {isExpanded ? "Show Less" : "Read the Story"}
              <ArrowRight
                size={16}
                strokeWidth={3}
                className={`transform transition-transform ${isExpanded ? "rotate-90" : ""}`}
              />
            </button>
          </div>

          <div ref={journeyImgRef} style={journeyImgStyle} className="flex-1 w-full relative">
            {journeyImg && (
              <img
                src="https://res.cloudinary.com/djuqr3qlu/image/upload/v1786098318/Delivery_URL_-_BetterUp_-_importance_of_teamwork_ARTICLE_-3_d2in17.webp"
                alt="Our Team"
                loading="lazy"
                className="w-full h-auto rounded-2xl shadow-xl object-cover aspect-[4/3] md:aspect-[16/10]"
              />
            )}
          </div>
        </div>
      </div>

      {/* 3. MISSION & VISION SECTION */}
      <div className="bg-white py-16 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Label */}
          <div ref={mvRef} style={mvStyle} className="text-center mb-12">
            <span className="inline-block bg-[#1E88E5]/15 text-black text-[10px] font-bold uppercase tracking-[0.35em] px-4 py-1.5 rounded-full border border-[#1E88E5]/30 mb-4">
              Our Purpose
            </span>
           <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-black tracking-tight">
              What Drives Us Every Day
            </h2>
          </div>

          <div className="grid grid-cols-1  md:grid-cols-2 gap-6 lg:gap-8">
            {/* Vision Card */}
            <RevealItem delay={0.05} from="left">
              <div className="relative bg-[#546e7a] border border-white/10 rounded-2xl p-8 lg:p-10 h-full overflow-hidden group transition-colors duration-300">
                {/* Accent glow */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1E88E5] via-yellow-300 to-transparent rounded-t-2xl" />
                {/* Background number */}
                <span className="absolute -bottom-4 -right-2 text-[120px] font-black text-white/[0.03] leading-none select-none pointer-events-none">01</span>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-[#1E88E5]/15 border border-[#1E88E5]/30 flex items-center justify-center flex-shrink-0">
                      <Target size={20} className="text-[#1E88E5]" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-[#1E88E5] text-[10px] font-bold uppercase tracking-[0.3em] leading-none mb-1">Our</p>
                      <h3 className="text-white text-xl font-extrabold leading-none tracking-tight">Vision</h3>
                    </div>
                  </div>
                  <p className="text-gray-300 text-[15px] leading-[1.85] font-light">
                    To become the most trusted travel companion, ensuring every traveler feels at home wherever their journey takes them by delivering memorable, comfortable and worry-free travel experiences.
                  </p>
                  <div className="mt-7 pt-6 border-t border-white/10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1E88E5]" />
                    <span className="text-white text-[11px] font-bold uppercase tracking-widest">Trusted · Memorable · Comfortable</span>
                  </div>
                </div>
              </div>
            </RevealItem>

            {/* Mission Card */}
            <RevealItem delay={0.15} from="right">
              <div className="relative bg-[#546e7a] border border-white/10 rounded-2xl p-8 lg:p-10 h-full overflow-hidden  transition-colors duration-300">
                {/* Accent glow */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#1E88E5] to-[#1E88E5] rounded-t-2xl" />
                {/* Background number */}
                <span className="absolute -bottom-4 -right-2 text-[120px] font-black text-white/[0.03] leading-none select-none pointer-events-none">02</span>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-[#1E88E5]/15 border border-[#1E88E5]/30 flex items-center justify-center flex-shrink-0">
                      <Rocket size={20} className="text-[#1E88E5]" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-[#1E88E5] text-[10px] font-bold uppercase tracking-[0.3em] leading-none mb-1">Our</p>
                      <h3 className="text-white text-xl font-extrabold leading-none tracking-tight">Mission</h3>
                    </div>
                  </div>
                  <p className="text-gray-300 text-[15px] leading-[1.85] font-light">
                    To make every journey feel like home by providing personalised travel solutions, genuine care, seamless planning and reliable support. We strive to create unforgettable memories through exceptional service, attention to detail and a commitment to exceeding our guests' expectations at every step of their journey.
                  </p>
                  <div className="mt-7 pt-6 border-t border-white/10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1E88E5]" />
                    <span className="text-white text-[11px] font-bold uppercase tracking-widest">Personalised · Caring · Seamless</span>
                  </div>
                </div>
              </div>
            </RevealItem>
          </div>
        </div>
      </div>

      {/* 4. WHAT WE BELIEVE SECTION */}
      <div className="bg-[#fcfcfc] pb-10 lg:pt-14 lg:pb-20 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2
            ref={believeTitleRef}
            style={believeTitleStyle}
            className="text-center text-2xl sm:text-3xl md:text-[32px] sm:mt-5 mt-10 font-bold text-[#000000] mb-10"
          >
            What We Believe
          </h2>

          {(() => {
            const BELIEVE_ROW1 = [
              {
                icon: User,
                title: <>Travel should feel<br /><TypedWord word="Personal" startDelay={0.8} /></>,
                desc: "Every journey we design reflects you — your pace, your preferences, your story.",
              },
              {
                icon: Sofa,
                title: <><TypedWord word="Comfort" startDelay={0.92} /> is as important<br />as destination</>,
                desc: "Where you stay and how you feel matters as much as where you go.",
              },
              {
                icon: HeartHandshake,
                title: <>Every traveler deserves<br /><TypedWord word="Care" startDelay={1.04} /></>,
                desc: "From your first conversation to your return home, we're with you at every step.",
              },
            ];
            const BELIEVE_ROW2 = [
              {
                icon: Compass,
                title: <><TypedWord word="Experience" startDelay={1.16} /> over<br />Itinerary</>,
                desc: "We don't just plan schedules — we craft moments that stay with you.",
              },
              {
                icon: ShieldCheck,
                title: <><TypedWord word="Trust" startDelay={1.28} /> is Our Foundation</>,
                desc: "Every journey is built on transparency and reliability.",
              },
            ];
            const card = ({ icon, title, desc }, wrapCls = "") => (
              <div className={`bg-[#f6f6f6] p-10 rounded-xl text-center hover:shadow-sm transition h-full ${wrapCls}`}>
                <IconWithCircle icon={icon} />
                <h3 className="text-lg font-bold text-black mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            );
            return (
              <>
                <div className="hidden md:block">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {BELIEVE_ROW1.map((item, i) => (
                      <RevealItem key={i} delay={i * 0.12} from="bottom">{card(item)}</RevealItem>
                    ))}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
                    {BELIEVE_ROW2.map((item, i) => (
                      <RevealItem key={i} delay={0.36 + i * 0.12} from="bottom">{card(item)}</RevealItem>
                    ))}
                  </div>
                </div>
                <HorizontalScroller>
                  {[...BELIEVE_ROW1, ...BELIEVE_ROW2].map((item, i) => (
                    <div key={i} className="flex-shrink-0 w-[240px] snap-start">
                      {card(item)}
                    </div>
                  ))}
                </HorizontalScroller>
              </>
            );
          })()}
        </div>
      </div>

      {/* 5. MEET THE TEAM SECTION */}
      <div id="meet-the-team" className="max-w-7xl mx-auto px-4 pt-8 pb-10 lg:pt-10 lg:pb-20 overflow-x-hidden">
        <div ref={teamRef} style={teamStyle} className=" max-w-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-black mb-4">Meet the team</h2>
          <p className="text-gray-600 text-base">
            Guiding you to your dream... the faces to understand the people behind the guest.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 md:gap-3">
          {team.map((member, i) => (
            <RevealItem key={i} delay={i * 0.13} from={i % 2 === 0 ? "left" : "right"}>
              <div className="flex flex-col group cursor-default">
                <div
                  className="relative overflow-hidden bg-white w-full aspect-[3/4] mb-3"
                  style={{ clipPath: ARCH_CLIP }}
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    loading="lazy"
                    className="absolute bottom-0 w-full object-contain object-bottom transition-all  "
                    style={{ height: "100%" }}
                  />
                </div>

                {/* Name left, LinkedIn right corner */}
                <div className="w-full px-2 pr-4">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="text-sm sm:text-base font-bold text-black leading-tight">
                      {member.name}
                    </h3>
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-black hover:text-[#0A66C2] transition-colors duration-200"
                      >
                        <LinkedInIcon />
                      </a>
                    ) : (
                      <span className="flex-shrink-0 text-black" title="LinkedIn not linked yet">
                        <LinkedInIcon />
                      </span>
                    )}
                  </div>
                  <p className="text-[#eab308] font-semibold text-[10px] sm:text-xs tracking-wide uppercase leading-tight">
                    {member.role}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </div>
      </div>

      {/* 6. FOOTER CTA SECTION */}
      <div ref={ctaRef} style={ctaStyle} className="bg-[#1E88E5] py-15 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-9 sm:gap-2 relative z-10">
          <div className="flex-1 max-w-2xl">
            <h2 className="text-[32px] md:text-[40px] font-bold text-white mb-4 leading-tight">
              Wherever You Go, You're<br />
              Never Far From{" "}
              <span
                className="inline-block text-white"
                style={{ minWidth: `${Math.max(...CYCLE_WORDS.map(w => w.length))}ch` }}
              >
                {ctaWord}
                <span className="inline-block w-[2px] h-[0.85em] bg-white ml-[1px] animate-pulse align-middle" />
              </span>
            </h2>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;


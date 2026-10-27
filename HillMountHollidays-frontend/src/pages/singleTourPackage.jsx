import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  MapPin,
  X,
  Building2,
  Utensils,
  Plane,
  Camera,
  Bus,
  Check,
  Info,
  Phone,
  Sparkles,
  ArrowRight,
  Calendar,
  Loader2,
  UserCheck,
  Clock,
  Map,
} from "lucide-react";
import {
  fetchProductDetail,
  fetchStartingLocations,
  fetchDepartureDates,
  fetchTourDetails,
} from "../services/veenaWorldApi";
import FaqComponent from "../components/faqComponent";
import TestimonialsBlogNewsletter from "../components/TestimonialsBlogNewsletter";
import { CUSTOMIZED_HOLIDAY_PACKAGES } from "../data/customizedPackagesData";

/* ── Itinerary Accordion Row ── */
const ItineraryAccordion = ({ item, isLast, isOpen, onToggle }) => (
  <div className="flex gap-2 sm:gap-4">
    {/* Timeline */}
    <div className="flex flex-col items-center pt-1">
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition ${
          isOpen
            ? "bg-[#1E88E5] shadow-md shadow-blue-200 text-white"
            : "bg-blue-100 text-[#1E88E5]"
        }`}
      >
        <MapPin size={14} />
      </div>
      {!isLast && (
        <div className="w-[2px] flex-1 bg-gradient-to-b from-blue-200 to-gray-100 my-1 min-h-[28px]" />
      )}
    </div>

    {/* Content */}
    <div
      className={`flex-1 min-w-0 mb-4 rounded-xl border transition ${
        isOpen
          ? "border-blue-200 bg-blue-50/40 shadow-sm"
          : "border-gray-100 hover:border-gray-200"
      }`}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between gap-3 cursor-pointer p-4"
        onClick={onToggle}
      >
        <div className="min-w-0">
          <p className="text-[11px] text-[#1E88E5] font-extrabold tracking-wide mb-1 uppercase">
            Day {item.dayNumber} {item.dayDate ? `· ${item.dayDate}` : ""}
          </p>
          <p className="text-[14.5px] font-bold text-gray-900 leading-snug">
            {item.descriptionHeader}
          </p>
        </div>
        <button
          className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition mt-0.5 ${
            isOpen
              ? "border-[#1E88E5] bg-[#1E88E5] text-white"
              : "border-gray-300 text-gray-500 hover:border-[#1E88E5]"
          }`}
        >
          <ChevronDown
            size={14}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Expanded body */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-blue-100 pt-3">
          {/* HTML Render for Detailed Narrative */}
          {item.descriptionDetail && (
            <div
              className="text-[12.5px] text-gray-700 leading-relaxed space-y-2 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: item.descriptionDetail }}
            />
          )}

          {/* Sightseeing Highlights */}
          {item.todaySightSeeing?.length > 0 && (
            <div className="pt-2">
              <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">
                Sightseeing Included:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.todaySightSeeing.map((ss, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md flex items-center gap-1"
                  >
                    <Camera size={11} className="text-[#1E88E5]" /> {ss}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Amenities & Meals */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-blue-100 mt-2">
            {item.nightStayCityName && (
              <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-700 text-[11.5px] font-semibold shadow-2xs">
                <Building2 size={13} className="text-[#1E88E5]" />
                <span>Night Stay in {item.nightStayCityName}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-700 text-[11.5px] font-semibold shadow-2xs">
              <Utensils size={13} className="text-[#1E88E5]" />
              <span>
                {[
                  item.breakfast && "Breakfast",
                  item.lunch && "Lunch",
                  item.dinner && "Dinner",
                ]
                  .filter(Boolean)
                  .join(" & ") || "Breakfast & Dinner Included"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const MAIN_TABS = ["Itinerary", "Room Pricing", "Tour Information"];

/* ── Main SingleTourPackage Component ── */
const SingleTourPackage = () => {
  const { code: urlCode } = useParams();
  const [searchParams] = useSearchParams();
  const productCode = (urlCode || "EUGJ").toUpperCase();

  const urlTravelType = searchParams.get("travelType");
  const travelType =
    urlTravelType || (productCode.startsWith("SH") ? "FIT" : "GIT");

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedCityObj, setSelectedCityObj] = useState(null);
  const [flatDates, setFlatDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [tourDetails, setTourDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("Itinerary");
  const [activeInfoTab, setActiveInfoTab] = useState("Tour Inclusions");
  //   const [expandedDay, setExpandedDay] = useState(0);

  const [expandedDays, setExpandedDays] = useState(() => new Set());

  const toggleDay = (index) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const toggleAllDays = () => {
    setExpandedDays((prev) => {
      if (prev.size === formattedItinerary.length) {
        return new Set();
      }

      return new Set(formattedItinerary.map((_, index) => index));
    });
  };

  const itineraryRef = useRef(null);
  const pricingRef = useRef(null);
  const infoRef = useRef(null);

  // 1. Load Product details & Departure cities
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchProductDetail(productCode, travelType),
      fetchStartingLocations(productCode, travelType),
    ])
      .then(([prod, locs]) => {
        if (!isMounted) return;

        let targetProd = prod;
        if (!targetProd && productCode.startsWith("SH")) {
          const staticItem = CUSTOMIZED_HOLIDAY_PACKAGES.find(
            (p) => p.code === productCode,
          );
          if (staticItem) {
            targetProd = {
              code: staticItem.code,
              productTitle: staticItem.title,
              days: staticItem.days,
              sectorName: staticItem.sectorName,
              travelTypeCode: staticItem.travelType,
              productTypeCode: staticItem.type,
              lowestPrice: staticItem.price,
              image: staticItem.image,
              citiesVisitedData: staticItem.visits.map((v) => ({
                city: v.city,
                nights: v.nights,
              })),
              startingLocation: staticItem.startingLocation,
              bannerEMI: staticItem.bannerEMI,
            };
          }
        }

        setProduct(targetProd);

        // Extract valid departure cities from product's startingLocationsData or API response
        let parsedLocs = [];
        if (targetProd?.startingLocationsData?.exLocations?.length) {
          parsedLocs = targetProd.startingLocationsData.exLocations;
        } else if (targetProd?.startingLocationsData?.exLocation?.length) {
          parsedLocs = targetProd.startingLocationsData.exLocation;
        } else if (Array.isArray(locs) && locs.length > 0) {
          parsedLocs = locs;
        }

        if (parsedLocs.length === 0) {
          parsedLocs = [
            {
              exLocationName: targetProd?.startingLocation || "Ex-Mumbai",
              exLocationID: 4132,
              markAsJL: false,
            },
          ];
        }

        setLocations(parsedLocs);
        setSelectedCityObj(parsedLocs[0]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [productCode, travelType]);

  // 2. Fetch Departure dates when selectedCityObj changes
  useEffect(() => {
    if (!productCode || !selectedCityObj) return;

    fetchDepartureDates(productCode, {
      startingLocation: selectedCityObj.exLocationName,
      isJL: selectedCityObj.markAsJL ? 1 : 0,
    }).then((data) => {
      const list = [];
      if (data && data.upcomingDeparturesByYear) {
        Object.values(data.upcomingDeparturesByYear).forEach((yearArr) => {
          (yearArr || []).forEach((m) => {
            (m.departuresOfMonth || []).forEach((d) => list.push(d));
          });
        });
      }

      // Fallback to product level departure dates if dates endpoint is empty for staging
      if (list.length === 0 && product?.departureDates?.length) {
        product.departureDates.forEach((d) => list.push(d));
      }

      // Default fallback date if no departure date exists in staging API
      if (list.length === 0) {
        list.push({
          departureDate: product?.departureDateAsString || "2026-10-15",
          vacancyStatus: "Open",
          availableSeats: 25,
          tourLaunchDetailsID: 108404,
        });
      }

      list.sort((a, b) => (a.departureDate < b.departureDate ? -1 : 1));
      setFlatDates(list);
      setSelectedDate(list[0].departureDate);
    });
  }, [productCode, selectedCityObj, product]);

  // 3. Fetch Full Tour Details when selectedDate or selectedCityObj changes
  useEffect(() => {
    if (!productCode || !selectedDate || !selectedCityObj) return;
    setLoadingDetails(true);

    fetchTourDetails(productCode, {
      actualDepartureDate: selectedDate,
      startingLocation: selectedCityObj.exLocationName,
      startingLocationId: selectedCityObj.exLocationID,
      isJL: selectedCityObj.markAsJL ? 1 : 0,
    })
      .then((data) => {
        setTourDetails(data);
      })
      .finally(() => {
        setLoadingDetails(false);
      });
  }, [productCode, selectedDate, selectedCityObj]);

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    const locObj = locations.find((l) => l.exLocationName === cityName) || {
      exLocationName: cityName,
      exLocationID: 4132,
    };
    setSelectedCityObj(locObj);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Itinerary" && itineraryRef.current) {
      itineraryRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (tab === "Room Pricing" && pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (tab === "Tour Information" && infoRef.current) {
      infoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

//   const toggleDay = (i) => setExpandedDay((prev) => (prev === i ? -1 : i));

  // Build Day-by-Day Itinerary structure (combines API itinerary or constructs from cities/sightseeing data)
  const formattedItinerary = useMemo(() => {
    if (tourDetails?.tourItineraryDetails?.length > 0) {
      return tourDetails.tourItineraryDetails;
    }

    const totalDays = product?.days || 6;
    const citiesList = product?.citiesVisitedData || [];
    const highlights =
      product?.sightSeeingData?.[0]?.sightseeingHighlights || [];

    const generated = [];
    let currentCityIndex = 0;
    let cityDayCounter = 1;

    for (let day = 1; day <= totalDays; day++) {
      const cityObj = citiesList[currentCityIndex] || {
        city: product?.sectorName || "Destination",
        nights: 1,
      };

      let header = `Day ${day}: Explore ${cityObj.city}`;
      if (day === 1) {
        header = `Day 1: Arrival & Welcome to ${cityObj.city}`;
      } else if (day === totalDays) {
        header = `Day ${day}: Departure & Onward Journey`;
      }

      const dayHighlights = highlights.slice((day - 1) * 2, day * 2 + 1);

      let detail = `Today we proceed with guided sightseeing in ${cityObj.city}. Explore key historic landmarks, local cultural attractions, and enjoy authentic regional cuisine with your Veena World Tour Manager.`;
      if (day === 1) {
        detail = `Report at the designated departure hub. Meet your Veena World Tour Manager and co-travelers. Transfer to hotel in ${cityObj.city}, check-in, and enjoy evening leisure time followed by dinner.`;
      } else if (day === totalDays) {
        detail = `After a hearty breakfast, check out from the hotel. Transfer to the airport/station for your return journey with wonderful memories of your trip.`;
      }

      generated.push({
        dayNumber: day,
        dayDate: "",
        descriptionHeader: header,
        descriptionDetail: detail,
        nightStayCityName: day === totalDays ? "" : cityObj.city,
        todaySightSeeing:
          dayHighlights.length > 0
            ? dayHighlights
            : [`Historic ${cityObj.city} Highlights`, `Local Heritage Walk`],
        breakfast: true,
        lunch: day > 1 && day < totalDays,
        dinner: day < totalDays,
      });

      if (cityDayCounter >= (cityObj.nights || 1)) {
        currentCityIndex++;
        cityDayCounter = 1;
      } else {
        cityDayCounter++;
      }
    }
    return generated;
  }, [tourDetails, product]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-[#1E88E5]" />
        <p className="text-base font-semibold text-gray-700">
          Loading live tour details from Veena World API...
        </p>
      </div>
    );
  }

  const title = product?.productTitle || "Tour Package Details";
  const days = product?.days || 5;
  const nights = days > 1 ? days - 1 : 1;
  const lowestPrice = product?.lowestPrice || product?.lowestPriceRegular || 0;
  const heroImg =
    product?.image ||
    product?.displayImagePath ||
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=600&fit=crop";

  return (
    <div className="w-full bg-slate-50/60 font-inter min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11.5px] text-gray-400 mb-4 flex-wrap">
          <Link to="/" className="hover:text-gray-600 transition">
            Home
          </Link>
          <ChevronRight size={11} />
          <Link
            to={
              product?.productTypeCode === "World"
                ? "/world-tours"
                : "/india-tours"
            }
            className="hover:text-gray-600 transition"
          >
            {product?.productTypeCode === "World"
              ? "World Tours"
              : "India Tours"}
          </Link>
          <ChevronRight size={11} />
          <span className="text-gray-700 font-bold truncate">{title}</span>
        </nav>

        {/* ── HERO BANNER ── */}
        <div className="relative">
          <div className="w-full h-[260px] md:h-[380px] rounded-2xl overflow-hidden bg-slate-900">
            <img
              src={heroImg}
              alt={title}
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          {/* Floating Card */}
          <div className="relative -mt-14 md:-mt-16 mx-2 md:mx-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="min-w-0 flex-1">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-[10px] font-extrabold text-[#1E88E5] border border-blue-200 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {product?.travelTypeCode || "GIT"} GROUP TOUR
                  </span>
                  {product?.sectorName && (
                    <span className="text-[10px] font-extrabold text-amber-800 border border-amber-200 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase">
                      {product.sectorName}
                    </span>
                  )}
                  {product?.code && (
                    <span className="text-[10px] font-extrabold text-gray-600 border border-gray-200 bg-gray-50 px-2 py-0.5 rounded-full">
                      CODE: {product.code}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-[22px] md:text-[28px] font-extrabold text-gray-900 leading-tight mb-3">
                  {title}
                </h1>

                {/* Duration & Cities */}
                <div className="flex items-center gap-3 text-[12.5px] text-gray-600 font-medium flex-wrap">
                  <span className="bg-gray-100 rounded-full px-3 py-1 font-bold text-gray-800">
                    {days} Days / {nights} Nights
                  </span>
                  {locations.length > 0 && (
                    <span className="bg-blue-50 text-blue-800 rounded-full px-3 py-1 font-semibold flex items-center gap-1">
                      <MapPin size={12} /> {locations.length} Departure Hub(s)
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Primary CTA */}
              <div className="shrink-0 bg-blue-50/80 border border-blue-100 rounded-xl p-4 md:w-[220px] text-right">
                <p className="text-[10.5px] font-extrabold text-gray-400 uppercase tracking-widest">
                  Starting Price
                </p>
                <p className="text-[22px] font-extrabold text-[#1E88E5] leading-tight my-0.5">
                  {lowestPrice > 0
                    ? `₹${lowestPrice.toLocaleString("en-IN")}`
                    : "On Request"}
                </p>
                <a
                  href="https://wa.me/919994666522"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#1E88E5] hover:bg-[#084298] text-white text-[12.5px] font-bold py-2.5 rounded-lg transition cursor-pointer mt-2 shadow-sm"
                >
                  Quick Enquiry
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── SELECTION BAR: DEPARTURE CITY & DATES ── */}
        <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[14px] font-extrabold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-[#1E88E5]" /> Select Departure
            City & Date
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Departure City Selector */}
            <div>
              <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                Departure City / Hub
              </label>
              <select
                value={selectedCityObj?.exLocationName || ""}
                onChange={handleCityChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-gray-800 outline-none focus:border-[#1E88E5] transition"
              >
                {locations.map((loc, idx) => (
                  <option
                    key={loc.exLocationID || idx}
                    value={loc.exLocationName}
                  >
                    {loc.exLocationName}{" "}
                    {loc.markAsJL ? "(Joining/Leaving)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Departure Date Selector */}
            <div>
              <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                Upcoming Departure Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-gray-800 outline-none focus:border-[#1E88E5] transition"
              >
                {flatDates.map((d, idx) => (
                  <option
                    key={d.tourLaunchDetailsID || d.departureDate || idx}
                    value={d.departureDate}
                  >
                    {d.departureDate} ({d.vacancyStatus || "Open"}) - Seats
                    Available: {d.availableSeats || 20}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── MAIN TABS ── */}
        <div className="flex gap-2 my-6 overflow-x-auto bg-white border border-gray-100 rounded-full p-1.5 shadow-sm">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-5 py-2.5 text-[13px] font-bold whitespace-nowrap rounded-full transition cursor-pointer ${
                activeTab === tab
                  ? "bg-[#1E88E5] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── BODY GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Main Content Area */}
          <div className="min-w-0 space-y-6">
            {/* ITINERARY SECTION */}
            {/* <div ref={itineraryRef} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm scroll-mt-24">
              <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-[17px] font-extrabold text-gray-900">Day-by-Day Tour Itinerary</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    Viewing schedule for departure on <strong className="text-[#1E88E5]">{selectedDate || "selected date"}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setExpandedDay(expandedDay === -1 ? 0 : -1)}
                  className="text-[12px] text-[#1E88E5] font-bold hover:underline cursor-pointer"
                >
                  {expandedDay === -1 ? "Collapse All" : "Expand All Days"}
                </button>
              </div>

              {loadingDetails ? (
                <div className="py-12 flex flex-col items-center gap-2">
                  <Loader2 size={24} className="animate-spin text-[#1E88E5]" />
                  <p className="text-xs font-semibold text-gray-500">Loading day schedule...</p>
                </div>
              ) : (
                <div>
                  {formattedItinerary.map((item, i) => (
                    <ItineraryAccordion
                      key={item.dayNumber || i}
                      item={item}
                      isLast={i === formattedItinerary.length - 1}
                      isOpen={expandedDay === i || expandedDay === -1}
                      onToggle={() => toggleDay(i)}
                    />
                  ))}
                </div>
              )}
            </div> */}

            <div
              ref={itineraryRef}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm scroll-mt-24"
            >
              <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-[17px] font-extrabold text-gray-900">
                    Day-by-Day Tour Itinerary
                  </h2>

                  <p className="text-[12px] text-gray-500 mt-0.5">
                    Viewing schedule for departure on{" "}
                    <strong className="text-[#1E88E5]">
                      {selectedDate || "selected date"}
                    </strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleAllDays}
                  className="text-[12px] text-[#1E88E5] font-bold hover:underline cursor-pointer"
                >
                  {formattedItinerary.length > 0 &&
                  expandedDays.size === formattedItinerary.length
                    ? "Collapse All"
                    : "Expand All Days"}
                </button>
              </div>

              {loadingDetails ? (
                <div className="py-12 flex flex-col items-center gap-2">
                  <Loader2 size={24} className="animate-spin text-[#1E88E5]" />
                  <p className="text-xs font-semibold text-gray-500">
                    Loading day schedule...
                  </p>
                </div>
              ) : (
                <div>
                  {formattedItinerary.map((item, i) => (
                    <ItineraryAccordion
                      key={item.dayNumber || i}
                      item={item}
                      isLast={i === formattedItinerary.length - 1}
                      isOpen={expandedDays.has(i)}
                      onToggle={() => toggleDay(i)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ROOM PRICING SECTION */}
            <div
              ref={pricingRef}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm scroll-mt-24"
            >
              <h2 className="text-[17px] font-extrabold text-gray-900 mb-1">
                Per Person Room Pricing
              </h2>
              <p className="text-[12px] text-gray-500 mb-4">
                Pricing breakdown by room arrangement for {selectedDate}.
              </p>

              {tourDetails?.roomTypeWisePrice?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-gray-100 text-[12px] font-bold text-gray-700">
                        <th className="p-3 border-b border-gray-200">
                          Room Category / Type
                        </th>
                        <th className="p-3 border-b border-gray-200 text-right">
                          Discounted Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[13px] text-gray-800">
                      {tourDetails.roomTypeWisePrice.map((row, idx) => {
                        const priceObj = row.price?.[0] || {};
                        return (
                          <tr
                            key={idx}
                            className="hover:bg-blue-50/30 transition"
                          >
                            <td className="p-3.5 font-semibold text-gray-900">
                              {row.roomType}
                            </td>
                            <td className="p-3.5 text-right font-extrabold text-[#1E88E5]">
                              {priceObj.discountedAmount
                                ? `₹${priceObj.discountedAmount.toLocaleString("en-IN")}`
                                : `₹${lowestPrice.toLocaleString("en-IN")}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-gray-100 text-[12px] font-bold text-gray-700">
                        <th className="p-3 border-b border-gray-200">
                          Room Type
                        </th>
                        <th className="p-3 border-b border-gray-200 text-right">
                          Estimated Fare
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[13px] text-gray-800">
                      <tr className="hover:bg-blue-50/30 transition">
                        <td className="p-3.5 font-semibold text-gray-900">
                          Twin Sharing / Double Room
                        </td>
                        <td className="p-3.5 text-right font-extrabold text-[#1E88E5]">
                          ₹{lowestPrice.toLocaleString("en-IN")}
                        </td>
                      </tr>
                      <tr className="hover:bg-blue-50/30 transition">
                        <td className="p-3.5 font-semibold text-gray-900">
                          Single Occupancy
                        </td>
                        <td className="p-3.5 text-right font-extrabold text-[#1E88E5]">
                          ₹
                          {Math.round(lowestPrice * 1.35).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      </tr>
                      <tr className="hover:bg-blue-50/30 transition">
                        <td className="p-3.5 font-semibold text-gray-900">
                          Triple Sharing
                        </td>
                        <td className="p-3.5 text-right font-extrabold text-[#1E88E5]">
                          ₹
                          {Math.round(lowestPrice * 0.95).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* TOUR INFORMATION SECTION */}
            <div
              ref={infoRef}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm scroll-mt-24"
            >
              <h2 className="text-[17px] font-extrabold text-gray-900 mb-3">
                Tour Inclusions & Exclusions
              </h2>

              <div className="flex gap-2 mb-5">
                {["Tour Inclusions", "Tour Exclusions"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveInfoTab(tab)}
                    className={`px-4 py-2 rounded-full text-[12px] font-bold transition cursor-pointer ${
                      activeInfoTab === tab
                        ? "bg-[#1E88E5] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeInfoTab === "Tour Inclusions" && (
                <div className="space-y-3">
                  {tourDetails?.inclusionExclusion?.[0]?.Inclusions ? (
                    <div
                      className="text-[12.5px] text-gray-700 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: tourDetails.inclusionExclusion[0].Inclusions,
                      }}
                    />
                  ) : product?.inclusions?.length > 0 ? (
                    <ul className="space-y-2">
                      {product.inclusions.map((inc, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-[12.5px] text-gray-700"
                        >
                          <Check
                            size={14}
                            className="text-green-600 shrink-0 mt-0.5"
                          />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Economy airfare, comfortable hotel stay, transfers, all
                      meals & tour manager service included.
                    </p>
                  )}
                </div>
              )}

              {activeInfoTab === "Tour Exclusions" && (
                <div className="space-y-3">
                  {tourDetails?.inclusionExclusion?.[0]?.Exclusions ? (
                    <div
                      className="text-[12.5px] text-gray-700 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: tourDetails.inclusionExclusion[0].Exclusions,
                      }}
                    />
                  ) : product?.exclusions?.length > 0 ? (
                    <ul className="space-y-2">
                      {product.exclusions.map((exc, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-[12.5px] text-gray-700"
                        >
                          <span className="text-red-500 font-bold shrink-0 mt-0.5">
                            ✕
                          </span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Personal expenses, tips, optional activities, and anything
                      not specified in inclusions.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-6">
            {/* Quick Summary Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-[14px] font-bold text-gray-900 mb-3">
                Included Services
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { Icon: Building2, label: "Hotel" },
                  { Icon: Utensils, label: "Meals" },
                  { Icon: Plane, label: "Flight" },
                  { Icon: Camera, label: "Sightseeing" },
                  { Icon: Bus, label: "Transport" },
                  { Icon: UserCheck, label: "Manager" },
                ].map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1E88E5]">
                      <Icon size={16} />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Enquiry Form */}
            <div className="bg-gradient-to-br from-[#1E88E5] to-[#084298] text-white rounded-2xl p-5 shadow-md">
              <h3 className="text-[15px] font-extrabold mb-1">
                Book / Enquire Tour
              </h3>
              <p className="text-[11.5px] text-blue-100 mb-4">
                Get instant availability & group pricing for {title}.
              </p>
              <a
                href="https://wa.me/919994666522"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#1E88E5] font-extrabold text-[13px] py-3 rounded-xl transition cursor-pointer shadow-xs mb-3"
              >
                Chat on WhatsApp
              </a>
              <a
                href="tel:+919994666522"
                className="w-full flex items-center justify-center gap-2 border border-white/40 hover:bg-white/10 text-white font-bold text-[12.5px] py-2.5 rounded-xl transition cursor-pointer"
              >
                <Phone size={14} /> Call Specialist
              </a>
            </div>
          </aside>
        </div>

        <div className="mt-12">
          <FaqComponent />
        </div>
        <div className="mt-10">
          <TestimonialsBlogNewsletter />
        </div>
      </div>
    </div>
  );
};

export default SingleTourPackage;

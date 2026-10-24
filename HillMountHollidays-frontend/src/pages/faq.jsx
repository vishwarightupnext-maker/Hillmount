import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

// Full Comprehensive FAQ Data categorized into 13 distinct categories, updated for HillMount Holidays
const FAQ_DATA = {
  "General Enquiries": [
    {
      q: "Where can I find information about HillMount tours and products?",
      a: "You can find comprehensive information about HillMount tours, products, and services through our official website www.hillmountholidays.com, by calling our support number 0422 43 66522, or by visiting any of our authorized sales offices and partners."
    },
    {
      q: "What type of tours or packages does HillMount offer?",
      a: "We offer a diverse range of travel products including fully guided Group Tours (domestic and international), Personalised Holidays (tailor-made for families/individuals), Specialty Tours (Women's Special, Senior's Special, Students Special), MICE (Corporate Tours), and inbound tours for NRI/foreign nationals."
    },
    {
      q: "Does HillMount book train tickets?",
      a: "No, HillMount does not book train or rail tickets independently. If your holiday itinerary requires rail travel, we advise you to book your tickets directly via the official Indian Railways website (IRCTC) or an authorized agent."
    },
    {
      q: "Where can I find the addresses of HillMount offices or its Sales Partners?",
      a: "You can find the address and contact details of all our branch offices and sales partners by visiting the 'Contact Us' page on our website or calling our customer support center."
    },
    {
      q: "How many travellers will there be as a part of a group tour?",
      a: "Group size varies depending on the destination. Typically, our international group tours have about 40 to 50 guests, while Indian domestic tours have 30 to 40 guests. This ensures optimal logistics and standard coach seating capacity."
    },
    {
      q: "Is the tour itinerary fixed? Or does it change while on tour?",
      a: "Tours operate as per the published itinerary. However, in case of unforeseen circumstances like weather changes, flight disruptions, or regulatory restrictions, we reserve the right to alter the itinerary for the safety and comfort of our guests."
    },
    {
      q: "Can I join or leave a tour midway? or can I opt for a part tour?",
      a: "Yes, you can join or leave a group tour midway or book a part tour, subject to availability and prior confirmation at the time of booking. Pricing for such requests will be calculated on a pro-rata or custom package basis."
    },
    {
      q: "Can I extend my stay while on a group tour?",
      a: "Yes, you can extend your stay at the first or last destination. You will need to request this at the time of booking so that custom hotel extensions and flight alterations can be processed (additional costs will apply)."
    },
    {
      q: "Can I modify or change my booking after confirmation?",
      a: "Modifications to confirmed bookings are subject to availability, airline rules, and cancellation policies. Any amendment charges levied by airlines or suppliers will be borne by the customer."
    },
    {
      q: "Will I get discount over and above the tour price?",
      a: "Our tour prices are highly competitive and offer maximum value. Any active discounts, such as early bird promotions or group discounts, are already factored in or published on our website at the time of booking."
    },
    {
      q: "What is Women's Special tour? What is the age group?",
      a: "Women's Special tours are exclusive, fun-filled itineraries designed specifically for women travellers of all age groups. There is no age limit; any woman who loves to travel and explore with like-minded companions is welcome!"
    },
    {
      q: "Do you do only hotel bookings and air tickets for my independent holiday?",
      a: "Yes! Through our Personalised Holidays section, we can book independent packages comprising hotels, sightseeing transfers, and air tickets tailored to your specific preferences."
    },
    {
      q: "Does HillMount have tours for Corporates or Institutions?",
      a: "Yes, our dedicated MICE (Meetings, Incentives, Conferences, and Exhibitions) division specializes in creating customized corporate tours and institutional travel programs."
    },
    {
      q: "I am a Non Resident Indian, do you have any special tours for me?",
      a: "We welcome NRI guests on all our group tours and customized holidays. We also customize inbound tours specifically designed to explore heritage, culture, and leisure destinations across India."
    }
  ],
  "Booking & Payment": [
    {
      q: "Can I make full payment for the tour or holiday in one go?",
      a: "Yes, you can make the entire payment for your tour or holiday in a single transaction. We support credit/debit cards, net banking, UPI, bank transfers (NEFT/RTGS), and cheque payments."
    },
    {
      q: "What is the initial booking amount to confirm a seat?",
      a: "The registration or initial booking amount varies depending on the tour type (Domestic or International). Typically, it ranges from INR 10,000 to INR 50,000 per person."
    },
    {
      q: "What are the payment timelines for the remaining balance?",
      a: "The final balance payment must be cleared at least 45 days before the departure date for international tours, and 30 days prior for domestic tours."
    },
    {
      q: "Do you offer EMI or travel loan options?",
      a: "Yes, we partner with leading financial institutions to offer easy EMI and travel loan facilities. Speak to our travel advisors during booking to check your eligibility."
    }
  ],
  "Flights": [
    {
      q: "Is airfare included in the published group tour price?",
      a: "Yes, most of our standard group tour prices are inclusive of economy class round-trip airfare from the designated hubs. Check the 'Inclusions' section of your specific tour package details."
    },
    {
      q: "Can I upgrade my flights to Business Class?",
      a: "Yes, we can upgrade your flights to Business Class or Premium Economy, subject to availability with the airlines and payment of the applicable fare difference."
    },
    {
      q: "Can I book a tour without flight tickets (Land-only package)?",
      a: "Yes, you can opt for a 'Join and Leaving' (J/L) tour, which excludes airfare. You will receive a discount equivalent to the factored airfare and will be responsible for booking your own flights."
    }
  ],
  "Hotels": [
    {
      q: "What standard of hotels are provided on the tours?",
      a: "We generally provide comfortable, premium 3-star or 4-star hotels, selected based on cleanliness, amenities, and location proximity to sightseeing spots."
    },
    {
      q: "Can I request a single room? What are the charges?",
      a: "Yes, single occupancy is available upon request. A 'Single Supplement' fee will apply to cover the cost of the room, as our standard tour prices are based on twin-sharing occupancy."
    },
    {
      q: "Are early check-in and late check-out available?",
      a: "Standard hotel check-in is usually at 2:00 PM or 3:00 PM, and check-out is at 11:00 AM or 12:00 PM. Early check-in or late check-out is subject to hotel availability and may incur extra charges."
    }
  ],
  "Food": [
    {
      q: "What kind of meals are provided during the tour?",
      a: "We provide nutritious and delicious meals on all our tours. On international tours, we often arrange a mix of authentic Indian meals (prepared by our specialized culinary teams or local Indian restaurants) and local regional specialties."
    },
    {
      q: "Do you cater to pure vegetarian and Jain dietary preferences?",
      a: "Yes, we cater to pure vegetarian and Jain dietary requirements. Please specify your meal preferences at the time of booking so our team can make the necessary arrangements."
    },
    {
      q: "Is drinking water provided during sightseeing tours?",
      a: "Yes, we provide mineral water bottles daily to all guests during coach travel and sightseeing tours."
    }
  ],
  "Road Travel on Tour": [
    {
      q: "What type of vehicles are used for road travel?",
      a: "We use modern, air-conditioned, luxury coaches or minibuses suited for group sizes, ensuring comfortable seating and ample luggage space."
    },
    {
      q: "Are there pre-allocated seats on the tour coach?",
      a: "To ensure fairness, we follow a daily seat rotation system on our group coaches. Your Tour Manager will guide you on the rotation schedule every morning."
    },
    {
      q: "Is there a washroom facility available on the coaches?",
      a: "While some international long-distance coaches have washrooms, we plan regular comfort stops at clean highway stations and cafes every 2 to 3 hours."
    }
  ],
  "On Tour": [
    {
      q: "Who will manage and guide the group during the tour?",
      a: "Every group tour is accompanied by a professional, experienced, and friendly HillMount Tour Manager who takes care of all logistics, sightseeing entries, and guest comfort from start to finish."
    },
    {
      q: "What is the standard wake-up and departure schedule?",
      a: "Usually, the wake-up call is around 6:30 AM, breakfast at 7:30 AM, and departure at 8:30 AM, depending on the day's itinerary and distance to cover."
    },
    {
      q: "What happens if I fall sick during the tour?",
      a: "Our Tour Managers are trained in basic first-aid. In case of medical emergencies, we will immediately arrange local doctor consultations or hospital assistance. Expenses incurred will be covered as per your travel insurance policy."
    }
  ],
  "Visa": [
    {
      q: "Does HillMount assist with the tourist visa application process?",
      a: "Yes, we have a dedicated Visa assistance division that provides guidance on documentation, schedules appointments, and processes tourist visas for our guests."
    },
    {
      q: "Is the visa fee included in the international tour price?",
      a: "For most of our international group tours, visa fees and documentation assistance are included. Please check the specific package inclusions for verification."
    },
    {
      q: "What happens if my visa application is rejected by the consulate?",
      a: "Visa approval is at the sole discretion of the respective embassy or consulate. In the unfortunate event of a visa rejection, standard cancellation policy rules will apply to the tour booking."
    }
  ],
  "Insurance": [
    {
      q: "Is travel insurance included in the tour packages?",
      a: "Yes, standard overseas travel insurance is included for all guests booking our international group tours (up to a certain age limit). We highly recommend reviewing the coverage policy and upgrading if required."
    },
    {
      q: "What does the travel insurance cover?",
      a: "The policy typically covers emergency medical expenses, trip delay or interruption, baggage loss or delay, and personal liability. Coverage details are provided at the time of booking."
    }
  ],
  "Personalised Holidays": [
    {
      q: "How does a Personalised Holiday differ from a Group Tour?",
      a: "A Group Tour has a fixed departure date, itinerary, group coach, and accompanying Tour Manager. A Personalised Holiday is completely tailor-made for you with private transfers, your choice of hotels, and personalised itineraries."
    },
    {
      q: "Can I customize an existing group tour itinerary?",
      a: "Yes, we can take any of our standard group tour itineraries and adapt it as a personalised private holiday for you and your family."
    }
  ],
  "Cancellation & Refund": [
    {
      q: "What is the cancellation policy for bookings?",
      a: "Cancellation fees depend on how close the cancellation date is to the departure date. Detailed terms are outlined in our booking terms and conditions, as airline and hotel non-refundable terms apply."
    },
    {
      q: "How long does it take to process a refund?",
      a: "Once a cancellation request is formally processed, eligible refunds are usually credited back to the original payment source within 7 to 10 business days."
    }
  ],
  "Foreign Exchange (Forex)": [
    {
      q: "Do you provide foreign currency exchange services?",
      a: "Yes, we assist guests in obtaining foreign exchange and travel currency cards through our authorized financial partners at highly competitive market rates."
    },
    {
      q: "How much foreign currency am I allowed to carry?",
      a: "As per Reserve Bank of India (RBI) regulations, Indian citizens can carry cash and travel cards up to USD 250,000 per financial year under the Liberalised Remittance Scheme (LRS)."
    }
  ],
  "Feedback": [
    {
      q: "How can I share my feedback after completing the tour?",
      a: "We highly value your feedback! You can share your experience by filling out our post-tour feedback form, emailing us at feedback@hillmountholidays.com, or posting on our official social media channels."
    },
    {
      q: "Who should I contact if I have a grievance?",
      a: "Please reach out to our Customer Relations team at feedback@hillmountholidays.com or call our helpline. We are committed to resolving all concerns swiftly."
    }
  ]
};

// Numeric ordered list of categories matching reference image
const CATEGORIES_LIST = [
  "General Enquiries",
  "Booking & Payment",
  "Flights",
  "Hotels",
  "Food",
  "Road Travel on Tour",
  "On Tour",
  "Visa",
  "Insurance",
  "Personalised Holidays",
  "Cancellation & Refund",
  "Foreign Exchange (Forex)",
  "Feedback"
];

const API = import.meta.env.VITE_API_BASE || '';

const Faq = () => {
  const [activeCategory, setActiveCategory] = useState("General Enquiries");
  const [openAccordions, setOpenAccordions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [faqData, setFaqData] = useState(FAQ_DATA);

  // Toggle Accordion Item
  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const res = await fetch(`${API}/api/faqs`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          // Group fetched FAQs by category
          const grouped = {};
          CATEGORIES_LIST.forEach((cat) => {
            grouped[cat] = [];
          });

          data.data.forEach((item) => {
            const cat = item.category || "General Enquiries";
            if (!grouped[cat]) {
              grouped[cat] = [];
            }
            grouped[cat].push({
              q: item.question,
              a: item.answer,
              category: cat
            });
          });

          setFaqData(grouped);
        }
      } catch (e) {
        console.error("Backend fetch error or offline, fallback to local FAQ data", e);
      }
    };
    loadFaqs();
  }, []);

  // Filter FAQs based on search term and active category
  const filteredFAQs = useMemo(() => {
    if (searchTerm.trim() === "") {
      return faqData[activeCategory] || [];
    }
    
    // If there is a search term, search across ALL categories
    const term = searchTerm.toLowerCase();
    const matches = [];
    Object.keys(faqData).forEach((cat) => {
      faqData[cat].forEach((item) => {
        if (item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term)) {
          matches.push({ ...item, category: cat });
        }
      });
    });
    return matches;
  }, [searchTerm, activeCategory, faqData]);

  return (
    <div className="w-full font-inter bg-[#F4F6FB] min-h-screen pt-12 pb-16">
      
      {/* MAIN FAQ FILTER & ACCORDIONS CONTAINER */}
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Real-time Search Box */}
        <div className="w-full max-w-2xl mb-8">
          <div className="relative flex items-center bg-white shadow-sm border border-gray-200 rounded-full px-5 py-3.5 text-gray-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
            <Search size={18} className="mr-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by keywords (e.g., 'refund', 'visa', 'meals')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-black text-[14.5px] placeholder-gray-400"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-[12px] text-gray-400 hover:text-gray-600 font-semibold px-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="space-y-2.5 mb-10">
          <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-widest block">
            Categories
          </span>
          <div className="flex flex-wrap gap-2.5 pb-2">
            {CATEGORIES_LIST.map((category, index) => {
              const isActive = activeCategory === category && !searchTerm;
              return (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setSearchTerm(""); // Clear search to show category lists
                  }}
                  className={`px-4.5 py-2 border rounded-full text-[13px] transition duration-200 cursor-pointer font-medium whitespace-nowrap shadow-sm
                    ${isActive 
                      ? "bg-white border-[#0F3596] text-[#0F3596] ring-1 ring-[#0F3596] font-semibold" 
                      : "bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                    }`}
                >
                  {index + 1}. {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Section Heading */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3 flex items-center justify-between">
          <span>
            {searchTerm ? `Search Results for "${searchTerm}"` : activeCategory}
          </span>
          <span className="text-sm font-normal text-gray-500 bg-white px-3.5 py-1 rounded-full border border-gray-200 shadow-sm">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? "question" : "questions"} found
          </span>
        </h2>

        {/* Accordions List */}
        {filteredFAQs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center space-y-4">
            <p className="text-gray-500 text-[15px] font-medium">
              No matching questions found for "{searchTerm}".
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-[#0F3596] hover:underline font-bold text-sm"
            >
              Reset search and show all FAQs
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFAQs.map((item, idx) => {
              const isOpen = !!openAccordions[idx];
              return (
                <div 
                  key={idx}
                  className={`border rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${
                    isOpen 
                      ? "border-blue-100 bg-blue-50/40" 
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Accordion Trigger/Header */}
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full px-5 py-4.5 text-left flex justify-between items-center gap-4 cursor-pointer focus:outline-none transition hover:bg-gray-50/50"
                  >
                    <span className={`text-[14.5px] md:text-[15.5px] font-semibold leading-snug transition-colors ${
                      isOpen ? "text-[#1E88E5]" : "text-gray-800"
                    }`}>
                      {item.q}
                    </span>
                    <div className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center">
                      {isOpen ? (
                        <ChevronUp size={14} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={14} className="text-gray-500" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden
                      ${isOpen ? "max-h-[300px] border-t border-gray-100" : "max-h-0"}`}
                  >
                    <div className="px-5 py-4 text-[13.5px] md:text-[14.5px] text-gray-600 leading-relaxed bg-[#fbfcfd]">
                      {item.a}
                    
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Faq;

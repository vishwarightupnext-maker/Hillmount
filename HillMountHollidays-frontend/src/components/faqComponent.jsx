import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE;
const categories = ["General Enquiries", "Food", "Visa", "Travel Details"];

const FaqComponent = ({ filterParam = "home" }) => {
  const [openIndex, setOpenIndex] = useState(-1);
  const [faqs, setFaqs]           = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch(`${API}/api/faqs?${filterParam}=1`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.length) {
          setFaqs(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filterParam]);

  return (
    <section className="w-full bg-white py-14 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Title */}
        <h2 className="text-center text-2xl md:text-[26px] font-bold text-black mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-sm text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
          We <span className="text-[#1E88E5] font-medium">help you prepare</span> for your trip and ensure an{" "}
          <span className="text-[#1E88E5] font-medium">effortless</span> and{" "}
          <span className="text-[#1E88E5] font-medium">enjoyable travel experience.</span>
        </p>

        {/* Accordion */}
        <div className="space-y-3 mb-10">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-xl px-5 py-4">
                  <div className="h-4 skeleton-shimmer rounded w-3/4" />
                </div>
              ))
            : faqs.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-xl overflow-hidden transition-all ${
                openIndex === i
                  ? "border-blue-100 bg-blue-50/40"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
              >
                <span className={`text-[13.5px] font-semibold leading-snug ${openIndex === i ? "text-[#1E88E5]" : "text-gray-800"}`}>
                  {faq.question}
                </span>
                <div className="flex-shrink-0 w-7 h-7 cursor-pointer rounded-full border border-gray-200 bg-white flex items-center justify-center">
                  {openIndex === i
                    ? <ChevronUp size={14} className="text-gray-500" />
                    : <ChevronDown size={14} className="text-gray-500" />}
                </div>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-[13px] text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
        
          <Link
            to="/faq"
            className="inline-block bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white font-semibold text-[14px] px-6 py-2.5 rounded-sm transition"
          >
            View all FAQ's
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FaqComponent;

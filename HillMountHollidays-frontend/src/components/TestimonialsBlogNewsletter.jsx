import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, Quote, Send, CheckCircle } from "lucide-react";
import { API } from "./adminComponents/apiHelper";

const TESTIMONIALS = [
  {
    text: "Excellent organization, well planned itinerary and very good hotels. We enjoyed every moment. Highly recommended!",
    name: "Priya Menon",
  },
  {
    text: "Our Kashmir trip was flawless — the tour manager took care of everything. Truly a memorable holiday with HillMount!",
    name: "Rahul Sharma",
  },
  {
    text: "Great value for money. Comfortable transport, lovely stays and warm local experiences throughout the tour.",
    name: "Anitha Krishnan",
  },
];

const BLOGS = [
  { title: "10 Best Places to Visit in Kashmir in Summer", date: "May 20, 2025", tag: "Travel Guide", image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=200&auto=format&fit=crop" },
  { title: "Packing Checklist for Himachal Trip",          date: "May 18, 2025", tag: "Travel Tips",  image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=200&auto=format&fit=crop" },
  { title: "Top 7 Family Friendly Destinations in India",  date: "May 15, 2025", tag: "Travel Guide", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=200&auto=format&fit=crop" },
];

const TestimonialsBlogNewsletter = () => {
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const [nlEmail, setNlEmail]     = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [nlSuccess, setNlSuccess] = useState(false);
  const [nlError, setNlError]     = useState("");
  const nlSubmittingRef = useRef(false);

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    if (nlSubmittingRef.current) return;
    nlSubmittingRef.current = true;
    setNlLoading(true);
    setNlError("");
    try {
      const res = await fetch(`${API}/api/newsletter`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: "", email: nlEmail, phone: "" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed.");
      setNlSuccess(true);
      setNlEmail("");
    } catch (err) {
      setNlError(err.message);
    } finally {
      setNlLoading(false);
      nlSubmittingRef.current = false;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr_0.8fr] gap-5">

      {/* What Our Travelers Say */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4">What Our Travelers Say</h3>
        <div className="flex-1 flex items-center gap-2">
          <button
            onClick={() => setTestimonialIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="shrink-0 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 bg-gray-50 rounded-xl p-4">
            <Quote size={16} className="text-[#1E88E5] mb-2" />
            <p className="text-[12px] text-gray-600 leading-relaxed mb-3">
              {TESTIMONIALS[testimonialIdx].text}
            </p>
            <p className="text-[11.5px] font-semibold text-gray-800 mb-1">
              – {TESTIMONIALS[testimonialIdx].name}
            </p>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12} className="text-[#1E88E5] fill-[#1E88E5]" />
              ))}
            </div>
          </div>
          <button
            onClick={() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length)}
            className="shrink-0 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex justify-center gap-1.5 mt-4">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setTestimonialIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition cursor-pointer ${
                i === testimonialIdx ? "bg-[#1E88E5]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Latest from Our Blog */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4">Latest from Our Blog</h3>
        <div className="space-y-4 flex-1">
          {BLOGS.map((blog) => (
            <Link key={blog.title} to="/blog" className="flex gap-3 group">
              <img
                src={blog.image}
                alt={blog.title}
                loading="lazy"
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-gray-900 leading-snug group-hover:text-[#1E88E5] transition line-clamp-2">
                  {blog.title}
                </p>
                <p className="text-[10.5px] text-gray-400 mt-1">
                  {blog.date} · <span className="text-[#1E88E5]">{blog.tag}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Link
          to="/blog"
          className="mt-6 self-start bg-[#1E88E5] hover:bg-[#084298] text-white text-[11.5px] font-bold px-4 py-2 rounded-lg transition"
        >
          View All Blogs
        </Link>
      </div>

      {/* Newsletter */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
        <h3 className="text-[15px] font-bold text-gray-900 mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
          Get exclusive travel deals, tips & updates straight to your inbox.
        </p>
        <div className="flex-1 flex flex-col">
          {nlSuccess ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-lg px-4 py-3">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              <p className="text-[12px] text-green-700 font-medium">Subscribed! We'll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubscribe}>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="email"
                  required
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2.5 text-[12px] outline-none focus:border-[#1E88E5] transition"
                />
                <Send size={16} className="text-[#1E88E5] shrink-0" />
              </div>
              <button
                type="submit"
                disabled={nlLoading}
                className={`w-full font-bold text-[12.5px] py-2.5 rounded-lg transition ${
                  nlLoading
                    ? "bg-blue-300 text-white cursor-not-allowed"
                    : "bg-[#1E88E5] hover:bg-[#084298] text-white cursor-pointer"
                }`}
              >
                {nlLoading ? "Subscribing…" : "Subscribe Now"}
              </button>
              {nlError && (
                <p className="text-[11px] text-red-500 mt-2">{nlError}</p>
              )}
            </form>
          )}
        </div>
        <p className="text-[10px] text-gray-400 mt-auto pt-3">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default TestimonialsBlogNewsletter;

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Quote, Star, Send, CheckCircle } from "lucide-react";
import { API } from "./adminComponents/apiHelper";

/* Fallbacks shown until (or if) the backend has no data */
const FALLBACK_TESTIMONIALS = [
  {
    text: "Excellent organization, well planned itinerary and very good hotels. We enjoyed every moment. Highly recommended!",
    reviewer: "Priya Menon",
    rating: 5,
  },
  {
    text: "Our Kashmir trip was flawless — the tour manager took care of everything. Truly a memorable holiday with HillMount!",
    reviewer: "Rahul Sharma",
    rating: 5,
  },
  {
    text: "Great value for money. Comfortable transport, lovely stays and warm local experiences throughout the tour.",
    reviewer: "Anitha Krishnan",
    rating: 5,
  },
];

/**
 * Three-column strip: travelers' reviews carousel + latest blogs + newsletter.
 * Reviews and blogs load dynamically from the backend.
 */
const TravelBlogNewsletter = () => {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [blogs, setBlogs] = useState([]);

  const [nlEmail,   setNlEmail]   = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [nlSuccess, setNlSuccess] = useState(false);
  const [nlError,   setNlError]   = useState("");
  const nlSubmittingRef = useRef(false);

  useEffect(() => {
    fetch(`${API}/api/reviews`)
      .then((r) => r.json())
      .then((d) => {
        const list = (d.success ? d.data : d) || [];
        if (Array.isArray(list) && list.length) {
          setTestimonials(list.filter((r) => r.text).slice(0, 6));
          setTestimonialIdx(0);
        }
      })
      .catch(() => {});

    fetch(`${API}/api/blogs?limit=3`)
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data?.length) setBlogs(d.data.slice(0, 3)); })
      .catch(() => {});
  }, []);

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

  const current = testimonials[testimonialIdx] || testimonials[0];

  const blogMeta = (blog) => {
    const img = blog.coverImage
      ? (blog.coverImage.startsWith("/") ? `${API}${blog.coverImage}` : blog.coverImage)
      : "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=200&auto=format&fit=crop";
    const date = blog.createdAt
      ? new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "";
    return { img, date, slug: blog.slug || blog._id };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr_0.8fr] gap-5">

      {/* What Our Travelers Say */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4">What Our Travelers Say</h3>
        <div className="flex-1 flex items-center gap-2">
          <button
            onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
            className="shrink-0 text-gray-400 hover:text-gray-700 transition cursor-pointer"
            aria-label="Previous review"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 bg-gray-50 rounded-xl p-4">
            <Quote size={16} className="text-[#1E88E5] mb-2" />
            <p className="text-[12px] text-gray-600 leading-relaxed mb-3 line-clamp-5">
              {current?.text}
            </p>
            <p className="text-[11.5px] font-semibold text-gray-800 mb-1">
              – {current?.reviewer || current?.name}
            </p>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12}
                  className={s <= (current?.rating || 5) ? "text-[#1E88E5] fill-[#1E88E5]" : "text-gray-300"} />
              ))}
            </div>
          </div>
          <button
            onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)}
            className="shrink-0 text-gray-400 hover:text-gray-700 transition cursor-pointer"
            aria-label="Next review"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex justify-center gap-1.5 mt-4">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setTestimonialIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition cursor-pointer ${
                i === testimonialIdx ? "bg-[#1E88E5]" : "bg-gray-300"
              }`}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Latest from Our Blog */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4">Latest from Our Blog</h3>
        <div className="space-y-4 flex-1">
          {blogs.length === 0 ? (
            <p className="text-[12px] text-gray-400">New travel stories coming soon.</p>
          ) : (
            blogs.map((blog) => {
              const { img, date, slug } = blogMeta(blog);
              return (
                <Link key={blog._id || blog.title} to={`/blog/${slug}`} className="flex gap-3 group">
                  <img
                    src={img}
                    alt={blog.title}
                    loading="lazy"
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-gray-900 leading-snug group-hover:text-[#1E88E5] transition line-clamp-2">
                      {blog.title}
                    </p>
                    <p className="text-[10.5px] text-gray-400 mt-1">
                      {date}{blog.category && <> · <span className="text-[#1E88E5]">{blog.category}</span></>}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
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

export default TravelBlogNewsletter;

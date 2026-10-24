import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { API } from "./adminComponents/apiHelper";
import fallbackImg from "../assets/blogs/blog.webp";
import HorizontalScroller from "./HorizontalScroller";

const stripHtml = (html) => html ? html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';

const blogFlags = (b) =>
  Array.isArray(b.interests) && b.interests.length ? b.interests :
  (b.interest ? [b.interest] : []);

const useReveal = (delay = 0) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(32px)",
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  }];
};

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
    <div className="w-full h-44 skeleton-shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-3 skeleton-shimmer rounded w-1/3" />
      <div className="h-4 skeleton-shimmer rounded w-full" />
      <div className="h-4 skeleton-shimmer rounded w-4/5" />
      <div className="h-3 skeleton-shimmer rounded w-3/4 mt-1" />
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <div className="w-7 h-7 rounded-full skeleton-shimmer" />
        <div className="space-y-1.5">
          <div className="h-2.5 skeleton-shimmer rounded w-20" />
          <div className="h-2 skeleton-shimmer rounded w-28" />
        </div>
      </div>
    </div>
  </div>
);

/* ── Blog card ── */
const BlogCard = ({ blog, delay, animate = true }) => {
  const [revealRef, revealStyle] = useReveal(delay);
  const ref   = animate ? revealRef : null;
  const style = animate ? revealStyle : undefined;

  const imgSrc = blog.coverImage
    ? (blog.coverImage.startsWith('/') ? `${API}${blog.coverImage}` : blog.coverImage)
    : fallbackImg;

  const dateStr = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  const flags = blogFlags(blog);
  const slug  = blog.slug || blog._id;

  return (
    <div ref={ref} style={style} className="h-full">
      <Link to={`/blog/${slug}`} className="block h-full">
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition duration-300 group cursor-pointer h-full">
          {/* Image */}
          <div className="relative w-full h-44 overflow-hidden bg-slate-100 shrink-0">
            <img
              src={imgSrc}
              alt={blog.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              onError={(e) => { e.target.src = fallbackImg; }}
            />
          </div>

          {/* Body */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {blog.tag && (
                  <span className="bg-[#fffbeb] border border-amber-100 text-amber-700 text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                    {blog.tag}
                  </span>
                )}
              
              </div>

              {/* Title */}
              <h3 className="text-[14px] font-bold text-gray-900 leading-snug group-hover:text-[#1E88E5] transition duration-200 line-clamp-2 mb-2">
                {blog.title}
              </h3>

              {/* Excerpt */}
              <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2">
                {stripHtml(blog.excerpt)}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2.5 pt-3.5 mt-3 border-t border-gray-100">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[10px] font-extrabold border border-slate-200 shrink-0">
                {blog.author?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-800 leading-none">{blog.author || 'HillMount'}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{dateStr}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

/* ── Main section ── */
const HomeBlogSection = () => {
  const [blogs,   setBlogs]   = useState([]);
  const [loading, setLoading] = useState(true);

  const [headerRef, headerStyle] = useReveal(0);

  useEffect(() => {
    fetch(`${API}/api/blogs?limit=4`)
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data?.length) setBlogs(d.data.slice(0, 4)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-gray-50 py-14 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={headerRef} style={headerStyle} className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold text-[#1E88E5] uppercase tracking-[0.25em] mb-1">Travel Inspiration</p>
            <h2 className="text-[22px] md:text-[28px] font-extrabold text-gray-900 leading-tight">
              From Our Blog
            </h2>
          </div>
          <Link
            to="/blog"
            className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-black border border-gray-300 hover:border-gray-700 px-4 py-2 rounded-full transition whitespace-nowrap"
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <>
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
            <HorizontalScroller className="md:hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[240px] snap-start"><SkeletonCard /></div>
              ))}
            </HorizontalScroller>
          </>
        ) : blogs.length === 0 ? null : (
          <>
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {blogs.map((blog, i) => (
                <BlogCard key={blog._id} blog={blog} delay={i * 0.1} />
              ))}
            </div>
            <HorizontalScroller className="md:hidden">
              {blogs.map((blog) => (
                <div key={blog._id} className="flex-shrink-0 w-[240px] snap-start">
                  <BlogCard blog={blog} animate={false} />
                </div>
              ))}
            </HorizontalScroller>
          </>
        )}

      </div>
    </section>
  );
};

export default HomeBlogSection;


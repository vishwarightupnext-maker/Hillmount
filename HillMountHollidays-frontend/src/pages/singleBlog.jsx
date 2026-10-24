import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, User, MapPin, Compass, ArrowLeft, Loader2, ChevronRight, Building2 } from "lucide-react";
import fallbackImg from "../assets/blogs/blog.webp";

const API = import.meta.env.VITE_API_BASE;

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const imgUrl = (src) =>
    src ? (src.startsWith("/") ? `${API}${src}` : src) : null;

const FALLBACK = fallbackImg;

// ── Small sidebar card ────
const SideCard = ({ blog }) => {
    const slug = blog.slug || blog._id;
    const src = imgUrl(blog.coverImage) || FALLBACK;

    return (
        <Link to={`/blog/${slug}`}
            className="flex gap-3 group rounded-xl p-2 hover:bg-amber-50 transition-colors">
            <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                <img src={src} alt={blog.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => { e.target.src = FALLBACK; }} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1 truncate">
                    {blog.tag}
                </div>
                <p className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {blog.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                    {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        : ""}
                </p>
            </div>
        </Link>
    );
};

// ── Grid card for similar blogs ───────────────────────────────────────────────
const GridCard = ({ blog }) => {
    const slug = blog.slug || blog._id;
    const src = imgUrl(blog.coverImage) || FALLBACK;

    return (
        <Link to={`/blog/${slug}`} className="group block">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative w-full h-44 overflow-hidden bg-slate-100">
                    <img src={src} alt={blog.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onError={(e) => { e.target.src = FALLBACK; }} />
                   
                </div>
                <div className="p-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-2">
                        {blog.tag}
                    </div>
                    <h4 className="text-[14px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
                        {blog.title}
                    </h4>
                    <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed">{stripHtml(blog.excerpt)}</p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[10px] font-bold">
                            {blog.author?.[0]?.toUpperCase() || "A"}
                        </div>
                        <span className="text-[11px] text-gray-500">{blog.author}</span>
                        <span className="text-gray-300 ml-auto text-[11px]">
                            {blog.createdAt
                                ? new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                : ""}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// ── Main SingleBlog page ──────────────────────────────────────────────────────
const SingleBlog = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        setLoading(true);
        setNotFound(false);
        setBlog(null);
        fetch(`${API}/api/blogs/slug/${slug}`)
            .then((r) => r.json())
            .then((d) => {
                if (d.success) setBlog(d.data);
                else setNotFound(true);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    useEffect(() => {
        fetch(`${API}/api/blogs`)
            .then((r) => r.json())
            .then((d) => { if (d.success) setAllBlogs(d.data); });
    }, []);

    const otherBlogs = allBlogs
        .filter((b) => (b.slug || b._id) !== slug && b._id !== blog?._id)
        .slice(0, 5);

    const similarBlogs = allBlogs
        .filter((b) => {
            if ((b.slug || b._id) === slug || b._id === blog?._id) return false;
            return (
                (blog?.destination && b.destination === blog.destination) ||
                (blog?.tag && b.tag === blog.tag)
            );
        })
        .slice(0, 4);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 size={36} className="animate-spin text-yellow-400" />
            </div>
        );
    }

    if (notFound || !blog) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-32 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Article not found</h2>
                <p className="text-gray-500 mb-8">This article may have been removed or the link is incorrect.</p>
                <Link to="/blog"
                    className="inline-flex items-center gap-2 bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white font-semibold px-6 py-2.5 rounded-lg transition">
                    <ArrowLeft size={16} /> Back to Blog
                </Link>
            </div>
        );
    }

    const coverSrc = imgUrl(blog.coverImage) || FALLBACK;
    const dateStr = blog.createdAt
        ? new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
        : "";

    // Detect whether content is HTML (from rich editor) or plain text
    const isHtml = (str) => /<[a-z][\s\S]*>/i.test(str);

    // Convert tab/column divs to HTML table (passthrough — preserves content as-is)
    const convertTabDivsToTable = (html) => html;

    // Circle icon span for Do's (green) and Don'ts (red)
    const circleIcon = (color) =>
        `<span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;min-width:20px;border-radius:50%;border:2px solid ${color};color:${color};font-size:11px;font-weight:800;vertical-align:middle;margin-right:6px">${color === '#16a34a' ? '✓' : '✗'}</span>`;

    // Colorize ✓ → green circle, ✗ / × / "X " → red circle in HTML content
    const colorizeMarkers = (html) =>
        html
            .replace(/✓/g, circleIcon('#16a34a'))
            .replace(/✗/g, circleIcon('#dc2626'))
            .replace(/×/g, circleIcon('#dc2626'))
            .replace(/(<(?:p|li)[^>]*>)\s*X\s/g, `$1${circleIcon('#dc2626')}`);

    // Inject onerror on every <img> inside HTML content so broken uploads don't show broken icon
    const injectImgFallback = (html) =>
        html.replace(/<img(\s[^>]*?)>/gi, (match, attrs) => {
            if (/onerror/i.test(attrs)) return match;
            return `<img${attrs} onerror="this.style.display='none'">`;
        });

    const renderContent = (text) => {
        if (!text?.trim()) return null;
        if (isHtml(text)) {
            return (
                <div
                    className="prose-content text-[15px] text-gray-700 leading-[1.9]"
                    dangerouslySetInnerHTML={{ __html: injectImgFallback(colorizeMarkers(convertTabDivsToTable(text))) }}
                />
            );
        }
        // Plain text: every single newline = new line; blank lines = gap
        return text.split("\n").map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={i} style={{ height: "0.6rem" }} />;
            const isCheck = trimmed.startsWith('✓');
            const isCross = trimmed.startsWith('✗') || trimmed.startsWith('×') || /^[Xx]\s/.test(trimmed);
            if (isCheck || isCross) {
                const rest = trimmed.replace(/^[✓✗×Xx]\s*/, '').trim();
                return (
                    <p key={i} className="flex items-start gap-2 text-[15px] leading-[1.9] mb-1 text-gray-700">
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '20px', height: '20px', minWidth: '20px', borderRadius: '50%',
                            border: `2px solid ${isCheck ? '#16a34a' : '#dc2626'}`,
                            color: isCheck ? '#16a34a' : '#dc2626',
                            fontSize: '11px', fontWeight: '800', marginTop: '4px',
                        }}>
                            {isCheck ? '✓' : '✗'}
                        </span>
                        {rest}
                    </p>
                );
            }
            return <p key={i} className="text-[15px] text-gray-700 leading-[1.9] mb-1">{trimmed}</p>;
        });
    };

    return (
        <div className="w-full font-inter bg-white">

            {/* HERO IMAGE */}
            <div className="relative w-full h-[360px] md:h-[480px] overflow-hidden bg-slate-900">
                <img src={coverSrc} alt={blog.title}
                    className="w-full h-full object-cover opacity-50"
                    onError={(e) => { e.target.src = FALLBACK; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/15" />

              <div className="absolute bottom-0 left-0 right-0 px-5 md:px-12 pb-10 max-w-6xl mx-auto">
    
    {/* Breadcrumb */}
    <nav className="flex items-center gap-1.5 text-white/60 text-[11px] mb-4 flex-wrap">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <ChevronRight size={10} />
        <Link to="/blog" className="hover:text-white transition">Blog</Link>
        <ChevronRight size={10} />
        <span className="text-white/90 line-clamp-1">{blog.title}</span>
    </nav>

    {/* Top Tags (ONLY tag + interest) */}
    <div className="flex flex-wrap gap-2 mb-4">
        {blog.tag && (
            <span className="bg-[#1E88E5] text-white text-[10px] font-extrabold px-3 py-1 rounded-sm uppercase tracking-wider">
                {blog.tag}
            </span>
        )}

        {blog.interest && (
            <span className="bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-sm uppercase tracking-wider">
                {blog.interest}
            </span>
        )}
    </div>

    {/* Title */}
    <h1 className="text-2xl md:text-[38px] lg:text-[44px] font-extrabold text-white leading-tight max-w-4xl tracking-tight">
        {blog.title}
    </h1>

    {/* Location Section (Australia, Brisbane BELOW title) */}
    {(blog.destination || blog.city) && (
        <div className="flex flex-wrap gap-2 mt-3">

            {/* Destination (Australia, Brisbane) */}
            {blog.destination &&
                blog.destination
                    .split(',')
                    .map((d) => d.trim())
                    .filter(Boolean)
                    .map((d) => (
                        <span
                            key={`dest-${d}`}
                            className="inline-flex items-center gap-1.5 bg-blue-500/25 text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider backdrop-blur-sm border border-blue-300/30"
                        >
                            <Building2 size={9} />
                            {d}
                        </span>
                    ))}

            {/* City */}
            {blog.city &&
                blog.city
                    .split(',')
                    .map((c) => c.trim())
                    .filter(Boolean)
                    .map((c) => (
                        <span
                            key={`city-${c}`}
                            className="inline-flex items-center gap-1.5 bg-blue-500/25 text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider backdrop-blur-sm border border-blue-300/30"
                        >
                            <Building2 size={9} />
                            {c}
                        </span>
                    ))}
        </div>
    )}
</div>
            </div>

            {/* MAIN LAYOUT */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8 transition group cursor-pointer">
                    <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back to Articles
                </button>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* LEFT: Article content */}
                    <article className="flex-1 min-w-0">

                        {/* Meta bar */}
                        <div className="flex flex-wrap items-center gap-5 text-[13px] text-gray-500 mb-7 pb-6 border-b border-gray-100">
                            <span className="flex items-center gap-1.5">
                                <User size={13} className="text-gray-400" />
                                <span className="font-semibold text-gray-700">{blog.author}</span>
                            </span>
                            {dateStr && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={13} className="text-gray-400" />
                                    {dateStr}
                                </span>
                            )}
                            {blog.destination && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={13} className="text-gray-400" />
                                    {blog.destination}
                                </span>
                            )}
                            {blog.city && (
                                <span className="flex items-center gap-1.5">
                                    <Building2 size={13} className="text-gray-400" />
                                    {blog.city}
                                </span>
                            )}
                            {blog.interest && (
                                <span className="flex items-center gap-1.5">
                                    <Compass size={13} className="text-gray-400" />
                                    {blog.interest}
                                </span>
                            )}
                        </div>

                        {/* Lead excerpt */}
                        {blog.excerpt && (
                            <blockquote
                                className="text-[16px] text-gray-600 leading-relaxed font-medium border-l-4 border-[#1E88E5] pl-5 py-1 mb-8 bg-amber-50/40 rounded-r-xl pr-4 italic prose-content"
                                {...(isHtml(blog.excerpt)
                                    ? { dangerouslySetInnerHTML: { __html: blog.excerpt } }
                                    : { children: blog.excerpt }
                                )}
                            />
                        )}

                        {/* Cover image (also shown inline in article for context) */}
                        <div className="rounded-2xl overflow-hidden mb-8 shadow-sm border border-gray-100">
                            <img src={coverSrc} alt={blog.title}
                                className="w-full max-h-[420px] object-cover"
                                onError={(e) => { e.target.src = FALLBACK; }} />
                        </div>

                        {/* Body content */}
                        {blog.content?.trim() ? (
                            <div className="prose-content">{renderContent(blog.content)}</div>
                        ) : (
                            <p className="text-gray-400 text-sm italic">No full content available for this article.</p>
                        )}

                        {/* Keyword tag buttons */}
                        {blog.destination && (() => {
                            const dest = blog.destination.split(',')[0].trim();
                            const keywords = [
                                `${dest} Itinerary`,
                                `${dest} Leading Tour Operator`,
                                `${dest} Tour Packages`,
                                `${dest} Holiday`,
                                `Best Travel Months ${dest}`,
                                `Seasons in ${dest}`,
                                `Solo Backpacking ${dest} Trip`,
                                `Things to Do in ${dest}`,
                            ];
                            return (
                                <div className="mt-10 pt-6 border-t border-gray-100">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {keywords.map((kw) => (
                                            <Link
                                                key={kw}
                                                to={`/blog?q=${encodeURIComponent(kw)}`}
                                                className="border border-gray-300 text-gray-700 text-[11px] font-bold uppercase tracking-wider px-4 py-2 hover:bg-gray-100 transition-colors"
                                            >
                                                {kw}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Social share */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-[13px] font-bold text-gray-700">Share</span>
                                        {/* Facebook */}
                                        <a
                                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#1877F2] hover:opacity-80 transition"
                                            title="Share on Facebook"
                                        >
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                            </svg>
                                        </a>
                                        {/* LinkedIn */}
                                        <a
                                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#0A66C2] hover:opacity-80 transition"
                                            title="Share on LinkedIn"
                                        >
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                        </a>
                                        {/* Twitter / X */}
                                        <a
                                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#1E88E5] hover:opacity-80 transition"
                                            title="Share on Twitter / X"
                                        >
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.263 5.633L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            );
                        })()}
                    </article>

                    {/* RIGHT: Sidebar */}
                    {otherBlogs.length > 0 && (
                        <aside className="lg:w-72 xl:w-80 flex-shrink-0">
                            <div className="sticky top-24">
                                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                    <h3 className="text-[12px] font-extrabold text-gray-700 uppercase tracking-widest mb-4 pb-3 border-b border-gray-200">
                                        More Articles
                                    </h3>
                                    <div className="space-y-1">
                                        {otherBlogs.map((b) => (
                                            <SideCard key={b._id} blog={b} />
                                        ))}
                                    </div>
                                    <Link to="/blog"
                                        className="mt-5 flex items-center justify-center gap-1.5 text-[12px] font-bold text-amber-600 hover:text-amber-700 transition pt-4 border-t border-gray-200">
                                        View all articles <ChevronRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    )}

                </div>

                {/* SIMILAR BLOGS SECTION */}
                {similarBlogs.length > 0 && (
                    <section className="mt-16 pt-10 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-[#1E88E5] mb-1">You Might Also Like</p>
                                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Similar Articles</h2>
                            </div>
                            <Link to="/blog"
                                className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-800 transition">
                                All articles <ChevronRight size={15} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarBlogs.map((b) => (
                                <GridCard key={b._id} blog={b} />
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
};

export default SingleBlog;


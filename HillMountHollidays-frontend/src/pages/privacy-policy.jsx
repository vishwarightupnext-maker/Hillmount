import { useState, useEffect } from "react";
import { Phone, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { API } from "../components/adminComponents/apiHelper";

const DEFAULT_CONTENT = `
  <p>We value your privacy. This Privacy Policy explains how HillMount Holidays collects, uses, and protects your personal information when you use our website and services.</p>
  <p>This page has not been configured yet. Please check back soon, or contact us directly if you have any questions about how your data is handled.</p>
`;

/* ─── Page ─── */
const PrivacyPolicy = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/privacy-policy`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.content) setContent(d.data.content);
        else setContent(DEFAULT_CONTENT);
      })
      .catch(() => setContent(DEFAULT_CONTENT))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-white font-inter">

      {/* ── HERO ── */}
      <div className="bg-black text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1 text-[12px] mb-6 flex-wrap">
            <Link to="/" className="text-pink-300 hover:underline">Home</Link>
            <span className="text-gray-300 mx-1">&gt;</span>
            <span className="text-white">Privacy Policy</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">Privacy Policy</h1>
          <p className="text-blue-200 text-[15px] mb-8 max-w-2xl">
            How HillMount Holidays collects, uses and protects your information.
          </p>
          <p className="text-blue-100 text-[13px] mb-1">Prefer to speak to one of our expert advisors?</p>
          <div className="flex items-center gap-3">
            <Phone size={22} className="text-white" />
            <a href="tel:+919994666522">
              <span className="text-3xl font-extrabold tracking-wide cursor-pointer">
                +91 99946 66522
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-8 py-8 min-w-0">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 size={28} className="animate-spin text-[#1E88E5]" />
              </div>
            ) : (
              <div
                className="text-[13.5px] text-gray-700 leading-relaxed space-y-3
                           [&_h1]:text-[20px] [&_h1]:font-extrabold [&_h1]:text-gray-900 [&_h1]:mb-3
                           [&_h2]:text-[16px] [&_h2]:font-extrabold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-2
                           [&_h3]:text-[14px] [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-4 [&_h3]:mb-2
                           [&_p]:mb-2
                           [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
                           [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
                           [&_a]:text-blue-600 [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

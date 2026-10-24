import { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import PageLoader from "./components/PageLoader";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/footer";
import EnquiryModal from "./components/EnquiryModal";
import ScrollToTopButton from "./components/ScrollToTopButton";

const Home                     = lazy(() => import("./pages/Home"));
const AboutUs                  = lazy(() => import("./pages/about-us"));
const Mice                     = lazy(() => import("./pages/mice"));
const Contact                  = lazy(() => import("./pages/contact"));
const Faq                      = lazy(() => import("./pages/faq"));
const Blogs                    = lazy(() => import("./pages/blogs"));
const SingleBlog               = lazy(() => import("./pages/singleBlog"));
const Careers                  = lazy(() => import("./pages/careers"));
const CustomizedHolidays       = lazy(() => import("./pages/customizedHilidays"));
const IndiaTours               = lazy(() => import("./pages/indiaTours"));
const WorldTours               = lazy(() => import("./pages/worldTours"));
const SingleTourPackage        = lazy(() => import("./pages/singleTourPackage"));
const CustomizedHolidaySingle  = lazy(() => import("./pages/customizedHolidaySingle"));
const SpecialityTours          = lazy(() => import("./pages/specialityTours"));
const ShortStay                = lazy(() => import("./pages/shortStay"));
const Cruise                   = lazy(() => import("./pages/cruise"));
const TermsAndConditions       = lazy(() => import("./pages/terms-conditions"));
const PrivacyPolicy            = lazy(() => import("./pages/privacy-policy"));
const AdminLogin               = lazy(() => import("./pages/admin/adminLogin"));
const AdminRegister            = lazy(() => import("./pages/admin/adminRegister"));
const AdminDashboard           = lazy(() => import("./pages/admin/adminDashboard"));

// Layout for all public pages (includes Navbar + Footer)
function PublicLayout() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen font-inter">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Floating Quick Enquiry button → opens EnquiryModal */}
      <button
        onClick={() => setEnquiryOpen(true)}
        className="fixed bottom-6 right-5 z-40 flex items-center gap-2 bg-[#1E88E5] hover:bg-[#084298] text-white font-semibold text-sm px-4 py-2.5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {/* Clipboard / form icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect x="9" y="2" width="6" height="4" rx="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="16" x2="13" y2="16" />
        </svg>
        Quick Enquiry
      </button>

      <ScrollToTopButton />
      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </div>
  );
}

// Shows the logo loader on initial load and briefly on every route change
function RouteLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return loading ? <PageLoader /> : null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <RouteLoader />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Admin routes – no Navbar / Footer */}
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/register" element={<AdminRegister />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Public routes – wrapped in PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/mice" element={<Mice />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/blog" element={<Blogs />} />
            <Route path="/blog/:slug" element={<SingleBlog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/personalised-holidays" element={<CustomizedHolidays />} />
            <Route path="/personalised-holidays/:slug" element={<CustomizedHolidaySingle />} />
            <Route path="/speciality-tours" element={<SpecialityTours />} />
            <Route path="/speciality-tours/:slug" element={<CustomizedHolidaySingle />} />
            <Route path="/short-stay" element={<ShortStay />} />
            <Route path="/short-stay/:slug" element={<CustomizedHolidaySingle />} />
            <Route path="/cruise" element={<Cruise />} />
            <Route path="/cruise/:slug" element={<CustomizedHolidaySingle />} />
            <Route path="/mice-tour/:slug" element={<CustomizedHolidaySingle />} />
            <Route path="/india-tours" element={<IndiaTours />} />
            <Route path="/world-tours" element={<WorldTours />} />
            <Route path="/tour-package" element={<SingleTourPackage />} />
            <Route path="/tour-package/:code" element={<SingleTourPackage />} />
            <Route path="/terms-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

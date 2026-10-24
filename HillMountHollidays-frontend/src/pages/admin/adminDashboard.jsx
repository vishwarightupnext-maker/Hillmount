import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Image, HelpCircle, Briefcase, Images, BookOpen, Star,
  LogOut, Menu, X, Sun, AlignJustify, LayoutGrid, Video, MapPin, Users,
  Contact, Camera, ShieldCheck,
} from 'lucide-react';
import logo from "../../assets/logo.png";
import AdBannerManager from '../../components/adminComponents/AdBannerManager';
import HomeBannerManager from '../../components/adminComponents/HomeBannerManager';
import FaqManager from '../../components/adminComponents/FaqManager';
import CareersManager from '../../components/adminComponents/CareersManager';
import GalleryManager from '../../components/adminComponents/GalleryManager';
import BlogsManager from '../../components/adminComponents/BlogsManager';
import ReviewsManager from '../../components/adminComponents/ReviewsManager';
import SeasonManager from '../../components/adminComponents/SeasonManager';
import MarqueeManager from '../../components/adminComponents/MarqueeManager';
import MiceGalleryManager from '../../components/adminComponents/MiceGalleryManager';
import ReelManager from '../../components/adminComponents/ReelManager';
import CustomizedHolidayManager from '../../components/adminComponents/CustomizedHolidayManager';
import UsersManager from '../../components/adminComponents/UsersManager';
import TeamManager from '../../components/adminComponents/TeamManager';
import AboutJourneyManager from '../../components/adminComponents/AboutJourneyManager';
import PrivacyPolicyManager from '../../components/adminComponents/PrivacyPolicyManager';
import { API, getToken, clearToken, getTokenPayload } from '../../components/adminComponents/apiHelper';

// All possible menu items with access metadata
const ALL_MENU = [
  { id: 'adbanner',       label: 'AD Banner',      icon: Image,        superOnly: true },
  { id: 'home-banner',    label: 'Home Banner',    icon: Image,        superOnly: true },
  { id: 'faq',            label: 'FAQ',             icon: HelpCircle,   superOnly: true },
  { id: 'careers',        label: 'Careers',         icon: Briefcase,    superOnly: true },
  { id: 'gallery',        label: 'Gallery',         icon: Images,       superOnly: true },
  { id: 'blogs',          label: 'Blogs',           icon: BookOpen,     accessKey: 'blogs' },
  { id: 'reviews',        label: 'Reviews',         icon: Star,         superOnly: true },
  { id: 'seasons',        label: 'Seasons',         icon: Sun,          superOnly: true },
  { id: 'marquee',        label: 'Marquee',         icon: AlignJustify, superOnly: true },
  { id: 'mice-gallery',   label: 'MICE Gallery',    icon: LayoutGrid,   superOnly: true },
  { id: 'reels',          label: 'Reels',           icon: Video,        superOnly: true },
  { id: 'custom-holidays',label: 'Custom Holidays', icon: MapPin,       accessKey: 'customHolidays' },
  { id: 'team',           label: 'Team',            icon: Contact,      superOnly: true },
  { id: 'about-journey',  label: 'About Journey Photo', icon: Camera,   superOnly: true },
  { id: 'privacy-policy', label: 'Privacy Policy',  icon: ShieldCheck,  superOnly: true },
  { id: 'users',          label: 'Users',           icon: Users,        superOnly: true },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Decode token synchronously to drive role / access
  const payload = getTokenPayload();
  const role   = payload?.role  || 'admin';
  const access = payload?.access || {};
  const userEmail = payload?.email || 'Admin';

  const isSuperAdmin = role === 'admin';

  const visibleMenu = isSuperAdmin
    ? ALL_MENU
    : ALL_MENU.filter((m) => {
        if (m.superOnly) return false;
        if (m.accessKey) return (access[m.accessKey] ?? 'none') !== 'none';
        return false;
      });

  const canEditBlogs  = isSuperAdmin || access.blogs === 'edit';
  const canEditCustom = isSuperAdmin || access.customHolidays === 'edit';

  const [active, setActive] = useState(() => {
    const saved = sessionStorage.getItem('adminActiveTab') || 'adbanner';
    const allowed = isSuperAdmin || visibleMenu.some((m) => m.id === saved);
    return allowed ? saved : (visibleMenu[0]?.id || 'adbanner');
  });

  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const token = getToken();
    if (!token) { navigate('/login'); return; }

    fetch(`${API}/api/admin/verify`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401) { clearToken(); navigate('/login'); }
      })
      .catch(() => {});
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const setTab = (id) => {
    setActive(id);
    sessionStorage.setItem('adminActiveTab', id);
    if (isMobile) setSidebarOpen(false);
  };

  const activeItem = visibleMenu.find((m) => m.id === active) || ALL_MENU.find((m) => m.id === active);

  const renderContent = () => {
    switch (active) {
      case 'adbanner':       return <AdBannerManager />;
      case 'home-banner':    return <HomeBannerManager />;
      case 'faq':            return <FaqManager />;
      case 'careers':        return <CareersManager />;
      case 'gallery':        return <GalleryManager />;
      case 'blogs':          return <BlogsManager canEdit={canEditBlogs} />;
      case 'reviews':        return <ReviewsManager />;
      case 'seasons':        return <SeasonManager />;
      case 'marquee':        return <MarqueeManager />;
      case 'mice-gallery':   return <MiceGalleryManager />;
      case 'reels':          return <ReelManager />;
      case 'custom-holidays':return <CustomizedHolidayManager canEdit={canEditCustom} />;
      case 'team':           return <TeamManager />;
      case 'about-journey':  return <AboutJourneyManager />;
      case 'privacy-policy': return <PrivacyPolicyManager />;
      case 'users':          return <UsersManager />;
      default:               return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300"
        style={{
          width: isMobile ? '240px' : (sidebarOpen ? '240px' : '64px'),
          backgroundColor: '#1F2937',
          height: '100vh',
          overflow: 'hidden',
          position: isMobile ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          zIndex: isMobile ? 50 : undefined,
          transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        }}
      >
        {/* Logo row */}
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: '64px' }}
        >
          {sidebarOpen && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden"
                style={{ width: '32px', height: '32px', backgroundColor: '#fefefeff' }}
              >
                <img src={logo} alt="logo" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
              </div>
              <span className="text-white font-bold text-sm truncate">HillMount</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {sidebarOpen && (
          <p className="px-4 pt-3 pb-1 text-gray-500 text-xs uppercase tracking-wider">
            {isSuperAdmin ? 'Admin Panel' : 'Panel'}
          </p>
        )}

        {/* Nav items */}
        <nav className="flex-1 min-h-0 px-2 py-2 space-y-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {visibleMenu.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                title={!sidebarOpen ? label : undefined}
                className="w-full flex cursor-pointer items-center gap-3 rounded-lg transition-all duration-150"
                style={{
                  padding: sidebarOpen ? '10px 12px' : '10px',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  backgroundColor: isActive ? '#1E88E5' : 'transparent',
                  color: isActive ? '#1F2937' : '#9CA3AF',
                }}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium truncate">{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Logout' : undefined}
            className="w-full flex items-center gap-3 rounded-lg text-red-400 hover:text-red-300 transition-colors"
            style={{ padding: sidebarOpen ? '10px 12px' : '10px', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center justify-between px-4 sm:px-6 flex-shrink-0"
          style={{ minHeight: '64px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors mr-1"
              >
                <Menu size={20} />
              </button>
            )}
            {activeItem && <activeItem.icon size={18} style={{ color: '#1E88E5' }} />}
            <h1 className="text-gray-800 font-semibold text-base">{activeItem?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-full text-white text-sm font-bold flex-shrink-0"
              style={{ width: '34px', height: '34px', backgroundColor: '#1E88E5' }}
            >
              {userEmail[0]?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{isSuperAdmin ? 'Admin' : 'Sub-Admin'}</p>
              <p className="text-xs text-gray-400">{userEmail}</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="admin-scroll-area" className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm"
            style={{ minHeight: 'calc(100vh - 136px)' }}
          >
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

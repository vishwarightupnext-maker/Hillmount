import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, EyeOff, Smartphone, Monitor, Upload, X, Loader2 } from 'lucide-react';
import { API, authHeaders, safeFetch } from './apiHelper';

// ── Image Upload Box ──────────────────────────────────────────────────────────
function ImageUploadBox({ label, icon: Icon, file, preview, onFileChange, onClear, dimension }) {
  const inputRef = useRef(null);

  return (
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
        <Icon size={13} /> {label}
      </p>
      {preview ? (
        <div
          className="relative rounded-xl overflow-hidden border border-blue-300 group"
          style={{ height: '140px' }}
        >
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded truncate max-w-28">
            {file?.name}
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
          style={{ height: '140px' }}
        >
          <Upload size={22} className="text-[#1E88E5]" />
          <span className="text-xs text-[#1E88E5] font-medium">Click to upload</span>
          <span className="text-xs font-semibold text-[#084298]">{dimension}</span>
          <span className="text-xs text-gray-400">JPG · PNG · WEBP · max 5 MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}

// ── Banner Card ───────────────────────────────────────────────────────────────
function BannerCard({ banner, onToggle, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex">
        <div className="flex-1 relative" style={{ height: '120px' }}>
          <img
            src={`${API}${banner.mobileImage}`}
            alt="mobile"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 text-xs text-white py-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          >
            <Smartphone size={11} /> Mobile
          </span>
        </div>
        <div
          className="flex-1 relative"
          style={{ borderLeft: '2px solid #F3F4F6', height: '120px' }}
        >
          <img
            src={`${API}${banner.desktopImage}`}
            alt="desktop"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 text-xs text-white py-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          >
            <Monitor size={11} /> Desktop
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0 flex-1 mr-3">
          <p className="text-sm font-semibold text-gray-800 truncate">{banner.title}</p>
          {banner.linkUrl && (
            <p className="text-xs text-gray-400 truncate">{banner.linkUrl}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onToggle(banner._id)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors"
            style={{
              backgroundColor: banner.active ? '#FFFBEB' : '#F9FAFB',
              borderColor:     banner.active ? '#FDE68A' : '#E5E7EB',
              color:           banner.active ? '#D97706' : '#9CA3AF',
            }}
          >
            {banner.active ? <Eye size={11} /> : <EyeOff size={11} />}
            {banner.active ? 'Active' : 'Hidden'}
          </button>
          <button
            onClick={() => onDelete(banner._id)}
            className="text-red-300 hover:text-red-600 transition-colors p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdBannerManager() {
  const navigate = useNavigate();

  const [banners, setBanners]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [showForm, setShowForm]         = useState(false);
  const [error, setError]               = useState('');
  const [formError, setFormError]       = useState('');
  const [title, setTitle]               = useState('');
  const [linkUrl, setLinkUrl]           = useState('');
  const [active, setActive]             = useState(true);
  const [mobileFile, setMobileFile]     = useState(null);
  const [mobilePreview, setMobilePreview]   = useState('');
  const [desktopFile, setDesktopFile]   = useState(null);
  const [desktopPreview, setDesktopPreview] = useState('');

  // ── fetch ──
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/ad-banners`);
      const data = await res.json();
      if (data.success) setBanners(data.data);
      else setError('Failed to load banners');
    } catch {
      setError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  // ── file helpers ──
  const handleFileChange = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'mobile') { setMobileFile(file);  setMobilePreview(url); }
    else                   { setDesktopFile(file); setDesktopPreview(url); }
  };

  const clearFile = (type) => {
    if (type === 'mobile') { setMobileFile(null);  setMobilePreview(''); }
    else                   { setDesktopFile(null); setDesktopPreview(''); }
  };

  const resetForm = () => {
    setTitle(''); setLinkUrl(''); setActive(true);
    setMobileFile(null);  setMobilePreview('');
    setDesktopFile(null); setDesktopPreview('');
    setFormError('');
  };

  // ── submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!mobileFile)  return setFormError('Please upload a mobile image.');
    if (!desktopFile) return setFormError('Please upload a desktop image.');

    const fd = new FormData();
    fd.append('title', title);
    fd.append('linkUrl', linkUrl);
    fd.append('active', String(active));
    fd.append('mobileImage', mobileFile);
    fd.append('desktopImage', desktopFile);

    try {
      setSubmitting(true);
      // NOTE: do NOT set Content-Type when sending FormData — browser sets it with boundary
      const res = await safeFetch(
        `${API}/api/ad-banners`,
        { method: 'POST', headers: authHeaders(), body: fd },
        navigate,
      );
      if (!res) return; // 401 → already redirected

      const data = await res.json();
      if (data.success) {
        setBanners((prev) => [data.data, ...prev]);
        resetForm();
        setShowForm(false);
      } else {
        setFormError(data.message || 'Failed to save banner');
      }
    } catch {
      setFormError('Server error — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── toggle active ──
  const handleToggle = async (id) => {
    const res = await safeFetch(
      `${API}/api/ad-banners/${id}/toggle`,
      { method: 'PATCH', headers: authHeaders() },
      navigate,
    );
    if (!res) return;
    const data = await res.json();
    if (data.success) setBanners((prev) => prev.map((b) => b._id === id ? data.data : b));
  };

  // ── delete ──
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    const res = await safeFetch(
      `${API}/api/ad-banners/${id}`,
      { method: 'DELETE', headers: authHeaders() },
      navigate,
    );
    if (!res) return;
    const data = await res.json();
    if (data.success) setBanners((prev) => prev.filter((b) => b._id !== id));
  };

  // ── render ──
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">AD Banners</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Upload separate mobile &amp; desktop images per banner
          </p>
        </div>
        <button
          onClick={() => { setShowForm((s) => !s); if (showForm) resetForm(); }}
          className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: '#F5C518' }}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Banner'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">New Banner</h3>
          {formError && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded mb-3">
              {formError}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Banner Title *</label>
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Escape Deals" required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]"
              />
            </div>

            <div className="flex gap-4">
              <ImageUploadBox
                label="Mobile Image" icon={Smartphone}
                dimension="475 × 398 px"
                file={mobileFile} preview={mobilePreview}
                onFileChange={(e) => handleFileChange('mobile', e)}
                onClear={() => clearFile('mobile')}
              />
              <ImageUploadBox
                label="Desktop Image" icon={Monitor}
                dimension="1423 × 402 px"
                file={desktopFile} preview={desktopPreview}
                onFileChange={(e) => handleFileChange('desktop', e)}
                onClear={() => clearFile('desktop')}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Link URL (optional)</label>
              <input
                type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/personalised-holidays or https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox" id="banner-active" checked={active}
                onChange={(e) => setActive(e.target.checked)}
                style={{ accentColor: '#F5C518' }}
              />
              <label htmlFor="banner-active" className="text-sm text-gray-600">
                Active (visible on site)
              </label>
            </div>

            <button
              type="submit" disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-white text-sm font-semibold"
              style={{ backgroundColor: submitting ? '#D97706' : '#F5C518' }}
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? 'Saving…' : 'Save Banner'}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={28} className="animate-spin text-[#1E88E5]" />
        </div>
      ) : error ? (
        <p className="text-center text-red-400 text-sm py-8">{error}</p>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Monitor size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No banners yet. Click "Add Banner" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {banners.map((banner) => (
            <BannerCard
              key={banner._id} banner={banner}
              onToggle={handleToggle} onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

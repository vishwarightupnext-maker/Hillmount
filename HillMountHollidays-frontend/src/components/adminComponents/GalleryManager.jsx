import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, EyeOff, Upload, X, Loader2, Images } from 'lucide-react';
import { API, authHeaders, safeFetch } from './apiHelper';

const SECTIONS = [
  { id: 'side', label: 'Side Cards',    desc: 'Expandable cards beside the contact story (max 3)' },
  { id: 'row1', label: 'Marquee Row 1', desc: 'First scrolling row of the gallery' },
  { id: 'row2', label: 'Marquee Row 2', desc: 'Second scrolling row of the gallery' },
];

// ── Upload Form ───────────────────────────────────────────────────────────────
function UploadForm({ onUploaded, onCancel }) {
  const inputRef = useRef(null);
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState('');
  const [alt, setAlt]           = useState('');
  const [section, setSection]   = useState('row1');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const pickFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select an image.');
    setSubmitting(true);
    const fd = new FormData();
    fd.append('image',   file);
    fd.append('alt',     alt || 'gallery image');
    fd.append('section', section);
    const res = await safeFetch(`${API}/api/gallery`,
      { method: 'POST', headers: authHeaders(), body: fd }, navigate);
    setSubmitting(false);
    if (!res) return;
    const data = await res.json();
    if (data.success) { onUploaded(data.data); }
    else setError(data.message || 'Upload failed');
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Upload New Image</h3>
      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Image picker */}
        {preview ? (
          <div className="relative rounded-xl overflow-hidden border border-blue-300 group" style={{ height: '180px' }}>
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <button type="button" onClick={() => { setFile(null); setPreview(''); }}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={14} />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-white hover:bg-blue-50 transition-colors cursor-pointer"
            style={{ height: '140px' }}>
            <Upload size={22} className="text-[#1E88E5]" />
            <span className="text-xs text-[#1E88E5] font-medium">Click to select image</span>
            <span className="text-xs text-gray-400">JPG · PNG · WEBP · max 5 MB</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
          className="hidden" onChange={(e) => pickFile(e.target.files[0])}
          onDrop={(e) => { e.preventDefault(); pickFile(e.dataTransfer.files[0]); }} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Alt Text / Destination</label>
            <input value={alt} onChange={(e) => setAlt(e.target.value)}
              placeholder="e.g. Bali, Paris…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Section *</label>
            <select value={section} onChange={(e) => setSection(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] bg-white">
              {SECTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: submitting ? '#D97706' : '#F5C518' }}>
            {submitting && <Loader2 size={13} className="animate-spin" />}
            {submitting ? 'Uploading…' : 'Upload Image'}
          </button>
          <button type="button" onClick={onCancel}
            className="px-5 py-2 rounded-lg text-gray-600 text-sm border border-gray-300">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Image Card ────────────────────────────────────────────────────────────────
function ImageCard({ img, onToggle, onDelete }) {
  const sectionLabel = SECTIONS.find((s) => s.id === img.section)?.label || img.section;
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm group">
      <div className="relative" style={{ height: '140px' }}>
        <img src={`${API}${img.imageUrl}`} alt={img.alt}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }} />
        {!img.active && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">Hidden</span>
          </div>
        )}
      </div>
      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-700 truncate">{img.alt}</p>
          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-[#084298] border border-blue-200">
            {sectionLabel}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onToggle(img._id)}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title={img.active ? 'Hide' : 'Show'}>
            {img.active ? <Eye size={14} className="text-[#1E88E5]" /> : <EyeOff size={14} className="text-gray-400" />}
          </button>
          <button onClick={() => onDelete(img._id)}
            className="p-1.5 rounded hover:bg-red-50 text-red-300 hover:text-red-500 transition-colors"
            title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function GalleryManager() {
  const navigate = useNavigate();
  const [images, setImages]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeSection, setActiveSection] = useState('all');

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/api/gallery?all=1`);
      const data = await res.json();
      if (data.success) setImages(data.data);
      else setError('Failed to load gallery');
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUploaded = (img) => {
    setImages((prev) => [img, ...prev]);
    setShowForm(false);
  };

  const handleToggle = async (id) => {
    const res = await safeFetch(`${API}/api/gallery/${id}/toggle`,
      { method: 'PATCH', headers: authHeaders() }, navigate);
    if (!res) return;
    const data = await res.json();
    if (data.success) setImages((prev) => prev.map((i) => i._id === id ? data.data : i));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image? This cannot be undone.')) return;
    const res = await safeFetch(`${API}/api/gallery/${id}`,
      { method: 'DELETE', headers: authHeaders() }, navigate);
    if (!res) return;
    const data = await res.json();
    if (data.success) setImages((prev) => prev.filter((i) => i._id !== id));
  };

  const filtered = activeSection === 'all'
    ? images
    : images.filter((i) => i.section === activeSection);

  const countFor = (sec) => images.filter((i) => i.section === sec).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Gallery Manager</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Upload and manage images shown on the Contact page gallery
          </p>
        </div>
        <button onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: '#F5C518' }}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Upload Image'}
        </button>
      </div>

      {/* Section guide */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {SECTIONS.map((s) => (
          <div key={s.id} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
            <p className="text-xs font-semibold text-gray-700">{s.label}
              <span className="ml-1.5 text-[#1E88E5]">({countFor(s.id)})</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>

      {showForm && <UploadForm onUploaded={handleUploaded} onCancel={() => setShowForm(false)} />}

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
        {[{ id: 'all', label: `All (${images.length})` },
          ...SECTIONS.map((s) => ({ id: s.id, label: `${s.label} (${countFor(s.id)})` }))
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setActiveSection(id)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap"
            style={{
              backgroundColor: activeSection === id ? 'white' : 'transparent',
              color: activeSection === id ? '#1F2937' : '#6B7280',
              boxShadow: activeSection === id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={28} className="animate-spin text-[#1E88E5]" />
        </div>
      ) : error ? (
        <p className="text-center text-red-400 text-sm py-8">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Images size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No images yet. Click "Upload Image" to add one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <ImageCard key={img._id} img={img} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

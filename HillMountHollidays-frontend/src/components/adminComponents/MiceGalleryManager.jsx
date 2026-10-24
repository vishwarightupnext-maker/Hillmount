import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, EyeOff, Upload, X, Loader2, Pencil, Check } from 'lucide-react';
import { API, authHeaders, authJsonHeaders, safeFetch } from './apiHelper';

const SLOTS = [
  { id: 'left',      label: 'Left — Tall',         dim: '9:16 vertical  (e.g. 500 × 889 px)',  aspect: 'aspect-[9/16]' },
  { id: 'center-tl', label: 'Center Top-Left',      dim: 'Square 500 × 500 px',                 aspect: 'aspect-square' },
  { id: 'center-tr', label: 'Center Top-Right',     dim: 'Square 500 × 500 px',                 aspect: 'aspect-square' },
  { id: 'center-bl', label: 'Center Bottom-Left',   dim: 'Square 500 × 500 px',                 aspect: 'aspect-square' },
  { id: 'center-br', label: 'Center Bottom-Right',  dim: 'Square 500 × 500 px',                 aspect: 'aspect-square' },
  { id: 'right',     label: 'Right — Tall',         dim: '9:16 vertical  (e.g. 500 × 889 px)',  aspect: 'aspect-[9/16]' },
];

function UploadForm({ onUploaded, onCancel }) {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState('');
  const [slot, setSlot]         = useState('center-tl');
  const [label, setLabel]       = useState('');
  const [sublabel, setSublabel] = useState('');
  const [destination, setDestination]   = useState('');
  const [nights, setNights]             = useState('');
  const [startingFrom, setStartingFrom] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');

  const currentSlot = SLOTS.find((s) => s.id === slot);

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
    fd.append('image',    file);
    fd.append('slot',     slot);
    fd.append('label',    label);
    fd.append('sublabel', sublabel);
    fd.append('destination',  destination);
    fd.append('nights',       nights);
    fd.append('startingFrom', startingFrom);
    fd.append('alt',      label || slot);
    const res = await safeFetch(`${API}/api/mice-gallery`,
      { method: 'POST', headers: authHeaders(), body: fd }, navigate);
    setSubmitting(false);
    if (!res) return;
    const data = await res.json();
    if (data.success) onUploaded(data.data);
    else setError(data.message || 'Upload failed');
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Upload MICE Gallery Image</h3>
      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Slot selector */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Grid Slot *</label>
          <select value={slot} onChange={(e) => setSlot(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] bg-white">
            {SLOTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <p className="text-[11px] text-[#084298] mt-1 font-medium">
            Recommended: {currentSlot?.dim}
          </p>
        </div>

        {/* Image picker */}
        {preview ? (
          <div className={`relative rounded-xl overflow-hidden border border-blue-300 group w-32 ${currentSlot?.aspect}`}>
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <button type="button" onClick={() => { setFile(null); setPreview(''); }}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={12} />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-white hover:bg-blue-50 transition-colors cursor-pointer"
            style={{ height: '120px' }}>
            <Upload size={20} className="text-[#1E88E5]" />
            <span className="text-xs text-[#1E88E5] font-medium">Click to select image</span>
            <span className="text-xs text-gray-400">JPG · PNG · WEBP · max 5 MB</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
          className="hidden" onChange={(e) => pickFile(e.target.files[0])} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Label (e.g. "Corporate Events")</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)}
              placeholder="Overlay title…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sub-label (e.g. "Strategy & Meetings")</label>
            <input value={sublabel} onChange={(e) => setSublabel(e.target.value)}
              placeholder="Overlay subtitle…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
        </div>

        {/* Optional destination / nights / price overlay (e.g. "Goa · 3N · Starts from ₹20,000") */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Destination</label>
            <input value={destination} onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Goa"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">No. of Nights</label>
            <input type="number" min="0" value={nights} onChange={(e) => setNights(e.target.value)}
              placeholder="e.g. 3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Starting From (₹)</label>
            <input type="number" min="0" value={startingFrom} onChange={(e) => setStartingFrom(e.target.value)}
              placeholder="e.g. 20000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-medium bg-[#1E88E5] hover:bg-[#084298] transition disabled:opacity-60">
            {submitting && <Loader2 size={13} className="animate-spin" />}
            {submitting ? 'Uploading…' : 'Upload Image'}
          </button>
          <button type="button" onClick={onCancel}
            className="px-5 py-2 rounded-lg text-gray-600 text-sm border border-gray-300 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function EditForm({ img, onSaved, onCancel }) {
  const navigate = useNavigate();
  const [label, setLabel]               = useState(img.label || '');
  const [sublabel, setSublabel]         = useState(img.sublabel || '');
  const [destination, setDestination]   = useState(img.destination || '');
  const [nights, setNights]             = useState(img.nights ?? '');
  const [startingFrom, setStartingFrom] = useState(img.startingFrom ?? '');
  const [saving, setSaving]             = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await safeFetch(`${API}/api/mice-gallery/${img._id}`, {
      method: 'PUT',
      headers: authJsonHeaders(),
      body: JSON.stringify({
        label, sublabel, destination,
        nights:       nights       === '' ? null : Number(nights),
        startingFrom: startingFrom === '' ? null : Number(startingFrom),
      }),
    }, navigate);
    setSaving(false);
    if (!res) return;
    const data = await res.json();
    if (data.success) onSaved(data.data);
  };

  return (
    <div className="px-3 py-2.5 space-y-2 bg-blue-50">
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label"
        className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#1E88E5]" />
      <input value={sublabel} onChange={(e) => setSublabel(e.target.value)} placeholder="Sub-label"
        className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#1E88E5]" />
      <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination"
        className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#1E88E5]" />
      <div className="flex gap-2">
        <input type="number" min="0" value={nights} onChange={(e) => setNights(e.target.value)} placeholder="Nights"
          className="w-1/2 border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#1E88E5]" />
        <input type="number" min="0" value={startingFrom} onChange={(e) => setStartingFrom(e.target.value)} placeholder="₹ From"
          className="w-1/2 border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#1E88E5]" />
      </div>
      <div className="flex items-center gap-1 pt-1">
        <button onClick={handleSave} disabled={saving}
          className="p-1.5 rounded hover:bg-white transition-colors flex-1 flex justify-center disabled:opacity-60" title="Save">
          {saving ? <Loader2 size={13} className="animate-spin text-[#1E88E5]" /> : <Check size={13} className="text-emerald-600" />}
        </button>
        <button onClick={onCancel}
          className="p-1.5 rounded hover:bg-white transition-colors flex-1 flex justify-center" title="Cancel">
          <X size={13} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}

function ImageCard({ img, onToggle, onDelete, onSaved }) {
  const [editing, setEditing] = useState(false);
  const slot = SLOTS.find((s) => s.id === img.slot);
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm group">
      <div className="relative" style={{ height: '130px' }}>
        <img src={`${API}${img.imageUrl}`} alt={img.alt}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }} />
        {!img.active && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">Hidden</span>
          </div>
        )}
      </div>
      {editing ? (
        <EditForm
          img={img}
          onCancel={() => setEditing(false)}
          onSaved={(updated) => { onSaved(updated); setEditing(false); }}
        />
      ) : (
        <div className="px-3 py-2.5">
          <p className="text-xs font-semibold text-gray-700 truncate mb-1">{img.label || img.alt || '—'}</p>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-[#084298] border border-blue-200 block mb-2 w-fit">
            {slot?.label || img.slot}
          </span>
          {img.destination && (
            <p className="text-[10px] text-gray-500 mb-2">
              {img.destination}
              {img.nights ? ` · ${img.nights}N` : ''}
              {img.startingFrom ? ` · from ₹${Number(img.startingFrom).toLocaleString('en-IN')}` : ''}
            </p>
          )}
          <div className="flex items-center gap-1">
            <button onClick={() => setEditing(true)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors flex-1 flex justify-center"
              title="Edit">
              <Pencil size={13} className="text-gray-500" />
            </button>
            <button onClick={() => onToggle(img._id)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors flex-1 flex justify-center"
              title={img.active ? 'Hide' : 'Show'}>
              {img.active ? <Eye size={13} className="text-[#1E88E5]" /> : <EyeOff size={13} className="text-gray-400" />}
            </button>
            <button onClick={() => onDelete(img._id)}
              className="p-1.5 rounded hover:bg-red-50 text-red-300 hover:text-red-500 transition-colors flex-1 flex justify-center"
              title="Delete">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MiceGalleryManager() {
  const navigate = useNavigate();
  const [images, setImages]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeSlot, setActiveSlot] = useState('all');

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/api/mice-gallery?all=1`);
      const data = await res.json();
      if (data.success) setImages(data.data);
      else setError('Failed to load MICE gallery');
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
    const res = await safeFetch(`${API}/api/mice-gallery/${id}/toggle`,
      { method: 'PATCH', headers: authHeaders() }, navigate);
    if (!res) return;
    const data = await res.json();
    if (data.success) setImages((prev) => prev.map((i) => i._id === id ? data.data : i));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image? This cannot be undone.')) return;
    const res = await safeFetch(`${API}/api/mice-gallery/${id}`,
      { method: 'DELETE', headers: authHeaders() }, navigate);
    if (!res) return;
    const data = await res.json();
    if (data.success) setImages((prev) => prev.filter((i) => i._id !== id));
  };

  const handleSaved = (updated) => {
    setImages((prev) => prev.map((i) => i._id === updated._id ? updated : i));
  };

  const filtered = activeSlot === 'all' ? images : images.filter((i) => i.slot === activeSlot);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">MICE Gallery</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage the 6-slot photo collage on the MICE page</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg text-white text-sm font-medium bg-[#1E88E5] hover:bg-[#084298] transition">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Upload Image'}
        </button>
      </div>

      {/* Dimension guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-xs text-blue-700 space-y-1">
        <p className="font-bold mb-1">Image dimension guide:</p>
        <p>• <strong>Left / Right tall slots</strong> — 9:16 vertical, e.g. <code>500 × 889 px</code></p>
        <p>• <strong>4 centre slots</strong> — Square <code>500 × 500 px</code></p>
      </div>

      {showForm && <UploadForm onUploaded={handleUploaded} onCancel={() => setShowForm(false)} />}

      {/* Slot filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['all', ...SLOTS.map((s) => s.id)].map((s) => (
          <button key={s} onClick={() => setActiveSlot(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              activeSlot === s ? 'bg-[#1E88E5] text-black border-[#1E88E5]' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
            }`}>
            {s === 'all' ? `All (${images.length})` : (SLOTS.find((x) => x.id === s)?.label ?? s)}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-2 rounded-lg mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[#1E88E5]" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No images uploaded yet for this slot.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((img) => (
            <ImageCard key={img._id} img={img} onToggle={handleToggle} onDelete={handleDelete} onSaved={handleSaved} />
          ))}
        </div>
      )}
    </div>
  );
}

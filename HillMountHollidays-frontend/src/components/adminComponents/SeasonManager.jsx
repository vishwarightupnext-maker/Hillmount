import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, EyeOff, Upload, X, Loader2, GripVertical } from 'lucide-react';
import { API, authHeaders, safeFetch } from './apiHelper';

function UploadForm({ onUploaded, onCancel }) {
  const inputRef = useRef(null);
  const [file,        setFile]        = useState(null);
  const [preview,     setPreview]     = useState('');
  const [label,       setLabel]       = useState('');
  const [period,      setPeriod]      = useState('');
  const [subtitle,    setSubtitle]    = useState('');
  const [description, setDescription] = useState('');
  const [order,       setOrder]       = useState('0');
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState('');
  const navigate = useNavigate();

  const pickFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file)  return setError('Please select an image.');
    if (!label) return setError('Label is required.');
    setSubmitting(true);
    const fd = new FormData();
    fd.append('image',       file);
    fd.append('label',       label);
    fd.append('period',      period);
    fd.append('subtitle',    subtitle);
    fd.append('description', description);
    fd.append('order',       order);
    const res = await safeFetch(`${API}/api/seasons`,
      { method: 'POST', headers: authHeaders(), body: fd }, navigate);
    setSubmitting(false);
    if (!res) return;
    const data = await res.json();
    if (data.success) onUploaded(data.data);
    else setError(data.message || 'Upload failed');
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Add New Season</h3>
      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">

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
          className="hidden" onChange={(e) => pickFile(e.target.files[0])} />

        <div>
          <label className="block text-xs text-gray-500 mb-1">Season Label *</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. MARCH TO JUNE"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Period</label>
            <input value={period} onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g. Mar – Jun"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Display Order</label>
            <input type="number" value={order} onChange={(e) => setOrder(e.target.value)}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Subtitle</label>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Spring & Summer Escapes"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of this season…" rows="3"
            className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
        </div>

        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={submitting}
            className="flex items-center gap-1.5 bg-[#1E88E5] hover:bg-[#084298] text-black text-sm font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50">
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {submitting ? 'Uploading…' : 'Add Season'}
          </button>
          <button type="button" onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SeasonManager() {
  const [seasons,     setSeasons]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [deletingId,  setDeletingId]  = useState(null);
  const [togglingId,  setTogglingId]  = useState(null);
  const navigate = useNavigate();

  const fetchSeasons = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/seasons`);
      const data = await res.json();
      if (data.success) setSeasons(data.data);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchSeasons(); }, []);

  const handleUploaded = (newSeason) => {
    setSeasons((prev) => [newSeason, ...prev]);
    setShowForm(false);
  };

  const handleToggle = async (id) => {
    setTogglingId(id);
    const res = await safeFetch(`${API}/api/seasons/${id}/toggle`,
      { method: 'PATCH', headers: authHeaders() }, navigate);
    setTogglingId(null);
    if (!res) return;
    const data = await res.json();
    if (data.success) setSeasons((prev) => prev.map((s) => s._id === id ? data.data : s));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this season?')) return;
    setDeletingId(id);
    const res = await safeFetch(`${API}/api/seasons/${id}`,
      { method: 'DELETE', headers: authHeaders() }, navigate);
    setDeletingId(null);
    if (!res) return;
    const data = await res.json();
    if (data.success) setSeasons((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-gray-800">Season Manager</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage seasonal journey cards shown on the homepage</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-[#1E88E5] hover:bg-[#084298] text-black text-sm font-semibold px-4 py-2 rounded-lg transition">
            <Plus size={15} /> Add Season
          </button>
        )}
      </div>

      {showForm && (
        <UploadForm onUploaded={handleUploaded} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[#1E88E5]" />
        </div>
      ) : seasons.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No seasons yet. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {seasons.map((season) => (
            <div key={season._id}
              className={`rounded-xl border overflow-hidden shadow-sm transition-opacity ${season.active ? 'opacity-100' : 'opacity-60'}`}>
              <div className="relative h-40 bg-gray-100">
                <img src={`${API}${season.image}`} alt={season.label}
                  className="w-full h-full object-cover" />
                {!season.active && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold bg-black/60 px-2 py-0.5 rounded">Hidden</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wide truncate">{season.label}</p>
                    {season.period && <p className="text-[11px] text-gray-500">{season.period}</p>}
                    {season.subtitle && <p className="text-[11px] text-gray-600 mt-0.5 truncate">{season.subtitle}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleToggle(season._id)} disabled={!!togglingId}
                      title={season.active ? 'Hide' : 'Show'}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition">
                      {togglingId === season._id
                        ? <Loader2 size={14} className="animate-spin" />
                        : season.active ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => handleDelete(season._id)} disabled={deletingId === season._id}
                      title="Delete"
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition">
                      {deletingId === season._id
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <GripVertical size={12} className="text-gray-300" />
                  <span className="text-[10px] text-gray-400">Order: {season.order}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

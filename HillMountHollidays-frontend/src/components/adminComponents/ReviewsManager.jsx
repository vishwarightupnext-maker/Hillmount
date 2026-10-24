import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, Check, X, Loader2, Star, ToggleLeft, ToggleRight, Upload } from 'lucide-react';
import { API, authHeaders, authJsonHeaders, safeFetch } from './apiHelper';

const CATEGORIES = [
  'Women Special', 'Honeymoon Special', 'Senior Special', 'Personalised Holidays',
  'International Family Group Tour', 'Domestic Family Group Tour', 'Solo Trip',
  'Flight Tickets', 'Visa', 'Forex',
];
const RATINGS    = [1, 2, 3, 4, 5];

const emptyForm = { rating: 5, category: 'Women Special', destination: '', text: '', reviewer: '', date: '', active: true };

// ── Review Row ────────────────────────────────────────────────────────────────
function ReviewRow({ review, onDelete, onUpdate, onToggle, navigate }) {
  const [editing,  setEditing]  = useState(false);
  const [form,     setForm]     = useState({ ...review });
  const [saving,   setSaving]   = useState(false);
  const [toggling, setToggling] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const saveEdit = async () => {
    if (!form.destination.trim() || !form.text.trim() || !form.reviewer.trim() || !form.date.trim()) return;
    setSaving(true);
    try {
      const res = await safeFetch(
        `${API}/api/reviews/${review._id}`,
        { method: 'PUT', headers: authJsonHeaders(), body: JSON.stringify(form) },
        navigate,
      );
      if (!res) return;
      const data = await res.json();
      if (data.success) { onUpdate(data.data); setEditing(false); }
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const cancelEdit = () => { setForm({ ...review }); setEditing(false); };

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await safeFetch(
        `${API}/api/reviews/${review._id}/toggle`,
        { method: 'PATCH', headers: authJsonHeaders() },
        navigate,
      );
      if (!res) return;
      const data = await res.json();
      if (data.success) onToggle(data.data);
    } catch { /* silent */ }
    finally { setToggling(false); }
  };

  if (editing) {
    return (
      <div className="border border-blue-300 rounded-xl p-4 bg-blue-50 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Rating</label>
            <select value={form.rating} onChange={(e) => set('rating', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] bg-white">
              {RATINGS.map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] bg-white">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Destination *</label>
            <input value={form.destination} onChange={(e) => set('destination', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Reviewer Name *</label>
            <input value={form.reviewer} onChange={(e) => set('reviewer', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date *</label>
            <input value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="e.g. May, 2026"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id={`active-edit-${review._id}`} checked={form.active}
              onChange={(e) => set('active', e.target.checked)} className="accent-[#1E88E5] w-4 h-4" />
            <label htmlFor={`active-edit-${review._id}`} className="text-sm text-gray-600">Show on website</label>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Review Text *</label>
          <textarea value={form.text} onChange={(e) => set('text', e.target.value)} rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] resize-none" />
        </div>
        <div className="flex gap-2">
          <button onClick={saveEdit} disabled={saving}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-black text-xs font-medium bg-[#F5C518] hover:bg-[#1E88E5] transition">
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
          </button>
          <button onClick={cancelEdit}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-gray-600 text-xs border border-gray-300">
            <X size={12} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-xl p-4 ${review.active ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Reviewer avatar */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
            {review.image
              ? <img src={`${API}${review.image}`} alt={review.reviewer} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold uppercase">
                  {review.reviewer?.[0] || '?'}
                </div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={12} className="fill-[#1E88E5] text-[#1E88E5]" />
                ))}
              </div>
              <span className="bg-pink-50 border border-pink-200 text-pink-500 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                {review.category}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${review.active ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                {review.active ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <p className="font-semibold text-gray-800 text-sm">{review.destination}</p>
            <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">"{review.text}"</p>
            <p className="text-gray-400 text-xs mt-1">{review.reviewer} · {review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={handleToggle} disabled={toggling} title={review.active ? 'Hide' : 'Show'}
            className="text-gray-400 hover:text-[#1E88E5] transition-colors p-1.5 rounded hover:bg-blue-50">
            {toggling ? <Loader2 size={15} className="animate-spin" /> : review.active
              ? <ToggleRight size={15} className="text-green-500" />
              : <ToggleLeft size={15} />}
          </button>
          <button onClick={() => setEditing(true)} title="Edit"
            className="text-[#1E88E5] hover:text-[#084298] transition-colors p-1.5 rounded hover:bg-blue-50">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(review._id)} title="Delete"
            className="text-red-300 hover:text-red-500 transition-colors p-1.5 rounded hover:bg-red-50">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ReviewsManager() {
  const navigate = useNavigate();
  const imgRef   = useRef(null);

  const [reviews,     setReviews]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState(emptyForm);
  const [imgFile,     setImgFile]     = useState(null);
  const [imgPreview,  setImgPreview]  = useState('');
  const [formError,   setFormError]   = useState('');
  const [fetchError,  setFetchError]  = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const pickImage = (file) => {
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/api/reviews?all=1`);
      const data = await res.json();
      if (data.success) setReviews(data.data);
      else setFetchError('Failed to load reviews');
    } catch {
      setFetchError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImgFile(null);
    setImgPreview('');
    setFormError('');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.destination.trim() || !form.text.trim() || !form.reviewer.trim() || !form.date.trim())
      return setFormError('Destination, review text, reviewer name and date are required.');

    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.append('image', imgFile);

      const res = await safeFetch(
        `${API}/api/reviews`,
        { method: 'POST', headers: authHeaders(), body: fd },
        navigate,
      );
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => [data.data, ...prev]);
        resetForm();
        setShowForm(false);
      } else {
        setFormError(data.message || 'Failed to create review');
      }
    } catch {
      setFormError('Server error — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    const res = await safeFetch(
      `${API}/api/reviews/${id}`,
      { method: 'DELETE', headers: authJsonHeaders() },
      navigate,
    );
    if (!res) return;
    const data = await res.json();
    if (data.success) setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  const handleUpdate = (updated) => setReviews((prev) => prev.map((r) => r._id === updated._id ? updated : r));
  const handleToggle = (updated) => setReviews((prev) => prev.map((r) => r._id === updated._id ? updated : r));
  const visible = reviews.filter((r) => r.active).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Guest Reviews</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} · {visible} visible on site
          </p>
        </div>
        <button
          onClick={() => { setShowForm((s) => !s); resetForm(); }}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-black text-sm font-medium bg-[#F5C518] hover:bg-[#1E88E5] transition">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Review'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">New Review</h3>
          {formError && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded mb-3">{formError}</p>
          )}
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rating *</label>
                <select value={form.rating} onChange={(e) => set('rating', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] bg-white">
                  {RATINGS.map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category *</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] bg-white">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Destination *</label>
                <input value={form.destination} onChange={(e) => set('destination', e.target.value)}
                  placeholder="e.g. Kuala Lumpur Malaysia" required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Reviewer Name *</label>
                <input value={form.reviewer} onChange={(e) => set('reviewer', e.target.value)}
                  placeholder="e.g. Sandeep" required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date *</label>
                <input value={form.date} onChange={(e) => set('date', e.target.value)}
                  placeholder="e.g. May, 2026" required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="active-new" checked={form.active}
                  onChange={(e) => set('active', e.target.checked)} className="accent-[#1E88E5] w-4 h-4" />
                <label htmlFor="active-new" className="text-sm text-gray-600">Show on website</label>
              </div>
            </div>

            {/* Review text */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Review Text *</label>
              <textarea value={form.text} onChange={(e) => set('text', e.target.value)}
                placeholder="Write the guest's review here…" rows={3} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] resize-none" />
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Reviewer Photo (optional)</label>
              {imgPreview ? (
                <div className="relative inline-block group">
                  <img src={imgPreview} alt="preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-300" />
                  <button type="button"
                    onClick={() => { setImgFile(null); setImgPreview(''); }}
                    className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => imgRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-blue-300 rounded-lg text-xs text-[#084298] hover:bg-blue-50 transition">
                  <Upload size={14} /> Upload Photo
                </button>
              )}
              <input ref={imgRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                className="hidden" onChange={(e) => pickImage(e.target.files[0])} />
            </div>

            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-black text-sm font-semibold bg-[#F5C518] hover:bg-[#1E88E5] transition disabled:opacity-50">
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? 'Saving…' : 'Save Review'}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={28} className="animate-spin text-[#1E88E5]" />
        </div>
      ) : fetchError ? (
        <p className="text-center text-red-400 text-sm py-8">{fetchError}</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No reviews yet. Click "Add Review" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewRow
              key={review._id} review={review} navigate={navigate}
              onDelete={handleDelete} onUpdate={handleUpdate} onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

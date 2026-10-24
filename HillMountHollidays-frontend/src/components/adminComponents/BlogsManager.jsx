import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Pencil, Eye, Upload, X,
  Loader2, BookOpen, Globe, CheckCircle, XCircle,
} from 'lucide-react';
import { API, authHeaders, authJsonHeaders, safeFetch } from './apiHelper';
import RichTextEditor from './RichTextEditor';

// ── Cover image picker ────────────────────────────────────────────────────────
function CoverPicker({ file, preview, externalUrl, onFile, onClear, onUrl }) {
  const ref = useRef(null);
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">Cover Image</label>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-blue-300 group mb-2" style={{ height: '160px' }}>
          <img src={preview} alt="cover" className="w-full h-full object-cover" />
          <button type="button" onClick={onClear}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors mb-2"
          style={{ height: '120px' }}>
          <Upload size={20} className="text-[#1E88E5]" />
          <span className="text-xs text-[#1E88E5] font-medium">Upload cover image</span>
          <span className="text-xs text-gray-400">JPG · PNG · WEBP · max 5 MB</span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
        className="hidden" onChange={(e) => onFile(e.target.files[0])} />
      {!file && (
        <input type="url" value={externalUrl} onChange={(e) => onUrl(e.target.value)}
          placeholder="Or paste an image URL…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] mt-1" />
      )}
    </div>
  );
}

const INTEREST_FLAGS = [
  'Weekend Getaways', 'Honeymoon', 'Adventure', 'Nature', 'Photography',
  'Beach Holidays', 'Shopping', 'Festival', 'Solo Travel', 'Wildlife',
  'Food & Culinary', 'Spiritual', 'Budget Travel', 'Culture', 'Mountains', 'UNESCO Site',
];

// ── Blog Form ─────────────────────────────────────────────────────────────────
function BlogForm({ initial, onSave, onCancel, saving, readOnly = false }) {
  const [title,       setTitle]       = useState(initial?.title       || '');
  const [tag,         setTag]         = useState(initial?.tag         || '');
  const [destTags,    setDestTags]    = useState(() => {
    const d = initial?.destination || '';
    return d ? d.split(',').map((s) => s.trim()).filter(Boolean) : [];
  });
  const [destInput,   setDestInput]   = useState('');
  const [cityTags,    setCityTags]    = useState(() => {
    const c = initial?.city || '';
    return c ? c.split(',').map((s) => s.trim()).filter(Boolean) : [];
  });
  const [cityInput,   setCityInput]   = useState('');
  const [interests,   setInterests]   = useState(() => {
    if (Array.isArray(initial?.interests) && initial.interests.length) return initial.interests;
    if (initial?.interest) return [initial.interest];
    return [];
  });
  const [excerpt,     setExcerpt]     = useState(initial?.excerpt     || '');
  const [content,     setContent]     = useState(initial?.content     || '');
  const [author,      setAuthor]      = useState(initial?.author      || '');
  const [published,   setPublished]   = useState(initial?.published   ?? false);
  const [coverFile,   setCoverFile]   = useState(null);
  const [coverPreview,setCoverPreview]= useState(initial?.coverImage?.startsWith('/') ? `${API}${initial.coverImage}` : (initial?.coverImage || ''));
  const [externalUrl, setExternalUrl] = useState('');
  const [err,         setErr]         = useState('');

  const toggleInterestFlag = (flag) =>
    setInterests((prev) => prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]);

  const addDestTag = (val) => {
    if (!val) return;
    const items = val.split(',').map((s) => s.trim()).filter(Boolean);
    if (!items.length) return;
    setDestTags((prev) => {
      const next = [...prev];
      items.forEach((item) => {
        if (!next.includes(item)) next.push(item);
      });
      return next;
    });
    setDestInput('');
  };
  const removeDestTag = (t) => setDestTags((prev) => prev.filter((x) => x !== t));

  const addCityTag = (val) => {
    if (!val) return;
    const items = val.split(',').map((s) => s.trim()).filter(Boolean);
    if (!items.length) return;
    setCityTags((prev) => {
      const next = [...prev];
      items.forEach((item) => {
        if (!next.includes(item)) next.push(item);
      });
      return next;
    });
    setCityInput('');
  };
  const removeCityTag = (t) => setCityTags((prev) => prev.filter((x) => x !== t));

  const pickFile = (f) => {
    if (!f) return;
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
    setExternalUrl('');
  };

  const clearCover = () => { setCoverFile(null); setCoverPreview(''); setExternalUrl(''); };

  // Strip HTML tags & nbsp to get real visible text (used for validation)
  const plainText = (html) =>
    (html || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const handleSave = async () => {
    // 1. Auto-commit any pending inputs typed without pressing enter
    let currentDestTags = [...destTags];
    if (destInput.trim()) {
      const parts = destInput.split(',').map((s) => s.trim()).filter(Boolean);
      parts.forEach((p) => {
        if (!currentDestTags.includes(p)) currentDestTags.push(p);
      });
      setDestTags(currentDestTags);
      setDestInput('');
    }

    let currentCityTags = [...cityTags];
    if (cityInput.trim()) {
      const parts = cityInput.split(',').map((s) => s.trim()).filter(Boolean);
      parts.forEach((p) => {
        if (!currentCityTags.includes(p)) currentCityTags.push(p);
      });
      setCityTags(currentCityTags);
      setCityInput('');
    }

    // 2. Validate required fields with specific friendly feedback
    const missing = [];
    if (!title.trim()) missing.push('Title');
    if (!tag.trim()) missing.push('Tag / Category');
    if (currentDestTags.length === 0) missing.push('Destination');
    if (!author.trim()) missing.push('Author');
    if (!plainText(excerpt)) missing.push('Excerpt');

    if (missing.length > 0) {
      setErr(`Please fill in the required field${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}.`);
      return;
    }
    setErr('');

    const fd = new FormData();
    fd.append('title',       title.trim());
    fd.append('tag',         tag.trim());
    fd.append('destination', currentDestTags.join(', '));
    fd.append('city',        currentCityTags.join(', '));
    fd.append('interests',   JSON.stringify(interests));
    fd.append('excerpt',     excerpt.trim());
    fd.append('content',     content.trim());
    fd.append('author',      author.trim());
    fd.append('published',   String(published));
    if (coverFile) fd.append('coverImage', coverFile);
    else if (externalUrl) fd.append('coverImageUrl', externalUrl.trim());
    else if (initial?.coverImage) fd.append('coverImageUrl', initial.coverImage);

    const result = await onSave(fd);
    if (result && !result.success && result.error) {
      setErr(result.error);
    }
  };

  const isFieldMissing = (f) => {
    if (!err || readOnly) return false;
    if (f === 'title') return !title.trim();
    if (f === 'tag') return !tag.trim();
    if (f === 'destination') return destTags.length === 0 && !destInput.trim();
    if (f === 'author') return !author.trim();
    if (f === 'excerpt') return !plainText(excerpt);
    return false;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          {readOnly ? 'View Blog Post' : (initial ? 'Edit Blog Post' : 'New Blog Post')}
        </h3>
        {readOnly && (
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">View Only</span>
        )}
      </div>
      {err && !readOnly && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-lg mb-4 font-medium">
          <XCircle size={15} className="shrink-0 text-red-500" />
          <span>{err}</span>
        </div>
      )}

      <div className={readOnly ? 'pointer-events-none select-none opacity-90' : ''}>
        <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">
            Title * {isFieldMissing('title') && <span className="text-red-500 text-[11px]">(Required)</span>}
          </label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Wellness Tourism in Bali 2026"
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition ${
              isFieldMissing('title') ? 'border-red-400 bg-red-50/20 focus:border-red-500' : 'border-gray-300 focus:border-[#1E88E5]'
            }`} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Tag / Category * {isFieldMissing('tag') && <span className="text-red-500 text-[11px]">(Required)</span>}
          </label>
          <input value={tag} onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. Bali Travel Plan"
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition ${
              isFieldMissing('tag') ? 'border-red-400 bg-red-50/20 focus:border-red-500' : 'border-gray-300 focus:border-[#1E88E5]'
            }`} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Destination * <span className="text-gray-400">(press Enter or comma to add)</span>{' '}
            {isFieldMissing('destination') && <span className="text-red-500 text-[11px]">(Required)</span>}
          </label>
          <div className={`flex flex-wrap gap-1.5 min-h-[40px] w-full border rounded-lg px-2 py-1.5 bg-white transition ${
            isFieldMissing('destination') ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus-within:border-[#1E88E5]'
          }`}>
            {destTags.map((t) => (
              <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                {t}
                <button type="button" onClick={() => removeDestTag(t)} className="text-[#1E88E5] hover:text-[#084298] leading-none">
                  <X size={10} />
                </button>
              </span>
            ))}
            <input
              value={destInput}
              onChange={(e) => {
                const v = e.target.value;
                if (v.includes(',')) addDestTag(v);
                else setDestInput(v);
              }}
              onBlur={() => {
                if (destInput.trim()) addDestTag(destInput);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addDestTag(destInput);
                }
              }}
              placeholder={destTags.length === 0 ? 'e.g. Bali, Japan, Europe' : 'Add more…'}
              className="flex-1 min-w-[120px] outline-none text-sm py-0.5 bg-transparent"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">
            City <span className="text-gray-400">(optional filter — press Enter or comma to add)</span>
          </label>
          <div className="flex flex-wrap gap-1.5 min-h-[40px] w-full border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus-within:border-[#1E88E5] transition">
            {cityTags.map((t) => (
              <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                {t}
                <button type="button" onClick={() => removeCityTag(t)} className="text-blue-500 hover:text-blue-700 leading-none">
                  <X size={10} />
                </button>
              </span>
            ))}
            <input
              value={cityInput}
              onChange={(e) => {
                const v = e.target.value;
                if (v.includes(',')) addCityTag(v);
                else setCityInput(v);
              }}
              onBlur={() => {
                if (cityInput.trim()) addCityTag(cityInput);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCityTag(cityInput);
                }
              }}
              placeholder={cityTags.length === 0 ? 'e.g. Ubud, Brisbane, Kyoto' : 'Add more…'}
              className="flex-1 min-w-[120px] outline-none text-sm py-0.5 bg-transparent"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-2">
            Interest Flags <span className="text-gray-400">(select all that apply — used for filter)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INTEREST_FLAGS.map((flag) => (
              <label key={flag}
                className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border text-xs font-semibold transition-colors select-none ${
                  interests.includes(flag)
                    ? 'border-[#1E88E5] bg-blue-50 text-blue-800'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                }`}>
                <input type="checkbox" checked={interests.includes(flag)}
                  onChange={() => toggleInterestFlag(flag)}
                  style={{ accentColor: '#F5C518' }} className="flex-shrink-0" />
                {flag}
              </label>
            ))}
          </div>
          {interests.length > 0 && (
            <p className="text-[11px] text-[#084298] mt-2 font-medium">
              Selected: {interests.join(' · ')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Author * {isFieldMissing('author') && <span className="text-red-500 text-[11px]">(Required)</span>}
          </label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Bhumika"
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition ${
              isFieldMissing('author') ? 'border-red-400 bg-red-50/20 focus:border-red-500' : 'border-gray-300 focus:border-[#1E88E5]'
            }`} />
        </div>

        <div className="flex items-center gap-2 pt-5">
          <input type="checkbox" id="blog-published" checked={published}
            onChange={(e) => setPublished(e.target.checked)} style={{ accentColor: '#F5C518' }} />
          <label htmlFor="blog-published" className="text-sm text-gray-600">Publish immediately</label>
        </div>

        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">
            Excerpt * <span className="text-gray-400">(shown on card ~150 chars)</span>{' '}
            {isFieldMissing('excerpt') && <span className="text-red-500 text-[11px]">(Required)</span>}
          </label>
          <div className={isFieldMissing('excerpt') ? 'border border-red-400 rounded-lg p-0.5 bg-red-50/20' : ''}>
            <RichTextEditor
              value={excerpt}
              onChange={setExcerpt}
              placeholder="Short description shown on the blog listing card…"
              minHeight={96}
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Full Content <span className="text-gray-400">(optional)</span></label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write the full article here…"
            minHeight={200}
          />
        </div>

        <div className="col-span-2">
          <CoverPicker
            file={coverFile} preview={coverPreview} externalUrl={externalUrl}
            onFile={pickFile} onClear={clearCover} onUrl={setExternalUrl} />
        </div>
        </div>
      </div>

      <div className="flex gap-3">
        {!readOnly && (
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: saving ? '#D97706' : '#F5C518' }}>
            {saving && <Loader2 size={13} className="animate-spin" />}
            {saving ? 'Saving…' : 'Save Post'}
          </button>
        )}
        <button onClick={onCancel}
          className="px-5 py-2 rounded-lg text-gray-600 text-sm border border-gray-300">
          {readOnly ? 'Close' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}

// ── Blog Row ──────────────────────────────────────────────────────────────────
function BlogRow({ blog, onEdit, onView, onDelete, onToggle, canEdit = true }) {
  const imgSrc = blog.coverImage
    ? (blog.coverImage.startsWith('/') ? `${API}${blog.coverImage}` : blog.coverImage)
    : null;

  return (
    <div className="flex items-start gap-4 border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-gray-100">
        {imgSrc
          ? <img src={imgSrc} alt={blog.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          : <div className="w-full h-full flex items-center justify-center"><BookOpen size={18} className="text-gray-300" /></div>}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-xs px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider"
            style={{ backgroundColor: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' }}>
            {blog.tag}
          </span>
          {(Array.isArray(blog.interests) ? blog.interests : (blog.interest ? [blog.interest] : [])).map((flag) => (
            <span key={flag} className="text-xs px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider"
              style={{ backgroundColor: flag === 'MICE' ? '#FEF9C3' : '#EFF6FF', color: flag === 'MICE' ? '#713F12' : '#1D4ED8', border: `1px solid ${flag === 'MICE' ? '#FDE047' : '#BFDBFE'}` }}>
              {flag}
            </span>
          ))}
          <span className="flex items-center gap-1 text-xs font-medium"
            style={{ color: blog.published ? '#16A34A' : '#9CA3AF' }}>
            {blog.published ? <CheckCircle size={11} /> : <XCircle size={11} />}
            {blog.published ? 'Published' : 'Draft'}
          </span>
        </div>
        <p className="text-sm font-semibold text-gray-800 truncate">{blog.title}</p>
        {blog.city && (
          <div className="flex flex-wrap gap-1 mt-1">
            {blog.city.split(',').map((c) => c.trim()).filter(Boolean).map((c) => (
              <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                {c}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          {blog.destination} · by {blog.author} · {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {canEdit && (blog.published ? (
          <button onClick={() => onToggle(blog._id)}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
            title="Click to unpublish">
            <Eye size={12} /> Unpublish
          </button>
        ) : (
          <button onClick={() => onToggle(blog._id)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold text-black transition-colors"
            style={{ backgroundColor: '#F5C518', border: '1px solid #D97706' }}
            title="Click to publish — makes it visible on the website">
            <Eye size={12} /> Publish
          </button>
        ))}
        {canEdit && (
          <button onClick={() => onEdit(blog)}
            className="p-1.5 rounded hover:bg-blue-50 text-[#1E88E5] hover:text-[#084298] transition-colors" title="Edit">
            <Pencil size={15} />
          </button>
        )}
        {canEdit && (
          <button onClick={() => onDelete(blog._id)}
            className="p-1.5 rounded hover:bg-red-50 text-red-300 hover:text-red-500 transition-colors" title="Delete">
            <Trash2 size={15} />
          </button>
        )}
        {!canEdit && (
          <button onClick={() => onView(blog)}
            className="p-1.5 rounded hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors" title="View">
            <Eye size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BlogsManager({ canEdit = true }) {
  const navigate = useNavigate();
  const [blogs,     setBlogs]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [editBlog,  setEditBlog]  = useState(null);
  const [viewBlog,  setViewBlog]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [filterPub,  setFilterPub]  = useState('all'); // 'all' | 'published' | 'draft'
  const [filterMice, setFilterMice] = useState(false);

  const scrollTop = () => document.getElementById('admin-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/api/blogs?all=1`);
      const data = await res.json();
      if (data.success) setBlogs(data.data);
      else setError('Failed to load blogs');
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleCreate = async (fd) => {
    try {
      setSaving(true);
      const res = await safeFetch(`${API}/api/blogs`,
        { method: 'POST', headers: authHeaders(), body: fd }, navigate);
      setSaving(false);
      if (!res) return { success: false, error: 'Authentication failed. Please log in again.' };
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setBlogs((p) => [data.data, ...p]);
        setShowForm(false);
        return { success: true };
      }
      return { success: false, error: data.message || `Failed to create blog post (${res.status})` };
    } catch (err) {
      setSaving(false);
      return { success: false, error: err.message || 'Network error while creating blog post' };
    }
  };

  const handleUpdate = async (fd) => {
    try {
      setSaving(true);
      const res = await safeFetch(`${API}/api/blogs/${editBlog._id}`,
        { method: 'PUT', headers: authHeaders(), body: fd }, navigate);
      setSaving(false);
      if (!res) return { success: false, error: 'Authentication failed. Please log in again.' };
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setBlogs((p) => p.map((b) => b._id === editBlog._id ? data.data : b));
        setEditBlog(null);
        return { success: true };
      }
      return { success: false, error: data.message || `Failed to update blog post (${res.status})` };
    } catch (err) {
      setSaving(false);
      return { success: false, error: err.message || 'Network error while updating blog post' };
    }
  };

  const handleToggle = async (id) => {
    const res = await safeFetch(`${API}/api/blogs/${id}/publish`,
      { method: 'PATCH', headers: authJsonHeaders() }, navigate);
    if (!res) return;
    const data = await res.json();
    if (data.success) setBlogs((p) => p.map((b) => b._id === id ? data.data : b));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post? This cannot be undone.')) return;
    const res = await safeFetch(`${API}/api/blogs/${id}`,
      { method: 'DELETE', headers: authHeaders() }, navigate);
    if (!res) return;
    const data = await res.json();
    if (data.success) setBlogs((p) => p.filter((b) => b._id !== id));
  };

  const isMice = (b) =>
    (Array.isArray(b.interests) && b.interests.some((f) => f.toLowerCase() === 'mice')) ||
    b.interest?.toLowerCase() === 'mice';

  const displayed = blogs.filter((b) => {
    const pubMatch  = filterPub === 'all' ? true : filterPub === 'published' ? b.published : !b.published;
    const miceMatch = !filterMice || isMice(b);
    return pubMatch && miceMatch;
  });

  const pubCount   = blogs.filter((b) => b.published).length;
  const draftCount = blogs.filter((b) => !b.published).length;
  const miceCount  = blogs.filter(isMice).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Blog Posts</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {pubCount} published · {draftCount} draft{draftCount !== 1 ? 's' : ''}
          </p>
        </div>
        {canEdit && (
          <button onClick={() => { setShowForm((s) => !s); setEditBlog(null); }}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: '#F5C518' }}>
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'New Post'}
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && !editBlog && (
        <BlogForm onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
      )}

      {/* Edit form */}
      {editBlog && (
        <BlogForm initial={editBlog} onSave={handleUpdate}
          onCancel={() => setEditBlog(null)} saving={saving} />
      )}

      {/* View-only form (sub-admin with view access) */}
      {viewBlog && (
        <BlogForm initial={viewBlog} readOnly onCancel={() => setViewBlog(null)} saving={false} onSave={() => {}} />
      )}

      {/* Filter tabs + MICE checkbox */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[{ id: 'all', label: `All (${blogs.length})` },
            { id: 'published', label: `Published (${pubCount})` },
            { id: 'draft', label: `Drafts (${draftCount})` },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setFilterPub(id)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap"
              style={{
                backgroundColor: filterPub === id ? 'white' : 'transparent',
                color: filterPub === id ? '#1F2937' : '#6B7280',
                boxShadow: filterPub === id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}>
              {label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors">
          <input type="checkbox" checked={filterMice} onChange={(e) => setFilterMice(e.target.checked)}
            style={{ accentColor: '#F5C518' }} />
          <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
            MICE{miceCount > 0 ? ` (${miceCount})` : ''}
          </span>
        </label>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-[#1E88E5]" /></div>
      ) : error ? (
        <p className="text-center text-red-400 text-sm py-8">{error}</p>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Globe size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No posts yet. Click "New Post" to write one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((blog) => (
            <BlogRow key={blog._id} blog={blog}
              onEdit={(b) => { setEditBlog(b); setShowForm(false); setViewBlog(null); scrollTop(); }}
              onView={(b) => { setViewBlog(b); setEditBlog(null); setShowForm(false); scrollTop(); }}
              onDelete={handleDelete} onToggle={handleToggle} canEdit={canEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

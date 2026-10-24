import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, Check, X, ChevronDown, ChevronUp, Loader2, Home, Briefcase } from 'lucide-react';
import { API, authJsonHeaders, safeFetch } from './apiHelper';

const CATEGORIES_LIST = [
  "General Enquiries",
  "Booking & Payment",
  "Flights",
  "Hotels",
  "Food",
  "Road Travel on Tour",
  "On Tour",
  "Visa",
  "Insurance",
  "Personalised Holidays",
  "Cancellation & Refund",
  "Foreign Exchange (Forex)",
  "Feedback"
];

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({ faq, onDelete, onUpdate, navigate, homeCount, miceCount }) {
  const [open, setOpen]             = useState(false);
  const [editing, setEditing]       = useState(false);
  const [question, setQuestion]     = useState(faq.question);
  const [answer, setAnswer]         = useState(faq.answer);
  const [category, setCategory]     = useState(faq.category || 'General Enquiries');
  const [showOnHome, setShowOnHome] = useState(!!faq.showOnHome);
  const [showOnMice, setShowOnMice] = useState(!!faq.showOnMice);
  const [saving, setSaving]         = useState(false);
  const [toggling, setToggling]     = useState(false);
  const [togglingMice, setTogglingMice] = useState(false);

  const saveEdit = async () => {
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);
    try {
      const res = await safeFetch(
        `${API}/api/faqs/${faq._id}`,
        { method: 'PUT', headers: authJsonHeaders(), body: JSON.stringify({ question, answer, category, showOnHome, showOnMice }) },
        navigate,
      );
      if (!res) return;
      const data = await res.json();
      if (data.success) { onUpdate(data.data); setEditing(false); }
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const cancelEdit = () => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || 'General Enquiries');
    setShowOnHome(!!faq.showOnHome);
    setShowOnMice(!!faq.showOnMice);
    setEditing(false);
  };

  const toggleHome = async (e) => {
    e.stopPropagation();
    if (!faq.showOnHome && homeCount >= 5) {
      alert('Only 5 FAQs can be shown on the home page. Uncheck another one first.');
      return;
    }
    setToggling(true);
    try {
      const res = await safeFetch(
        `${API}/api/faqs/${faq._id}`,
        { method: 'PUT', headers: authJsonHeaders(), body: JSON.stringify({ showOnHome: !faq.showOnHome }) },
        navigate,
      );
      if (!res) return;
      const data = await res.json();
      if (data.success) { onUpdate(data.data); setShowOnHome(data.data.showOnHome); }
    } catch { /* silent */ }
    finally { setToggling(false); }
  };

  const toggleMice = async (e) => {
    e.stopPropagation();
    if (!faq.showOnMice && miceCount >= 5) {
      alert('Only 5 FAQs can be shown on the MICE page. Uncheck another one first.');
      return;
    }
    setTogglingMice(true);
    try {
      const res = await safeFetch(
        `${API}/api/faqs/${faq._id}`,
        { method: 'PUT', headers: authJsonHeaders(), body: JSON.stringify({ showOnMice: !faq.showOnMice }) },
        navigate,
      );
      if (!res) return;
      const data = await res.json();
      if (data.success) { onUpdate(data.data); setShowOnMice(data.data.showOnMice); }
    } catch { /* silent */ }
    finally { setTogglingMice(false); }
  };

  if (editing) {
    return (
      <div className="border border-blue-300 rounded-xl p-4 bg-blue-50">
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Question</label>
            <input
              value={question} onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Answer</label>
            <textarea
              value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] bg-white"
            >
              {CATEGORIES_LIST.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox" checked={showOnHome}
              onChange={(e) => setShowOnHome(e.target.checked)}
              className="accent-[#1E88E5] w-4 h-4 cursor-pointer"
            />
            <span className="text-xs text-gray-600 font-medium">Show on Home page</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox" checked={showOnMice}
              onChange={(e) => setShowOnMice(e.target.checked)}
              className="accent-[#1E88E5] w-4 h-4 cursor-pointer"
            />
            <span className="text-xs text-gray-600 font-medium">Show on MICE page</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={saveEdit} disabled={saving}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-white text-xs font-medium"
              style={{ backgroundColor: '#F5C518' }}
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-gray-600 text-xs border border-gray-300"
            >
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-800 pr-4 flex-grow flex items-center flex-wrap gap-2">
          <span>{faq.question}</span>
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-blue-600 bg-blue-50 rounded-full uppercase">
            {faq.category || 'General Enquiries'}
          </span>
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={toggleHome} disabled={toggling}
            title={faq.showOnHome ? 'Remove from Home page' : 'Show on Home page'}
            className={`p-1.5 rounded transition-colors ${faq.showOnHome ? 'text-[#1E88E5] bg-blue-50 hover:bg-blue-100' : 'text-gray-300 hover:text-[#1E88E5] hover:bg-blue-50'}`}
          >
            {toggling ? <Loader2 size={14} className="animate-spin" /> : <Home size={14} />}
          </button>
          <button
            onClick={toggleMice} disabled={togglingMice}
            title={faq.showOnMice ? 'Remove from MICE page' : 'Show on MICE page'}
            className={`p-1.5 rounded transition-colors ${faq.showOnMice ? 'text-[#1E88E5] bg-blue-50 hover:bg-blue-100' : 'text-gray-300 hover:text-[#1E88E5] hover:bg-blue-50'}`}
          >
            {togglingMice ? <Loader2 size={14} className="animate-spin" /> : <Briefcase size={14} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(true); setOpen(false); }}
            className="text-[#1E88E5] hover:text-[#084298] transition-colors p-1.5 rounded hover:bg-blue-50"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(faq._id); }}
            className="text-red-300 hover:text-red-500 transition-colors p-1.5 rounded hover:bg-red-50"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
          {open
            ? <ChevronUp size={16} className="text-gray-400 ml-1" />
            : <ChevronDown size={16} className="text-gray-400 ml-1" />}
        </div>
      </button>
      {open && (
        <div
          className="px-5 pb-4 text-sm text-gray-600"
          style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px', lineHeight: '1.7' }}
        >
          {faq.answer}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function FaqManager() {
  const navigate = useNavigate();

  const [faqs, setFaqs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [question, setQuestion]     = useState('');
  const [answer, setAnswer]         = useState('');
  const [category, setCategory]     = useState('General Enquiries');
  const [formError, setFormError]   = useState('');
  const [fetchError, setFetchError] = useState('');

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/faqs`);
      const data = await res.json();
      if (data.success) setFaqs(data.data);
      else setFetchError('Failed to load FAQs');
    } catch {
      setFetchError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!question.trim() || !answer.trim())
      return setFormError('Both question and answer are required.');

    try {
      setSubmitting(true);
      const res = await safeFetch(
        `${API}/api/faqs`,
        { method: 'POST', headers: authJsonHeaders(), body: JSON.stringify({ question, answer, category }) },
        navigate,
      );
      if (!res) return; // 401 → already redirected

      const data = await res.json();
      if (data.success) {
        setFaqs((prev) => [data.data, ...prev]);
        setQuestion(''); setAnswer(''); setCategory('General Enquiries'); setShowForm(false);
      } else {
        setFormError(data.message || 'Failed to create FAQ');
      }
    } catch {
      setFormError('Server error — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    const res = await safeFetch(
      `${API}/api/faqs/${id}`,
      { method: 'DELETE', headers: authJsonHeaders() },
      navigate,
    );
    if (!res) return;
    const data = await res.json();
    if (data.success) setFaqs((prev) => prev.filter((f) => f._id !== id));
  };

  const handleUpdate = (updated) =>
    setFaqs((prev) => prev.map((f) => f._id === updated._id ? updated : f));

  const homeCount = faqs.filter((f) => f.showOnHome).length;
  const miceCount = faqs.filter((f) => f.showOnMice).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">FAQ Management</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {faqs.length} question{faqs.length !== 1 ? 's' : ''} · click any row to expand ·{' '}
            <span className={homeCount >= 5 ? 'text-[#1E88E5] font-semibold' : 'text-green-600 font-semibold'}>
              {homeCount}/5 on Home
            </span>
            {' '}·{' '}
            <span className={miceCount >= 5 ? 'text-[#1E88E5] font-semibold' : 'text-green-600 font-semibold'}>
              {miceCount}/5 on MICE
            </span>
          </p>
        </div>
        <button
          onClick={() => { setShowForm((s) => !s); setFormError(''); }}
          className="flex items-center gap-2 px-4 cursor-pointer py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: '#F5C518' }}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add FAQ'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">New FAQ</h3>
          {formError && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded mb-3">
              {formError}
            </p>
          )}
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Question *</label>
              <input
                type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. What destinations does HillMount cover?" required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Answer *</label>
              <textarea
                value={answer} onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write a detailed answer here…" rows={4} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Category *</label>
              <select
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] bg-white"
              >
                {CATEGORIES_LIST.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              type="submit" disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-white text-sm font-semibold"
              style={{ backgroundColor: submitting ? '#D97706' : '#F5C518' }}
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? 'Saving…' : 'Save FAQ'}
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
      ) : faqs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No FAQs yet. Click "Add FAQ" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <FaqItem
              key={faq._id} faq={faq} navigate={navigate}
              onDelete={handleDelete} onUpdate={handleUpdate}
              homeCount={homeCount}
              miceCount={miceCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}

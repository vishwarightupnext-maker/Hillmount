import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { API, authJsonHeaders, safeFetch } from './apiHelper';

export default function MarqueeManager() {
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [text,       setText]       = useState('');
  const [order,      setOrder]      = useState('0');
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/marquee?all=1`);
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return setFormError('Text is required.');
    setSaving(true);
    setFormError('');
    const res = await safeFetch(`${API}/api/marquee`,
      { method: 'POST', headers: authJsonHeaders(), body: JSON.stringify({ text: text.trim(), order: Number(order) }) },
      navigate);
    setSaving(false);
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setItems((prev) => [...prev, data.data].sort((a, b) => a.order - b.order));
      setText(''); setOrder('0'); setShowForm(false);
    } else {
      setFormError(data.message || 'Save failed');
    }
  };

  const handleToggle = async (id) => {
    setTogglingId(id);
    const res = await safeFetch(`${API}/api/marquee/${id}/toggle`,
      { method: 'PATCH', headers: authJsonHeaders() }, navigate);
    setTogglingId(null);
    if (!res) return;
    const data = await res.json();
    if (data.success) setItems((prev) => prev.map((it) => it._id === id ? data.data : it));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this marquee item?')) return;
    setDeletingId(id);
    const res = await safeFetch(`${API}/api/marquee/${id}`,
      { method: 'DELETE', headers: authJsonHeaders() }, navigate);
    setDeletingId(null);
    if (!res) return;
    const data = await res.json();
    if (data.success) setItems((prev) => prev.filter((it) => it._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-gray-800">Marquee Manager</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage the scrolling text banner on the homepage</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-[#1E88E5] hover:bg-[#084298] text-black text-sm font-semibold px-4 py-2 rounded-lg transition">
            <Plus size={15} /> Add Item
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">New Marquee Item</h3>
            <button onClick={() => { setShowForm(false); setFormError(''); }} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
          {formError && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded mb-3">{formError}</p>}
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Text *</label>
              <input value={text} onChange={(e) => setText(e.target.value)}
                placeholder="e.g. HillMount Holidays"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Order</label>
              <input type="number" min="0" value={order} onChange={(e) => setOrder(e.target.value)}
                className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving}
                className="flex items-center gap-1.5 bg-[#1E88E5] hover:bg-[#084298] text-black text-sm font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50">
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                {saving ? 'Saving…' : 'Add'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setFormError(''); }}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[#1E88E5]" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No marquee items yet.</div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item._id}
              className={`flex items-center justify-between gap-3 border rounded-xl px-4 py-3 transition ${item.active ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] font-mono text-gray-400 flex-shrink-0">#{item.order}</span>
                <p className="text-sm font-medium text-gray-800 truncate">{item.text}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${item.active ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                  {item.active ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => handleToggle(item._id)} disabled={!!togglingId}
                  title={item.active ? 'Hide' : 'Show'}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition">
                  {togglingId === item._id ? <Loader2 size={14} className="animate-spin" /> : item.active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => handleDelete(item._id)} disabled={deletingId === item._id}
                  title="Delete"
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition">
                  {deletingId === item._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

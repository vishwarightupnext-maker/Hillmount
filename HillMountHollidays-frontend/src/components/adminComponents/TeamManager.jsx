import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, Check, X, Loader2, ToggleLeft, ToggleRight, Upload } from 'lucide-react';
import { API, authHeaders, safeFetch } from './apiHelper';

const emptyForm = { name: '', role: '', linkedin: '', order: 0, active: true };

// ── Team Member Row ────────────────────────────────────────────────────────────
function MemberRow({ member, onDelete, onUpdate, onToggle, navigate }) {
  const [editing,  setEditing]  = useState(false);
  const [form,     setForm]     = useState({ name: member.name, role: member.role, linkedin: member.linkedin, order: member.order, active: member.active });
  const [imgFile,    setImgFile]    = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [toggling, setToggling] = useState(false);
  const editImgRef = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const pickImage = (file) => {
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const saveEdit = async () => {
    if (!form.name.trim() || !form.role.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.append('image', imgFile);

      const res = await safeFetch(
        `${API}/api/team/${member._id}`,
        { method: 'PUT', headers: authHeaders(), body: fd },
        navigate,
      );
      if (!res) return;
      const data = await res.json();
      if (data.success) { onUpdate(data.data); setEditing(false); setImgFile(null); setImgPreview(''); }
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const cancelEdit = () => {
    setForm({ name: member.name, role: member.role, linkedin: member.linkedin, order: member.order, active: member.active });
    setImgFile(null);
    setImgPreview('');
    setEditing(false);
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await safeFetch(
        `${API}/api/team/${member._id}/toggle`,
        { method: 'PATCH', headers: authHeaders() },
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
            <label className="block text-xs text-gray-500 mb-1">Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Designation *</label>
            <input value={form.role} onChange={(e) => set('role', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">LinkedIn URL (optional)</label>
            <input value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)}
              placeholder="https://www.linkedin.com/in/…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id={`active-edit-${member._id}`} checked={form.active}
              onChange={(e) => set('active', e.target.checked)} className="accent-[#1E88E5] w-4 h-4" />
            <label htmlFor={`active-edit-${member._id}`} className="text-sm text-gray-600">Show on website</label>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Photo</label>
          {imgPreview ? (
            <div className="relative inline-block group">
              <img src={imgPreview} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-blue-300" />
              <button type="button" onClick={() => { setImgFile(null); setImgPreview(''); }}
                className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <img src={`${API}${member.image}`} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
              <button type="button" onClick={() => editImgRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-blue-300 rounded-lg text-xs text-[#084298] hover:bg-blue-50 transition">
                <Upload size={13} /> Replace Photo
              </button>
            </div>
          )}
          <input ref={editImgRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
            className="hidden" onChange={(e) => pickImage(e.target.files[0])} />
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
    <div className={`border rounded-xl p-4 ${member.active ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
            <img src={`${API}${member.image}`} alt={member.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${member.active ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                {member.active ? 'Visible' : 'Hidden'}
              </span>
              <span className="text-[10px] text-gray-400">Order: {member.order}</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
            <p className="text-gray-500 text-xs mt-0.5">{member.role}</p>
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-[#1E88E5] text-xs hover:underline mt-1 inline-block break-all">
                {member.linkedin}
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={handleToggle} disabled={toggling} title={member.active ? 'Hide' : 'Show'}
            className="text-gray-400 hover:text-[#1E88E5] transition-colors p-1.5 rounded hover:bg-blue-50">
            {toggling ? <Loader2 size={15} className="animate-spin" /> : member.active
              ? <ToggleRight size={15} className="text-green-500" />
              : <ToggleLeft size={15} />}
          </button>
          <button onClick={() => setEditing(true)} title="Edit"
            className="text-[#1E88E5] hover:text-[#084298] transition-colors p-1.5 rounded hover:bg-blue-50">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(member._id)} title="Delete"
            className="text-red-300 hover:text-red-500 transition-colors p-1.5 rounded hover:bg-red-50">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TeamManager() {
  const navigate = useNavigate();
  const imgRef   = useRef(null);

  const [members,     setMembers]     = useState([]);
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

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/api/team?all=1`);
      const data = await res.json();
      if (data.success) setMembers(data.data);
      else setFetchError('Failed to load team members');
    } catch {
      setFetchError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImgFile(null);
    setImgPreview('');
    setFormError('');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim() || !form.role.trim())
      return setFormError('Name and designation are required.');
    if (!imgFile)
      return setFormError('Please upload a photo.');

    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('image', imgFile);

      const res = await safeFetch(
        `${API}/api/team`,
        { method: 'POST', headers: authHeaders(), body: fd },
        navigate,
      );
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        setMembers((prev) => [...prev, data.data].sort((a, b) => a.order - b.order));
        resetForm();
        setShowForm(false);
      } else {
        setFormError(data.message || 'Failed to add team member');
      }
    } catch {
      setFormError('Server error — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    const res = await safeFetch(
      `${API}/api/team/${id}`,
      { method: 'DELETE', headers: authHeaders() },
      navigate,
    );
    if (!res) return;
    const data = await res.json();
    if (data.success) setMembers((prev) => prev.filter((m) => m._id !== id));
  };

  const handleUpdate = (updated) => setMembers((prev) => prev.map((m) => m._id === updated._id ? updated : m).sort((a, b) => a.order - b.order));
  const handleToggle = (updated) => setMembers((prev) => prev.map((m) => m._id === updated._id ? updated : m));
  const visible = members.filter((m) => m.active).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Meet the Team</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {members.length} member{members.length !== 1 ? 's' : ''} · {visible} visible on site — shown on the About Us page.
          </p>
        </div>
        <button
          onClick={() => { setShowForm((s) => !s); resetForm(); }}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-black text-sm font-medium bg-[#F5C518] hover:bg-[#1E88E5] transition">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Team Member'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">New Team Member</h3>
          {formError && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded mb-3">{formError}</p>
          )}
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Ramaswamy Subbiah" required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Designation *</label>
                <input value={form.role} onChange={(e) => set('role', e.target.value)}
                  placeholder="e.g. Chief Operating Officer" required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">LinkedIn URL (optional)</label>
                <input value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)}
                  placeholder="https://www.linkedin.com/in/…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Order (lower shows first)</label>
                <input type="number" value={form.order} onChange={(e) => set('order', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="active-new" checked={form.active}
                  onChange={(e) => set('active', e.target.checked)} className="accent-[#1E88E5] w-4 h-4" />
                <label htmlFor="active-new" className="text-sm text-gray-600">Show on website</label>
              </div>
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Photo *</label>
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
              {submitting ? 'Saving…' : 'Save Team Member'}
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
      ) : members.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No team members yet. Click "Add Team Member" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <MemberRow
              key={member._id} member={member} navigate={navigate}
              onDelete={handleDelete} onUpdate={handleUpdate} onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

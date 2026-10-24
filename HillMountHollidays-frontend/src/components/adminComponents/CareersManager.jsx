import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Pencil, Check, X, Loader2,
  Eye, EyeOff, Briefcase, FileText, ChevronDown, ChevronUp,
} from 'lucide-react';
import { API, authHeaders, authJsonHeaders, safeFetch } from './apiHelper';

const STATUS_COLORS = {
  pending:     { bg: '#FEF9E7', border: '#FDE68A', text: '#D97706' },
  reviewed:    { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' },
  shortlisted: { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A' },
  rejected:    { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const linesToArray = (str) =>
  str.split('\n').map((s) => s.trim()).filter(Boolean);

const arrayToLines = (arr) =>
  (arr || []).join('\n');

// ── Job Form (create / edit) ──────────────────────────────────────────────────
function JobForm({ initial, onSave, onCancel, saving }) {
  const empty = {
    category: '', title: '', type: 'Full Time', location: 'Mumbai',
    department: '', employmentType: 'Full Time Employee',
    eligibilityText: '', workText: '', active: true,
  };
  const [form, setForm] = useState(
    initial
      ? { ...initial, eligibilityText: arrayToLines(initial.eligibility), workText: arrayToLines(initial.workWillInclude) }
      : empty
  );
  const [err, setErr] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.category.trim() || !form.title.trim() || !form.location.trim() || !form.department.trim())
      return setErr('Category, Title, Location and Department are required.');
    setErr('');
    onSave({
      category: form.category, title: form.title, type: form.type,
      location: form.location, department: form.department,
      employmentType: form.employmentType,
      eligibility:     linesToArray(form.eligibilityText),
      workWillInclude: linesToArray(form.workText),
      active: form.active,
    });
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        {initial ? 'Edit Job' : 'New Job Listing'}
      </h3>
      {err && <p className="text-red-500 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded mb-3">{err}</p>}

      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          ['Category', 'category', 'e.g. Executive'],
          ['Title', 'title', 'Full job title'],
          ['Location', 'location', 'e.g. Mumbai'],
          ['Department', 'department', 'e.g. Administration'],
          ['Employment Type', 'employmentType', 'e.g. Full Time Employee'],
        ].map(([label, key, ph]) => (
          <div key={key} className={key === 'title' || key === 'employmentType' ? 'col-span-2' : ''}>
            <label className="block text-xs text-gray-500 mb-1">{label} *</label>
            <input value={form[key]} onChange={(e) => set(key, e.target.value)}
              placeholder={ph}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
        ))}

        <div>
          <label className="block text-xs text-gray-500 mb-1">Job Type</label>
          <select value={form.type} onChange={(e) => set('type', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] bg-white">
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-5">
          <input type="checkbox" id="job-active" checked={form.active}
            onChange={(e) => set('active', e.target.checked)} style={{ accentColor: '#F5C518' }} />
          <label htmlFor="job-active" className="text-sm text-gray-600">Active (visible on site)</label>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs text-gray-500 mb-1">Eligibility (one item per line)</label>
        <textarea value={form.eligibilityText} onChange={(e) => set('eligibilityText', e.target.value)}
          rows={4} placeholder={"Graduate in any field\n2+ years experience\n..."}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] resize-none font-mono" />
      </div>

      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-1">Work Will Include (one item per line)</label>
        <textarea value={form.workText} onChange={(e) => set('workText', e.target.value)}
          rows={5} placeholder={"Maintain records\nCoordinate with teams\n..."}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] resize-none font-mono" />
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: '#F5C518' }}>
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          {saving ? 'Saving…' : 'Save Job'}
        </button>
        <button onClick={onCancel}
          className="px-5 py-2 rounded-lg text-gray-600 text-sm border border-gray-300">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Job Row ───────────────────────────────────────────────────────────────────
function JobRow({ job, onEdit, onDelete, onToggle }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
        <button onClick={() => setOpen((s) => !s)} className="flex-1 text-left">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{job.category}</p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">{job.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{job.type} · {job.location}</p>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <button onClick={() => onToggle(job._id)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border"
            style={{
              backgroundColor: job.active ? '#FFFBEB' : '#F9FAFB',
              borderColor:     job.active ? '#FDE68A' : '#E5E7EB',
              color:           job.active ? '#D97706' : '#9CA3AF',
            }}>
            {job.active ? <Eye size={11} /> : <EyeOff size={11} />}
            {job.active ? 'Active' : 'Hidden'}
          </button>
          <button onClick={() => onEdit(job)} className="text-[#1E88E5] hover:text-[#084298] p-1.5 rounded hover:bg-blue-50 transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(job._id)} className="text-red-300 hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-colors">
            <Trash2 size={14} />
          </button>
          <button onClick={() => setOpen((s) => !s)} className="text-gray-400 p-1">
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="px-5 pb-4 border-t border-gray-100 pt-3 grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Eligibility</p>
            <ul className="list-disc pl-4 space-y-1">
              {job.eligibility?.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Work Will Include</p>
            <ul className="list-disc pl-4 space-y-1">
              {job.workWillInclude?.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Applications Tab ──────────────────────────────────────────────────────────
function ApplicationsTab({ navigate }) {
  const [apps, setApps]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    safeFetch(`${API}/api/applications`, { headers: authHeaders() }, navigate)
      .then((res) => res && res.json())
      .then((d) => { if (d?.success) setApps(d.data); })
      .catch(() => setError('Failed to load applications'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const updateStatus = async (id, status) => {
    const res = await safeFetch(`${API}/api/applications/${id}`,
      { method: 'PATCH', headers: authJsonHeaders(), body: JSON.stringify({ status }) },
      navigate);
    if (!res) return;
    const d = await res.json();
    if (d.success) setApps((prev) => prev.map((a) => a._id === id ? d.data : a));
  };

  const deleteApp = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    const res = await safeFetch(`${API}/api/applications/${id}`,
      { method: 'DELETE', headers: authHeaders() }, navigate);
    if (!res) return;
    const d = await res.json();
    if (d.success) setApps((prev) => prev.filter((a) => a._id !== id));
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={26} className="animate-spin text-[#1E88E5]" /></div>;
  if (error)   return <p className="text-center text-red-400 text-sm py-8">{error}</p>;
  if (apps.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <FileText size={38} className="mx-auto mb-3 opacity-30" />
      <p className="text-sm">No applications received yet.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {apps.map((app) => {
        const sc = STATUS_COLORS[app.status] || STATUS_COLORS.pending;
        return (
          <div key={app._id} className="border border-gray-200 rounded-xl px-5 py-4 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800">{app.fullName}</p>
              <p className="text-xs text-gray-400">{app.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                Applied for: <span className="font-medium text-gray-700">{app.jobTitle}</span>
              </p>
              {app.message && (
                <p className="text-xs text-gray-400 mt-1 italic truncate max-w-80">{app.message}</p>
              )}
              <a href={`${API}${app.resume}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 mt-1.5 font-medium">
                <FileText size={12} /> View Resume
              </a>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <select value={app.status}
                onChange={(e) => updateStatus(app._id, e.target.value)}
                className="text-xs px-2 py-1 rounded-full border font-medium bg-white outline-none cursor-pointer"
                style={{ backgroundColor: sc.bg, borderColor: sc.border, color: sc.text }}>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
              <p className="text-xs text-gray-400">
                {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <button onClick={() => deleteApp(app._id)}
                className="text-red-300 hover:text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CareersManager() {
  const navigate = useNavigate();
  const [tab, setTab]       = useState('jobs');   // 'jobs' | 'applications'
  const [jobs, setJobs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob]   = useState(null);
  const [saving, setSaving]     = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/careers?all=1`);
      const d   = await res.json();
      if (d.success) setJobs(d.data);
      else setError('Failed to load jobs');
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleCreate = async (payload) => {
    setSaving(true);
    const res = await safeFetch(`${API}/api/careers`,
      { method: 'POST', headers: authJsonHeaders(), body: JSON.stringify(payload) }, navigate);
    setSaving(false);
    if (!res) return;
    const d = await res.json();
    if (d.success) { setJobs((prev) => [d.data, ...prev]); setShowForm(false); }
  };

  const handleUpdate = async (payload) => {
    setSaving(true);
    const res = await safeFetch(`${API}/api/careers/${editJob._id}`,
      { method: 'PUT', headers: authJsonHeaders(), body: JSON.stringify(payload) }, navigate);
    setSaving(false);
    if (!res) return;
    const d = await res.json();
    if (d.success) { setJobs((prev) => prev.map((j) => j._id === editJob._id ? d.data : j)); setEditJob(null); }
  };

  const handleToggle = async (id) => {
    const res = await safeFetch(`${API}/api/careers/${id}/toggle`,
      { method: 'PATCH', headers: authHeaders() }, navigate);
    if (!res) return;
    const d = await res.json();
    if (d.success) setJobs((prev) => prev.map((j) => j._id === id ? d.data : j));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job listing?')) return;
    const res = await safeFetch(`${API}/api/careers/${id}`,
      { method: 'DELETE', headers: authHeaders() }, navigate);
    if (!res) return;
    const d = await res.json();
    if (d.success) setJobs((prev) => prev.filter((j) => j._id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Careers</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage job listings and view applicant submissions</p>
        </div>
        {tab === 'jobs' && (
          <button onClick={() => { setShowForm((s) => !s); setEditJob(null); }}
            className="flex items-center cursor-pointer  gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: '#F5C518' }}>
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'Add Job'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {[{ id: 'jobs', label: 'Job Listings', icon: Briefcase }, { id: 'applications', label: 'Applications', icon: FileText }]
          .map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: tab === id ? 'white' : 'transparent',
                color: tab === id ? '#1F2937' : '#6B7280',
                boxShadow: tab === id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}>
              <Icon size={14} /> {label}
            </button>
          ))}
      </div>

      {tab === 'jobs' ? (
        <>
          {(showForm && !editJob) && (
            <JobForm onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
          )}
          {editJob && (
            <JobForm initial={editJob} onSave={handleUpdate}
              onCancel={() => setEditJob(null)} saving={saving} />
          )}

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 size={26} className="animate-spin text-[#1E88E5]" /></div>
          ) : error ? (
            <p className="text-center text-red-400 text-sm py-8">{error}</p>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Briefcase size={38} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No job listings yet. Click "Add Job" to create one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <JobRow key={job._id} job={job}
                  onEdit={(j) => { setEditJob(j); setShowForm(false); window.scrollTo(0, 0); }}
                  onDelete={handleDelete} onToggle={handleToggle} />
              ))}
            </div>
          )}
        </>
      ) : (
        <ApplicationsTab navigate={navigate} />
      )}
    </div>
  );
}

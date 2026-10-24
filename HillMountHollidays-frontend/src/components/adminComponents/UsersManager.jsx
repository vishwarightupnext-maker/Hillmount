import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Users, Eye, EyeOff, Edit2, Ban, Loader2, X, Copy, CheckCheck } from 'lucide-react';
import { API, authJsonHeaders, authHeaders, safeFetch } from './apiHelper';

const ACCESS_OPTS = ['none', 'view', 'edit'];

const ACCESS_STYLE = {
  none: 'bg-gray-100 text-gray-500',
  view: 'bg-blue-50 text-blue-700',
  edit: 'bg-green-50 text-green-700',
};

const ACCESS_ICON = {
  none: <Ban size={10} />,
  view: <Eye size={10} />,
  edit: <Edit2 size={10} />,
};

const EMPTY_FORM = () => ({
  email: '',
  password: '',
  access: { blogs: 'none', customHolidays: 'none' },
});

function AccessToggle({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-gray-500 w-28 shrink-0">{label}</span>
      <div className="flex gap-1.5">
        {ACCESS_OPTS.map((opt) => {
          const active = value === opt;
          const base = 'text-xs font-semibold px-3 py-1 rounded-lg border transition-all cursor-pointer';
          const style = active
            ? opt === 'none' ? 'bg-gray-200 text-gray-700 border-gray-300'
              : opt === 'view' ? 'bg-blue-100 text-blue-700 border-blue-300'
              : 'bg-green-100 text-green-700 border-green-300'
            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600';
          return (
            <button key={opt} type="button" onClick={() => onChange(opt)} className={`${base} ${style}`}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function UsersManager() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [createdCreds, setCreatedCreds] = useState(null); // { email, password } shown after creation
  const [copied, setCopied] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await safeFetch(`${API}/api/admin/sub-users`, { headers: authHeaders() }, navigate);
    if (!res) return;
    const data = await res.json();
    if (data.success) setUsers(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm(EMPTY_FORM());
    setError('');
    setFormOpen(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ email: user.email, password: '', access: { ...user.access } });
    setError(''); setShowPwd(false); setCopied(false);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false); setEditUser(null); setError('');
    setCreatedCreds(null); setShowPwd(false); setCopied(false);
  };;

  const setAccess = (section, val) =>
    setForm((f) => ({ ...f, access: { ...f.access, [section]: val } }));

  const handleSubmit = async () => {
    setError('');
    if (!editUser && (!form.email.trim() || !form.password))
      return setError('Email and password are required');
    if (form.access.blogs === 'none' && form.access.customHolidays === 'none')
      return setError('Select at least one section with view or edit access');

    setSaving(true);
    const body = editUser
      ? { access: form.access, ...(form.password ? { password: form.password } : {}) }
      : { email: form.email.trim(), password: form.password, access: form.access };

    const url    = editUser ? `${API}/api/admin/sub-users/${editUser._id}` : `${API}/api/admin/sub-users`;
    const method = editUser ? 'PUT' : 'POST';

    const res = await safeFetch(url, { method, headers: authJsonHeaders(), body: JSON.stringify(body) }, navigate);
    setSaving(false);
    if (!res) return;
    const data = await res.json();
    if (!data.success) return setError(data.message || 'Failed to save');

    if (editUser) {
      setUsers((prev) => prev.map((u) => u._id === editUser._id ? { ...u, ...data.data } : u));
      closeForm();
    } else {
      setUsers((prev) => [data.data, ...prev]);
      // Show credentials card — password only visible now, before form clears
      setCreatedCreds({ email: form.email.trim(), password: form.password });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? They will no longer be able to log in.')) return;
    const res = await safeFetch(
      `${API}/api/admin/sub-users/${id}`,
      { method: 'DELETE', headers: authHeaders() },
      navigate
    );
    if (!res) return;
    const data = await res.json();
    if (data.success) setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-gray-800">User Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Create sub-admin accounts with restricted access to Blogs or Custom Holidays
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1E88E5] hover:bg-[#084298] text-black font-semibold text-sm px-4 py-2 rounded-lg transition"
        >
          <Plus size={15} /> Add User
        </button>
      </div>

      {/* Form panel */}
      {formOpen && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-sm">
              {editUser ? 'Edit User' : 'Create New User'}
            </h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>

          {error && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-3 mb-5">
            {!editUser && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="user@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1E88E5]"
                />
              </div>
            )}
            {editUser && (
              <div className="space-y-1.5">
                <p className="text-xs text-gray-500">
                  Editing: <span className="font-semibold text-gray-700">{editUser.email}</span>
                </p>
                {editUser.plainPassword && (
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                    <span className="text-xs text-gray-400 w-24 shrink-0">Current Password</span>
                    <span className="text-sm font-semibold text-gray-800 tracking-widest flex-1">
                      {showPwd ? editUser.plainPassword : '•'.repeat(editUser.plainPassword.length)}
                    </span>
                    <button type="button" onClick={() => setShowPwd((v) => !v)} className="text-gray-400 hover:text-gray-600">
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { navigator.clipboard.writeText(editUser.plainPassword); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="Copy password"
                    >
                      {copied ? <CheckCheck size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                )}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {editUser ? 'New Password' : 'Password'}
                {editUser && <span className="text-gray-400 font-normal ml-1">(leave blank to keep current)</span>}
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder={editUser ? 'Enter new password to change…' : 'Password'}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:border-[#1E88E5]"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
              Access Permissions
            </p>
            <div className="space-y-3">
              <AccessToggle
                label="Blogs"
                value={form.access.blogs}
                onChange={(v) => setAccess('blogs', v)}
              />
              <AccessToggle
                label="Custom Holidays"
                value={form.access.customHolidays}
                onChange={(v) => setAccess('customHolidays', v)}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              View — can read only. Edit — can create, update, and delete.
            </p>
          </div>

          {/* Credentials card — shown after successful creation */}
          {createdCreds ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-2">
              <p className="text-xs font-bold text-green-700 mb-3 uppercase tracking-wide">
                User created! Share these credentials:
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between bg-white rounded-lg border border-green-200 px-3 py-2">
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Email</p>
                    <p className="text-sm font-semibold text-gray-800">{createdCreds.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg border border-green-200 px-3 py-2">
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Password</p>
                    <p className="text-sm font-semibold text-gray-800 tracking-widest">
                      {showPwd ? createdCreds.password : '•'.repeat(createdCreds.password.length)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(createdCreds.password);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="Copy password"
                    >
                      {copied ? <CheckCheck size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mb-3">
                This password will not be shown again. Save it before closing.
              </p>
              <button
                onClick={closeForm}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 bg-[#1E88E5] hover:bg-[#084298] text-black font-semibold text-sm px-4 py-2 rounded-lg transition disabled:opacity-60"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                {editUser ? 'Update User' : 'Create User'}
              </button>
              <button
                onClick={closeForm}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* User list */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <Loader2 size={28} className="mx-auto mb-2 animate-spin opacity-40" />
          <p className="text-sm">Loading users…</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No sub-admin users yet.</p>
          <button
            onClick={openCreate}
            className="mt-3 text-sm text-[#084298] font-medium hover:underline"
          >
            Create your first user
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user) => {
            const bAccess = user.access?.blogs || 'none';
            const cAccess = user.access?.customHolidays || 'none';
            return (
              <div
                key={user._id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition"
              >
                {/* Avatar */}
                <div
                  className="flex items-center justify-center rounded-full text-white text-xs font-bold shrink-0"
                  style={{ width: '34px', height: '34px', backgroundColor: '#1F2937' }}
                >
                  {user.email[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-medium">Blogs:</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ACCESS_STYLE[bAccess]}`}>
                      {ACCESS_ICON[bAccess]} {bAccess}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium ml-1">Custom Holidays:</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ACCESS_STYLE[cAccess]}`}>
                      {ACCESS_ICON[cAccess]} {cAccess}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(user)}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#1E88E5] hover:text-[#084298] transition"
                    title="Edit user"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500 transition"
                    title="Delete user"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

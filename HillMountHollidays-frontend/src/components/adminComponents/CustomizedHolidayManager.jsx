import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Eye, EyeOff, Upload, X, Loader2, Edit2,
} from 'lucide-react';
import { API, authHeaders, authJsonHeaders, safeFetch } from './apiHelper';
import RichTextEditor from './RichTextEditor';

const INTEREST_FLAGS = [
  'Weekend Getaways', 'Honeymoon', 'Adventure', 'Nature', 'Photography',
  'Beach Holidays', 'Shopping', 'Festival', 'Solo Travel', 'Wildlife',
  'Food & Culinary', 'Spiritual', 'Budget Travel', 'Culture', 'Mountains', 'UNESCO Site',
];

const INCLUDE_ICONS = ['Hotel', 'Meals', 'Flight', 'Sightseeing', 'Transport', 'Guide', 'Insurance'];

const EMPTY_DAY = () => ({ dayLabel: '', date: '', title: '', nights: 1, description: '', amenities: [] });
const PACKAGE_TYPES = [
  { value: 'customized',  label: 'Customized Holiday' },
  { value: 'speciality',  label: 'Speciality Tour' },
  { value: 'tailor-made', label: 'Tailor made Holidays' },
  { value: 'short-stay',  label: 'Weekend Getaway (Short Stay)' },
  { value: 'mice',        label: 'MICE' },
  { value: 'cruise',      label: 'Cruise' },
];

const EMPTY_FORM = () => ({
  title: '', tourCode: '', packageType: 'customized',
  days: 4, nights: 3, states: 1, cities: 1,
  tags: '', destination: '', destRow: '',
  interests: [],
  price: 0,
  highlights: '',
  itinerary: [EMPTY_DAY()],
  includes: INCLUDE_ICONS.slice(0, 5).map((icon) => ({ icon, label: icon })),
  inclusions: '', exclusions: '',
  tourInfo: '', needToKnow: '',
  published: false,
  heroFile: null, heroPreview: '',
  _id: null,
});

const fieldCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5] transition";
const labelCls = "block text-xs text-gray-500 font-medium mb-1";
const sectionTitle = (t) => (
  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-5 pt-4 border-t border-gray-100">{t}</h3>
);

/* ── Form ── */
function HolidayForm({ initial, onSaved, onCancel, readOnly = false }) {
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const imgRef = useRef(null);
  const navigate = useNavigate();

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const toggleInterest = (flag) =>
    set('interests', f.interests.includes(flag)
      ? f.interests.filter((x) => x !== flag)
      : [...f.interests, flag]);

  const updateDay = (i, k, v) =>
    setF((p) => {
      const days = [...p.itinerary];
      days[i] = { ...days[i], [k]: v };
      return { ...p, itinerary: days };
    });

  const addDay    = () => setF((p) => ({ ...p, itinerary: [...p.itinerary, EMPTY_DAY()] }));
  const removeDay = (i) => setF((p) => ({ ...p, itinerary: p.itinerary.filter((_, idx) => idx !== i) }));

  const updateInclude = (i, k, v) =>
    setF((p) => {
      const arr = [...p.includes];
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, includes: arr };
    });
  const addInclude    = () => setF((p) => ({ ...p, includes: [...p.includes, { icon: 'Hotel', label: '' }] }));
  const removeInclude = (i) => setF((p) => ({ ...p, includes: p.includes.filter((_, idx) => idx !== i) }));

  const addDayAmenity = (dayIdx) => setF((p) => ({
    ...p,
    itinerary: p.itinerary.map((d, i) =>
      i === dayIdx ? { ...d, amenities: [...(d.amenities || []), { icon: 'Hotel', label: '' }] } : d
    ),
  }));
  const removeDayAmenity = (dayIdx, amenIdx) => setF((p) => ({
    ...p,
    itinerary: p.itinerary.map((d, i) =>
      i === dayIdx ? { ...d, amenities: d.amenities.filter((_, ai) => ai !== amenIdx) } : d
    ),
  }));
  const updateDayAmenity = (dayIdx, amenIdx, key, val) => setF((p) => ({
    ...p,
    itinerary: p.itinerary.map((d, i) => {
      if (i !== dayIdx) return d;
      const amenities = d.amenities.map((a, ai) => ai === amenIdx ? { ...a, [key]: val } : a);
      return { ...d, amenities };
    }),
  }));

  const handleSave = async () => {
    if (!f.title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    setError('');

    const fd = new FormData();
    fd.append('title',       f.title.trim());
    fd.append('tourCode',    f.tourCode.trim());
    fd.append('packageType', f.packageType || 'customized');
    fd.append('days',        f.days);
    fd.append('nights',      f.nights);
    fd.append('states',      f.states);
    fd.append('cities',      f.cities);
    fd.append('price',       f.price);
    fd.append('destination', f.destination.trim());
    fd.append('published',   f.published);
    fd.append('tourInfo',    f.tourInfo.trim());
    fd.append('needToKnow',  f.needToKnow.trim());

    fd.append('tags',      JSON.stringify(f.tags.split(',').map((s) => s.trim()).filter(Boolean)));
    fd.append('interests', JSON.stringify(f.interests));
    fd.append('destRow',   JSON.stringify(f.destRow.split('\n').map((s) => s.trim()).filter(Boolean)));
    fd.append('highlights',JSON.stringify(f.highlights.split('\n').map((s) => s.trim()).filter(Boolean)));
    fd.append('inclusions',JSON.stringify(f.inclusions.split('\n').map((s) => s.trim()).filter(Boolean)));
    fd.append('exclusions',JSON.stringify(f.exclusions.split('\n').map((s) => s.trim()).filter(Boolean)));
    fd.append('includes',  JSON.stringify(f.includes.filter((x) => x.label.trim())));

    const isEmptyHtml = (s) => !s || s === '<br>' || s === '<div><br></div>';
    const itinerary = f.itinerary.map((d) => ({
      dayLabel:  d.dayLabel,
      date:      d.date,
      title:     d.title,
      nights:    Number(d.nights) || 0,
      sections:  !isEmptyHtml(d.description) ? [{ type: 'text', text: d.description }] : [],
      amenities: (d.amenities || []).filter((a) => a.label.trim()),
    }));
    fd.append('itinerary', JSON.stringify(itinerary));

    if (f.heroFile) fd.append('heroImage', f.heroFile);

    const url    = f._id ? `${API}/api/customized-holidays/${f._id}` : `${API}/api/customized-holidays`;
    const method = f._id ? 'PUT' : 'POST';
    const res    = await safeFetch(url, { method, headers: authHeaders(), body: fd }, navigate);
    setSaving(false);
    if (!res) return;
    const data = await res.json();
    if (data.success) onSaved(data.data, !!f._id);
    else setError(data.message || 'Save failed');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-gray-800">{readOnly ? 'View' : (f._id ? 'Edit' : 'New')} Customized Holiday</h2>
          {readOnly && <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">View Only</span>}
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>

      {error && !readOnly && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</p>}

      <div className={readOnly ? 'pointer-events-none select-none opacity-90' : ''}>
      {/* Hero image */}
      {sectionTitle('Hero Image')}
      <div>
        {f.heroPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-blue-300 group" style={{ height: 180 }}>
            <img src={f.heroPreview} alt="preview" className="w-full h-full object-cover" />
            <button type="button" onClick={() => setF((p) => ({ ...p, heroFile: null, heroPreview: '' }))}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-red-500 opacity-0 group-hover:opacity-100 transition">
              <X size={14} />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => imgRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
            style={{ height: 130 }}>
            <Upload size={22} className="text-[#1E88E5]" />
            <span className="text-xs text-[#1E88E5] font-medium">Click to select image</span>
          </button>
        )}
        <input ref={imgRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setF((p) => ({ ...p, heroFile: file, heroPreview: URL.createObjectURL(file) }));
          }} />
      </div>

      {/* Basic info */}
      {sectionTitle('Basic Info')}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={labelCls}>Package Type</label>
          <select className={fieldCls} value={f.packageType} onChange={(e) => set('packageType', e.target.value)}>
            {PACKAGE_TYPES.map((pt) => (
              <option key={pt.value} value={pt.value}>{pt.label}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Title *</label>
          <input className={fieldCls} value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Leh Ladakh Adventure" />
        </div>
        <div>
          <label className={labelCls}>Tour Code</label>
          <input className={fieldCls} value={f.tourCode} onChange={(e) => set('tourCode', e.target.value)} placeholder="e.g. LHML4" />
        </div>
        <div>
          <label className={labelCls}>Price (₹)</label>
          <input type="number" className={fieldCls} value={f.price} onChange={(e) => set('price', e.target.value)} min={0} />
        </div>
        <div>
          <label className={labelCls}>Days</label>
          <input type="number" className={fieldCls} value={f.days} onChange={(e) => set('days', e.target.value)} min={1} />
        </div>
        <div>
          <label className={labelCls}>Nights</label>
          <input type="number" className={fieldCls} value={f.nights} onChange={(e) => set('nights', e.target.value)} min={0} />
        </div>
        <div>
          <label className={labelCls}>States</label>
          <input type="number" className={fieldCls} value={f.states} onChange={(e) => set('states', e.target.value)} min={1} />
        </div>
        <div>
          <label className={labelCls}>Cities</label>
          <input type="number" className={fieldCls} value={f.cities} onChange={(e) => set('cities', e.target.value)} min={1} />
        </div>
      </div>

      {/* Destination */}
      {sectionTitle('Destination')}
      <div>
        <label className={labelCls}>Destination Label</label>
        <input className={fieldCls} value={f.destination} onChange={(e) => set('destination', e.target.value)} placeholder="e.g. Leh Ladakh" />
      </div>
      <div>
        <label className={labelCls}>Destination Row (one per line)</label>
        <textarea rows={3} className={fieldCls} value={f.destRow} onChange={(e) => set('destRow', e.target.value)}
          placeholder={"Leh (2N)\nNubra Valley\nPangong Lake"} />
      </div>
      <div>
        <label className={labelCls}>Tags (comma-separated)</label>
        <input className={fieldCls} value={f.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Adventure, Family, Trekking" />
      </div>

      {/* Interests */}
      {sectionTitle('Interests')}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {INTEREST_FLAGS.map((flag) => (
          <button key={flag} type="button" onClick={() => toggleInterest(flag)}
            className={`flex items-center gap-1.5 cursor-pointer px-2 py-1.5 rounded-lg border text-xs font-medium transition text-left
              ${f.interests.includes(flag) ? 'border-[#1E88E5] bg-blue-50 text-[#084298]' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
            <span className={`w-3 h-3 rounded-sm border flex-shrink-0 flex items-center justify-center text-[9px]
              ${f.interests.includes(flag) ? 'bg-[#1E88E5] border-[#1E88E5] text-white' : 'border-gray-300'}`}>
              {f.interests.includes(flag) ? '✓' : ''}
            </span>
            {flag}
          </button>
        ))}
      </div>

      {/* Highlights */}
      {sectionTitle('Highlights')}
      <div>
        <label className={labelCls}>Tour Highlights (one per line)</label>
        <textarea rows={5} className={fieldCls} value={f.highlights} onChange={(e) => set('highlights', e.target.value)}
          placeholder={"Pangong Lake Visit\nNubra Valley Safari\nMagnetic Hill"} />
      </div>

      {/* Tour Includes */}
      {sectionTitle('Tour Includes Icons')}
      <div className="space-y-2">
        {f.includes.map((inc, i) => (
          <div key={i} className="flex items-center gap-2">
            <select value={inc.icon} onChange={(e) => updateInclude(i, 'icon', e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#1E88E5] w-32">
              {INCLUDE_ICONS.map((ic) => <option key={ic}>{ic}</option>)}
            </select>
            <input value={inc.label} onChange={(e) => updateInclude(i, 'label', e.target.value)}
              placeholder="Display label" className={`${fieldCls} flex-1`} />
            <button onClick={() => removeInclude(i)} className="text-red-400 hover:text-red-600 shrink-0"><X size={14} /></button>
          </div>
        ))}
        <button onClick={addInclude}
          className="flex items-center gap-1 text-xs text-[#084298] font-medium hover:underline mt-1">
          <Plus size={12} /> Add include
        </button>
      </div>

      {/* Inclusions / Exclusions */}
      {sectionTitle('Inclusions & Exclusions')}
      <div>
        <label className={labelCls}>Inclusions (one per line)</label>
        <textarea rows={4} className={fieldCls} value={f.inclusions} onChange={(e) => set('inclusions', e.target.value)}
          placeholder="Hotel accommodation&#10;All meals" />
      </div>
      <div>
        <label className={labelCls}>Exclusions (one per line)</label>
        <textarea rows={3} className={fieldCls} value={f.exclusions} onChange={(e) => set('exclusions', e.target.value)}
          placeholder="International airfare&#10;Personal expenses" />
      </div>

      {/* Itinerary */}
      {sectionTitle('Itinerary')}
      <div className="space-y-4">
        {f.itinerary.map((day, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 relative">
            <button onClick={() => removeDay(i)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-600"><X size={14} /></button>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className={labelCls}>Day Label</label>
                <input value={day.dayLabel} onChange={(e) => updateDay(i, 'dayLabel', e.target.value)}
                  placeholder="Day 1" className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Date (optional)</label>
                <input value={day.date} onChange={(e) => updateDay(i, 'date', e.target.value)}
                  placeholder="16 Jun, 26" className={fieldCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Day Title</label>
                <input value={day.title} onChange={(e) => updateDay(i, 'title', e.target.value)}
                  placeholder="Arrival at Leh" className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Nights</label>
                <input type="number" value={day.nights} onChange={(e) => updateDay(i, 'nights', e.target.value)}
                  min={0} className={fieldCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Description</label>
                <RichTextEditor
                  value={day.description}
                  onChange={(v) => updateDay(i, 'description', v)}
                  placeholder="Describe the day's activities…"
                  minHeight={120}
                />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Amenities</label>
                <div className="space-y-1.5 mb-1.5">
                  {(day.amenities || []).map((amen, ai) => (
                    <div key={ai} className="flex items-center gap-2">
                      <select value={amen.icon} onChange={(e) => updateDayAmenity(i, ai, 'icon', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#1E88E5] w-28 flex-shrink-0">
                        {INCLUDE_ICONS.map((ic) => <option key={ic}>{ic}</option>)}
                      </select>
                      <input value={amen.label} onChange={(e) => updateDayAmenity(i, ai, 'label', e.target.value)}
                        placeholder="e.g. Night Stay in Leh" className={`${fieldCls} flex-1`} />
                      <button type="button" onClick={() => removeDayAmenity(i, ai)}
                        className="text-red-400 hover:text-red-600 flex-shrink-0"><X size={13} /></button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addDayAmenity(i)}
                  className="flex items-center gap-1 text-xs text-[#084298] font-medium hover:underline">
                  <Plus size={12} /> Add amenity
                </button>
              </div>
            </div>
          </div>
        ))}
        <button onClick={addDay}
          className="flex items-center gap-2 text-sm font-semibold text-[#084298] border border-blue-300 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition">
          <Plus size={14} /> Add Day
        </button>
      </div>

      {/* Tour info / Need to know */}
      {sectionTitle('Additional Info')}
      <div>
        <label className={labelCls}>Short Description <span className="text-gray-400 font-normal">(shown above the hero image on the page)</span></label>
        <RichTextEditor
          value={f.tourInfo}
          onChange={(v) => set('tourInfo', v)}
          placeholder="e.g. Explore the stunning landscapes of Switzerland with our carefully crafted 6-day itinerary…"
          minHeight={100}
        />
      </div>
      <div>
        <label className={labelCls}>Need to Know</label>
        <RichTextEditor
          value={f.needToKnow}
          onChange={(v) => set('needToKnow', v)}
          placeholder="Important notes, terms, or travel tips…"
          minHeight={100}
        />
      </div>

      {/* Publish */}
      {sectionTitle('Visibility')}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => set('published', !f.published)}
          className={`relative w-10 h-5 rounded-full transition ${f.published ? 'bg-[#1E88E5]' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${f.published ? 'left-5' : 'left-0.5'}`} />
        </div>
        <span className="text-sm text-gray-700 font-medium">{f.published ? 'Published' : 'Draft'}</span>
      </label>

      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
        {!readOnly && (
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-[#1E88E5] hover:bg-[#084298] text-black font-semibold text-sm px-5 py-2 rounded-lg transition disabled:opacity-60">
            {saving && <Loader2 size={14} className="animate-spin" />}
            {f._id ? 'Update' : 'Create'}
          </button>
        )}
        <button onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 border border-gray-200 rounded-lg transition">
          {readOnly ? 'Close' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}

/* ── map DB doc → form state ── */
function docToForm(doc) {
  return {
    _id:         doc._id,
    title:       doc.title || '',
    tourCode:    doc.tourCode || '',
    packageType: doc.packageType || 'customized',
    days:        doc.days || 4,
    nights:      doc.nights || 3,
    states:      doc.states || 1,
    cities:      doc.cities || 1,
    price:       doc.price || 0,
    destination: doc.destination || '',
    interests:   doc.interests || [],
    tags:        (doc.tags || []).join(', '),
    destRow:     (doc.destRow || []).join('\n'),
    highlights:  (doc.highlights || []).join('\n'),
    inclusions:  (doc.inclusions || []).join('\n'),
    exclusions:  (doc.exclusions || []).join('\n'),
    includes:    (doc.includes || []).length ? doc.includes : INCLUDE_ICONS.slice(0, 5).map((i) => ({ icon: i, label: i })),
    itinerary:   (doc.itinerary || []).map((d) => ({
      dayLabel:    d.dayLabel || '',
      date:        d.date || '',
      title:       d.title || '',
      nights:      d.nights || 0,
      description: d.sections?.find((s) => s.type === 'text')?.text || '',
      amenities:   d.amenities || [],
    })),
    tourInfo:    doc.tourInfo || '',
    needToKnow:  doc.needToKnow || '',
    published:   doc.published || false,
    heroFile:    null,
    heroPreview: doc.heroImage ? `${API}${doc.heroImage}` : '',
  };
}

/* ── Main component ── */
export default function CustomizedHolidayManager({ canEdit = true }) {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState(null);
  const [toggling, setToggling] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const res = await safeFetch(`${API}/api/customized-holidays?all=1`, {}, navigate);
    setLoading(false);
    if (!res) return;
    const data = await res.json();
    if (data.success) setItems(data.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this holiday?')) return;
    const res = await safeFetch(`${API}/api/customized-holidays/${id}`, { method: 'DELETE', headers: authHeaders() }, navigate);
    if (!res) return;
    const data = await res.json();
    if (data.success) setItems((prev) => prev.filter((x) => x._id !== id));
  };

  const handleToggle = async (id) => {
    setToggling(id);
    const res = await safeFetch(`${API}/api/customized-holidays/${id}/publish`, { method: 'PATCH', headers: authJsonHeaders() }, navigate);
    setToggling(null);
    if (!res) return;
    const data = await res.json();
    if (data.success) setItems((prev) => prev.map((x) => x._id === id ? data.data : x));
  };

  const handleSaved = (doc, isEdit) => {
    setItems((prev) => isEdit ? prev.map((x) => x._id === doc._id ? doc : x) : [doc, ...prev]);
    setForm(null);
  };

  if (form) {
    return (
      <div className="max-w-2xl">
        <HolidayForm initial={form} onSaved={handleSaved} onCancel={() => setForm(null)} readOnly={!canEdit} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-gray-800">Personalised Holidays</h2>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} packages</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setForm(EMPTY_FORM())}
            className="flex items-center gap-2 bg-[#1E88E5] hover:bg-[#084298] text-black font-semibold text-sm px-4 py-2 rounded-lg transition">
            <Plus size={15} /> New Holiday
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#1E88E5]" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No holidays yet.</p>
          {canEdit && (
            <button onClick={() => setForm(EMPTY_FORM())} className="mt-3 text-sm text-[#084298] font-medium hover:underline">
              Create your first holiday
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
              {/* Thumbnail */}
              <div className="w-16 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {item.heroImage ? (
                  <img src={`${API}${item.heroImage}`} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-[#1E88E5] text-xs">No img</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{item.title}</p>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <span className="text-xs text-gray-400">{item.days}D · {item.nights}N</span>
                  {item.tourCode && <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{item.tourCode}</span>}
                  {item.price > 0 && <span className="text-xs text-green-600 font-semibold">₹{item.price.toLocaleString('en-IN')}</span>}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {canEdit ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleToggle(item._id)} disabled={toggling === item._id}
                    title={item.published ? 'Unpublish' : 'Publish'}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#1E88E5] hover:text-[#084298] transition disabled:opacity-50">
                    {toggling === item._id
                      ? <Loader2 size={14} className="animate-spin" />
                      : item.published ? <EyeOff size={14} /> : <Eye size={14} />
                    }
                  </button>
                  <button onClick={() => setForm(docToForm(item))}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <button onClick={() => setForm(docToForm(item))}
                  className="p-1.5 rounded-lg border border-gray-200 text-blue-400 hover:border-blue-400 hover:text-blue-600 transition shrink-0"
                  title="View">
                  <Eye size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

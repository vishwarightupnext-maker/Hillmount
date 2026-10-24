import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, EyeOff, Upload, X, Loader2, Play } from 'lucide-react';
import { API, authHeaders, safeFetch } from './apiHelper';

function UploadForm({ onUploaded, onCancel }) {
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);
  const navigate = useNavigate();
  const [videoFile, setVideoFile]   = useState(null);
  const [thumbFile, setThumbFile]   = useState(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [title, setTitle]           = useState('');
  const [order, setOrder]           = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  const pickVideo = (f) => { if (f) { setVideoFile(f); setError(''); } };
  const pickThumb = (f) => {
    if (!f) return;
    setThumbFile(f);
    setThumbPreview(URL.createObjectURL(f));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return setError('Please select a video file.');
    setSubmitting(true);
    const fd = new FormData();
    fd.append('video', videoFile);
    if (thumbFile) fd.append('thumbnail', thumbFile);
    fd.append('title', title);
    fd.append('order', order || '0');
    const res = await safeFetch(`${API}/api/reels`,
      { method: 'POST', headers: authHeaders(), body: fd }, navigate);
    setSubmitting(false);
    if (!res) return;
    const data = await res.json();
    if (data.success) onUploaded(data.data);
    else setError(data.message || 'Upload failed');
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Upload Reel Video</h3>
      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Video picker */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Video File * (MP4, WebM, MOV — max 200 MB)</label>
          {videoFile ? (
            <div className="flex items-center gap-3 bg-white border border-blue-300 rounded-lg px-4 py-2.5">
              <Play size={14} className="text-[#1E88E5] fill-[#1E88E5] flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate flex-1">{videoFile.name}</span>
              <button type="button" onClick={() => setVideoFile(null)} className="text-red-400 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => videoInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-white hover:bg-blue-50 transition-colors"
              style={{ height: '90px' }}>
              <Upload size={18} className="text-[#1E88E5]" />
              <span className="text-xs text-[#1E88E5] font-medium">Click to select video</span>
            </button>
          )}
          <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime,video/avi"
            className="hidden" onChange={(e) => pickVideo(e.target.files[0])} />
        </div>

        {/* Thumbnail picker */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Thumbnail Image (optional — JPG, PNG, WEBP)</label>
          {thumbPreview ? (
            <div className="relative w-24 aspect-[9/16] rounded-xl overflow-hidden border border-blue-300 group">
              <img src={thumbPreview} alt="thumb" className="w-full h-full object-cover" />
              <button type="button" onClick={() => { setThumbFile(null); setThumbPreview(''); }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={10} />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => thumbInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              style={{ height: '72px' }}>
              <Upload size={16} className="text-gray-400" />
              <span className="text-xs text-gray-400">Click to add thumbnail (9:16 recommended)</span>
            </button>
          )}
          <input ref={thumbInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
            className="hidden" onChange={(e) => pickThumb(e.target.files[0])} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Title (optional)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Order (lower = first)</label>
            <input value={order} onChange={(e) => setOrder(e.target.value)}
              type="number" placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E88E5]" />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-medium bg-[#1E88E5] hover:bg-[#084298] transition disabled:opacity-60">
            {submitting && <Loader2 size={13} className="animate-spin" />}
            {submitting ? 'Uploading…' : 'Upload Reel'}
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

function ReelCard({ reel, onToggle, onDelete }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleClick = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().then(() => setPlaying(true)).catch(() => {}); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="relative aspect-[9/16] cursor-pointer bg-black" onClick={handleClick}>
        <video
          ref={videoRef}
          src={`${API}${reel.videoUrl}`}
          className="w-full h-full object-cover"
          playsInline loop preload="metadata"
          onEnded={() => setPlaying(false)}
        />
        {reel.thumbnailUrl && !playing && (
          <img src={`${API}${reel.thumbnailUrl}`} alt="thumb"
            className="absolute inset-0 w-full h-full object-cover" />
        )}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
              <Play size={16} className="text-[#1E88E5] fill-[#1E88E5] ml-0.5" />
            </div>
          </div>
        )}
        {!reel.active && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
            <span className="text-white text-xs font-semibold">Hidden</span>
          </div>
        )}
      </div>
      <div className="px-3 py-2.5">
        <p className="text-xs font-semibold text-gray-700 truncate mb-1">{reel.title || '(no title)'}</p>
        <p className="text-[10px] text-gray-400 mb-2">Order: {reel.order}</p>
        <div className="flex items-center gap-1">
          <button onClick={() => onToggle(reel._id)}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors flex-1 flex justify-center"
            title={reel.active ? 'Hide' : 'Show'}>
            {reel.active ? <Eye size={13} className="text-[#1E88E5]" /> : <EyeOff size={13} className="text-gray-400" />}
          </button>
          <button onClick={() => onDelete(reel._id)}
            className="p-1.5 rounded hover:bg-red-50 text-red-300 hover:text-red-500 transition-colors flex-1 flex justify-center"
            title="Delete">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReelManager() {
  const navigate = useNavigate();
  const [reels, setReels]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/api/reels?all=1`);
      const data = await res.json();
      if (data.success) setReels(data.data);
      else setError('Failed to load reels');
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReels(); }, []);

  const handleUploaded = (reel) => {
    setReels((prev) => [reel, ...prev]);
    setShowForm(false);
  };

  const handleToggle = async (id) => {
    const res = await safeFetch(`${API}/api/reels/${id}/toggle`,
      { method: 'PATCH', headers: authHeaders() }, navigate);
    if (!res) return;
    const data = await res.json();
    if (data.success) setReels((prev) => prev.map((r) => r._id === id ? data.data : r));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reel? Video and thumbnail files will also be removed.')) return;
    const res = await safeFetch(`${API}/api/reels/${id}`,
      { method: 'DELETE', headers: authHeaders() }, navigate);
    if (!res) return;
    const data = await res.json();
    if (data.success) setReels((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Reel Videos</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage the short-form reel videos shown on the homepage</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg text-white text-sm font-medium bg-[#1E88E5] hover:bg-[#084298] transition">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Upload Reel'}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-xs text-blue-700 space-y-1">
        <p className="font-bold mb-1">Tips:</p>
        <p>• Videos are stored without compression — keep files under 50 MB for fast page loads.</p>
        <p>• Add a <strong>thumbnail</strong> (9:16 image) so users see a preview before playing.</p>
        <p>• Use the <strong>Order</strong> field to control display sequence (lower = first).</p>
      </div>

      {showForm && <UploadForm onUploaded={handleUploaded} onCancel={() => setShowForm(false)} />}

      {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-2 rounded-lg mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[#1E88E5]" /></div>
      ) : reels.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No reels uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {reels.map((reel) => (
            <ReelCard key={reel._id} reel={reel} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

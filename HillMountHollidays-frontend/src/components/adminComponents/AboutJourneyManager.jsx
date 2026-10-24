import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Loader2 } from 'lucide-react';
import { API, authHeaders, safeFetch } from './apiHelper';

export default function AboutJourneyManager() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [image, setImage]     = useState(null);
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const fetchImage = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/api/about-journey`);
      const data = await res.json();
      if (data.success) setImage(data.data);
      else setError('Failed to load image');
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImage(); }, []);

  const pickFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select an image.');
    setSubmitting(true);
    setError('');
    const fd = new FormData();
    fd.append('image', file);
    const res = await safeFetch(`${API}/api/about-journey`,
      { method: 'POST', headers: authHeaders(), body: fd }, navigate);
    setSubmitting(false);
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setImage(data.data);
      setFile(null);
      setPreview('');
      setSuccess(true);
    } else {
      setError(data.message || 'Upload failed');
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-800">About Us — Journey Photo</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          The team photo on the "Our Journey Crafting Meaningful Travel" section of the About Us page.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-xs text-blue-700">
        <p><strong>Recommended:</strong> landscape photo, e.g. <code>1200 × 900 px</code> or larger. JPG · PNG · WEBP · max 5 MB.</p>
      </div>

      {error   && <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-2 rounded-lg mb-4">{error}</p>}
      {success && <p className="text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-lg mb-4">Image updated!</p>}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[#1E88E5]" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Current image */}
          <div>
            <p className="text-xs text-gray-500 mb-2 font-medium">Current image</p>
            <div className="rounded-xl overflow-hidden border border-gray-200 aspect-[4/3] bg-gray-100">
              {image ? (
                <img src={`${API}${image.image}`} alt={image.alt} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  Using default site image — none uploaded yet
                </div>
              )}
            </div>
          </div>

          {/* Upload new */}
          <form onSubmit={handleSubmit}>
            <p className="text-xs text-gray-500 mb-2 font-medium">Replace with new image</p>
            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-blue-300 group aspect-[4/3]">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setFile(null); setPreview(''); }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => inputRef.current?.click()}
                className="w-full aspect-[4/3] flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-white hover:bg-blue-50 transition-colors cursor-pointer">
                <Upload size={22} className="text-[#1E88E5]" />
                <span className="text-xs text-[#1E88E5] font-medium">Click to select image</span>
                <span className="text-xs text-gray-400">JPG · PNG · WEBP · max 5 MB</span>
              </button>
            )}
            <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
              className="hidden" onChange={(e) => pickFile(e.target.files[0])} />

            <button type="submit" disabled={submitting || !file}
              className="mt-4 flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-medium bg-[#1E88E5] hover:bg-[#084298] transition disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting && <Loader2 size={13} className="animate-spin" />}
              {submitting ? 'Uploading…' : 'Save Image'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { API, authJsonHeaders, safeFetch } from './apiHelper';
import RichTextEditor from './RichTextEditor';

export default function PrivacyPolicyManager() {
  const navigate = useNavigate();
  const [content, setContent]       = useState('');
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);

  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/api/privacy-policy`);
      const data = await res.json();
      if (data.success) setContent(data.data?.content || '');
      else setError('Failed to load privacy policy');
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPolicy(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return setError('Please enter the policy content.');
    setSubmitting(true);
    setError('');
    setSuccess(false);
    const res = await safeFetch(`${API}/api/privacy-policy`,
      { method: 'POST', headers: authJsonHeaders(), body: JSON.stringify({ content }) }, navigate);
    setSubmitting(false);
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setContent(data.data.content);
      setSuccess(true);
    } else {
      setError(data.message || 'Save failed');
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Privacy Policy</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          Content shown on the public Privacy Policy page, linked from the site footer.
        </p>
      </div>

      {error   && <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-2 rounded-lg mb-4">{error}</p>}
      {success && <p className="text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-lg mb-4">Privacy policy updated!</p>}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[#1E88E5]" /></div>
      ) : (
        <form onSubmit={handleSubmit}>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write the privacy policy…"
            minHeight={420}
          />

          <button type="submit" disabled={submitting}
            className="mt-4 flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-medium bg-[#1E88E5] hover:bg-[#084298] transition disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting && <Loader2 size={13} className="animate-spin" />}
            {submitting ? 'Saving…' : 'Save Privacy Policy'}
          </button>
        </form>
      )}
    </div>
  );
}

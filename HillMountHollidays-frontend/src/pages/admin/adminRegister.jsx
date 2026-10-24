import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';
import logo from "../../assets/logo.png";

const API = import.meta.env.VITE_API_BASE;

// ── Decorative left panel ───────────────────────────────────────────────────
function LeftPanel() {
  return (
    <div
      className="hidden sm:relative sm:flex flex-shrink-0 flex-col items-center justify-center overflow-hidden"
      style={{ width: '42%', backgroundColor: '#1E88E5' }}
    >
      <div className="absolute" style={{ bottom: '-70px', left: '-70px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)' }} />
      <div className="absolute" style={{ top: '-50px', right: '-50px', width: '160px', height: '160px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.20)' }} />
      <div className="absolute" style={{ bottom: '100px', left: '-30px', width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.18)' }} />
      {[{ top: '14%', left: '12%' }, { top: '22%', right: '14%' }, { bottom: '28%', left: '20%' }, { bottom: '18%', right: '18%' }].map((pos, i) => (
        <div key={i} className="absolute" style={{ ...pos, width: i % 2 === 0 ? '12px' : '8px', height: i % 2 === 0 ? '12px' : '8px', backgroundColor: 'rgba(255,255,255,0.9)', transform: 'rotate(45deg)' }} />
      ))}
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <p className="relative z-10 font-bold tracking-widest uppercase mt-4" style={{ color: 'white', fontSize: '15px', letterSpacing: '3px' }}>HillMount</p>
      <p className="relative z-10 text-center mt-2 px-6" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', lineHeight: '1.5' }}>Admin Registration & Access Control</p>
    </div>
  );
}

const InputRow = ({ icon: Icon, children }) => (
  <div className="flex items-center pb-2 mb-5" style={{ borderBottom: '1px solid #D1D5DB' }}>
    <Icon style={{ width: '18px', height: '18px', color: '#9CA3AF', marginRight: '10px', flexShrink: 0 }} />
    {children}
  </div>
);

const inputStyle = { flex: 1, outline: 'none', border: 'none', background: 'transparent', color: '#4B5563', fontSize: '13px' };

const BtnPrimary = ({ loading, children, ...props }) => (
  <button
    type="submit"
    disabled={loading}
    style={{ width: '100%', backgroundColor: loading ? '#084298' : '#1E88E5', color: 'white', fontWeight: '600', fontSize: '14px', padding: '11px 0', borderRadius: '9999px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', letterSpacing: '0.5px' }}
    onMouseEnter={(e) => { if (!loading) e.target.style.backgroundColor = '#084298'; }}
    onMouseLeave={(e) => { if (!loading) e.target.style.backgroundColor = '#1E88E5'; }}
    {...props}
  >
    {children}
  </button>
);

export default function AdminRegister() {
  const navigate = useNavigate();

  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [regError,        setRegError]        = useState('');
  const [regSuccess,      setRegSuccess]      = useState('');
  const [loading,         setLoading]         = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (password !== confirmPassword) {
      return setRegError('Passwords do not match');
    }
    if (password.length < 6) {
      return setRegError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setRegSuccess(data.message || 'Admin registered successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setRegError(data.message || 'Registration failed');
      }
    } catch {
      setRegError('Cannot connect to server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex w-full" style={{ maxWidth: '720px' }}>
        <LeftPanel />

        {/* Right panel */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 py-10 sm:py-12">
          <div className="flex items-center gap-2 mb-1 text-blue-600">
            <ShieldCheck size={24} />
            <h1 className="font-light text-gray-700" style={{ fontSize: '22px' }}>Admin Registration</h1>
          </div>
          <p className="text-gray-400 mb-6" style={{ fontSize: '11px' }}>Register a new Admin account to manage HillMount Holidays.</p>

          {regError && (
            <div className="mb-4 px-3 py-2 rounded text-sm" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
              {regError}
            </div>
          )}

          {regSuccess && (
            <div className="mb-4 px-3 py-2 rounded text-sm flex items-center gap-2" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534' }}>
              <CheckCircle size={18} />
              <span>{regSuccess} Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <InputRow icon={User}>
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </InputRow>

            <InputRow icon={Lock}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', flexShrink: 0 }}
              >
                {showPassword ? <EyeOff style={{ width: '16px', height: '16px', color: '#9CA3AF' }} /> : <Eye style={{ width: '16px', height: '16px', color: '#9CA3AF' }} />}
              </button>
            </InputRow>

            <InputRow icon={Lock}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </InputRow>

            <BtnPrimary loading={loading}>{loading ? 'Registering…' : 'Register Admin'}</BtnPrimary>
          </form>

          <div className="text-center mt-6">
            <span className="text-xs text-gray-500">Already registered as Admin? </span>
            <Link to="/login" className="text-xs font-semibold text-blue-600 hover:underline">
              Log In
            </Link>
          </div>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '24px', paddingTop: '16px' }}>
            <div className="flex items-center justify-between">
              <span style={{ color: '#9CA3AF', fontSize: '10px' }}>Admin Access Only</span>
              <span style={{ color: '#9CA3AF', fontSize: '10px' }}>HillMount Holidays © 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Mail, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
import logo from "../../assets/logo.png";

const API = import.meta.env.VITE_API_BASE;

// ── Decorative left panel (shared) ───────────────────────────────────────────
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
      <p className="relative z-10 text-center mt-2 px-6" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', lineHeight: '1.5' }}>Your gateway to amazing holiday experiences</p>
    </div>
  );
}

const InputRow = ({ icon: Icon, children }) => (
  <div className="flex items-center pb-2 mb-6" style={{ borderBottom: '1px solid #D1D5DB' }}>
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

// ── Main ─────────────────────────────────────────────────────────────────────
export default function AdminLogin() {
  const navigate = useNavigate();

  // Login state
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);
  const [loginError,   setLoginError]   = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Forgot-password flow  ('login' | 'fp-email' | 'fp-otp' | 'fp-done')
  const [step,      setStep]      = useState('login');
  const [fpEmail,   setFpEmail]   = useState('');
  const [fpOtp,     setFpOtp]     = useState('');
  const [fpNewPwd,  setFpNewPwd]  = useState('');
  const [fpError,   setFpError]   = useState('');
  const [fpLoading, setFpLoading] = useState(false);

  // ── Login submit ───────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        const store = rememberMe ? localStorage : sessionStorage;
        store.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch {
      setLoginError('Cannot connect to server. Please ensure the backend is running.');
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Forgot password — step 1: send OTP ────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setFpError('');
    if (!fpEmail.trim()) return setFpError('Email is required');
    setFpLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail }),
      });
      const data = await res.json();
      if (data.success) setStep('fp-otp');
      else setFpError(data.message || 'Something went wrong');
    } catch {
      setFpError('Cannot connect to server.');
    } finally {
      setFpLoading(false);
    }
  };

  // ── Forgot password — step 2: verify OTP + set new password ───────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFpError('');
    if (!fpOtp.trim())    return setFpError('OTP is required');
    if (!fpNewPwd.trim()) return setFpError('New password is required');
    setFpLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail, otp: fpOtp, newPassword: fpNewPwd }),
      });
      const data = await res.json();
      if (data.success) setStep('fp-done');
      else setFpError(data.message || 'Reset failed');
    } catch {
      setFpError('Cannot connect to server.');
    } finally {
      setFpLoading(false);
    }
  };

  const backToLogin = () => {
    setStep('login');
    setFpEmail(''); setFpOtp(''); setFpNewPwd(''); setFpError('');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex w-full" style={{ maxWidth: '720px' }}>
        <LeftPanel />

        {/* Right panel */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 py-10 sm:py-12">

          {/* ── LOGIN ── */}
          {step === 'login' && (
            <>
              <h1 className="font-light text-gray-700 mb-1" style={{ fontSize: '22px' }}>Members Log in</h1>
              <p className="text-gray-400 mb-8" style={{ fontSize: '11px' }}>Sign in to access the HillMount admin panel.</p>

              {loginError && (
                <div className="mb-4 px-3 py-2 rounded text-sm" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <InputRow icon={User}>
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                </InputRow>

                <InputRow icon={Lock}>
                  <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', flexShrink: 0 }}>
                    {showPassword ? <EyeOff style={{ width: '16px', height: '16px', color: '#9CA3AF' }} /> : <Eye style={{ width: '16px', height: '16px', color: '#9CA3AF' }} />}
                  </button>
                </InputRow>

                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ accentColor: '#1E88E5', width: '14px', height: '14px' }} />
                    <span style={{ color: '#6B7280', fontSize: '11px' }}>Remember Me?</span>
                  </label>
                  <button type="button" onClick={() => { setStep('fp-email'); setFpEmail(email); }}
                    style={{ color: '#1E88E5', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                    Forgot Password?
                  </button>
                </div>

                <BtnPrimary loading={loginLoading}>{loginLoading ? 'Logging in…' : 'Log In'}</BtnPrimary>
              </form>

              {/* <div className="text-center mt-5">
                <span className="text-xs text-gray-500">Need an Admin account? </span>
                <Link to="/register" className="text-xs font-semibold text-blue-600 hover:underline">
                  Register Admin
                </Link>
              </div> */}

              <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '28px', paddingTop: '16px' }}>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#9CA3AF', fontSize: '10px' }}>Admin Access Only</span>
                  <span style={{ color: '#9CA3AF', fontSize: '10px' }}>HillMount Holidays © 2024</span>
                </div>
              </div>
            </>
          )}

          {/* ── FORGOT PASSWORD — enter email ── */}
          {step === 'fp-email' && (
            <>
              <button type="button" onClick={backToLogin}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-6 transition-colors">
                <ArrowLeft size={13} /> Back to Login
              </button>
              <h1 className="font-light text-gray-700 mb-1" style={{ fontSize: '22px' }}>Reset Password</h1>
              <p className="text-gray-400 mb-8" style={{ fontSize: '11px' }}>Enter your email and we'll send you a one-time code.</p>

              {fpError && (
                <div className="mb-4 px-3 py-2 rounded text-sm" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>{fpError}</div>
              )}

              <form onSubmit={handleSendOtp}>
                <InputRow icon={Mail}>
                  <input type="email" placeholder="Your email address" value={fpEmail} onChange={(e) => setFpEmail(e.target.value)} required style={inputStyle} />
                </InputRow>
                <BtnPrimary loading={fpLoading}>{fpLoading ? 'Sending…' : 'Send OTP'}</BtnPrimary>
              </form>
            </>
          )}

          {/* ── FORGOT PASSWORD — enter OTP + new password ── */}
          {step === 'fp-otp' && (
            <>
              <button type="button" onClick={() => setStep('fp-email')}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-6 transition-colors">
                <ArrowLeft size={13} /> Back
              </button>
              <h1 className="font-light text-gray-700 mb-1" style={{ fontSize: '22px' }}>Enter OTP</h1>
              <p className="text-gray-400 mb-8" style={{ fontSize: '11px' }}>
                A 6-digit code was sent to <strong style={{ color: '#4B5563' }}>{fpEmail}</strong>. Enter it below along with your new password.
              </p>

              {fpError && (
                <div className="mb-4 px-3 py-2 rounded text-sm" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>{fpError}</div>
              )}

              <form onSubmit={handleResetPassword}>
                <InputRow icon={KeyRound}>
                  <input type="text" placeholder="6-digit OTP" value={fpOtp} onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} required maxLength={6} style={{ ...inputStyle, letterSpacing: '4px', fontSize: '18px', fontWeight: '700' }} />
                </InputRow>
                <InputRow icon={Lock}>
                  <input type="password" placeholder="New password" value={fpNewPwd} onChange={(e) => setFpNewPwd(e.target.value)} required style={inputStyle} />
                </InputRow>
                <BtnPrimary loading={fpLoading}>{fpLoading ? 'Resetting…' : 'Reset Password'}</BtnPrimary>
              </form>
            </>
          )}

          {/* ── FORGOT PASSWORD — success ── */}
          {step === 'fp-done' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle style={{ width: '48px', height: '48px', color: '#16a34a' }} />
              </div>
              <h1 className="font-semibold text-gray-700 mb-2" style={{ fontSize: '20px' }}>Password Reset!</h1>
              <p className="text-gray-400 mb-8" style={{ fontSize: '12px' }}>Your password has been updated. You can now log in with your new password.</p>
              <button
                onClick={backToLogin}
                style={{ backgroundColor: '#1E88E5', color: 'white', fontWeight: '600', fontSize: '14px', padding: '11px 32px', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
              >
                Go to Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

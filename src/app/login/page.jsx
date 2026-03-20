'use client';
// src/app/login/page.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) window.location.href = '/';
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password.');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%,100%{transform:translateY(0px) rotate(-2deg)}
          50%{transform:translateY(-10px) rotate(2deg)}
        }
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(20px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes pulse-ring {
          0%{transform:scale(1);opacity:0.5}
          100%{transform:scale(1.7);opacity:0}
        }
        @keyframes bounce {
          0%,80%,100%{transform:scale(0.8);opacity:0.5}
          40%{transform:scale(1.2);opacity:1}
        }
        .bell-float{animation:float 3s ease-in-out infinite;display:inline-block}
        .card-fade{animation:fadeUp 0.5s ease-out both}
        .pulse-ring{position:relative;display:inline-block}
        .pulse-ring::before{
          content:'';position:absolute;inset:-10px;border-radius:50%;
          border:2px solid rgba(234,179,8,0.4);
          animation:pulse-ring 2s ease-out infinite;
        }
        .pulse-ring::after{
          content:'';position:absolute;inset:-20px;border-radius:50%;
          border:1px solid rgba(234,179,8,0.15);
          animation:pulse-ring 2s ease-out infinite 0.5s;
        }
        .sb-input{
          width:100%;background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);border-radius:10px;
          padding:11px 16px;color:#f1f5f9;font-size:14px;outline:none;
          transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;
          font-family:inherit;box-sizing:border-box;
        }
        .sb-input::placeholder{color:rgba(255,255,255,0.22)}
        .sb-input:focus{
          border-color:rgba(99,102,241,0.7);
          box-shadow:0 0 0 3px rgba(99,102,241,0.15);
          background:rgba(255,255,255,0.07);
        }
        .sb-input:hover:not(:focus){
          border-color:rgba(255,255,255,0.18);
          background:rgba(255,255,255,0.06);
        }
        .sb-btn{
          width:100%;background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);
          color:white;font-weight:700;font-size:14px;padding:12px;
          border-radius:10px;border:none;cursor:pointer;
          transition:all 0.2s;letter-spacing:0.3px;font-family:inherit;
        }
        .sb-btn:hover:not(:disabled){
          background:linear-gradient(135deg,#7173f4 0%,#6056f0 100%);
          transform:translateY(-1px);
          box-shadow:0 8px 25px rgba(99,102,241,0.4);
        }
        .sb-btn:active:not(:disabled){transform:translateY(0)}
        .sb-btn:disabled{opacity:0.6;cursor:not-allowed}
        .dot-loader{display:inline-flex;gap:4px;align-items:center;height:20px}
        .dot-loader span{width:5px;height:5px;background:white;border-radius:50%;animation:bounce 0.6s ease-in-out infinite}
        .dot-loader span:nth-child(2){animation-delay:0.1s}
        .dot-loader span:nth-child(3){animation-delay:0.2s}
        .eye-btn{
          position:absolute;right:12px;top:50%;transform:translateY(-50%);
          background:none;border:none;cursor:pointer;
          color:rgba(255,255,255,0.28);padding:4px;
          display:flex;align-items:center;transition:color 0.15s;
        }
        .eye-btn:hover{color:rgba(255,255,255,0.65)}
        .fp-link{
          color:rgba(99,102,241,0.7);font-size:13px;text-decoration:none;
          display:inline-flex;align-items:center;gap:5px;transition:color 0.15s;
        }
        .fp-link:hover{color:rgba(148,163,184,0.9)}
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 20% 50%,rgba(99,102,241,0.08) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(234,179,8,0.05) 0%,transparent 50%),#09090f',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}>
        {/* Grid background */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        <div className="card-fade" style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="pulse-ring" style={{ marginBottom: '16px' }}>
              <div className="bell-float" style={{ fontSize: '52px', lineHeight: 1, display: 'block' }}>🔔</div>
            </div>
            <h1 style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: 800, margin: '0 0 5px', letterSpacing: '-0.5px' }}>
              SmartBell
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: '0 0 10px' }}>
              School Bell Management System
            </p>
            <span style={{
              display: 'inline-block', background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)', borderRadius: '20px',
              padding: '2px 10px', fontSize: '11px', color: 'rgba(148,163,184,0.7)',
              fontFamily: 'monospace', letterSpacing: '0.5px',
            }}>v2.0</span>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px', padding: '32px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.05)',
          }}>
            <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>
              Welcome back
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '13px', margin: '0 0 24px' }}>
              Sign in to manage your school bells
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Username */}
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' }}>
                  Username
                </label>
                <input className="sb-input"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="Enter your username"
                  required autoComplete="username" autoFocus
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input className="sb-input"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    type={show ? 'text' : 'password'}
                    placeholder="Enter your password"
                    required autoComplete="current-password"
                    style={{ paddingRight: '44px' }}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShow(s => !s)} tabIndex={-1}>
                    {show ? (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px', padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: '#fca5a5', fontSize: '13px',
                }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button type="submit" disabled={loading} className="sb-btn" style={{ marginTop: '4px' }}>
                {loading ? (
                  <div className="dot-loader"><span /><span /><span /></div>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Sign In
                  </span>
                )}
              </button>

            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 16px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '11px' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'center' }}>
              <Link href="/forgot-password" className="fp-link">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.12)', fontSize: '11px', marginTop: '24px', letterSpacing: '0.3px' }}>
            SmartBell v2.0 · Embedded Systems Project
          </p>
        </div>
      </div>
    </>
  );
}
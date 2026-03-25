'use client';
// src/app/forgot-password/page.jsx
import { useState, useRef } from 'react';
import API from '@/lib/api';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirm] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef([]);

    const pwStrength = (pw) => {
        if (!pw) return 0;
        let s = 0;
        if (pw.length >= 8) s++;
        if (pw.length >= 12) s++;
        if (/[A-Z]/.test(pw)) s++;
        if (/[0-9]/.test(pw)) s++;
        if (/[^A-Za-z0-9]/.test(pw)) s++;
        return s;
    };

    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
    const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

    const step1 = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await API.post('/api/auth/forgot-password', { username });
        } catch { }
        finally {
            setLoading(false);
            setStep(2);
        }
    };

    const handleCodeInput = (i, val) => {
        if (!/^\d?$/.test(val)) return;
        const c = [...code]; c[i] = val; setCode(c);
        if (val && i < 5) inputRefs.current[i + 1]?.focus();
    };

    const handleCodeKey = (i, e) => {
        if (e.key === 'Backspace' && !code[i] && i > 0) {
            inputRefs.current[i - 1]?.focus();
        }
        if (e.key === 'ArrowLeft' && i > 0) inputRefs.current[i - 1]?.focus();
        if (e.key === 'ArrowRight' && i < 5) inputRefs.current[i + 1]?.focus();
    };

    const handleCodePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setCode(pasted.split(''));
            inputRefs.current[5]?.focus();
        }
    };

    const step2 = async (e) => {
        e.preventDefault(); setError('');
        const codeStr = code.join('');
        if (codeStr.length !== 6) { setError('Enter all 6 digits'); return; }
        if (newPw !== confirmPw) { setError('Passwords do not match'); return; }
        if (newPw.length < 8) { setError('Password must be at least 8 characters'); return; }
        setLoading(true);
        try {
            await API.post('/api/auth/reset-password', {
                username, code: codeStr, new_password: newPw,
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired reset code.');
        } finally { setLoading(false); }
    };

    const strength = pwStrength(newPw);
    const pwMatch = newPw && confirmPw && newPw === confirmPw;
    const pwNoMatch = confirmPw && newPw !== confirmPw;

    return (
        <>
            <style>{`
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(18px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes bounce {
          0%,80%,100%{transform:scale(0.8);opacity:0.5}
          40%{transform:scale(1.2);opacity:1}
        }
        @keyframes checkPop {
          0%{transform:scale(0);opacity:0}
          70%{transform:scale(1.2)}
          100%{transform:scale(1);opacity:1}
        }
        .fp-fade{animation:fadeUp 0.45s ease-out both}
        .fp-input{
          width:100%;background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);border-radius:10px;
          padding:11px 16px;color:#f1f5f9;font-size:14px;outline:none;
          transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;
          font-family:inherit;box-sizing:border-box;
        }
        .fp-input::placeholder{color:rgba(255,255,255,0.22)}
        .fp-input:focus{
          border-color:rgba(99,102,241,0.7);
          box-shadow:0 0 0 3px rgba(99,102,241,0.15);
          background:rgba(255,255,255,0.07);
        }
        .fp-input:hover:not(:focus){
          border-color:rgba(255,255,255,0.18);
          background:rgba(255,255,255,0.06);
        }
        .fp-input.valid{border-color:rgba(34,197,94,0.5)!important;box-shadow:0 0 0 3px rgba(34,197,94,0.1)!important}
        .fp-input.invalid{border-color:rgba(239,68,68,0.5)!important;box-shadow:0 0 0 3px rgba(239,68,68,0.1)!important}
        .code-box{
          width:46px;height:56px;background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);border-radius:12px;
          text-align:center;color:#f1f5f9;font-size:22px;font-weight:700;
          font-family:monospace;outline:none;
          transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;
          caret-color:rgba(99,102,241,0.8);
        }
        .code-box:focus{
          border-color:rgba(99,102,241,0.8);
          box-shadow:0 0 0 3px rgba(99,102,241,0.18);
          background:rgba(255,255,255,0.08);
        }
        .code-box.filled{
          border-color:rgba(99,102,241,0.5);
          background:rgba(99,102,241,0.08);
        }
        .fp-btn{
          width:100%;font-weight:700;font-size:14px;padding:12px;
          border-radius:10px;border:none;cursor:pointer;
          transition:all 0.2s;font-family:inherit;letter-spacing:0.3px;
        }
        .fp-btn-primary{background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;}
        .fp-btn-primary:hover:not(:disabled){
          background:linear-gradient(135deg,#7173f4,#6056f0);
          transform:translateY(-1px);box-shadow:0 8px 25px rgba(99,102,241,0.4);
        }
        .fp-btn-primary:disabled{opacity:0.55;cursor:not-allowed}
        .fp-btn-success{background:linear-gradient(135deg,#059669,#047857);color:white;}
        .fp-btn-success:hover{background:linear-gradient(135deg,#10b981,#059669)}
        .dot-loader{display:inline-flex;gap:4px;align-items:center;height:20px}
        .dot-loader span{width:5px;height:5px;background:white;border-radius:50%;animation:bounce 0.6s ease-in-out infinite}
        .dot-loader span:nth-child(2){animation-delay:0.1s}
        .dot-loader span:nth-child(3){animation-delay:0.2s}
        .check-anim{animation:checkPop 0.4s ease-out both}
        .step-dot{
          width:8px;height:8px;border-radius:50%;
          transition:all 0.3s;
        }
        .eye-btn2{
          position:absolute;right:12px;top:50%;transform:translateY(-50%);
          background:none;border:none;cursor:pointer;
          color:rgba(255,255,255,0.3);padding:4px;
          display:flex;align-items:center;transition:color 0.15s;
        }
        .eye-btn2:hover{color:rgba(255,255,255,0.65)}
      `}</style>

            <div style={{
                minHeight: '100vh',
                background: 'radial-gradient(ellipse at 30% 60%,rgba(99,102,241,0.07) 0%,transparent 55%),radial-gradient(ellipse at 70% 10%,rgba(16,185,129,0.04) 0%,transparent 50%),#09090f',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
                fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}>
                {/* Grid */}
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',
                    backgroundSize: '50px 50px',
                }} />

                <div className="fp-fade" style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>

                    {/* Back link */}
                    <div style={{ marginBottom: '20px' }}>
                        <Link href="/login" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none',
                            transition: 'color 0.15s',
                        }}
                            onMouseOver={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                            onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back to login
                        </Link>
                    </div>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 16px',
                            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                        }}>🔑</div>
                        <h1 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.3px' }}>
                            Reset your password
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '13px', margin: 0 }}>
                            {step === 1 ? 'Enter your username to get started' : `Enter the code for ${username}`}
                        </p>
                    </div>

                    {/* Step indicators */}
                    {!success && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                            {[1, 2].map(s => (
                                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        background: step >= s ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.06)',
                                        border: step >= s ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '12px', fontWeight: 700,
                                        color: step >= s ? 'white' : 'rgba(255,255,255,0.3)',
                                        transition: 'all 0.3s',
                                    }}>{s}</div>
                                    {s < 2 && <div style={{ width: '32px', height: '1px', background: step > 1 ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Card */}
                    <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '20px', padding: '32px',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}>

                        {/* SUCCESS */}
                        {success && (
                            <div style={{ textAlign: 'center', padding: '12px 0' }}>
                                <div className="check-anim" style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px',
                                }}>
                                    <svg width="28" height="28" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800, margin: '0 0 8px' }}>Password reset!</h2>
                                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.6 }}>
                                    Your password has been changed successfully. You can now sign in with your new password.
                                </p>
                                <Link href="/login">
                                    <button className="fp-btn fp-btn-success">
                                        Go to Sign In →
                                    </button>
                                </Link>
                            </div>
                        )}

                        {/* STEP 1 — Username */}
                        {!success && step === 1 && (
                            <form onSubmit={step1} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{
                                    background: 'rgba(99,102,241,0.07)',
                                    border: '1px solid rgba(99,102,241,0.15)',
                                    borderRadius: '10px', padding: '12px 14px',
                                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                                }}>
                                    <svg width="15" height="15" fill="none" stroke="rgba(148,163,184,0.7)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '12.5px', lineHeight: 1.6, margin: 0 }}>
                                        Ask your <strong style={{ color: 'rgba(200,210,255,0.9)' }}>system administrator</strong> to generate a 6-digit reset code for your account after this step.
                                    </p>
                                </div>

                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' }}>
                                        Username
                                    </label>
                                    <input className="fp-input"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Enter your username"
                                        required autoFocus
                                    />
                                </div>

                                <button type="submit" disabled={loading || !username.trim()} className="fp-btn fp-btn-primary" style={{ marginTop: '4px' }}>
                                    {loading ? <div className="dot-loader"><span /><span /><span /></div> : (
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            Continue
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </span>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* STEP 2 — Code + new password */}
                        {!success && step === 2 && (
                            <form onSubmit={step2} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                                {/* Admin instruction */}
                                <div style={{
                                    background: 'rgba(234,179,8,0.06)',
                                    border: '1px solid rgba(234,179,8,0.2)',
                                    borderRadius: '10px', padding: '12px 14px',
                                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                                }}>
                                    <span style={{ fontSize: '16px', flexShrink: 0 }}>👨‍💼</span>
                                    <div>
                                        <p style={{ color: 'rgba(234,179,8,0.9)', fontSize: '12px', fontWeight: 600, margin: '0 0 2px' }}>
                                            Admin action required
                                        </p>
                                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
                                            Ask your admin to open <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Users tab → 🔑 icon</strong> next to <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{username}</strong> to get a 6-digit code.
                                        </p>
                                    </div>
                                </div>

                                {/* 6-digit code */}
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '10px' }}>
                                        6-digit reset code
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }} onPaste={handleCodePaste}>
                                        {code.map((d, i) => (
                                            <input
                                                key={i}
                                                ref={el => inputRefs.current[i] = el}
                                                className={`code-box ${d ? 'filled' : ''}`}
                                                value={d}
                                                onChange={e => handleCodeInput(i, e.target.value)}
                                                onKeyDown={e => handleCodeKey(i, e)}
                                                maxLength={1}
                                                inputMode="numeric"
                                            />
                                        ))}
                                    </div>
                                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginTop: '8px' }}>
                                        You can also paste the 6-digit code directly
                                    </p>
                                </div>

                                {/* New password */}
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' }}>
                                        New password
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            className="fp-input"
                                            value={newPw}
                                            onChange={e => setNewPw(e.target.value)}
                                            type={showPw ? 'text' : 'password'}
                                            placeholder="Min 8 characters"
                                            required
                                            style={{ paddingRight: '44px' }}
                                        />
                                        <button type="button" className="eye-btn2" onClick={() => setShowPw(s => !s)} tabIndex={-1}>
                                            {showPw ? (
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
                                    {/* Strength bar */}
                                    {newPw && (
                                        <div style={{ marginTop: '8px' }}>
                                            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} style={{
                                                        flex: 1, height: '3px', borderRadius: '2px',
                                                        background: i <= strength ? strengthColor[strength] : 'rgba(255,255,255,0.08)',
                                                        transition: 'background 0.3s',
                                                    }} />
                                                ))}
                                            </div>
                                            <p style={{ fontSize: '11px', color: strengthColor[strength], margin: 0, textAlign: 'right' }}>
                                                {strengthLabel[strength]}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm password */}
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' }}>
                                        Confirm password
                                    </label>
                                    <input
                                        className={`fp-input ${pwMatch ? 'valid' : pwNoMatch ? 'invalid' : ''}`}
                                        value={confirmPw}
                                        onChange={e => setConfirm(e.target.value)}
                                        type="password"
                                        placeholder="Repeat new password"
                                        required
                                    />
                                    {confirmPw && (
                                        <p style={{ fontSize: '12px', marginTop: '5px', color: pwMatch ? '#22c55e' : '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {pwMatch ? (
                                                <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>Passwords match</>
                                            ) : (
                                                <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>Passwords do not match</>
                                            )}
                                        </p>
                                    )}
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

                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                    <button type="button" onClick={() => { setStep(1); setError(''); setCode(['', '', '', '', '', '']) }}
                                        style={{
                                            flex: '0 0 auto', background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '10px', padding: '12px 16px',
                                            color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                                            fontSize: '13px', fontFamily: 'inherit', transition: 'all 0.15s',
                                        }}
                                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}>
                                        ← Back
                                    </button>
                                    <button type="submit" disabled={loading} className="fp-btn fp-btn-primary" style={{ flex: 1 }}>
                                        {loading ? <div className="dot-loader"><span /><span /><span /></div> : 'Reset Password'}
                                    </button>
                                </div>

                            </form>
                        )}

                    </div>

                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.1)', fontSize: '11px', marginTop: '24px' }}>
                        SmartBell v2.0 · Password Recovery
                    </p>
                </div>
            </div>
        </>
    );
}
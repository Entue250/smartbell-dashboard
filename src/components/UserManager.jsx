'use client';
// src/components/UserManager.jsx
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { useAuth } from '@/lib/auth';

const ROLE_CFG = {
  admin: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', color: '#fca5a5', icon: '👑' },
  teacher: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', color: '#a5b4fc', icon: '🎓' },
  viewer: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', color: '#86efac', icon: '👁' },
};

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', padding: '10px 14px',
  color: '#f1f5f9', fontSize: '14px', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'inherit',
};

export default function UserManager({ onRefresh }) {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', role: 'teacher' });
  const [confirmDel, setConfirmDel] = useState(null);
  const [resetModal, setResetModal] = useState(null);
  const [signupEnabled, setSignupEnabled] = useState(false);
  const [addError, setAddError] = useState('');

  const load = async () => {
    const [u, s] = await Promise.all([API.get('/api/users'), API.get('/api/auth/signup-status')]);
    setUsers(u.data); setSignupEnabled(s.data.enabled);
  };
  useEffect(() => { load(); }, []);

  const addUser = async () => {
    setAddError('');
    if (form.password.length < 8) { setAddError('Password must be at least 8 characters'); return; }
    try {
      await API.post('/api/auth/register', form);
      setShowAdd(false); setForm({ username: '', password: '', role: 'teacher' });
      load();
    } catch (e) { setAddError(e.response?.data?.error || 'Failed to create user'); }
  };

  const del = async (uid) => {
    await API.delete(`/api/users/${uid}`); setConfirmDel(null); load();
  };

  const generateResetCode = async (u) => {
    try {
      const r = await API.post('/api/auth/generate-reset-code', { user_id: u.id });
      setResetModal({ user: u, code: r.data.code, copied: false });
    } catch (e) { alert(e.response?.data?.error || 'Failed'); }
  };

  const toggleSignup = async () => {
    await API.post('/api/auth/signup-toggle', { enabled: !signupEnabled });
    setSignupEnabled(!signupEnabled);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(resetModal.code);
    setResetModal(r => ({ ...r, copied: true }));
    setTimeout(() => setResetModal(r => ({ ...r, copied: false })), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit' }}>

      {/* Reset Code Modal */}
      {resetModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={e => { if (e.target === e.currentTarget) setResetModal(null); }}>
          <div style={{
            background: '#111118', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '360px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔑</div>
              <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>Reset Code Generated</h3>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: 0 }}>
                For: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{resetModal.user.username}</strong>
              </p>
            </div>
            {/* Code display */}
            <div style={{
              background: '#0a0a12', borderRadius: '14px', padding: '20px',
              textAlign: 'center', marginBottom: '16px',
              border: '1px solid rgba(234,179,8,0.2)',
            }}>
              <div style={{
                fontFamily: '"Courier New", monospace', fontSize: '36px', fontWeight: 700,
                letterSpacing: '0.4em', color: '#fbbf24',
                textShadow: '0 0 20px rgba(251,191,36,0.4)',
              }}>{resetModal.code}</div>
            </div>
            <div style={{
              background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)',
              borderRadius: '10px', padding: '10px 14px',
              display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '16px',
            }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <p style={{ color: 'rgba(234,179,8,0.8)', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
                Show this to the user once. Valid for <strong>30 minutes</strong>. Cannot be retrieved again.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={copyCode} style={{
                flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                fontFamily: 'inherit', cursor: 'pointer',
                background: resetModal.copied ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                border: resetModal.copied ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.1)',
                color: resetModal.copied ? '#4ade80' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s',
              }}>
                {resetModal.copied ? '✓ Copied!' : '📋 Copy Code'}
              </button>
              <button onClick={() => setResetModal(null)} style={{
                flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                fontFamily: 'inherit', cursor: 'pointer',
                background: 'rgba(99,102,241,0.8)', border: 'none', color: 'white',
              }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '12px', padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          <p style={{ color: '#fca5a5', fontSize: '13px', margin: 0 }}>
            Delete <strong style={{ color: 'white' }}>{confirmDel.username}</strong>? This cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button onClick={() => setConfirmDel(null)} style={{
              padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
              fontFamily: 'inherit', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)',
            }}>Cancel</button>
            <button onClick={() => del(confirmDel.id)} style={{
              padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer',
              background: 'rgba(239,68,68,0.8)', border: 'none', color: 'white',
            }}>Delete</button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={() => { setShowAdd(s => !s); setAddError(''); }} style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
          fontFamily: 'inherit', cursor: 'pointer',
          background: 'rgba(99,102,241,0.8)', border: 'none', color: 'white',
          boxShadow: '0 4px 12px rgba(99,102,241,0.25)', transition: 'all 0.2s',
        }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          Add User
        </button>
        {/* Self-signup toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Self-signup</span>
          <div onClick={toggleSignup} style={{
            width: '40px', height: '22px', borderRadius: '11px', position: 'relative', cursor: 'pointer',
            background: signupEnabled ? 'rgba(34,197,94,0.7)' : 'rgba(255,255,255,0.1)',
            border: signupEnabled ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.25s',
          }}>
            <div style={{
              position: 'absolute', top: '3px', width: '16px', height: '16px', borderRadius: '50%',
              background: 'white', transition: 'left 0.25s',
              left: signupEnabled ? '21px' : '3px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }} />
          </div>
          <span style={{ fontSize: '11px', color: signupEnabled ? '#4ade80' : 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
            {signupEnabled ? 'On' : 'Off'}
          </span>
        </div>
      </div>

      {/* Add user form */}
      {showAdd && (
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px', padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <h4 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700, margin: 0 }}>New User</h4>
          <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            style={inputStyle} placeholder="Username"
            onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
          />
          <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            style={inputStyle} placeholder="Password (min 8 characters)"
            onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
          />
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
            <option value="viewer" style={{ background: '#111' }}>Viewer</option>
            <option value="teacher" style={{ background: '#111' }}>Teacher</option>
            <option value="admin" style={{ background: '#111' }}>Admin</option>
          </select>
          {addError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '8px 12px', color: '#fca5a5', fontSize: '12px' }}>
              {addError}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { setShowAdd(false); setAddError(''); }} style={{
              flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontFamily: 'inherit', cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)',
            }}>Cancel</button>
            <button onClick={addUser} style={{
              flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
              background: 'rgba(99,102,241,0.8)', border: 'none', color: 'white',
            }}>Create User</button>
          </div>
        </div>
      )}

      {/* User list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {users.map(u => {
          const rc = ROLE_CFG[u.role] || ROLE_CFG.viewer;
          const isSelf = u.username === user?.username;
          return (
            <div key={u.id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: '12px',
              transition: 'border-color 0.15s',
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
            >
              {/* Avatar */}
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                background: rc.bg, border: `1px solid ${rc.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px',
              }}>{rc.icon}</div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '14px' }}>{u.username}</span>
                  {isSelf && <span style={{ fontSize: '10px', color: 'rgba(99,102,241,0.7)', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '1px 7px' }}>you</span>}
                </div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                  Joined {new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                </span>
              </div>
              {/* Role badge */}
              <span style={{
                fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.5px',
                background: rc.bg, border: `1px solid ${rc.border}`, color: rc.color,
                padding: '3px 10px', borderRadius: '20px',
              }}>{u.role}</span>
              {/* Actions */}
              {!isSelf && (
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => generateResetCode(u)} title="Generate reset code" style={{
                    width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                    transition: 'all 0.15s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(234,179,8,0.4)'; e.currentTarget.style.color = '#fbbf24' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}>
                    🔑
                  </button>
                  <button onClick={() => setConfirmDel(u)} title="Delete user" style={{
                    width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = '#f87171' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
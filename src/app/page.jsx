'use client';
// src/app/page.jsx — SmartBell v2 Dashboards
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import API from '@/lib/api';

import ScheduleTable from '@/components/ScheduleTable';
import RingLogs from '@/components/RingLogs';
import ManualRing from '@/components/ManualRing';
import UserManager from '@/components/UserManager';
import TodayTimeline from '@/components/TodayTimeline';
import Analytics from '@/components/Analytics';
import SoundSettings from '@/components/SoundSettings';
import Templates from '@/components/Templates';
import ChangePasswordModal from '@/components/ChangePasswordModal';

// ── icons (inline SVG — no lucide dependency on this page) ────────────────
const Icon = ({ d, size = 16, ...rest }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...rest}>
    {d}
  </svg>
);
const ICONS = {
  bell: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />,
  wifi: <><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" fill="currentColor" /></>,
  wifiOff: <><line x1="1" y1="1" x2="23" y2="23" /><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" /><path d="M10.71 5.05A16 16 0 0 1 22.56 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" fill="currentColor" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  barChart: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
  volume: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></>,
  layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  cpu: <><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></>,
  key: <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  menu: <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>,
};

// ── Tabs config ───────────────────────────────────────────────────────────
const TABS_BASE = [
  { id: 'timeline', label: 'Timeline', icon: 'clock', adminOnly: false },
  { id: 'schedules', label: 'Schedules', icon: 'calendar', adminOnly: false },
  { id: 'logs', label: 'Logs', icon: 'activity', adminOnly: false },
  { id: 'analytics', label: 'Analytics', icon: 'barChart', adminOnly: false },
  { id: 'sounds', label: 'Sounds', icon: 'volume', adminOnly: false },
  { id: 'templates', label: 'Templates', icon: 'layers', adminOnly: true },
  { id: 'users', label: 'Users', icon: 'users', adminOnly: true },
  { id: 'health', label: 'Health', icon: 'cpu', adminOnly: true },
];

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon, sub }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px', padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: '4px',
      transition: 'border-color 0.2s',
    }}
      onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
      onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: '16px' }}>{icon}</span>
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '2px' }}>{sub}</div>}
    </div>
  );
}

// ── Health card ───────────────────────────────────────────────────────────
function HealthCard() {
  const [h, setH] = useState(null);
  useEffect(() => {
    const fetch = () => API.get('/api/health').then(r => setH(r.data)).catch(() => { });
    fetch();
    const id = setInterval(fetch, 10000);
    return () => clearInterval(id);
  }, []);

  if (!h) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>
      <div style={{ fontSize: '28px', marginBottom: '12px', opacity: 0.4 }}>💻</div>
      Loading system health...
    </div>
  );

  const color = v => v >= 90 ? '#f87171' : v >= 70 ? '#fbbf24' : '#4ade80';
  const bg = v => v >= 90 ? 'rgba(239,68,68,0.1)' : v >= 70 ? 'rgba(234,179,8,0.1)' : 'rgba(34,197,94,0.1)';
  const border = v => v >= 90 ? 'rgba(239,68,68,0.25)' : v >= 70 ? 'rgba(234,179,8,0.25)' : 'rgba(34,197,94,0.25)';

  const metrics = [
    { label: 'CPU Usage', value: h.cpu_percent, unit: '%', icon: '⚡', progress: true },
    { label: 'RAM Usage', value: h.ram_percent, unit: '%', icon: '🧠', progress: true },
    { label: 'Disk Usage', value: h.disk_percent, unit: '%', icon: '💾', progress: true },
    { label: 'CPU Temp', value: h.cpu_temp_c, unit: '°C', icon: '🌡', progress: false },
    { label: 'Uptime', value: h.uptime_hours?.toFixed(1), unit: 'h', icon: '⏱', progress: false },
    { label: 'Arduino', value: h.arduino, unit: '', icon: '🔌', progress: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit' }}>
      <div>
        <h2 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>System Health</h2>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0 }}>Raspberry Pi live metrics — refreshes every 10s</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        {metrics.map((m, i) => {
          const isConnected = m.value === 'connected';
          const isNum = typeof m.value === 'number';
          const c = isNum ? color(m.value) : isConnected ? '#4ade80' : '#f87171';
          return (
            <div key={i} style={{
              background: isNum ? bg(m.value) : isConnected ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
              border: `1px solid ${isNum ? border(m.value) : isConnected ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
              borderRadius: '14px', padding: '18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{m.label}</span>
                <span style={{ fontSize: '18px' }}>{m.icon}</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: 700, color: c, lineHeight: 1 }}>
                {m.value ?? '—'}{m.unit}
              </div>
              {m.progress && isNum && (
                <div style={{ marginTop: '10px', height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '2px',
                    background: c, width: `${Math.min(m.value || 0, 100)}%`,
                    transition: 'width 1s ease',
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [status, setStatus] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('timeline');
  const [showChangePw, setShowChangePw] = useState(false);
  const [liveAlert, setLiveAlert] = useState(null);
  const [bellActive, setBellActive] = useState(false);
  const [arduinoError, setArduinoError] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const bellTimerRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const loadData = useCallback(async () => {
    try {
      const [s, l, st] = await Promise.all([
        API.get('/api/schedules'),
        API.get('/api/logs'),
        API.get('/api/status'),
      ]);
      setSchedules(s.data); setLogs(l.data); setStatus(st.data);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    if (!user) return;
    loadData();
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000');
    socket.on('bell_rang', (data) => {
      setLiveAlert({ type: 'bell', msg: `🔔 ${data.name} rang at ${data.time}` });
      setBellActive(true);
      loadData();
      clearTimeout(bellTimerRef.current);
      bellTimerRef.current = setTimeout(() => { setBellActive(false); setLiveAlert(null); }, 30000);
    });
    socket.on('bell_stopped', () => {
      setBellActive(false);
      setLiveAlert({ type: 'stop', msg: '⬛ Bell silenced' });
      setTimeout(() => setLiveAlert(null), 3000);
    });
    socket.on('arduino_error', (data) => setArduinoError(data.message));
    socket.on('lcd_updated', () => { });
    return () => { socket.disconnect(); clearTimeout(bellTimerRef.current); };
  }, [user, loadData]);

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#09090f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px', animation: 'pulse 1.5s ease-in-out infinite' }}>🔔</div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontFamily: 'monospace' }}>Loading SmartBell v2...</p>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
  if (!user) return null;

  const canEdit = ['admin', 'teacher'].includes(user.role);
  const isAdmin = user.role === 'admin';
  const tabs = TABS_BASE.filter(t => !t.adminOnly || isAdmin);

  const roleColor = { admin: '#f87171', teacher: '#a5b4fc', viewer: '#86efac' }[user.role] || '#e2e8f0';

  return (
    <>
      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bellBounce { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-15deg)} 75%{transform:rotate(15deg)} }
        .alert-bell { animation: bellBounce 0.4s ease-in-out 3; }
        .tab-btn::-webkit-scrollbar{display:none}
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 0% 0%, rgba(99,102,241,0.04) 0%, transparent 50%), #09090f',
        color: '#f1f5f9', fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>

        {showChangePw && <ChangePasswordModal onClose={() => setShowChangePw(false)} />}

        {/* Arduino error */}
        {arduinoError && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.25)',
            padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: '13px',
          }}>
            <span style={{ color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ {arduinoError}
            </span>
            <button onClick={() => setArduinoError(null)} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
              cursor: 'pointer', fontSize: '16px', lineHeight: 1,
            }}>✕</button>
          </div>
        )}

        {/* Live bell toast */}
        {liveAlert && (
          <div className={liveAlert.type === 'bell' ? 'alert-bell' : ''} style={{
            position: 'fixed', top: '20px', right: '20px', zIndex: 50,
            padding: '12px 18px', borderRadius: '14px',
            fontWeight: 700, fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            animation: 'slideDown 0.3s ease-out',
            background: liveAlert.type === 'bell' ? '#fbbf24' : 'rgba(30,30,40,0.95)',
            color: liveAlert.type === 'bell' ? '#1a0f00' : '#f1f5f9',
            border: liveAlert.type === 'bell' ? 'none' : '1px solid rgba(255,255,255,0.1)',
          }}>
            {liveAlert.msg}
          </div>
        )}

        {/* ── Header ───────────────────────────────────────────────────── */}
        <header style={{
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '0 20px', height: '56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 30,
          backdropFilter: 'blur(20px)',
        }}>
          {/* Left — logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            }}>🔔</div>
            <span style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.3px' }}>SmartBell</span>
            <span style={{
              fontFamily: 'monospace', fontSize: '10px',
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
              color: 'rgba(148,163,184,0.6)', padding: '1px 7px', borderRadius: '20px',
            }}>v2.0</span>
          </div>

          {/* Right — status + actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Arduino status pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
              background: status?.arduino === 'connected' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${status?.arduino === 'connected' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
              color: status?.arduino === 'connected' ? '#4ade80' : '#f87171',
            }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
              <span className="hidden-mobile">{status?.arduino === 'connected' ? 'Arduino' : 'No Arduino'}</span>
            </div>

            {/* User pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '4px 10px', borderRadius: '20px', fontSize: '11px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700
              }}>
                {user.username[0].toUpperCase()}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>{user.username}</span>
              <span style={{ color: roleColor, fontWeight: 700 }}>{user.role}</span>
            </div>

            {/* Change password */}
            <button onClick={() => setShowChangePw(true)} title="Change password" style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
              fontFamily: 'inherit', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)', transition: 'all 0.15s',
            }}
              onMouseOver={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
              onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
              <Icon d={ICONS.key} size={13} />
              <span style={{ display: 'none' }} className="sm-show">Password</span>
            </button>

            {/* Logout */}
            <button onClick={logout} title="Logout" style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
              fontFamily: 'inherit', cursor: 'pointer',
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
              color: 'rgba(239,68,68,0.6)', transition: 'all 0.15s',
            }}
              onMouseOver={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.background = 'rgba(239,68,68,0.12)' }}
              onMouseOut={e => { e.currentTarget.style.color = 'rgba(239,68,68,0.6)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'; e.currentTarget.style.background = 'rgba(239,68,68,0.06)' }}>
              <Icon d={ICONS.logout} size={13} />
              <span style={{ display: 'none' }} className="sm-show">Logout</span>
            </button>
          </div>
        </header>

        {/* ── Tab nav ───────────────────────────────────────────────────── */}
        <nav style={{
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 16px',
          display: 'flex', overflowX: 'auto', gap: '2px',
        }}
          className="tab-btn">
          {tabs.map(t => {
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '12px 14px', fontSize: '12px', fontWeight: active ? 700 : 500,
                fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap',
                background: 'none', border: 'none',
                borderBottom: `2px solid ${active ? 'rgba(99,102,241,0.8)' : 'transparent'}`,
                color: active ? '#a5b4fc' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.15s',
              }}
                onMouseOver={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseOut={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  {ICONS[t.icon]}
                </svg>
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 16px 60px' }}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}
            className="stats-grid">
            <StatCard
              label="Current Time" icon="🕐"
              value={status?.time?.slice(0, 5) || '--:--'}
              color="#93c5fd"
            />
            <StatCard
              label="Rings Today" icon="🔔"
              value={status?.rings_today ?? '—'}
              color="#fde047"
              sub={status?.rings_today > 0 ? 'rings logged' : 'none yet'}
            />
            <StatCard
              label="Next Bell" icon="⏰"
              value={status?.next_bell?.ring_time || 'Done'}
              color="#4ade80"
              sub={status?.next_bell?.name || (status ? 'No more today' : '')}
            />
            <StatCard
              label="Arduino" icon={status?.arduino === 'connected' ? '🟢' : '🔴'}
              value={status?.arduino || '—'}
              color={status?.arduino === 'connected' ? '#4ade80' : '#f87171'}
            />
          </div>

          {/* Tab content */}
          <div style={{ animation: 'slideDown 0.2s ease-out' }} key={activeTab}>
            {activeTab === 'timeline' && (
              <div style={{ display: 'grid', gridTemplateColumns: canEdit ? '1fr 360px' : '1fr', gap: '16px' }}
                className="timeline-grid">
                <TodayTimeline canEdit={canEdit} onRing={loadData} />
                {canEdit && <ManualRing onRing={loadData} bellActive={bellActive} onBellActiveChange={setBellActive} />}
              </div>
            )}
            {activeTab === 'schedules' && <ScheduleTable schedules={schedules} canEdit={canEdit} isAdmin={isAdmin} onRefresh={loadData} />}
            {activeTab === 'logs' && <RingLogs logs={logs} showAll />}
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'sounds' && <SoundSettings />}
            {activeTab === 'templates' && isAdmin && <Templates isAdmin={isAdmin} onRefresh={loadData} />}
            {activeTab === 'users' && isAdmin && <UserManager onRefresh={loadData} />}
            {activeTab === 'health' && isAdmin && <HealthCard />}
          </div>
        </main>

        <style>{`
          @media (max-width: 640px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .timeline-grid { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 400px) {
            .stats-grid { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </div>
    </>
  );
}
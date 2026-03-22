'use client';
// src/components/ManualRing.jsx
import { useState } from 'react';
import API from '@/lib/api';
import PatternSelect from './PatternSelect';
import LCDPreview from './LCDPreview';

const LED_OPTIONS = [
  { value: 'GREEN', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.35)' },
  { value: 'YELLOW', color: '#eab308', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.35)' },
  { value: 'RED', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)' },
];

const Section = ({ title, children }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px', padding: '20px',
    display: 'flex', flexDirection: 'column', gap: '16px',
  }}>{title && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <h3 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700, margin: 0 }}>{title}</h3>
    </div>
  )}{children}</div>
);

export default function ManualRing({ onRing, bellActive, onBellActiveChange }) {
  const [form, setForm] = useState({
    name: 'MANUAL RING', pattern: 'LONG_SHORT',
    led_color: 'GREEN', lcd_line1: 'MANUAL RING', lcd_line2: '',
  });
  const [loading, setLoading] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [lcdLine1, setLcdLine1] = useState('');
  const [lcdLine2, setLcdLine2] = useState('');
  const [overrideStatus, setOverrideStatus] = useState(null);

  const ring = async () => {
    setLoading(true);
    try {
      await API.post('/api/ring-now', form);
      if (onRing) onRing();
    } catch (e) { alert(e.response?.data?.error || 'Ring failed'); }
    finally { setLoading(false); }
  };

  const silence = async () => {
    setStopping(true);
    try {
      await API.post('/api/ring-stop');
      if (onBellActiveChange) onBellActiveChange(false);
    } catch (e) { alert(e.response?.data?.error || 'Silence failed'); }
    finally { setStopping(false); }
  };

  const pushLCD = async () => {
    if (!lcdLine1.trim()) return;
    try {
      await API.post('/api/lcd-override', { line1: lcdLine1, line2: lcdLine2 });
      setOverrideStatus('pushed');
      setTimeout(() => setOverrideStatus(null), 2000);
    } catch { setOverrideStatus('error'); }
  };

  const clearLCD = async () => {
    try {
      await API.delete('/api/lcd-override');
      setLcdLine1(''); setLcdLine2('');
      setOverrideStatus('cleared');
      setTimeout(() => setOverrideStatus(null), 2000);
    } catch { }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', padding: '9px 12px',
    color: '#f1f5f9', fontSize: '13px', fontFamily: 'monospace', outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'inherit' }}>

      {/* Manual ring */}
      <Section title="🔔 Manual Ring">
        <PatternSelect value={form.pattern} onChange={v => setForm(f => ({ ...f, pattern: v }))} />

        {/* LED selector */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' }}>
            LED Color
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {LED_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setForm(f => ({ ...f, led_color: opt.value }))}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                  fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.15s',
                  background: form.led_color === opt.value ? opt.bg : 'rgba(255,255,255,0.04)',
                  border: form.led_color === opt.value ? `1px solid ${opt.border}` : '1px solid rgba(255,255,255,0.08)',
                  color: form.led_color === opt.value ? opt.color : 'rgba(255,255,255,0.3)',
                }}>
                {opt.value}
              </button>
            ))}
          </div>
        </div>

        {/* LCD lines */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '5px' }}>
              Line 1 ({16 - (form.lcd_line1?.length || 0)} left)
            </label>
            <input value={form.lcd_line1} maxLength={16}
              onChange={e => setForm(f => ({ ...f, lcd_line1: e.target.value }))}
              style={inputStyle} placeholder="LCD line 1"
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '5px' }}>
              Line 2 ({16 - (form.lcd_line2?.length || 0)} left)
            </label>
            <input value={form.lcd_line2} maxLength={16}
              onChange={e => setForm(f => ({ ...f, lcd_line2: e.target.value }))}
              style={inputStyle} placeholder="LCD line 2"
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
        </div>

        <LCDPreview label="Preview" line1={form.lcd_line1} line2={form.lcd_line2} />

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={ring} disabled={loading} style={{
            flex: 1, padding: '11px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
            fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? 'rgba(234,179,8,0.4)' : 'rgba(234,179,8,0.9)',
            border: 'none', color: '#1a1000',
            boxShadow: loading ? 'none' : '0 4px 14px rgba(234,179,8,0.3)',
            transition: 'all 0.2s',
          }}>
            {loading ? '⏳ Ringing...' : '🔔 Ring Now'}
          </button>
          <button onClick={silence} disabled={stopping || !bellActive} style={{
            padding: '11px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
            fontFamily: 'inherit', cursor: (!bellActive || stopping) ? 'not-allowed' : 'pointer',
            background: 'transparent',
            border: bellActive ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color: bellActive ? '#f87171' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.2s',
          }}>
            {stopping ? '...' : '⬛ Silence'}
          </button>
        </div>
        {!bellActive && (
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            Silence button activates for 30s after a bell rings
          </p>
        )}
      </Section>

      {/* LCD Override */}
      <Section title="📺 LCD Override">
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
          Push custom text to the LCD immediately, overriding the situation engine.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '5px' }}>
              Line 1 ({16 - (lcdLine1?.length || 0)} left)
            </label>
            <input value={lcdLine1} maxLength={16} onChange={e => setLcdLine1(e.target.value)}
              style={inputStyle} placeholder="Custom line 1"
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '5px' }}>
              Line 2 ({16 - (lcdLine2?.length || 0)} left)
            </label>
            <input value={lcdLine2} maxLength={16} onChange={e => setLcdLine2(e.target.value)}
              style={inputStyle} placeholder="Custom line 2"
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
        </div>
        <LCDPreview label="Preview" line1={lcdLine1} line2={lcdLine2} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={pushLCD} style={{
            flex: 1, padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
            fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
            background: overrideStatus === 'pushed' ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.8)',
            border: overrideStatus === 'pushed' ? '1px solid rgba(34,197,94,0.3)' : 'none',
            color: overrideStatus === 'pushed' ? '#4ade80' : 'white',
            boxShadow: overrideStatus !== 'pushed' ? '0 4px 12px rgba(99,102,241,0.25)' : 'none',
          }}>
            {overrideStatus === 'pushed' ? '✓ Pushed to LCD!' : '📺 Push to LCD'}
          </button>
          <button onClick={clearLCD} style={{
            padding: '10px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: overrideStatus === 'cleared' ? '#4ade80' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.2s',
          }}>
            {overrideStatus === 'cleared' ? '✓ Cleared' : 'Clear'}
          </button>
        </div>
      </Section>
    </div>
  );
}
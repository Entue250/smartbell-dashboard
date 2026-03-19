'use client';
// src/components/RingLogs.jsx
import { PatternBadge } from './PatternSelect';

const SIT_ICONS = {
  CLASS: '📚', BREAK: '☕', LUNCH: '🍽️', EXAM: '📝', EMERGENCY: '🚨',
  WARNING: '⚠️', ASSEMBLY: '🎤', HOLIDAY: '🎉', CUSTOM: '✏️',
};

const TRIGGER_STYLE = {
  schedule: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', color: '#93c5fd', label: 'auto' },
  manual: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.25)', color: '#fde047', label: 'manual' },
  manual_stop: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', color: '#fca5a5', label: 'stopped' },
};

export default function RingLogs({ logs = [], showAll = false }) {
  const display = showAll ? logs : logs.slice(0, 10);

  if (display.length === 0) return (
    <div style={{
      textAlign: 'center', padding: '48px 20px',
      color: 'rgba(255,255,255,0.2)', fontSize: '14px',
    }}>
      <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.3 }}>🔔</div>
      No bell rings logged yet.
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {display.map((l) => {
        const triggerKey = l.triggered_by === 'manual_stop' ? 'manual_stop'
          : l.triggered_by !== 'schedule' ? 'manual' : 'schedule';
        const style = TRIGGER_STYLE[triggerKey] || TRIGGER_STYLE.schedule;
        const ts = l.rang_at
          ? new Date(l.rang_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          : '';
        const dateStr = l.rang_at
          ? new Date(l.rang_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
          : '';
        const sitIcon = SIT_ICONS[l.situation_type] || '🔔';

        return (
          <div key={l.id} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'border-color 0.15s',
          }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
          >
            {/* Situation icon */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
              background: 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px',
            }}>{sitIcon}</div>

            {/* Name + pattern */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 700, color: '#f1f5f9', fontSize: '13px', marginBottom: '3px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {l.schedule_name || 'Ring'}
              </div>
              {l.pattern && <PatternBadge value={l.pattern} />}
            </div>

            {/* Timestamp */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                {ts}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
                {dateStr}
              </div>
            </div>

            {/* Trigger badge */}
            <div style={{
              flexShrink: 0,
              background: style.bg,
              border: `1px solid ${style.border}`,
              color: style.color,
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '0.5px',
              padding: '3px 8px',
              borderRadius: '20px',
            }}>
              {style.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
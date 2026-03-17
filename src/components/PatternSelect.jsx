'use client';
// src/components/PatternSelect.jsx

export const PATTERNS = [
    { value: 'LONG_SHORT', label: 'Class Start', desc: 'E E G — two stabs, one rise', icon: '🟢', color: '#22c55e' },
    { value: 'TRIPLE_SHORT', label: 'Break Time', desc: 'C E G — cheerful ascending', icon: '🟡', color: '#eab308' },
    { value: 'TRIPLE_LONG', label: 'School Ends', desc: 'G E C — slow descending close', icon: '🔴', color: '#ef4444' },
    { value: 'EMERGENCY', label: 'Emergency', desc: 'SOS · · · — — — · · ·', icon: '🚨', color: '#f97316' },
    { value: 'WARNING', label: 'Warning', desc: 'A A — gentle double chime', icon: '⚠️', color: '#f59e0b' },
    { value: 'DOUBLE_PULSE', label: 'Announcement', desc: 'D D — sharp double knock', icon: '📢', color: '#6366f1' },
    { value: 'ASCENDING', label: 'Event Start', desc: 'C E G — rising pitch & duration', icon: '📈', color: '#06b6d4' },
    { value: 'DESCENDING', label: 'Wind Down', desc: 'G E C — falling pitch & duration', icon: '📉', color: '#8b5cf6' },
    { value: 'TRIPLE_DOUBLE', label: 'Roll Call', desc: 'D D × 3 — authority groups', icon: '🎯', color: '#ec4899' },
];

export function getPatternInfo(value) {
    return PATTERNS.find(p => p.value === value) || PATTERNS[0];
}

export default function PatternSelect({ value, onChange }) {
    const selected = getPatternInfo(value);
    return (
        <div>
            <label style={{
                display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.45)',
                fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px',
            }}>
                Buzzer Pattern
            </label>
            <div style={{ position: 'relative' }}>
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        padding: '10px 36px 10px 14px',
                        color: '#f1f5f9',
                        fontSize: '13px',
                        outline: 'none',
                        appearance: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                >
                    {PATTERNS.map(p => (
                        <option key={p.value} value={p.value} style={{ background: '#1a1a2e' }}>
                            {p.icon}  {p.label} — {p.desc}
                        </option>
                    ))}
                </select>
                {/* Custom chevron */}
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg width="12" height="12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>
            {/* Selected pattern info pill */}
            {selected && (
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    marginTop: '8px', padding: '4px 10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                }}>
                    <span style={{ fontSize: '12px' }}>{selected.icon}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{selected.desc}</span>
                </div>
            )}
        </div>
    );
}

export function PatternBadge({ value }) {
    const p = getPatternInfo(value);
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '11px', fontFamily: 'monospace',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.55)',
            padding: '2px 8px', borderRadius: '20px',
        }}>
            {p.icon} {p.label}
        </span>
    );
}
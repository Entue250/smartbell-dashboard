'use client';
// src/components/SoundSettings.jsx
import { useState } from 'react';
import API from '@/lib/api';
import { PATTERNS } from './PatternSelect';
import LCDPreview from './LCDPreview';

const WAVE_BARS = 5;

function WaveIcon({ playing }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px' }}>
            {Array.from({ length: WAVE_BARS }).map((_, i) => (
                <div key={i} style={{
                    width: '3px',
                    borderRadius: '2px',
                    background: playing ? '#6366f1' : 'rgba(255,255,255,0.25)',
                    height: playing ? `${[60, 100, 80, 100, 60][i]}%` : '40%',
                    transition: 'height 0.15s, background 0.15s',
                    animation: playing ? `wave ${0.4 + i * 0.1}s ease-in-out infinite alternate` : 'none',
                }} />
            ))}
            <style>{`@keyframes wave { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
        </div>
    );
}

export default function SoundSettings() {
    const [states, setStates] = useState({});

    const testPattern = async (pattern) => {
        setStates(s => ({ ...s, [pattern.value]: 'loading' }));
        try {
            await API.post('/api/ring-now', {
                name: 'SOUND TEST',
                pattern: pattern.value,
                led_color: 'GREEN',
                lcd_line1: 'SOUND TEST',
                lcd_line2: pattern.label.toUpperCase().slice(0, 16),
            });
            setStates(s => ({ ...s, [pattern.value]: 'done' }));
            setTimeout(() => setStates(s => ({ ...s, [pattern.value]: null })), 2500);
        } catch {
            setStates(s => ({ ...s, [pattern.value]: null }));
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit' }}>

            {/* Info banner */}
            <div style={{
                background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '12px', padding: '12px 16px',
                display: 'flex', alignItems: 'flex-start', gap: '10px',
            }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>🔊</span>
                <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                    Your buzzer is <strong style={{ color: 'rgba(200,210,255,0.9)' }}>passive</strong> — each pattern plays distinct musical notes via <code style={{ fontFamily: 'monospace', background: 'rgba(99,102,241,0.15)', padding: '1px 5px', borderRadius: '4px', fontSize: '12px' }}>tone()</code>. Arduino must be connected to hear sound.
                </p>
            </div>

            {/* Pattern list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {PATTERNS.map((p, idx) => {
                    const st = states[p.value];
                    const isPlaying = st === 'loading';
                    const isDone = st === 'done';
                    return (
                        <div key={p.value} style={{
                            background: isDone ? 'rgba(34,197,94,0.05)' : isPlaying ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.03)',
                            border: isDone ? '1px solid rgba(34,197,94,0.2)' : isPlaying ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '14px',
                            padding: '14px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s',
                        }}>
                            {/* Index + icon */}
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                background: isPlaying ? 'rgba(99,102,241,0.15)' : isDone ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                                border: isPlaying ? '1px solid rgba(99,102,241,0.3)' : isDone ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(255,255,255,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '16px', transition: 'all 0.2s',
                            }}>
                                {isDone ? '✓' : p.icon}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '14px' }}>{p.label}</span>
                                    <span style={{
                                        fontFamily: 'monospace', fontSize: '10px',
                                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                                        color: 'rgba(255,255,255,0.35)', padding: '1px 6px', borderRadius: '4px',
                                    }}>{p.value}</span>
                                    {isPlaying && (
                                        <span style={{ fontSize: '11px', color: 'rgba(99,102,241,0.8)', fontStyle: 'italic' }}>Playing...</span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <WaveIcon playing={isPlaying} />
                                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{p.desc}</span>
                                </div>
                            </div>

                            {/* LCD preview — hidden on small screens */}
                            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}
                                className="hidden md:block">
                                <LCDPreview line1="SOUND TEST" line2={p.label.toUpperCase().slice(0, 16)} />
                            </div>

                            {/* Test button */}
                            <button
                                onClick={() => testPattern(p)}
                                disabled={!!st}
                                style={{
                                    flexShrink: 0,
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    fontSize: '12px', fontWeight: 700,
                                    fontFamily: 'inherit',
                                    cursor: st ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    border: 'none',
                                    background: isDone
                                        ? 'rgba(34,197,94,0.15)'
                                        : isPlaying
                                            ? 'rgba(99,102,241,0.2)'
                                            : 'rgba(99,102,241,0.8)',
                                    color: isDone ? '#4ade80' : isPlaying ? 'rgba(148,163,184,0.7)' : 'white',
                                    boxShadow: (!st && !isDone) ? '0 4px 12px rgba(99,102,241,0.25)' : 'none',
                                }}
                                onMouseOver={e => { if (!st) e.currentTarget.style.background = 'rgba(99,102,241,1)'; }}
                                onMouseOut={e => { if (!st) e.currentTarget.style.background = 'rgba(99,102,241,0.8)'; }}
                            >
                                {isDone ? (
                                    <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg> Done</>
                                ) : isPlaying ? (
                                    '♪ Playing...'
                                ) : (
                                    <><svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg> Test</>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
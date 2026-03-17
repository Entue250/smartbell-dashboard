'use client';
// src/components/LCDPreview.jsx
export default function LCDPreview({ line1 = '', line2 = '', label = '' }) {
    const pad = (s) => (String(s).toUpperCase() + ' '.repeat(16)).slice(0, 16);
    return (
        <div style={{ display: 'inline-block', fontFamily: 'inherit' }}>
            {label && (
                <p style={{
                    fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace',
                    letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px'
                }}>
                    {label}
                </p>
            )}
            <div style={{
                display: 'inline-block',
                background: 'linear-gradient(145deg, #0f1f0f, #162816)',
                border: '1px solid #2a4a2a',
                borderRadius: '10px',
                padding: '10px 12px 8px',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04)',
            }}>
                {/* Screen bezel */}
                <div style={{
                    background: '#0a160a',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.8)',
                    position: 'relative',
                }}>
                    {/* Scanline overlay */}
                    <div style={{
                        position: 'absolute', inset: 0, borderRadius: '6px',
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
                        pointerEvents: 'none', zIndex: 1,
                    }} />
                    <div style={{
                        fontFamily: '"Courier New", Courier, monospace',
                        fontSize: '13px',
                        lineHeight: '20px',
                        letterSpacing: '2px',
                        color: '#4dff6e',
                        textShadow: '0 0 8px rgba(77,255,110,0.6), 0 0 16px rgba(77,255,110,0.3)',
                        userSelect: 'none',
                        position: 'relative',
                        zIndex: 2,
                    }}>
                        <div style={{ whiteSpace: 'pre' }}>{pad(line1)}</div>
                        <div style={{ whiteSpace: 'pre' }}>{pad(line2)}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#1a5c1a', boxShadow: '0 0 4px #1a5c1a' }} />
                    <span style={{ fontSize: '9px', color: '#2a4a2a', fontFamily: 'monospace', letterSpacing: '1px' }}>16×2 LCD</span>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#1a5c1a', boxShadow: '0 0 4px #1a5c1a' }} />
                </div>
            </div>
        </div>
    );
}
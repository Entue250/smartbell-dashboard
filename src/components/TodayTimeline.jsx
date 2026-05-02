'use client';
// src/components/TodayTimeline.jsx
import { useState, useEffect, useCallback } from 'react';
import API from '@/lib/api';
import { PatternBadge } from './PatternSelect';

const SIT_ICONS = {
  CLASS: '📚',
  BREAK: '☕',
  LUNCH: '🍽️',
  EXAM: '📝',
  EMERGENCY: '🚨',
  WARNING: '⚠️',
  ASSEMBLY: '🎤',
  HOLIDAY: '🎉',
  CUSTOM: '✏️',
};

const SIT_COLOR = {
  CLASS: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', text: '#93c5fd' },
  BREAK: { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)', text: '#fde047' },
  LUNCH: { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)', text: '#fdba74' },
  EXAM: { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)', text: '#d8b4fe' },
  EMERGENCY: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#fca5a5' },
  WARNING: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#fcd34d' },
  ASSEMBLY: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', text: '#86efac' },
  HOLIDAY: { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)', text: '#f9a8d4' },
  CUSTOM: { bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)', text: '#9ca3af' },
};

const LED_COLOR = { GREEN: '#22c55e', YELLOW: '#facc15', RED: '#ef4444', OFF: '#6b7280' };

function useCountdown(targetTime) {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    if (!targetTime) return;
    const tick = () => {
      const now = new Date();
      const [hh, mm] = targetTime.split(':').map(Number);
      const target = new Date(now);
      target.setHours(hh, mm, 0, 0);
      const diff = target - now;
      if (diff <= 0) {
        setRemaining('Now!');
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${m}m ${s.toString().padStart(2, '0')}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetTime]);
  return remaining;
}

export default function TodayTimeline({ canEdit, onRing }) {
  const [schedules, setSchedules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [ringStates, setRingStates] = useState({});

  const load = useCallback(async () => {
    try {
      const [sc, lg] = await Promise.all([
        API.get('/api/schedules'),
        API.get('/api/logs?limit=100'),
      ]);
      const now = new Date();
      const dow = ['S', 'M', 'T', 'W', 't', 'F', 's'][now.getDay()];
      setSchedules(sc.data.filter((s) => s.active && (s.days_of_week || 'MTWTF').includes(dow)));
      setLogs(lg.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const nowStr = new Date().toTimeString().slice(0, 5);
  const nextSchedule = schedules.find((s) => s.ring_time > nowStr);
  const countdown = useCountdown(nextSchedule?.ring_time);

  const hasRungToday = (name) => {
    const today = new Date().toISOString().slice(0, 10);
    return logs.some((l) => l.schedule_name === name && l.rang_at?.startsWith(today));
  };

  const testBell = async (s) => {
    setRingStates((r) => ({ ...r, [s.id]: 'loading' }));
    try {
      await API.post('/api/ring-now', {
        name: s.name,
        pattern: s.pattern,
        led_color: s.led_color,
        lcd_line1: s.lcd_line1,
        lcd_line2: s.lcd_line2,
      });
      setRingStates((r) => ({ ...r, [s.id]: 'done' }));
      setTimeout(() => setRingStates((r) => ({ ...r, [s.id]: null })), 2500);
      if (onRing) onRing();
    } catch {
      setRingStates((r) => ({ ...r, [s.id]: null }));
    }
  };

  const S = {
    wrap: { display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit' },
    // Countdown
    cdCard: {
      background: 'linear-gradient(135deg,rgba(79,70,229,0.18),rgba(49,46,129,0.10))',
      border: '1px solid rgba(99,102,241,0.35)',
      borderRadius: '18px',
      padding: '18px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      boxShadow: '0 4px 24px rgba(99,102,241,0.12)',
    },
    cdName: { fontSize: '17px', fontWeight: 800, color: '#e0e7ff', marginBottom: '2px' },
    cdTime: { fontSize: '12px', color: 'rgba(165,180,252,0.5)', fontFamily: 'monospace' },
    cdLabel: {
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '2px',
      color: 'rgba(165,180,252,0.5)',
      textTransform: 'uppercase',
      marginBottom: '6px',
    },
    cdCount: {
      fontSize: '32px',
      fontWeight: 800,
      color: '#a5b4fc',
      fontFamily: 'monospace',
      letterSpacing: '-1px',
      lineHeight: 1,
    },
    cdSub: {
      fontSize: '9px',
      color: 'rgba(165,180,252,0.35)',
      letterSpacing: '2px',
      marginTop: '4px',
      textTransform: 'uppercase',
    },
    // Section header
    secHead: { display: 'flex', alignItems: 'center', gap: '10px' },
    secLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' },
    secTxt: {
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '2px',
      color: 'rgba(255,255,255,0.25)',
      textTransform: 'uppercase',
    },
    // Empty
    empty: { textAlign: 'center', padding: '56px 20px' },
  };

  return (
    <div style={S.wrap}>
      {/* ── Countdown / done card ───────────────────────────── */}
      {nextSchedule ? (
        <div style={S.cdCard}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={S.cdLabel}>Next Bell</p>
            <p style={S.cdName}>{nextSchedule.name}</p>
            <p style={S.cdTime}>{nextSchedule.ring_time}</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={S.cdCount}>{countdown}</div>
            <div style={S.cdSub}>remaining</div>
          </div>
          <div style={{ fontSize: '26px', flexShrink: 0 }}>⏰</div>
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(34,197,94,0.07)',
            border: '1px solid rgba(34,197,94,0.22)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '24px' }}>✅</span>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
              All bells done for today
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>
              See you tomorrow!
            </p>
          </div>
        </div>
      )}

      {/* ── Section header ──────────────────────────────────── */}
      <div style={S.secHead}>
        <span style={S.secTxt}>Today's Schedule</span>
        <div style={S.secLine} />
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
          {schedules.length} bells
        </span>
      </div>

      {/* ── Empty state ─────────────────────────────────────── */}
      {schedules.length === 0 && (
        <div style={S.empty}>
          <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.25 }}>🔔</div>
          <p
            style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', margin: 0 }}
          >
            No bells scheduled for today
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)', marginTop: '6px' }}>
            Check the Schedules tab to add bells
          </p>
        </div>
      )}

      {/* ── Timeline ────────────────────────────────────────── */}
      {schedules.length > 0 && (
        <div style={{ position: 'relative' }}>
          {/* Vertical connector line */}
          <div
            style={{
              position: 'absolute',
              left: '19px',
              top: '14px',
              bottom: '14px',
              width: '1px',
              background:
                'linear-gradient(to bottom, rgba(99,102,241,0.5) 0%, rgba(99,102,241,0.08) 100%)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {schedules.map((s) => {
              const rung = hasRungToday(s.name);
              const isNext = s.id === nextSchedule?.id;
              const rs = ringStates[s.id];
              const sit = SIT_COLOR[s.situation_type] || SIT_COLOR.CUSTOM;
              const led = LED_COLOR[s.led_color] || '#6b7280';

              return (
                <div
                  key={s.id}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingLeft: '44px',
                    paddingRight: '12px',
                    paddingTop: '11px',
                    paddingBottom: '11px',
                    borderRadius: '14px',
                    border: isNext
                      ? '1px solid rgba(99,102,241,0.45)'
                      : rung
                        ? '1px solid rgba(255,255,255,0.05)'
                        : '1px solid rgba(255,255,255,0.08)',
                    background: isNext
                      ? 'rgba(79,70,229,0.13)'
                      : rung
                        ? 'rgba(255,255,255,0.02)'
                        : 'rgba(255,255,255,0.035)',
                    opacity: rung ? 0.55 : 1,
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  {/* Dot on the vertical line */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '9px',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      background: rung
                        ? 'rgba(34,197,94,0.18)'
                        : isNext
                          ? 'rgba(99,102,241,0.28)'
                          : 'rgba(255,255,255,0.06)',
                      border: rung
                        ? '2px solid rgba(34,197,94,0.7)'
                        : isNext
                          ? '2px solid rgba(99,102,241,0.8)'
                          : '2px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    {rung ? (
                      <span style={{ color: '#4ade80', fontSize: '11px' }}>✓</span>
                    ) : isNext ? (
                      <span
                        style={{
                          display: 'block',
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: '#818cf8',
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          display: 'block',
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: led,
                        }}
                      />
                    )}
                  </div>

                  {/* Time */}
                  <div style={{ width: '46px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        letterSpacing: '-0.5px',
                        color: isNext ? '#a5b4fc' : rung ? 'rgba(255,255,255,0.28)' : '#e2e8f0',
                      }}
                    >
                      {s.ring_time}
                    </span>
                  </div>

                  {/* Name + badges */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                        marginBottom: '5px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: isNext ? '#e0e7ff' : rung ? 'rgba(255,255,255,0.3)' : '#f8fafc',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '180px',
                        }}
                      >
                        {s.name}
                      </span>
                      {/* Situation badge */}
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '20px',
                          background: sit.bg,
                          border: `1px solid ${sit.border}`,
                          color: sit.text,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {SIT_ICONS[s.situation_type]} {s.situation_type}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <PatternBadge value={s.pattern} />
                      {s.lcd_line1 && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            color: 'rgba(255,255,255,0.22)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '120px',
                          }}
                        >
                          {s.lcd_line1}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status chips */}
                  {rung && (
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: '10px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        color: '#4ade80',
                        background: 'rgba(34,197,94,0.1)',
                        border: '1px solid rgba(34,197,94,0.25)',
                        padding: '3px 9px',
                        borderRadius: '20px',
                      }}
                    >
                      ✓ Rang
                    </span>
                  )}
                  {isNext && !rung && (
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: '10px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        color: '#818cf8',
                        background: 'rgba(99,102,241,0.12)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        padding: '3px 9px',
                        borderRadius: '20px',
                      }}
                    >
                      Next ›
                    </span>
                  )}

                  {/* Test button */}
                  {canEdit && (
                    <button
                      onClick={() => testBell(s)}
                      disabled={!!rs}
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '7px 13px',
                        borderRadius: '9px',
                        fontSize: '11px',
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        cursor: rs ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s',
                        background:
                          rs === 'done'
                            ? 'rgba(34,197,94,0.15)'
                            : rs === 'loading'
                              ? 'rgba(255,255,255,0.04)'
                              : 'rgba(99,102,241,0.18)',
                        border:
                          rs === 'done'
                            ? '1px solid rgba(34,197,94,0.35)'
                            : rs === 'loading'
                              ? '1px solid rgba(255,255,255,0.08)'
                              : '1px solid rgba(99,102,241,0.4)',
                        color:
                          rs === 'done'
                            ? '#4ade80'
                            : rs === 'loading'
                              ? 'rgba(255,255,255,0.3)'
                              : '#a5b4fc',
                      }}
                    >
                      {rs === 'done' ? '✓ Done' : rs === 'loading' ? '...' : '🔔 Test'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

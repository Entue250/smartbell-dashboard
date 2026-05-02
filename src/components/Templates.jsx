'use client';
// src/components/Templates.jsx — full inline styles, no Tailwind dependency
import { useState, useEffect } from 'react';
import API from '@/lib/api';

const INPUT = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '11px 14px',
  color: '#f1f5f9',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

export default function Templates({ isAdmin, onRefresh }) {
  const [templates, setTemplates] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [activating, setActivating] = useState(null);

  const load = async () => {
    try {
      const [t, s] = await Promise.all([API.get('/api/templates'), API.get('/api/schedules')]);
      setTemplates(t.data);
      setSchedules(s.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createTemplate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await API.post('/api/templates', { name: name.trim() });
      setName('');
      setShowForm(false);
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const activate = async (tid) => {
    setActivating(tid);
    try {
      await API.put(`/api/templates/${tid}/activate`);
      load();
      if (onRefresh) onRefresh();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to activate');
    } finally {
      setActivating(null);
    }
  };

  const del = async (tid) => {
    try {
      await API.delete(`/api/templates/${tid}`);
      setConfirmDel(null);
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to delete');
    }
  };

  const schedulesFor = (tid) => schedules.filter((s) => s.template_id === tid);
  const unassigned = schedules.filter((s) => !s.template_id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit' }}>
      {/* ── Header ──────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 800, margin: 0 }}>
            Schedule Templates
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: '4px 0 0' }}>
            Switch between full schedule sets with one click
          </p>
        </div>
        {isAdmin && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '9px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
              border: 'none',
              color: 'white',
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              transition: 'box-shadow 0.15s',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow = '0 6px 22px rgba(99,102,241,0.45)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)')
            }
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> New Template
          </button>
        )}
      </div>

      {/* ── Delete confirm ───────────────────────────────────── */}
      {confirmDel && (
        <div
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <p style={{ color: '#fca5a5', fontSize: '13px', margin: 0 }}>
            Delete <strong style={{ color: 'white' }}>{confirmDel.name}</strong>? Schedules inside
            will become unassigned.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => setConfirmDel(null)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => del(confirmDel.id)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'inherit',
                cursor: 'pointer',
                background: 'rgba(239,68,68,0.8)',
                border: 'none',
                color: 'white',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* ── Create form ──────────────────────────────────────── */}
      {showForm && (
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '18px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              📋
            </div>
            <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 800, margin: 0 }}>
              New Template
            </h3>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '8px',
              }}
            >
              Template Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createTemplate()}
              placeholder='e.g. "Normal Week", "Exam Week", "Half Day"'
              autoFocus
              style={INPUT}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(99,102,241,0.7)';
                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                setShowForm(false);
                setName('');
              }}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              Cancel
            </button>
            <button
              onClick={createTemplate}
              disabled={loading || !name.trim()}
              style={{
                flex: 2,
                padding: '11px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: 'inherit',
                cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                border: 'none',
                color: 'white',
                opacity: loading || !name.trim() ? 0.5 : 1,
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                transition: 'all 0.15s',
              }}
            >
              {loading ? 'Creating...' : 'Create Template'}
            </button>
          </div>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────── */}
      {templates.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '14px', opacity: 0.2 }}>📋</div>
          <p
            style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', margin: 0 }}
          >
            No templates yet
          </p>
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.18)',
              marginTop: '8px',
              lineHeight: 1.6,
            }}
          >
            Templates let you switch between full schedule sets
            <br />
            (e.g. Normal Week vs Exam Week) with one click.
          </p>
        </div>
      )}

      {/* ── Template cards ───────────────────────────────────── */}
      {templates.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {templates.map((t) => {
            const tSched = schedulesFor(t.id);
            const isActive = t.is_active;
            const isAct = activating === t.id;

            return (
              <div
                key={t.id}
                style={{
                  background: isActive ? 'rgba(79,70,229,0.12)' : 'rgba(255,255,255,0.03)',
                  border: isActive
                    ? '1px solid rgba(99,102,241,0.35)'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '16px 18px',
                  boxShadow: isActive ? '0 4px 20px rgba(99,102,241,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Icon + info */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        flexShrink: 0,
                        background: isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                        border: isActive
                          ? '1px solid rgba(99,102,241,0.35)'
                          : '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}
                    >
                      {isActive ? '⭐' : '📋'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                          marginBottom: '4px',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '15px',
                            fontWeight: 800,
                            margin: 0,
                            color: isActive ? '#e0e7ff' : '#d1d5db',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {t.name}
                        </h3>
                        {isActive && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '1px',
                              color: '#818cf8',
                              background: 'rgba(99,102,241,0.15)',
                              border: '1px solid rgba(99,102,241,0.3)',
                              padding: '2px 8px',
                              borderRadius: '20px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            ● ACTIVE
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.28)', margin: 0 }}>
                        {tSched.length} schedule{tSched.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {isAdmin && !isActive && (
                      <button
                        onClick={() => activate(t.id)}
                        disabled={isAct}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: '9px',
                          fontSize: '12px',
                          fontWeight: 700,
                          fontFamily: 'inherit',
                          cursor: isAct ? 'not-allowed' : 'pointer',
                          background: 'rgba(99,102,241,0.2)',
                          border: '1px solid rgba(99,102,241,0.4)',
                          color: '#a5b4fc',
                          transition: 'all 0.15s',
                          opacity: isAct ? 0.6 : 1,
                        }}
                        onMouseOver={(e) => {
                          if (!isAct) {
                            e.currentTarget.style.background = 'rgba(99,102,241,0.3)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isAct) {
                            e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
                          }
                        }}
                      >
                        {isAct ? '...' : '✓ Activate'}
                      </button>
                    )}
                    {isActive && (
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: '9px',
                          fontSize: '12px',
                          fontWeight: 700,
                          background: 'rgba(99,102,241,0.15)',
                          border: '1px solid rgba(99,102,241,0.3)',
                          color: '#a5b4fc',
                        }}
                      >
                        ⭐ Active
                      </span>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => setConfirmDel(t)}
                        title="Delete template"
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '9px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.35)',
                          transition: 'all 0.15s',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                          e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)';
                          e.currentTarget.style.color = '#f87171';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
                        }}
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>

                {/* Schedule pills */}
                {tSched.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {tSched.map((s) => (
                      <span
                        key={s.id}
                        style={{
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          color: 'rgba(255,255,255,0.35)',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          padding: '3px 9px',
                          borderRadius: '20px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {s.ring_time} {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Unassigned section ───────────────────────────────── */}
      {unassigned.length > 0 && (
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px',
            padding: '16px 18px',
          }}
        >
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '2px',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
              }}
            >
              Unassigned ({unassigned.length})
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.25)',
              lineHeight: 1.6,
              margin: '0 0 12px',
            }}
          >
            These bells ring when <em>no</em> template is active. Assign them via the Schedules tab.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {unassigned.map((s) => (
              <span
                key={s.id}
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.28)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  padding: '3px 9px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.ring_time} {s.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';
// src/components/Analytics.jsx
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import {
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#f1f5f9',
        }}>
            {label && <div style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '4px', fontFamily: 'monospace' }}>{label}</div>}
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color, fontWeight: 700 }}>{p.value} rings</div>
            ))}
        </div>
    );
};

export default function Analytics() {
    const [stats, setStats] = useState(null);
    const [days, setDays] = useState(7);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        API.get(`/api/logs/stats?days=${days}`)
            .then(r => { setStats(r.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [days]);

    const statCards = stats ? [
        { label: 'Total Rings', value: stats.daily_counts.reduce((a, b) => a + b.count, 0), color: '#6366f1', icon: '🔔' },
        { label: 'Auto Rings', value: stats.by_type.find(t => t.triggered_by === 'schedule')?.count ?? 0, color: '#22c55e', icon: '⏱' },
        { label: 'Manual Rings', value: stats.by_type.find(t => t.triggered_by === 'manual')?.count ?? 0, color: '#f59e0b', icon: '👆' },
        { label: 'Active Days', value: stats.daily_counts.filter(d => d.count > 0).length, color: '#06b6d4', icon: '📅' },
    ] : [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'inherit' }}>

            {/* Period selector */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 700, margin: '0 0 2px' }}>Bell Analytics</h2>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0 }}>Ring history and patterns</p>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {[7, 14, 30].map(d => (
                        <button key={d} onClick={() => setDays(d)} style={{
                            padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                            fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
                            background: days === d ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.05)',
                            border: days === d ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                            color: days === d ? 'white' : 'rgba(255,255,255,0.4)',
                        }}>{d}d</button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>
                    <div style={{ fontSize: '28px', marginBottom: '10px', opacity: 0.4 }}>📊</div>
                    Loading analytics...
                </div>
            ) : !stats ? null : (
                <>
                    {/* Stat cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                        {statCards.map((s, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: '14px', padding: '16px',
                            }}>
                                <div style={{ fontSize: '20px', marginBottom: '8px' }}>{s.icon}</div>
                                <div style={{ fontFamily: 'monospace', fontSize: '26px', fontWeight: 700, color: s.color, lineHeight: 1 }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                        {/* Rings per day */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '16px', padding: '20px',
                        }}>
                            <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 700, margin: '0 0 16px' }}>Rings per day</h3>
                            {stats.daily_counts.length === 0
                                ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>No data</div>
                                : (
                                    <ResponsiveContainer width="100%" height={180}>
                                        <BarChart data={stats.daily_counts} barSize={18}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'monospace' }}
                                                tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]}
                                                background={{ fill: 'rgba(255,255,255,0.02)', radius: [4, 4, 0, 0] }} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                        </div>

                        {/* Auto vs Manual pie */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '16px', padding: '20px',
                        }}>
                            <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 700, margin: '0 0 16px' }}>Auto vs manual</h3>
                            {stats.by_type.length === 0
                                ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>No data</div>
                                : (
                                    <>
                                        <ResponsiveContainer width="100%" height={160}>
                                            <PieChart>
                                                <Pie data={stats.by_type} dataKey="count" nameKey="triggered_by"
                                                    cx="50%" cy="50%" outerRadius={65} innerRadius={35} paddingAngle={3}>
                                                    {stats.by_type.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '4px' }}>
                                            {stats.by_type.map((t, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: COLORS[i] }} />
                                                    {t.triggered_by} ({t.count})
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>

                    {/* Activity by hour */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '16px', padding: '20px',
                    }}>
                        <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 700, margin: '0 0 16px' }}>Activity by hour of day</h3>
                        {stats.by_hour.length === 0
                            ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>No data</div>
                            : (
                                <ResponsiveContainer width="100%" height={140}>
                                    <BarChart data={stats.by_hour} barSize={14}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'monospace' }}
                                            tickFormatter={v => `${v}h`} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                                            labelFormatter={v => `${v}:00`} />
                                        <Bar dataKey="count" fill="#22c55e" radius={[3, 3, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                    </div>
                </>
            )}
        </div>
    );
}
'use client';
// src/components/TodayTimeline.jsx
import { useState, useEffect, useCallback } from 'react';
import API from '@/lib/api';
import { PatternBadge } from './PatternSelect';
import { Check, Bell, Clock, ChevronRight } from 'lucide-react';

const LED_COLORS = { GREEN: 'bg-green-500', YELLOW: 'bg-yellow-400', RED: 'bg-red-500', OFF: 'bg-gray-600' };
const SIT_COLORS = {
    CLASS: 'text-blue-400', BREAK: 'text-yellow-400',
    LUNCH: 'text-orange-400', EXAM: 'text-purple-400',
    EMERGENCY: 'text-red-400', WARNING: 'text-orange-400',
    ASSEMBLY: 'text-green-400', HOLIDAY: 'text-pink-400',
    CUSTOM: 'text-gray-400',
};
const SIT_ICONS = {
    CLASS: '📚', BREAK: '☕', LUNCH: '🍽️', EXAM: '📝', EMERGENCY: '🚨',
    WARNING: '⚠️', ASSEMBLY: '🎤', HOLIDAY: '🎉', CUSTOM: '✏️',
};

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
            if (diff <= 0) { setRemaining('Now'); return; }
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
            // Filter to today's schedules
            setSchedules(sc.data.filter(s => s.active && (s.days_of_week || 'MTWTF').includes(dow)));
            setLogs(lg.data);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const nowStr = new Date().toTimeString().slice(0, 5);
    const nextSchedule = schedules.find(s => s.ring_time > nowStr);
    const nextBellTime = nextSchedule?.ring_time;
    const countdown = useCountdown(nextBellTime);

    const hasRungToday = (name) => {
        const today = new Date().toISOString().slice(0, 10);
        return logs.some(l => l.schedule_name === name && l.rang_at?.startsWith(today));
    };

    const testBell = async (s) => {
        setRingStates(r => ({ ...r, [s.id]: 'loading' }));
        try {
            await API.post('/api/ring-now', {
                name: s.name, pattern: s.pattern,
                led_color: s.led_color, lcd_line1: s.lcd_line1, lcd_line2: s.lcd_line2,
            });
            setRingStates(r => ({ ...r, [s.id]: 'done' }));
            setTimeout(() => setRingStates(r => ({ ...r, [s.id]: null })), 2500);
            if (onRing) onRing();
        } catch { setRingStates(r => ({ ...r, [s.id]: null })); }
    };

    return (
        <div className="space-y-4">
            {/* Next bell countdown */}
            {nextSchedule && (
                <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl px-5 py-4 flex items-center gap-4">
                    <div className="text-3xl font-bold font-mono text-blue-300 animate-pulse">{countdown}</div>
                    <div>
                        <p className="text-xs text-gray-400 font-mono tracking-widest">NEXT BELL</p>
                        <p className="text-white font-bold">{nextSchedule.name}</p>
                        <p className="text-gray-400 text-sm font-mono">{nextSchedule.ring_time}</p>
                    </div>
                    <Clock size={20} className="text-blue-500 ml-auto" />
                </div>
            )}

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[28px] top-0 bottom-0 w-px bg-gray-800" />

                <div className="space-y-2">
                    {schedules.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            <Bell size={32} className="mx-auto mb-2 opacity-30" />
                            <p>No bells scheduled for today</p>
                        </div>
                    )}
                    {schedules.map((s) => {
                        const rung = hasRungToday(s.name);
                        const isNext = s.id === nextSchedule?.id;
                        const isPast = s.ring_time < nowStr;
                        const rs = ringStates[s.id];
                        return (
                            <div key={s.id}
                                className={`relative flex items-start gap-4 pl-14 pr-4 py-3 rounded-xl transition
                  ${isNext ? 'bg-blue-900/20 border border-blue-800/40' :
                                        rung ? 'bg-gray-900/50 border border-gray-800/50 opacity-60' :
                                            'bg-gray-900 border border-gray-800'}
                `}
                            >
                                {/* Dot on timeline */}
                                <div className={`absolute left-5 top-4 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10
                  ${rung ? 'bg-green-800 border-green-600' :
                                        isNext ? 'bg-blue-700 border-blue-400 animate-pulse' :
                                            'bg-gray-800 border-gray-600'}
                `}>
                                    {rung ? <Check size={11} className="text-green-300" />
                                        : isNext ? <Bell size={10} className="text-blue-300" />
                                            : <div className={`w-2 h-2 rounded-full ${LED_COLORS[s.led_color] || 'bg-gray-500'}`} />}
                                </div>

                                {/* Time */}
                                <div className="w-12 flex-shrink-0">
                                    <span className={`font-mono text-sm font-bold ${isNext ? 'text-blue-300' : rung ? 'text-gray-500' : 'text-white'}`}>
                                        {s.ring_time}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-sm text-white truncate">{s.name}</span>
                                        <span className={`text-xs ${SIT_COLORS[s.situation_type] || 'text-gray-400'}`}>
                                            {SIT_ICONS[s.situation_type]} {s.situation_type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <PatternBadge value={s.pattern} />
                                        <span className="font-mono text-xs text-gray-500">{s.lcd_line1}</span>
                                    </div>
                                </div>

                                {/* Test button */}
                                {canEdit && (
                                    <button
                                        onClick={() => testBell(s)}
                                        disabled={!!rs}
                                        className={`flex-shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition
                      ${rs === 'done' ? 'border-green-700 text-green-400 bg-green-900/20'
                                                : rs === 'loading' ? 'border-gray-700 text-gray-500 cursor-wait'
                                                    : 'border-gray-700 text-gray-400 hover:border-blue-600 hover:text-blue-400'}`}
                                    >
                                        {rs === 'done' ? '✓ Done' : rs === 'loading' ? '...' : <><Bell size={11} /> Test</>}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
'use client';
// src/components/ManualRing.jsx
import { useState } from 'react';
import API from '@/lib/api';
import { Bell, AlertTriangle, Coffee } from 'lucide-react';

const QUICK_RINGS = [
  { label: 'Ring Class',  pattern: 'LONG_SHORT',   led: 'GREEN',  lcd1: 'CLASS START', lcd2: 'MANUAL', icon: <Bell size={16}/>,         color: 'green' },
  { label: 'Ring Break',  pattern: 'TRIPLE_SHORT',  led: 'YELLOW', lcd1: 'BREAK TIME',  lcd2: 'MANUAL', icon: <Coffee size={16}/>,        color: 'yellow' },
  { label: 'Emergency',   pattern: 'EMERGENCY',     led: 'RED',    lcd1: 'EMERGENCY!',  lcd2: 'ALERT',  icon: <AlertTriangle size={16}/>, color: 'red' },
];

const colorMap = {
  green:  { btn: 'border-green-700 hover:bg-green-900/30 text-green-400 hover:border-green-500', badge: 'bg-green-900/30' },
  yellow: { btn: 'border-yellow-700 hover:bg-yellow-900/30 text-yellow-400 hover:border-yellow-500', badge: 'bg-yellow-900/30' },
  red:    { btn: 'border-red-700 hover:bg-red-900/30 text-red-400 hover:border-red-500', badge: 'bg-red-900/30' },
};

export default function ManualRing({ onRing }) {
  const [ringing, setRinging] = useState(null);
  const [lastRung, setLastRung] = useState(null);
  const [custom, setCustom]   = useState({ name: '', pattern: 'LONG_SHORT', led: 'GREEN', lcd1: '', lcd2: '' });
  const [showCustom, setShowCustom] = useState(false);

  const doRing = async (r) => {
    setRinging(r.label);
    try {
      await API.post('/api/ring-now', {
        name:      r.label,
        pattern:   r.pattern,
        led_color: r.led,
        lcd_line1: r.lcd1,
        lcd_line2: r.lcd2,
      });
      setLastRung(r.label);
      setTimeout(() => setLastRung(null), 3000);
      onRing?.();
    } catch {
      alert('Ring failed — check Arduino connection');
    } finally {
      setRinging(null);
    }
  };

  const doCustomRing = async (e) => {
    e.preventDefault();
    await doRing({
      label:   custom.name || 'Custom Ring',
      pattern: custom.pattern,
      led:     custom.led,
      lcd1:    custom.lcd1 || 'CUSTOM RING',
      lcd2:    custom.lcd2,
    });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="font-semibold text-white mb-4 text-sm">Quick Manual Ring</h3>

      {lastRung && (
        <div className="mb-4 bg-yellow-900/30 border border-yellow-700 rounded-lg px-4 py-2 text-yellow-400 text-sm font-medium animate-pulse">
          🔔 {lastRung} — Bell rung successfully!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {QUICK_RINGS.map(r => (
          <button
            key={r.label}
            onClick={() => doRing(r)}
            disabled={!!ringing}
            className={`flex items-center gap-3 border rounded-xl px-4 py-3 font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${colorMap[r.color].btn}`}
          >
            {ringing === r.label ? (
              <span className="animate-spin">⏳</span>
            ) : r.icon}
            {ringing === r.label ? 'Ringing...' : r.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowCustom(v => !v)}
        className="text-xs text-gray-500 hover:text-gray-300 transition underline"
      >
        {showCustom ? 'Hide' : 'Custom ring options'}
      </button>

      {showCustom && (
        <form onSubmit={doCustomRing} className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <input value={custom.name} onChange={e => setCustom({...custom, name: e.target.value})}
            placeholder="Name (e.g. Assembly)"
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          <input value={custom.lcd1} onChange={e => setCustom({...custom, lcd1: e.target.value.slice(0,16)})}
            placeholder="LCD line 1"
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500" />
          <select value={custom.pattern} onChange={e => setCustom({...custom, pattern: e.target.value})}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
            <option>LONG_SHORT</option><option>TRIPLE_SHORT</option><option>TRIPLE_LONG</option><option>EMERGENCY</option>
          </select>
          <select value={custom.led} onChange={e => setCustom({...custom, led: e.target.value})}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
            <option>GREEN</option><option>YELLOW</option><option>RED</option>
          </select>
          <button type="submit" disabled={!!ringing}
            className="col-span-2 md:col-span-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg px-4 py-2 transition">
            {ringing ? 'Ringing...' : '🔔 Ring Custom'}
          </button>
        </form>
      )}
    </div>
  );
}
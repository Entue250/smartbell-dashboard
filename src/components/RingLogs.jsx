'use client';
// src/components/RingLogs.jsx
export default function RingLogs({ logs = [], showAll = false }) {
  const fmt = (ts) => {
    if (!ts) return '--';
    const d = new Date(ts);
    return d.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: 'short' });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <h3 className="font-semibold text-white text-sm">
          {showAll ? 'Bell History' : 'Recent Rings'}
        </h3>
        <span className="text-xs text-gray-500 font-mono">{logs.length} entries</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800">
              <th className="text-left px-4 py-2.5">Time</th>
              <th className="text-left px-4 py-2.5">Period</th>
              <th className="text-left px-4 py-2.5">Triggered By</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-8 text-sm">
                  No bell rings recorded yet.
                </td>
              </tr>
            )}
            {logs.map((l, i) => (
              <tr key={l.id ?? i} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition">
                <td className="px-4 py-2.5 font-mono text-xs text-gray-300">{fmt(l.rang_at)}</td>
                <td className="px-4 py-2.5 text-white font-medium">{l.schedule_name || 'Manual Ring'}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    l.triggered_by === 'manual'
                      ? 'bg-amber-900/40 text-amber-400'
                      : 'bg-blue-900/40 text-blue-400'
                  }`}>
                    {l.triggered_by === 'manual' ? '⚡ Manual' : '🕐 Schedule'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
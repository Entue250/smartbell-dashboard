'use client';
// src/components/ScheduleTable.jsx
import { useState } from 'react';
import API from '@/lib/api';
import { Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';

const PATTERNS = ['LONG_SHORT', 'TRIPLE_SHORT', 'TRIPLE_LONG', 'EMERGENCY'];
const LED_COLORS = ['GREEN', 'YELLOW', 'RED'];

const EMPTY_FORM = {
  name: '', ring_time: '', pattern: 'LONG_SHORT',
  led_color: 'GREEN', lcd_line1: '', lcd_line2: '', active: 1,
};

export default function ScheduleTable({ schedules, canEdit, isAdmin, onRefresh }) {
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState(null);

  const ledColor = (c) =>
    c === 'GREEN' ? 'text-green-400' : c === 'YELLOW' ? 'text-yellow-400' : 'text-red-400';
  const ledDot = (c) =>
    c === 'GREEN' ? 'bg-green-400' : c === 'YELLOW' ? 'bg-yellow-400' : 'bg-red-400';

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditId(s.id);
    setForm({
      name: s.name, ring_time: s.ring_time, pattern: s.pattern,
      led_color: s.led_color, lcd_line1: s.lcd_line1,
      lcd_line2: s.lcd_line2, active: s.active,
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await API.put(`/api/schedules/${editId}`, form);
      } else {
        await API.post('/api/schedules', form);
      }
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this schedule?')) return;
    try {
      await API.delete(`/api/schedules/${id}`);
      onRefresh();
    } catch {
      alert('Delete failed');
    }
  };

  const handleToggle = async (s) => {
    try {
      await API.put(`/api/schedules/${s.id}`, { ...s, active: s.active ? 0 : 1 });
      onRefresh();
    } catch {
      alert('Toggle failed');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Bell Schedule</h2>
          <p className="text-sm text-gray-400 mt-0.5">{schedules.length} entries</p>
        </div>
        {canEdit && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            <Plus size={16} /> Add Bell
          </button>
        )}
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="bg-gray-900 border border-blue-700 rounded-xl p-6">
          <h3 className="text-base font-bold mb-4 text-blue-400">
            {editId ? 'Edit Schedule' : 'Add New Bell'}
          </h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Period Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Period 1"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Ring Time (HH:MM)</label>
              <input
                type="time"
                value={form.ring_time}
                onChange={e => setForm({ ...form, ring_time: e.target.value })}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Buzz Pattern</label>
              <select
                value={form.pattern}
                onChange={e => setForm({ ...form, pattern: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {PATTERNS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">LED Color</label>
              <select
                value={form.led_color}
                onChange={e => setForm({ ...form, led_color: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {LED_COLORS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">LCD Line 1 (max 16 chars)</label>
              <input
                value={form.lcd_line1}
                onChange={e => setForm({ ...form, lcd_line1: e.target.value.slice(0, 16) })}
                placeholder="e.g. PERIOD 1"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">LCD Line 2 (max 16 chars)</label>
              <input
                value={form.lcd_line2}
                onChange={e => setForm({ ...form, lcd_line2: e.target.value.slice(0, 16) })}
                placeholder="e.g. 07:45-08:35"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition">
                <X size={14} /> Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg transition">
                <Save size={14} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SCHEDULE LIST */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider">
              <th className="text-left px-4 py-3">Time</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Pattern</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">LCD Display</th>
              <th className="text-left px-4 py-3">LED</th>
              <th className="text-left px-4 py-3">Status</th>
              {canEdit && <th className="text-right px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 && (
              <tr><td colSpan={7} className="text-center text-gray-500 py-10">No schedules yet. Add one above.</td></tr>
            )}
            {schedules.map(s => (
              <tr key={s.id} className={`border-b border-gray-800 hover:bg-gray-800/40 transition ${s.active ? '' : 'opacity-40'}`}>
                <td className="px-4 py-3 font-mono font-bold text-yellow-400">{s.ring_time}</td>
                <td className="px-4 py-3 font-medium text-white">{s.name}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="font-mono text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-300">{s.pattern}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="font-mono text-xs text-gray-300">{s.lcd_line1}</div>
                  {s.lcd_line2 && <div className="font-mono text-xs text-gray-500">{s.lcd_line2}</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${ledDot(s.led_color)}`} />
                    <span className={`text-xs ${ledColor(s.led_color)}`}>{s.led_color}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    s.active ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'
                  }`}>{s.active ? 'Active' : 'Off'}</span>
                </td>
                {canEdit && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => handleToggle(s)} title={s.active ? 'Disable' : 'Enable'}
                        className="text-gray-400 hover:text-yellow-400 transition">
                        {s.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                      <button onClick={() => openEdit(s)} title="Edit"
                        className="text-gray-400 hover:text-blue-400 transition">
                        <Pencil size={15} />
                      </button>
                      {isAdmin && (
                        <button onClick={() => handleDelete(s.id)} title="Delete"
                          className="text-gray-400 hover:text-red-400 transition">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
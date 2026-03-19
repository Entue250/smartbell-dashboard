// 'use client';
// // src/components/ScheduleTable.jsx
// import { useState } from 'react';
// import API from '@/lib/api';
// import { Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';

// const PATTERNS = ['LONG_SHORT', 'TRIPLE_SHORT', 'TRIPLE_LONG', 'EMERGENCY'];
// const LED_COLORS = ['GREEN', 'YELLOW', 'RED'];

// const EMPTY_FORM = {
//   name: '', ring_time: '', pattern: 'LONG_SHORT',
//   led_color: 'GREEN', lcd_line1: '', lcd_line2: '', active: 1,
// };

// export default function ScheduleTable({ schedules, canEdit, isAdmin, onRefresh }) {
//   const [showForm, setShowForm]   = useState(false);
//   const [editId, setEditId]       = useState(null);
//   const [form, setForm]           = useState(EMPTY_FORM);
//   const [saving, setSaving]       = useState(false);
//   const [deleteId, setDeleteId]   = useState(null);

//   const ledColor = (c) =>
//     c === 'GREEN' ? 'text-green-400' : c === 'YELLOW' ? 'text-yellow-400' : 'text-red-400';
//   const ledDot = (c) =>
//     c === 'GREEN' ? 'bg-green-400' : c === 'YELLOW' ? 'bg-yellow-400' : 'bg-red-400';

//   const openAdd = () => {
//     setEditId(null);
//     setForm(EMPTY_FORM);
//     setShowForm(true);
//   };

//   const openEdit = (s) => {
//     setEditId(s.id);
//     setForm({
//       name: s.name, ring_time: s.ring_time, pattern: s.pattern,
//       led_color: s.led_color, lcd_line1: s.lcd_line1,
//       lcd_line2: s.lcd_line2, active: s.active,
//     });
//     setShowForm(true);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       if (editId) {
//         await API.put(`/api/schedules/${editId}`, form);
//       } else {
//         await API.post('/api/schedules', form);
//       }
//       setShowForm(false);
//       onRefresh();
//     } catch (err) {
//       alert(err.response?.data?.error || 'Save failed');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this schedule?')) return;
//     try {
//       await API.delete(`/api/schedules/${id}`);
//       onRefresh();
//     } catch {
//       alert('Delete failed');
//     }
//   };

//   const handleToggle = async (s) => {
//     try {
//       await API.put(`/api/schedules/${s.id}`, { ...s, active: s.active ? 0 : 1 });
//       onRefresh();
//     } catch {
//       alert('Toggle failed');
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Header row */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-white">Bell Schedule</h2>
//           <p className="text-sm text-gray-400 mt-0.5">{schedules.length} entries</p>
//         </div>
//         {canEdit && (
//           <button
//             onClick={openAdd}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
//           >
//             <Plus size={16} /> Add Bell
//           </button>
//         )}
//       </div>

//       {/* ADD / EDIT FORM */}
//       {showForm && (
//         <div className="bg-gray-900 border border-blue-700 rounded-xl p-6">
//           <h3 className="text-base font-bold mb-4 text-blue-400">
//             {editId ? 'Edit Schedule' : 'Add New Bell'}
//           </h3>
//           <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">Period Name</label>
//               <input
//                 value={form.name}
//                 onChange={e => setForm({ ...form, name: e.target.value })}
//                 placeholder="e.g. Period 1"
//                 required
//                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">Ring Time (HH:MM)</label>
//               <input
//                 type="time"
//                 value={form.ring_time}
//                 onChange={e => setForm({ ...form, ring_time: e.target.value })}
//                 required
//                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">Buzz Pattern</label>
//               <select
//                 value={form.pattern}
//                 onChange={e => setForm({ ...form, pattern: e.target.value })}
//                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
//               >
//                 {PATTERNS.map(p => <option key={p}>{p}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">LED Color</label>
//               <select
//                 value={form.led_color}
//                 onChange={e => setForm({ ...form, led_color: e.target.value })}
//                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
//               >
//                 {LED_COLORS.map(c => <option key={c}>{c}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">LCD Line 1 (max 16 chars)</label>
//               <input
//                 value={form.lcd_line1}
//                 onChange={e => setForm({ ...form, lcd_line1: e.target.value.slice(0, 16) })}
//                 placeholder="e.g. PERIOD 1"
//                 required
//                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 font-mono"
//               />
//             </div>
//             <div>
//               <label className="text-xs text-gray-400 block mb-1">LCD Line 2 (max 16 chars)</label>
//               <input
//                 value={form.lcd_line2}
//                 onChange={e => setForm({ ...form, lcd_line2: e.target.value.slice(0, 16) })}
//                 placeholder="e.g. 07:45-08:35"
//                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 font-mono"
//               />
//             </div>
//             <div className="md:col-span-2 flex gap-3 justify-end pt-2">
//               <button type="button" onClick={() => setShowForm(false)}
//                 className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition">
//                 <X size={14} /> Cancel
//               </button>
//               <button type="submit" disabled={saving}
//                 className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg transition">
//                 <Save size={14} /> {saving ? 'Saving...' : 'Save'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* SCHEDULE LIST */}
//       <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider">
//               <th className="text-left px-4 py-3">Time</th>
//               <th className="text-left px-4 py-3">Name</th>
//               <th className="text-left px-4 py-3 hidden md:table-cell">Pattern</th>
//               <th className="text-left px-4 py-3 hidden md:table-cell">LCD Display</th>
//               <th className="text-left px-4 py-3">LED</th>
//               <th className="text-left px-4 py-3">Status</th>
//               {canEdit && <th className="text-right px-4 py-3">Actions</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {schedules.length === 0 && (
//               <tr><td colSpan={7} className="text-center text-gray-500 py-10">No schedules yet. Add one above.</td></tr>
//             )}
//             {schedules.map(s => (
//               <tr key={s.id} className={`border-b border-gray-800 hover:bg-gray-800/40 transition ${s.active ? '' : 'opacity-40'}`}>
//                 <td className="px-4 py-3 font-mono font-bold text-yellow-400">{s.ring_time}</td>
//                 <td className="px-4 py-3 font-medium text-white">{s.name}</td>
//                 <td className="px-4 py-3 hidden md:table-cell">
//                   <span className="font-mono text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-300">{s.pattern}</span>
//                 </td>
//                 <td className="px-4 py-3 hidden md:table-cell">
//                   <div className="font-mono text-xs text-gray-300">{s.lcd_line1}</div>
//                   {s.lcd_line2 && <div className="font-mono text-xs text-gray-500">{s.lcd_line2}</div>}
//                 </td>
//                 <td className="px-4 py-3">
//                   <div className="flex items-center gap-1.5">
//                     <div className={`w-2.5 h-2.5 rounded-full ${ledDot(s.led_color)}`} />
//                     <span className={`text-xs ${ledColor(s.led_color)}`}>{s.led_color}</span>
//                   </div>
//                 </td>
//                 <td className="px-4 py-3">
//                   <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
//                     s.active ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'
//                   }`}>{s.active ? 'Active' : 'Off'}</span>
//                 </td>
//                 {canEdit && (
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-2 justify-end">
//                       <button onClick={() => handleToggle(s)} title={s.active ? 'Disable' : 'Enable'}
//                         className="text-gray-400 hover:text-yellow-400 transition">
//                         {s.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
//                       </button>
//                       <button onClick={() => openEdit(s)} title="Edit"
//                         className="text-gray-400 hover:text-blue-400 transition">
//                         <Pencil size={15} />
//                       </button>
//                       {isAdmin && (
//                         <button onClick={() => handleDelete(s.id)} title="Delete"
//                           className="text-gray-400 hover:text-red-400 transition">
//                           <Trash2 size={15} />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


'use client';
// src/components/ScheduleTable.jsx — v2 with days-of-week, situation type, test button
import { useState } from 'react';
import API from '@/lib/api';
import PatternSelect, { PatternBadge } from './PatternSelect';
import LCDPreview from './LCDPreview';
import { Plus, Edit2, Trash2, Bell, Check, X } from 'lucide-react';

const DAYS = ['M', 'T', 'W', 't', 'F', 'S', 's'];
const DAYS_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const LED_OPTIONS = ['GREEN', 'YELLOW', 'RED'];

const SITUATION_TYPES = [
  { value: 'CLASS', icon: '📚', label: 'Class Period' },
  { value: 'BREAK', icon: '☕', label: 'Break Time' },
  { value: 'LUNCH', icon: '🍽️', label: 'Lunch Break' },
  { value: 'EXAM', icon: '📝', label: 'Exam Period' },
  { value: 'EMERGENCY', icon: '🚨', label: 'Emergency' },
  { value: 'WARNING', icon: '⚠️', label: 'Warning Bell' },
  { value: 'ASSEMBLY', icon: '🎤', label: 'Assembly' },
  { value: 'HOLIDAY', icon: '🎉', label: 'Holiday' },
  { value: 'CUSTOM', icon: '✏️', label: 'Custom' },
];

const SIT_COLORS = {
  CLASS: 'blue', BREAK: 'yellow', LUNCH: 'orange', EXAM: 'purple',
  EMERGENCY: 'red', WARNING: 'orange', ASSEMBLY: 'green', HOLIDAY: 'pink', CUSTOM: 'gray'
};

function SituationBadge({ type }) {
  const st = SITUATION_TYPES.find(s => s.value === type) || SITUATION_TYPES[0];
  const c = SIT_COLORS[type] || 'gray';
  const cls = {
    blue: 'bg-blue-900/30 text-blue-400 border-blue-800',
    yellow: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    orange: 'bg-orange-900/30 text-orange-400 border-orange-800',
    purple: 'bg-purple-900/30 text-purple-400 border-purple-800',
    red: 'bg-red-900/30 text-red-400 border-red-800',
    green: 'bg-green-900/30 text-green-400 border-green-800',
    pink: 'bg-pink-900/30 text-pink-400 border-pink-800',
    gray: 'bg-gray-800 text-gray-400 border-gray-700',
  }[c];
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cls}`}>
      {st.icon} {st.label}
    </span>
  );
}

const EMPTY = {
  name: '', ring_time: '07:30', pattern: 'LONG_SHORT', led_color: 'GREEN',
  lcd_line1: '', lcd_line2: '', lcd_idle_line1: '', lcd_idle_line2: '',
  situation_type: 'CLASS', days_of_week: 'MTWTF', template_id: null, active: 1,
};

function ScheduleForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [autoIdle, setAutoIdle] = useState(!initial?.lcd_idle_line1);

  const toggleDay = (d) => {
    const cur = form.days_of_week || '';
    const upd = cur.includes(d) ? cur.replace(d, '') : cur + d;
    setForm(f => ({ ...f, days_of_week: upd }));
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Bell Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            placeholder="e.g. Period 1 Start" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Time</label>
          <input type="time" value={form.ring_time}
            onChange={e => setForm(f => ({ ...f, ring_time: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      {/* Pattern + LED */}
      <div className="grid grid-cols-2 gap-3">
        <PatternSelect value={form.pattern} onChange={v => setForm(f => ({ ...f, pattern: v }))} />
        <div>
          <label className="block text-xs text-gray-400 mb-1">LED Color</label>
          <div className="flex gap-2">
            {LED_OPTIONS.map(c => (
              <button key={c} onClick={() => setForm(f => ({ ...f, led_color: c }))}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition
                  ${form.led_color === c
                    ? c === 'GREEN' ? 'bg-green-700 border-green-500 text-white'
                      : c === 'YELLOW' ? 'bg-yellow-700 border-yellow-500 text-white'
                        : 'bg-red-700 border-red-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400'}`}
              >{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Situation type */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Situation Type</label>
        <div className="flex flex-wrap gap-1.5">
          {SITUATION_TYPES.map(st => (
            <button key={st.value}
              onClick={() => setForm(f => ({ ...f, situation_type: st.value }))}
              className={`px-3 py-1 rounded-full text-xs border transition
                ${form.situation_type === st.value
                  ? 'bg-blue-700 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
            >{st.icon} {st.label}</button>
          ))}
        </div>
      </div>

      {/* Days of week */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Days of Week</label>
        <div className="flex gap-1.5">
          {DAYS.map((d, i) => (
            <button key={d}
              onClick={() => toggleDay(d)}
              className={`w-9 h-9 rounded-lg text-xs font-bold border transition
                ${(form.days_of_week || '').includes(d)
                  ? 'bg-blue-700 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-500'}`}
            >{DAYS_LABELS[i].slice(0, 2)}</button>
          ))}
        </div>
      </div>

      {/* LCD lines */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">LCD Line 1 (on ring)</label>
          <input value={form.lcd_line1} maxLength={16}
            onChange={e => setForm(f => ({ ...f, lcd_line1: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
            placeholder="16 chars max" />
          <p className="text-xs text-gray-600 mt-0.5">{16 - (form.lcd_line1?.length || 0)} remaining</p>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">LCD Line 2 (on ring)</label>
          <input value={form.lcd_line2} maxLength={16}
            onChange={e => setForm(f => ({ ...f, lcd_line2: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
            placeholder="16 chars max" />
        </div>
      </div>

      {/* Idle LCD */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-400">LCD During Period (idle)</label>
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
            <input type="checkbox" checked={autoIdle}
              onChange={e => setAutoIdle(e.target.checked)}
              className="rounded" />
            Auto-generate
          </label>
        </div>
        {!autoIdle && (
          <div className="grid grid-cols-2 gap-3">
            <input value={form.lcd_idle_line1} maxLength={16}
              onChange={e => setForm(f => ({ ...f, lcd_idle_line1: e.target.value }))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
              placeholder="Idle line 1" />
            <input value={form.lcd_idle_line2} maxLength={16}
              onChange={e => setForm(f => ({ ...f, lcd_idle_line2: e.target.value }))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
              placeholder="Idle line 2" />
          </div>
        )}
      </div>

      {/* LCD Previews */}
      <div className="flex gap-4 flex-wrap">
        <LCDPreview label="On Ring" line1={form.lcd_line1} line2={form.lcd_line2} />
        <LCDPreview label="During Period" line1={form.lcd_idle_line1 || form.situation_type} line2={form.lcd_idle_line2 || ''} />
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:border-gray-500 transition">
          Cancel
        </button>
        <button onClick={() => onSave(autoIdle ? { ...form, lcd_idle_line1: '', lcd_idle_line2: '' } : form)}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded-lg transition">
          Save Schedule
        </button>
      </div>
    </div>
  );
}

export default function ScheduleTable({ schedules, canEdit, isAdmin, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [testStates, setTestStates] = useState({});
  const [confirmDel, setConfirmDel] = useState(null);

  const save = async (form) => {
    try {
      if (editItem) {
        await API.put(`/api/schedules/${editItem.id}`, form);
      } else {
        await API.post('/api/schedules', form);
      }
      setShowForm(false); setEditItem(null);
      onRefresh();
    } catch (e) { alert(e.response?.data?.error || 'Save failed'); }
  };

  const del = async (id) => {
    await API.delete(`/api/schedules/${id}`);
    setConfirmDel(null); onRefresh();
  };

  const testBell = async (s) => {
    setTestStates(t => ({ ...t, [s.id]: 'loading' }));
    try {
      await API.post('/api/ring-now', {
        name: s.name, pattern: s.pattern, led_color: s.led_color,
        lcd_line1: s.lcd_line1, lcd_line2: s.lcd_line2,
      });
      setTestStates(t => ({ ...t, [s.id]: 'done' }));
      setTimeout(() => setTestStates(t => ({ ...t, [s.id]: null })), 2500);
    } catch { setTestStates(t => ({ ...t, [s.id]: null })); }
  };

  return (
    <div className="space-y-4">
      {canEdit && !showForm && (
        <button onClick={() => { setEditItem(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition">
          <Plus size={14} /> Add Schedule
        </button>
      )}

      {showForm && (
        <ScheduleForm
          initial={editItem}
          onSave={save}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
        />
      )}

      {/* Delete confirmation */}
      {confirmDel && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 flex items-center justify-between">
          <p className="text-red-300 text-sm">Delete <strong>{confirmDel.name}</strong>? This cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmDel(null)} className="px-3 py-1.5 text-xs border border-gray-700 text-gray-400 rounded-lg">Cancel</button>
            <button onClick={() => del(confirmDel.id)} className="px-3 py-1.5 text-xs bg-red-700 hover:bg-red-600 text-white rounded-lg">Delete</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {schedules.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p>No schedules yet. Add your first bell above.</p>
          </div>
        )}
        {schedules.map(s => {
          const ts = testStates[s.id];
          return (
            <div key={s.id}
              className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
              {/* LED dot */}
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${s.led_color === 'GREEN' ? 'bg-green-500' :
                  s.led_color === 'YELLOW' ? 'bg-yellow-400' : 'bg-red-500'
                }`} />
              {/* Time */}
              <span className="font-mono font-bold text-white text-sm w-14 flex-shrink-0">{s.ring_time}</span>
              {/* Name + badges */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm truncate">{s.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <PatternBadge value={s.pattern} />
                  <SituationBadge type={s.situation_type} />
                  <span className="font-mono text-xs text-gray-600">{s.days_of_week}</span>
                </div>
              </div>
              {/* LCD */}
              <div className="hidden lg:block">
                <LCDPreview line1={s.lcd_line1} line2={s.lcd_line2} />
              </div>
              {/* Actions */}
              {canEdit && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => testBell(s)} disabled={!!ts}
                    className={`p-1.5 rounded-lg border text-xs transition
                      ${ts === 'done' ? 'border-green-700 text-green-400' :
                        ts === 'loading' ? 'border-gray-700 text-gray-500' :
                          'border-gray-700 text-gray-400 hover:border-blue-600 hover:text-blue-400'}`}
                    title="Test this bell">
                    {ts === 'done' ? <Check size={13} /> : <Bell size={13} />}
                  </button>
                  <button onClick={() => { setEditItem(s); setShowForm(true); }}
                    className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-yellow-600 hover:text-yellow-400 transition"
                    title="Edit">
                    <Edit2 size={13} />
                  </button>
                  {isAdmin && (
                    <button onClick={() => setConfirmDel(s)}
                      className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-red-700 hover:text-red-400 transition"
                      title="Delete">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
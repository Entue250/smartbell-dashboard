// // 'use client';
// // // src/components/ScheduleTable.jsx
// // import { useState } from 'react';
// // import API from '@/lib/api';
// // import { Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';

// // const PATTERNS = ['LONG_SHORT', 'TRIPLE_SHORT', 'TRIPLE_LONG', 'EMERGENCY'];
// // const LED_COLORS = ['GREEN', 'YELLOW', 'RED'];

// // const EMPTY_FORM = {
// //   name: '', ring_time: '', pattern: 'LONG_SHORT',
// //   led_color: 'GREEN', lcd_line1: '', lcd_line2: '', active: 1,
// // };

// // export default function ScheduleTable({ schedules, canEdit, isAdmin, onRefresh }) {
// //   const [showForm, setShowForm]   = useState(false);
// //   const [editId, setEditId]       = useState(null);
// //   const [form, setForm]           = useState(EMPTY_FORM);
// //   const [saving, setSaving]       = useState(false);
// //   const [deleteId, setDeleteId]   = useState(null);

// //   const ledColor = (c) =>
// //     c === 'GREEN' ? 'text-green-400' : c === 'YELLOW' ? 'text-yellow-400' : 'text-red-400';
// //   const ledDot = (c) =>
// //     c === 'GREEN' ? 'bg-green-400' : c === 'YELLOW' ? 'bg-yellow-400' : 'bg-red-400';

// //   const openAdd = () => {
// //     setEditId(null);
// //     setForm(EMPTY_FORM);
// //     setShowForm(true);
// //   };

// //   const openEdit = (s) => {
// //     setEditId(s.id);
// //     setForm({
// //       name: s.name, ring_time: s.ring_time, pattern: s.pattern,
// //       led_color: s.led_color, lcd_line1: s.lcd_line1,
// //       lcd_line2: s.lcd_line2, active: s.active,
// //     });
// //     setShowForm(true);
// //   };

// //   const handleSave = async (e) => {
// //     e.preventDefault();
// //     setSaving(true);
// //     try {
// //       if (editId) {
// //         await API.put(`/api/schedules/${editId}`, form);
// //       } else {
// //         await API.post('/api/schedules', form);
// //       }
// //       setShowForm(false);
// //       onRefresh();
// //     } catch (err) {
// //       alert(err.response?.data?.error || 'Save failed');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (!confirm('Delete this schedule?')) return;
// //     try {
// //       await API.delete(`/api/schedules/${id}`);
// //       onRefresh();
// //     } catch {
// //       alert('Delete failed');
// //     }
// //   };

// //   const handleToggle = async (s) => {
// //     try {
// //       await API.put(`/api/schedules/${s.id}`, { ...s, active: s.active ? 0 : 1 });
// //       onRefresh();
// //     } catch {
// //       alert('Toggle failed');
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       {/* Header row */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h2 className="text-xl font-bold text-white">Bell Schedule</h2>
// //           <p className="text-sm text-gray-400 mt-0.5">{schedules.length} entries</p>
// //         </div>
// //         {canEdit && (
// //           <button
// //             onClick={openAdd}
// //             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
// //           >
// //             <Plus size={16} /> Add Bell
// //           </button>
// //         )}
// //       </div>

// //       {/* ADD / EDIT FORM */}
// //       {showForm && (
// //         <div className="bg-gray-900 border border-blue-700 rounded-xl p-6">
// //           <h3 className="text-base font-bold mb-4 text-blue-400">
// //             {editId ? 'Edit Schedule' : 'Add New Bell'}
// //           </h3>
// //           <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div>
// //               <label className="text-xs text-gray-400 block mb-1">Period Name</label>
// //               <input
// //                 value={form.name}
// //                 onChange={e => setForm({ ...form, name: e.target.value })}
// //                 placeholder="e.g. Period 1"
// //                 required
// //                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
// //               />
// //             </div>
// //             <div>
// //               <label className="text-xs text-gray-400 block mb-1">Ring Time (HH:MM)</label>
// //               <input
// //                 type="time"
// //                 value={form.ring_time}
// //                 onChange={e => setForm({ ...form, ring_time: e.target.value })}
// //                 required
// //                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
// //               />
// //             </div>
// //             <div>
// //               <label className="text-xs text-gray-400 block mb-1">Buzz Pattern</label>
// //               <select
// //                 value={form.pattern}
// //                 onChange={e => setForm({ ...form, pattern: e.target.value })}
// //                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
// //               >
// //                 {PATTERNS.map(p => <option key={p}>{p}</option>)}
// //               </select>
// //             </div>
// //             <div>
// //               <label className="text-xs text-gray-400 block mb-1">LED Color</label>
// //               <select
// //                 value={form.led_color}
// //                 onChange={e => setForm({ ...form, led_color: e.target.value })}
// //                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
// //               >
// //                 {LED_COLORS.map(c => <option key={c}>{c}</option>)}
// //               </select>
// //             </div>
// //             <div>
// //               <label className="text-xs text-gray-400 block mb-1">LCD Line 1 (max 16 chars)</label>
// //               <input
// //                 value={form.lcd_line1}
// //                 onChange={e => setForm({ ...form, lcd_line1: e.target.value.slice(0, 16) })}
// //                 placeholder="e.g. PERIOD 1"
// //                 required
// //                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 font-mono"
// //               />
// //             </div>
// //             <div>
// //               <label className="text-xs text-gray-400 block mb-1">LCD Line 2 (max 16 chars)</label>
// //               <input
// //                 value={form.lcd_line2}
// //                 onChange={e => setForm({ ...form, lcd_line2: e.target.value.slice(0, 16) })}
// //                 placeholder="e.g. 07:45-08:35"
// //                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 font-mono"
// //               />
// //             </div>
// //             <div className="md:col-span-2 flex gap-3 justify-end pt-2">
// //               <button type="button" onClick={() => setShowForm(false)}
// //                 className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition">
// //                 <X size={14} /> Cancel
// //               </button>
// //               <button type="submit" disabled={saving}
// //                 className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg transition">
// //                 <Save size={14} /> {saving ? 'Saving...' : 'Save'}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       )}

// //       {/* SCHEDULE LIST */}
// //       <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
// //         <table className="w-full text-sm">
// //           <thead>
// //             <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider">
// //               <th className="text-left px-4 py-3">Time</th>
// //               <th className="text-left px-4 py-3">Name</th>
// //               <th className="text-left px-4 py-3 hidden md:table-cell">Pattern</th>
// //               <th className="text-left px-4 py-3 hidden md:table-cell">LCD Display</th>
// //               <th className="text-left px-4 py-3">LED</th>
// //               <th className="text-left px-4 py-3">Status</th>
// //               {canEdit && <th className="text-right px-4 py-3">Actions</th>}
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {schedules.length === 0 && (
// //               <tr><td colSpan={7} className="text-center text-gray-500 py-10">No schedules yet. Add one above.</td></tr>
// //             )}
// //             {schedules.map(s => (
// //               <tr key={s.id} className={`border-b border-gray-800 hover:bg-gray-800/40 transition ${s.active ? '' : 'opacity-40'}`}>
// //                 <td className="px-4 py-3 font-mono font-bold text-yellow-400">{s.ring_time}</td>
// //                 <td className="px-4 py-3 font-medium text-white">{s.name}</td>
// //                 <td className="px-4 py-3 hidden md:table-cell">
// //                   <span className="font-mono text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-300">{s.pattern}</span>
// //                 </td>
// //                 <td className="px-4 py-3 hidden md:table-cell">
// //                   <div className="font-mono text-xs text-gray-300">{s.lcd_line1}</div>
// //                   {s.lcd_line2 && <div className="font-mono text-xs text-gray-500">{s.lcd_line2}</div>}
// //                 </td>
// //                 <td className="px-4 py-3">
// //                   <div className="flex items-center gap-1.5">
// //                     <div className={`w-2.5 h-2.5 rounded-full ${ledDot(s.led_color)}`} />
// //                     <span className={`text-xs ${ledColor(s.led_color)}`}>{s.led_color}</span>
// //                   </div>
// //                 </td>
// //                 <td className="px-4 py-3">
// //                   <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
// //                     s.active ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'
// //                   }`}>{s.active ? 'Active' : 'Off'}</span>
// //                 </td>
// //                 {canEdit && (
// //                   <td className="px-4 py-3">
// //                     <div className="flex items-center gap-2 justify-end">
// //                       <button onClick={() => handleToggle(s)} title={s.active ? 'Disable' : 'Enable'}
// //                         className="text-gray-400 hover:text-yellow-400 transition">
// //                         {s.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
// //                       </button>
// //                       <button onClick={() => openEdit(s)} title="Edit"
// //                         className="text-gray-400 hover:text-blue-400 transition">
// //                         <Pencil size={15} />
// //                       </button>
// //                       {isAdmin && (
// //                         <button onClick={() => handleDelete(s.id)} title="Delete"
// //                           className="text-gray-400 hover:text-red-400 transition">
// //                           <Trash2 size={15} />
// //                         </button>
// //                       )}
// //                     </div>
// //                   </td>
// //                 )}
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }

// 'use client';
// // src/components/ScheduleTable.jsx — v2 with days-of-week, situation type, test button
// import { useState } from 'react';
// import API from '@/lib/api';
// import PatternSelect, { PatternBadge } from './PatternSelect';
// import LCDPreview from './LCDPreview';
// import { Plus, Edit2, Trash2, Bell, Check, X } from 'lucide-react';

// const DAYS = ['M', 'T', 'W', 't', 'F', 'S', 's'];
// const DAYS_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// const LED_OPTIONS = ['GREEN', 'YELLOW', 'RED'];

// const SITUATION_TYPES = [
//   { value: 'CLASS', icon: '📚', label: 'Class Period' },
//   { value: 'BREAK', icon: '☕', label: 'Break Time' },
//   { value: 'LUNCH', icon: '🍽️', label: 'Lunch Break' },
//   { value: 'EXAM', icon: '📝', label: 'Exam Period' },
//   { value: 'EMERGENCY', icon: '🚨', label: 'Emergency' },
//   { value: 'WARNING', icon: '⚠️', label: 'Warning Bell' },
//   { value: 'ASSEMBLY', icon: '🎤', label: 'Assembly' },
//   { value: 'HOLIDAY', icon: '🎉', label: 'Holiday' },
//   { value: 'CUSTOM', icon: '✏️', label: 'Custom' },
// ];

// const SIT_COLORS = {
//   CLASS: 'blue', BREAK: 'yellow', LUNCH: 'orange', EXAM: 'purple',
//   EMERGENCY: 'red', WARNING: 'orange', ASSEMBLY: 'green', HOLIDAY: 'pink', CUSTOM: 'gray'
// };

// function SituationBadge({ type }) {
//   const st = SITUATION_TYPES.find(s => s.value === type) || SITUATION_TYPES[0];
//   const c = SIT_COLORS[type] || 'gray';
//   const cls = {
//     blue: 'bg-blue-900/30 text-blue-400 border-blue-800',
//     yellow: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
//     orange: 'bg-orange-900/30 text-orange-400 border-orange-800',
//     purple: 'bg-purple-900/30 text-purple-400 border-purple-800',
//     red: 'bg-red-900/30 text-red-400 border-red-800',
//     green: 'bg-green-900/30 text-green-400 border-green-800',
//     pink: 'bg-pink-900/30 text-pink-400 border-pink-800',
//     gray: 'bg-gray-800 text-gray-400 border-gray-700',
//   }[c];
//   return (
//     <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cls}`}>
//       {st.icon} {st.label}
//     </span>
//   );
// }

// const EMPTY = {
//   name: '', ring_time: '07:30', pattern: 'LONG_SHORT', led_color: 'GREEN',
//   lcd_line1: '', lcd_line2: '', lcd_idle_line1: '', lcd_idle_line2: '',
//   situation_type: 'CLASS', days_of_week: 'MTWTF', template_id: null, active: 1,
// };

// function ScheduleForm({ initial, onSave, onCancel }) {
//   const [form, setForm] = useState({ ...EMPTY, ...initial });
//   const [autoIdle, setAutoIdle] = useState(!initial?.lcd_idle_line1);

//   const toggleDay = (d) => {
//     const cur = form.days_of_week || '';
//     const upd = cur.includes(d) ? cur.replace(d, '') : cur + d;
//     setForm(f => ({ ...f, days_of_week: upd }));
//   };

//   return (
//     <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className="block text-xs text-gray-400 mb-1">Bell Name</label>
//           <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
//             className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
//             placeholder="e.g. Period 1 Start" />
//         </div>
//         <div>
//           <label className="block text-xs text-gray-400 mb-1">Time</label>
//           <input type="time" value={form.ring_time}
//             onChange={e => setForm(f => ({ ...f, ring_time: e.target.value }))}
//             className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
//         </div>
//       </div>

//       {/* Pattern + LED */}
//       <div className="grid grid-cols-2 gap-3">
//         <PatternSelect value={form.pattern} onChange={v => setForm(f => ({ ...f, pattern: v }))} />
//         <div>
//           <label className="block text-xs text-gray-400 mb-1">LED Color</label>
//           <div className="flex gap-2">
//             {LED_OPTIONS.map(c => (
//               <button key={c} onClick={() => setForm(f => ({ ...f, led_color: c }))}
//                 className={`flex-1 py-2 rounded-lg border text-xs font-bold transition
//                   ${form.led_color === c
//                     ? c === 'GREEN' ? 'bg-green-700 border-green-500 text-white'
//                       : c === 'YELLOW' ? 'bg-yellow-700 border-yellow-500 text-white'
//                         : 'bg-red-700 border-red-500 text-white'
//                     : 'bg-gray-800 border-gray-700 text-gray-400'}`}
//               >{c}</button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Situation type */}
//       <div>
//         <label className="block text-xs text-gray-400 mb-1.5">Situation Type</label>
//         <div className="flex flex-wrap gap-1.5">
//           {SITUATION_TYPES.map(st => (
//             <button key={st.value}
//               onClick={() => setForm(f => ({ ...f, situation_type: st.value }))}
//               className={`px-3 py-1 rounded-full text-xs border transition
//                 ${form.situation_type === st.value
//                   ? 'bg-blue-700 border-blue-500 text-white'
//                   : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
//             >{st.icon} {st.label}</button>
//           ))}
//         </div>
//       </div>

//       {/* Days of week */}
//       <div>
//         <label className="block text-xs text-gray-400 mb-1.5">Days of Week</label>
//         <div className="flex gap-1.5">
//           {DAYS.map((d, i) => (
//             <button key={d}
//               onClick={() => toggleDay(d)}
//               className={`w-9 h-9 rounded-lg text-xs font-bold border transition
//                 ${(form.days_of_week || '').includes(d)
//                   ? 'bg-blue-700 border-blue-500 text-white'
//                   : 'bg-gray-800 border-gray-700 text-gray-500'}`}
//             >{DAYS_LABELS[i].slice(0, 2)}</button>
//           ))}
//         </div>
//       </div>

//       {/* LCD lines */}
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className="block text-xs text-gray-400 mb-1">LCD Line 1 (on ring)</label>
//           <input value={form.lcd_line1} maxLength={16}
//             onChange={e => setForm(f => ({ ...f, lcd_line1: e.target.value }))}
//             className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
//             placeholder="16 chars max" />
//           <p className="text-xs text-gray-600 mt-0.5">{16 - (form.lcd_line1?.length || 0)} remaining</p>
//         </div>
//         <div>
//           <label className="block text-xs text-gray-400 mb-1">LCD Line 2 (on ring)</label>
//           <input value={form.lcd_line2} maxLength={16}
//             onChange={e => setForm(f => ({ ...f, lcd_line2: e.target.value }))}
//             className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
//             placeholder="16 chars max" />
//         </div>
//       </div>

//       {/* Idle LCD */}
//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <label className="text-xs text-gray-400">LCD During Period (idle)</label>
//           <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
//             <input type="checkbox" checked={autoIdle}
//               onChange={e => setAutoIdle(e.target.checked)}
//               className="rounded" />
//             Auto-generate
//           </label>
//         </div>
//         {!autoIdle && (
//           <div className="grid grid-cols-2 gap-3">
//             <input value={form.lcd_idle_line1} maxLength={16}
//               onChange={e => setForm(f => ({ ...f, lcd_idle_line1: e.target.value }))}
//               className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
//               placeholder="Idle line 1" />
//             <input value={form.lcd_idle_line2} maxLength={16}
//               onChange={e => setForm(f => ({ ...f, lcd_idle_line2: e.target.value }))}
//               className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
//               placeholder="Idle line 2" />
//           </div>
//         )}
//       </div>

//       {/* LCD Previews */}
//       <div className="flex gap-4 flex-wrap">
//         <LCDPreview label="On Ring" line1={form.lcd_line1} line2={form.lcd_line2} />
//         <LCDPreview label="During Period" line1={form.lcd_idle_line1 || form.situation_type} line2={form.lcd_idle_line2 || ''} />
//       </div>

//       <div className="flex gap-3 pt-2">
//         <button onClick={onCancel} className="flex-1 px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:border-gray-500 transition">
//           Cancel
//         </button>
//         <button onClick={() => onSave(autoIdle ? { ...form, lcd_idle_line1: '', lcd_idle_line2: '' } : form)}
//           className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded-lg transition">
//           Save Schedule
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function ScheduleTable({ schedules, canEdit, isAdmin, onRefresh }) {
//   const [showForm, setShowForm] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [testStates, setTestStates] = useState({});
//   const [confirmDel, setConfirmDel] = useState(null);

//   const save = async (form) => {
//     try {
//       if (editItem) {
//         await API.put(`/api/schedules/${editItem.id}`, form);
//       } else {
//         await API.post('/api/schedules', form);
//       }
//       setShowForm(false); setEditItem(null);
//       onRefresh();
//     } catch (e) { alert(e.response?.data?.error || 'Save failed'); }
//   };

//   const del = async (id) => {
//     await API.delete(`/api/schedules/${id}`);
//     setConfirmDel(null); onRefresh();
//   };

//   const testBell = async (s) => {
//     setTestStates(t => ({ ...t, [s.id]: 'loading' }));
//     try {
//       await API.post('/api/ring-now', {
//         name: s.name, pattern: s.pattern, led_color: s.led_color,
//         lcd_line1: s.lcd_line1, lcd_line2: s.lcd_line2,
//       });
//       setTestStates(t => ({ ...t, [s.id]: 'done' }));
//       setTimeout(() => setTestStates(t => ({ ...t, [s.id]: null })), 2500);
//     } catch { setTestStates(t => ({ ...t, [s.id]: null })); }
//   };

//   return (
//     <div className="space-y-4">
//       {canEdit && !showForm && (
//         <button onClick={() => { setEditItem(null); setShowForm(true); }}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition">
//           <Plus size={14} /> Add Schedule
//         </button>
//       )}

//       {showForm && (
//         <ScheduleForm
//           initial={editItem}
//           onSave={save}
//           onCancel={() => { setShowForm(false); setEditItem(null); }}
//         />
//       )}

//       {/* Delete confirmation */}
//       {confirmDel && (
//         <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 flex items-center justify-between">
//           <p className="text-red-300 text-sm">Delete <strong>{confirmDel.name}</strong>? This cannot be undone.</p>
//           <div className="flex gap-2">
//             <button onClick={() => setConfirmDel(null)} className="px-3 py-1.5 text-xs border border-gray-700 text-gray-400 rounded-lg">Cancel</button>
//             <button onClick={() => del(confirmDel.id)} className="px-3 py-1.5 text-xs bg-red-700 hover:bg-red-600 text-white rounded-lg">Delete</button>
//           </div>
//         </div>
//       )}

//       <div className="space-y-2">
//         {schedules.length === 0 && (
//           <div className="text-center py-12 text-gray-500">
//             <Bell size={40} className="mx-auto mb-3 opacity-30" />
//             <p>No schedules yet. Add your first bell above.</p>
//           </div>
//         )}
//         {schedules.map(s => {
//           const ts = testStates[s.id];
//           return (
//             <div key={s.id}
//               className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
//               {/* LED dot */}
//               <div className={`w-3 h-3 rounded-full flex-shrink-0 ${s.led_color === 'GREEN' ? 'bg-green-500' :
//                   s.led_color === 'YELLOW' ? 'bg-yellow-400' : 'bg-red-500'
//                 }`} />
//               {/* Time */}
//               <span className="font-mono font-bold text-white text-sm w-14 flex-shrink-0">{s.ring_time}</span>
//               {/* Name + badges */}
//               <div className="flex-1 min-w-0">
//                 <p className="font-bold text-white text-sm truncate">{s.name}</p>
//                 <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
//                   <PatternBadge value={s.pattern} />
//                   <SituationBadge type={s.situation_type} />
//                   <span className="font-mono text-xs text-gray-600">{s.days_of_week}</span>
//                 </div>
//               </div>
//               {/* LCD */}
//               <div className="hidden lg:block">
//                 <LCDPreview line1={s.lcd_line1} line2={s.lcd_line2} />
//               </div>
//               {/* Actions */}
//               {canEdit && (
//                 <div className="flex items-center gap-1 flex-shrink-0">
//                   <button onClick={() => testBell(s)} disabled={!!ts}
//                     className={`p-1.5 rounded-lg border text-xs transition
//                       ${ts === 'done' ? 'border-green-700 text-green-400' :
//                         ts === 'loading' ? 'border-gray-700 text-gray-500' :
//                           'border-gray-700 text-gray-400 hover:border-blue-600 hover:text-blue-400'}`}
//                     title="Test this bell">
//                     {ts === 'done' ? <Check size={13} /> : <Bell size={13} />}
//                   </button>
//                   <button onClick={() => { setEditItem(s); setShowForm(true); }}
//                     className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-yellow-600 hover:text-yellow-400 transition"
//                     title="Edit">
//                     <Edit2 size={13} />
//                   </button>
//                   {isAdmin && (
//                     <button onClick={() => setConfirmDel(s)}
//                       className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-red-700 hover:text-red-400 transition"
//                       title="Delete">
//                       <Trash2 size={13} />
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

'use client';
// src/components/ScheduleTable.jsx — full inline styles, no Tailwind dependency
import { useState } from 'react';
import API from '@/lib/api';
import PatternSelect, { PatternBadge } from './PatternSelect';
import LCDPreview from './LCDPreview';

// ── Constants ────────────────────────────────────────────────────────────
const DAYS = ['M', 'T', 'W', 't', 'F', 'S', 's'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const LED_OPTIONS = ['GREEN', 'YELLOW', 'RED'];

const SITUATION_TYPES = [
  { value: 'CLASS', icon: '📚', label: 'Class' },
  { value: 'BREAK', icon: '☕', label: 'Break' },
  { value: 'LUNCH', icon: '🍽️', label: 'Lunch' },
  { value: 'EXAM', icon: '📝', label: 'Exam' },
  { value: 'EMERGENCY', icon: '🚨', label: 'Emergency' },
  { value: 'WARNING', icon: '⚠️', label: 'Warning' },
  { value: 'ASSEMBLY', icon: '🎤', label: 'Assembly' },
  { value: 'HOLIDAY', icon: '🎉', label: 'Holiday' },
  { value: 'CUSTOM', icon: '✏️', label: 'Custom' },
];

const SIT_STYLE = {
  CLASS: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', color: '#93c5fd' },
  BREAK: { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)', color: '#fde047' },
  LUNCH: { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)', color: '#fdba74' },
  EXAM: { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)', color: '#d8b4fe' },
  EMERGENCY: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: '#fca5a5' },
  WARNING: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#fcd34d' },
  ASSEMBLY: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', color: '#86efac' },
  HOLIDAY: { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)', color: '#f9a8d4' },
  CUSTOM: { bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)', color: '#9ca3af' },
};

const LED_STYLE = {
  GREEN: {
    dot: '#22c55e',
    activeBg: 'rgba(34,197,94,0.15)',
    activeBorder: 'rgba(34,197,94,0.5)',
    activeColor: '#4ade80',
  },
  YELLOW: {
    dot: '#facc15',
    activeBg: 'rgba(250,204,21,0.15)',
    activeBorder: 'rgba(250,204,21,0.5)',
    activeColor: '#fde047',
  },
  RED: {
    dot: '#ef4444',
    activeBg: 'rgba(239,68,68,0.15)',
    activeBorder: 'rgba(239,68,68,0.5)',
    activeColor: '#f87171',
  },
};

const INPUT = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '10px 14px',
  color: '#f1f5f9',
  fontSize: '13px',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const EMPTY_FORM = {
  name: '',
  ring_time: '07:30',
  pattern: 'LONG_SHORT',
  led_color: 'GREEN',
  lcd_line1: '',
  lcd_line2: '',
  lcd_idle_line1: '',
  lcd_idle_line2: '',
  situation_type: 'CLASS',
  days_of_week: 'MTWTF',
  template_id: null,
  active: 1,
};

// ── Situation badge ───────────────────────────────────────────────────────
function SituationBadge({ type }) {
  const st = SITUATION_TYPES.find((s) => s.value === type) || SITUATION_TYPES[0];
  const sty = SIT_STYLE[type] || SIT_STYLE.CUSTOM;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        fontSize: '10px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        padding: '2px 8px',
        borderRadius: '20px',
        background: sty.bg,
        border: `1px solid ${sty.border}`,
        color: sty.color,
      }}
    >
      {st.icon} {st.label}
    </span>
  );
}

// ── Schedule form ─────────────────────────────────────────────────────────
function ScheduleForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const [autoIdle, setAutoIdle] = useState(!initial?.lcd_idle_line1);

  const toggleDay = (d) => {
    const cur = form.days_of_week || '';
    setForm((f) => ({ ...f, days_of_week: cur.includes(d) ? cur.replace(d, '') : cur + d }));
  };

  const focusStyle = (el) => {
    el.style.borderColor = 'rgba(99,102,241,0.7)';
    el.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
  };
  const blurStyle = (el) => {
    el.style.borderColor = 'rgba(255,255,255,0.1)';
    el.style.boxShadow = 'none';
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '18px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}
    >
      {/* Form title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: initial ? 'rgba(234,179,8,0.15)' : 'rgba(99,102,241,0.15)',
            border: initial ? '1px solid rgba(234,179,8,0.3)' : '1px solid rgba(99,102,241,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}
        >
          {initial ? '✏️' : '➕'}
        </div>
        <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 800, margin: 0 }}>
          {initial ? 'Edit Schedule' : 'New Schedule'}
        </h3>
      </div>

      {/* Row 1 — Name + Time */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '7px',
            }}
          >
            Bell Name
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Period 1 Start"
            style={INPUT}
            onFocus={(e) => focusStyle(e.target)}
            onBlur={(e) => blurStyle(e.target)}
          />
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
              marginBottom: '7px',
            }}
          >
            Ring Time
          </label>
          <input
            type="time"
            value={form.ring_time}
            onChange={(e) => setForm((f) => ({ ...f, ring_time: e.target.value }))}
            style={{ ...INPUT, colorScheme: 'dark' }}
            onFocus={(e) => focusStyle(e.target)}
            onBlur={(e) => blurStyle(e.target)}
          />
        </div>
      </div>

      {/* Row 2 — Pattern + LED */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <PatternSelect
          value={form.pattern}
          onChange={(v) => setForm((f) => ({ ...f, pattern: v }))}
        />
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '7px',
            }}
          >
            LED Color
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {LED_OPTIONS.map((c) => {
              const ls = LED_STYLE[c];
              const active = form.led_color === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, led_color: c }))}
                  style={{
                    flex: 1,
                    padding: '9px 0',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    background: active ? ls.activeBg : 'rgba(255,255,255,0.04)',
                    border: active
                      ? `1px solid ${ls.activeBorder}`
                      : '1px solid rgba(255,255,255,0.08)',
                    color: active ? ls.activeColor : 'rgba(255,255,255,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: active ? ls.dot : 'rgba(255,255,255,0.2)',
                    }}
                  />
                  {c[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Situation type */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '10px',
          }}
        >
          Situation Type
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {SITUATION_TYPES.map((st) => {
            const active = form.situation_type === st.value;
            return (
              <button
                key={st.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, situation_type: st.value }))}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                  border: active
                    ? '1px solid rgba(99,102,241,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                  color: active ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
                }}
              >
                {st.icon} {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Days of week */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '10px',
          }}
        >
          Days of Week
        </label>
        <div style={{ display: 'flex', gap: '6px' }}>
          {DAYS.map((d, i) => {
            const active = (form.days_of_week || '').includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                style={{
                  flex: 1,
                  height: '38px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                  border: active
                    ? '1px solid rgba(99,102,241,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                  color: active ? '#a5b4fc' : 'rgba(255,255,255,0.25)',
                }}
              >
                {DAY_LABELS[i].slice(0, 2)}
              </button>
            );
          })}
        </div>
      </div>

      {/* LCD lines on ring */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '10px',
          }}
        >
          LCD Text (on ring)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <input
              value={form.lcd_line1}
              maxLength={16}
              onChange={(e) => setForm((f) => ({ ...f, lcd_line1: e.target.value }))}
              placeholder="Line 1 (16 chars)"
              style={{ ...INPUT, fontFamily: 'monospace', fontSize: '12px' }}
              onFocus={(e) => focusStyle(e.target)}
              onBlur={(e) => blurStyle(e.target)}
            />
            <p
              style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.2)',
                margin: '4px 0 0',
                textAlign: 'right',
              }}
            >
              {16 - (form.lcd_line1?.length || 0)} left
            </p>
          </div>
          <div>
            <input
              value={form.lcd_line2}
              maxLength={16}
              onChange={(e) => setForm((f) => ({ ...f, lcd_line2: e.target.value }))}
              placeholder="Line 2 (16 chars)"
              style={{ ...INPUT, fontFamily: 'monospace', fontSize: '12px' }}
              onFocus={(e) => focusStyle(e.target)}
              onBlur={(e) => blurStyle(e.target)}
            />
            <p
              style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.2)',
                margin: '4px 0 0',
                textAlign: 'right',
              }}
            >
              {16 - (form.lcd_line2?.length || 0)} left
            </p>
          </div>
        </div>
      </div>

      {/* Idle LCD toggle */}
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          padding: '14px 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: autoIdle ? 0 : '12px',
          }}
        >
          <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            LCD During Period (idle)
          </label>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => setAutoIdle((v) => !v)}
          >
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Auto-generate</span>
            <div
              style={{
                width: '36px',
                height: '20px',
                borderRadius: '10px',
                position: 'relative',
                background: autoIdle ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.1)',
                border: autoIdle
                  ? '1px solid rgba(99,102,241,0.5)'
                  : '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'left 0.2s',
                  left: autoIdle ? '19px' : '3px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                }}
              />
            </div>
          </div>
        </div>
        {!autoIdle && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              value={form.lcd_idle_line1}
              maxLength={16}
              onChange={(e) => setForm((f) => ({ ...f, lcd_idle_line1: e.target.value }))}
              placeholder="Idle line 1"
              style={{ ...INPUT, fontFamily: 'monospace', fontSize: '12px' }}
              onFocus={(e) => focusStyle(e.target)}
              onBlur={(e) => blurStyle(e.target)}
            />
            <input
              value={form.lcd_idle_line2}
              maxLength={16}
              onChange={(e) => setForm((f) => ({ ...f, lcd_idle_line2: e.target.value }))}
              placeholder="Idle line 2"
              style={{ ...INPUT, fontFamily: 'monospace', fontSize: '12px' }}
              onFocus={(e) => focusStyle(e.target)}
              onBlur={(e) => blurStyle(e.target)}
            />
          </div>
        )}
      </div>

      {/* LCD Previews */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <LCDPreview label="On Ring" line1={form.lcd_line1} line2={form.lcd_line2} />
        <LCDPreview
          label="During Period"
          line1={form.lcd_idle_line1 || form.situation_type}
          line2={form.lcd_idle_line2 || ''}
        />
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
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
          type="button"
          onClick={() =>
            onSave(autoIdle ? { ...form, lcd_idle_line1: '', lcd_idle_line2: '' } : form)
          }
          style={{
            flex: 2,
            padding: '12px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: 'pointer',
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
            border: 'none',
            color: 'white',
            boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            transition: 'all 0.15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)')}
          onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)')}
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
}

// ── Main ScheduleTable ────────────────────────────────────────────────────
export default function ScheduleTable({ schedules, canEdit, isAdmin, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [testStates, setTestStates] = useState({});
  const [confirmDel, setConfirmDel] = useState(null);

  const save = async (form) => {
    try {
      if (editItem) await API.put(`/api/schedules/${editItem.id}`, form);
      else await API.post('/api/schedules', form);
      setShowForm(false);
      setEditItem(null);
      onRefresh();
    } catch (e) {
      alert(e.response?.data?.error || 'Save failed');
    }
  };

  const del = async (id) => {
    await API.delete(`/api/schedules/${id}`);
    setConfirmDel(null);
    onRefresh();
  };

  const testBell = async (s) => {
    setTestStates((t) => ({ ...t, [s.id]: 'loading' }));
    try {
      await API.post('/api/ring-now', {
        name: s.name,
        pattern: s.pattern,
        led_color: s.led_color,
        lcd_line1: s.lcd_line1,
        lcd_line2: s.lcd_line2,
      });
      setTestStates((t) => ({ ...t, [s.id]: 'done' }));
      setTimeout(() => setTestStates((t) => ({ ...t, [s.id]: null })), 2500);
    } catch {
      setTestStates((t) => ({ ...t, [s.id]: null }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit' }}>
      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 800, margin: 0 }}>
            Bell Schedule
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: '3px 0 0' }}>
            {schedules.length} {schedules.length === 1 ? 'bell' : 'bells'} configured
          </p>
        </div>
        {canEdit && !showForm && (
          <button
            onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}
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
              transition: 'all 0.15s',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)')
            }
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> Add Schedule
          </button>
        )}
      </div>

      {/* ── Form ─────────────────────────────────────────────── */}
      {showForm && (
        <ScheduleForm
          initial={editItem}
          onSave={save}
          onCancel={() => {
            setShowForm(false);
            setEditItem(null);
          }}
        />
      )}

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
            Delete <strong style={{ color: 'white' }}>{confirmDel.name}</strong>? This cannot be
            undone.
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

      {/* ── Schedule list ─────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {schedules.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.25 }}>🔔</div>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.3)',
                margin: 0,
              }}
            >
              No schedules yet
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)', marginTop: '6px' }}>
              Click "Add Schedule" above to create your first bell
            </p>
          </div>
        )}

        {schedules.map((s) => {
          const ts = testStates[s.id];
          const ls = LED_STYLE[s.led_color] || LED_STYLE.GREEN;
          const sit = SIT_STYLE[s.situation_type] || SIT_STYLE.CUSTOM;
          const sitSt =
            SITUATION_TYPES.find((x) => x.value === s.situation_type) || SITUATION_TYPES[0];
          return (
            <div
              key={s.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              {/* LED dot */}
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: ls.dot,
                  boxShadow: `0 0 6px ${ls.dot}55`,
                }}
              />

              {/* Time */}
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  width: '48px',
                  flexShrink: 0,
                  letterSpacing: '-0.5px',
                }}
              >
                {s.ring_time}
              </span>

              {/* Name + badges */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#f8fafc',
                    margin: '0 0 5px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.name}
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}
                >
                  <PatternBadge value={s.pattern} />
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '20px',
                      background: sit.bg,
                      border: `1px solid ${sit.border}`,
                      color: sit.color,
                    }}
                  >
                    {sitSt.icon} {sitSt.label}
                  </span>
                  {s.days_of_week && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        color: 'rgba(255,255,255,0.2)',
                        letterSpacing: '1px',
                      }}
                    >
                      {s.days_of_week}
                    </span>
                  )}
                </div>
              </div>

              {/* LCD preview — desktop only */}
              <div style={{ flexShrink: 0, display: 'none' }} className="lg-show">
                <LCDPreview line1={s.lcd_line1} line2={s.lcd_line2} />
              </div>

              {/* Active badge */}
              <span
                style={{
                  flexShrink: 0,
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: '20px',
                  background: s.active ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                  border: s.active
                    ? '1px solid rgba(34,197,94,0.25)'
                    : '1px solid rgba(255,255,255,0.08)',
                  color: s.active ? '#4ade80' : 'rgba(255,255,255,0.25)',
                }}
              >
                {s.active ? 'Active' : 'Off'}
              </span>

              {/* Action buttons */}
              {canEdit && (
                <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                  {/* Test */}
                  <button
                    onClick={() => testBell(s)}
                    disabled={!!ts}
                    title="Test this bell"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      cursor: ts ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: 'inherit',
                      background:
                        ts === 'done'
                          ? 'rgba(34,197,94,0.12)'
                          : ts === 'loading'
                            ? 'rgba(255,255,255,0.03)'
                            : 'rgba(255,255,255,0.05)',
                      border:
                        ts === 'done'
                          ? '1px solid rgba(34,197,94,0.3)'
                          : '1px solid rgba(255,255,255,0.08)',
                      color: ts === 'done' ? '#4ade80' : 'rgba(255,255,255,0.4)',
                    }}
                    onMouseOver={(e) => {
                      if (!ts) {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                        e.currentTarget.style.color = '#a5b4fc';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!ts) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                      }
                    }}
                  >
                    {ts === 'done' ? '✓' : ts === 'loading' ? '…' : '🔔'}
                  </button>
                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditItem(s);
                      setShowForm(true);
                    }}
                    title="Edit schedule"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: 'inherit',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.4)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(234,179,8,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(234,179,8,0.35)';
                      e.currentTarget.style.color = '#fde047';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                    }}
                  >
                    ✏️
                  </button>
                  {/* Delete */}
                  {isAdmin && (
                    <button
                      onClick={() => setConfirmDel(s)}
                      title="Delete schedule"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        fontFamily: 'inherit',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.4)',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)';
                        e.currentTarget.style.color = '#f87171';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                      }}
                    >
                      🗑
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
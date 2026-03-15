'use client';
// src/components/Templates.jsx
// Schedule Templates — create, activate, delete template sets
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { Plus, Star, Trash2, Check, Layers } from 'lucide-react';

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
            const [t, s] = await Promise.all([
                API.get('/api/templates'),
                API.get('/api/schedules'),
            ]);
            setTemplates(t.data);
            setSchedules(s.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { load(); }, []);

    const createTemplate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            await API.post('/api/templates', { name: name.trim() });
            setName(''); setShowForm(false);
            load();
        } catch (e) {
            alert(e.response?.data?.error || 'Failed to create template');
        } finally { setLoading(false); }
    };

    const activate = async (tid) => {
        setActivating(tid);
        try {
            await API.put(`/api/templates/${tid}/activate`);
            load();
            if (onRefresh) onRefresh();
        } catch (e) {
            alert(e.response?.data?.error || 'Failed to activate');
        } finally { setActivating(null); }
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

    const schedulesForTemplate = (tid) =>
        schedules.filter(s => s.template_id === tid);

    const unassigned = schedules.filter(s => !s.template_id);

    return (
        <div className="space-y-4">
            {/* Delete confirm */}
            {confirmDel && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 flex items-center justify-between">
                    <p className="text-red-300 text-sm">
                        Delete template <strong>{confirmDel.name}</strong>? Schedules in it will become unassigned.
                    </p>
                    <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => setConfirmDel(null)}
                            className="px-3 py-1.5 text-xs border border-gray-700 text-gray-400 rounded-lg">
                            Cancel
                        </button>
                        <button onClick={() => del(confirmDel.id)}
                            className="px-3 py-1.5 text-xs bg-red-700 hover:bg-red-600 text-white rounded-lg">
                            Delete
                        </button>
                    </div>
                </div>
            )}

            {/* Create button */}
            {isAdmin && !showForm && (
                <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition">
                    <Plus size={14} /> New Template
                </button>
            )}

            {/* Create form */}
            {showForm && (
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-white text-sm">New Template</h4>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder='e.g. "Normal Week", "Exam Week", "Half Day"'
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                        <button onClick={() => setShowForm(false)}
                            className="flex-1 py-2 text-sm border border-gray-700 text-gray-400 rounded-lg">
                            Cancel
                        </button>
                        <button onClick={createTemplate} disabled={loading || !name.trim()}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold py-2 rounded-lg transition">
                            {loading ? 'Creating...' : 'Create Template'}
                        </button>
                    </div>
                </div>
            )}

            {/* Template cards */}
            {templates.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <Layers size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No templates yet.</p>
                    <p className="text-xs mt-1 text-gray-600">
                        Templates let you switch between full schedule sets (e.g. Normal Week vs Exam Week) with one click.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {templates.map(t => {
                        const tSchedules = schedulesForTemplate(t.id);
                        const isActive = t.is_active;
                        const isAct = activating === t.id;
                        return (
                            <div key={t.id}
                                className={`rounded-xl border p-4 transition
                  ${isActive
                                        ? 'bg-blue-900/20 border-blue-700/60'
                                        : 'bg-gray-900 border-gray-800'}`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {isActive && <Star size={14} className="text-yellow-400 flex-shrink-0" />}
                                        <div>
                                            <h3 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                                {t.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {tSchedules.length} schedule{tSchedules.length !== 1 ? 's' : ''}
                                                {isActive && <span className="ml-2 text-blue-400 font-semibold">● ACTIVE</span>}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        {isAdmin && !isActive && (
                                            <button
                                                onClick={() => activate(t.id)}
                                                disabled={isAct}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold
                                   bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                                   text-white rounded-lg transition">
                                                {isAct ? '...' : <><Check size={11} /> Activate</>}
                                            </button>
                                        )}
                                        {isActive && (
                                            <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold
                                       bg-blue-900/40 text-blue-300 border border-blue-700 rounded-lg">
                                                <Star size={11} /> Active
                                            </span>
                                        )}
                                        {isAdmin && (
                                            <button onClick={() => setConfirmDel(t)}
                                                className="p-1.5 border border-gray-700 text-gray-500
                                   hover:border-red-700 hover:text-red-400 rounded-lg transition"
                                                title="Delete template">
                                                <Trash2 size={13} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Schedule pills */}
                                {tSchedules.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {tSchedules.map(s => (
                                            <span key={s.id}
                                                className="text-xs font-mono bg-gray-800 border border-gray-700
                                   text-gray-400 px-2 py-0.5 rounded-full">
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

            {/* Unassigned schedules info */}
            {unassigned.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">
                        Unassigned Schedules ({unassigned.length})
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                        These ring when <em>no</em> template is active, or alongside any active template.
                        Assign them to a template from the Schedules tab when editing.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {unassigned.map(s => (
                            <span key={s.id}
                                className="text-xs font-mono bg-gray-800 border border-gray-700
                           text-gray-500 px-2 py-0.5 rounded-full">
                                {s.ring_time} {s.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
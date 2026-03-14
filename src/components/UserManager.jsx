'use client';
// src/components/UserManager.jsx
import { useState, useEffect, useCallback } from 'react';
import API from '@/lib/api';
import { UserPlus, Trash2, Shield, ToggleLeft, ToggleRight } from 'lucide-react';

const ROLES = ['admin', 'teacher', 'viewer'];

export default function UserManager({ onRefresh }) {
  const [users, setUsers]               = useState([]);
  const [signupEnabled, setSignupEnabled] = useState(false);
  const [togglingSignup, setTogglingSignup] = useState(false);
  const [showAdd, setShowAdd]           = useState(false);
  const [form, setForm]                 = useState({ username: '', password: '', role: 'viewer' });
  const [saving, setSaving]             = useState(false);
  const [deletingId, setDeletingId]     = useState(null);

  const load = useCallback(async () => {
    try {
      const [u, s] = await Promise.all([
        API.get('/api/users'),
        API.get('/api/auth/signup-status'),
      ]);
      setUsers(u.data);
      setSignupEnabled(s.data.enabled);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleSignup = async () => {
    setTogglingSignup(true);
    try {
      const res = await API.post('/api/auth/signup-toggle', { enabled: !signupEnabled });
      setSignupEnabled(res.data.enabled);
    } catch {
      alert('Failed to toggle signup');
    } finally {
      setTogglingSignup(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/api/auth/register', form);
      setForm({ username: '', password: '', role: 'viewer' });
      setShowAdd(false);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (uid, username) => {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    setDeletingId(uid);
    try {
      await API.delete(`/api/users/${uid}`);
      load();
    } catch {
      alert('Delete failed (cannot delete admin)');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRoleChange = async (uid, newRole) => {
    try {
      await API.put(`/api/users/${uid}/role`, { role: newRole });
      load();
    } catch {
      alert('Role update failed');
    }
  };

  const roleColor = (r) =>
    r === 'admin' ? 'text-red-400' : r === 'teacher' ? 'text-blue-400' : 'text-green-400';

  return (
    <div className="space-y-6">

      {/* ── SIGNUP TOGGLE CARD ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-white mb-1">Teacher Self-Signup</h3>
            <p className="text-sm text-gray-400 max-w-md">
              When <span className="text-green-400 font-medium">enabled</span>, a "Sign Up" link appears on the login page.
              Anyone can register as a <span className="text-blue-400 font-medium">Teacher</span>.
              Disable after your teachers have registered.
            </p>
          </div>
          <button
            onClick={toggleSignup}
            disabled={togglingSignup}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition flex-shrink-0 ${
              signupEnabled
                ? 'bg-green-900/40 border border-green-700 text-green-400 hover:bg-green-900/60'
                : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
            }`}
          >
            {signupEnabled ? <ToggleRight size={18}/> : <ToggleLeft size={18}/>}
            {togglingSignup ? 'Updating...' : signupEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        <div className={`mt-3 text-xs px-3 py-2 rounded-lg ${
          signupEnabled
            ? 'bg-green-900/20 text-green-400 border border-green-900'
            : 'bg-gray-800 text-gray-500'
        }`}>
          Signup page: <span className="font-mono">/signup</span> is currently{' '}
          <strong>{signupEnabled ? 'OPEN (accessible to anyone)' : 'CLOSED'}</strong>
        </div>
      </div>

      {/* ── USER LIST ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">System Users</h3>
            <p className="text-xs text-gray-500 mt-0.5">{users.length} users registered</p>
          </div>
          <button
            onClick={() => setShowAdd(v => !v)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition"
          >
            <UserPlus size={15} /> Add User
          </button>
        </div>

        {/* Add user form */}
        {showAdd && (
          <div className="border-b border-gray-800 bg-gray-800/50 px-5 py-4">
            <form onSubmit={handleAddUser} className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Username</label>
                <input value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                  placeholder="username" required
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 w-40" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Password</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="password" required
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 w-40" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <button type="submit" disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                {saving ? 'Creating...' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowAdd(false)}
                className="text-gray-400 hover:text-white text-sm px-3 py-2 transition">
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Users table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800">
              <th className="text-left px-5 py-3">Username</th>
              <th className="text-left px-5 py-3">Role</th>
              <th className="text-left px-5 py-3 hidden md:table-cell">Joined</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition">
                <td className="px-5 py-3 font-medium text-white">
                  <div className="flex items-center gap-2">
                    {u.role === 'admin' && <Shield size={13} className="text-red-400" />}
                    {u.username}
                  </div>
                </td>
                <td className="px-5 py-3">
                  {u.role === 'admin' ? (
                    <span className="text-xs font-bold text-red-400 bg-red-900/30 px-2 py-0.5 rounded-full">admin</span>
                  ) : (
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      className={`bg-gray-800 border border-gray-700 rounded px-2 py-0.5 text-xs font-semibold focus:outline-none ${roleColor(u.role)}`}
                    >
                      {ROLES.filter(r => r !== 'admin').map(r => <option key={r}>{r}</option>)}
                    </select>
                  )}
                </td>
                <td className="px-5 py-3 hidden md:table-cell text-gray-400 text-xs font-mono">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB') : '--'}
                </td>
                <td className="px-5 py-3 text-right">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleDeleteUser(u.id, u.username)}
                      disabled={deletingId === u.id}
                      className="text-gray-500 hover:text-red-400 transition disabled:opacity-50"
                      title="Delete user"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
'use client';
// src/app/signup/page.jsx
// Only accessible when admin enables signup via dashboard
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';

export default function SignupPage() {
  const [form, setForm]           = useState({ username: '', password: '', confirm: '' });
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [checking, setChecking]   = useState(true);
  const [allowed, setAllowed]     = useState(false);
  const router = useRouter();

  // Check if signup is enabled before rendering the form
  useEffect(() => {
    API.get('/api/auth/signup-status')
      .then(r => {
        setAllowed(r.data.enabled);
        setChecking(false);
      })
      .catch(() => {
        setAllowed(false);
        setChecking(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await API.post('/api/auth/signup', {
        username: form.username,
        password: form.password,
      });
      setSuccess('Account created! You can now log in as a Teacher.');
      setForm({ username: '', password: '', confirm: '' });
      setTimeout(() => router.push('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        Checking...
      </div>
    );
  }

  // Signup is disabled — show blocked message
  if (!allowed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-white mb-2">Signup Disabled</h2>
          <p className="text-gray-400 text-sm mb-6">
            Account registration is currently disabled. Please contact your school administrator to get access.
          </p>
          <Link href="/login" className="text-blue-400 hover:underline text-sm">
            ← Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔔</div>
          <h1 className="text-3xl font-bold text-white">SmartBell</h1>
          <p className="text-gray-400 text-sm mt-1">Create a Teacher Account</p>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-2 text-white">Sign Up</h2>
          <p className="text-xs text-gray-500 mb-6">
            Your account will be created with the <span className="text-blue-400 font-medium">Teacher</span> role.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                placeholder="Choose a username"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                placeholder="Min 6 characters"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                placeholder="Repeat password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-2.5 text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg px-4 py-2.5 text-green-400 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition"
            >
              {loading ? 'Creating account...' : 'Create Teacher Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
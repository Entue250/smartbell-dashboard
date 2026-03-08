'use client';
// src/app/login/page.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';

export default function LoginPage() {
  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [signupEnabled, setSignupEnabled] = useState(false);
  const { login, user }       = useAuth();
  const router                = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  // Check if signup is enabled (to show/hide signup link)
  useEffect(() => {
    API.get('/api/auth/signup-status')
      .then(r => setSignupEnabled(r.data.enabled))
      .catch(() => setSignupEnabled(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.username, form.password);
      router.push('/');
    } catch {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔔</div>
          <h1 className="text-3xl font-bold text-white">SmartBell</h1>
          <p className="text-gray-400 text-sm mt-1">School Bell Management System</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6 text-white">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-2.5 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Signup link — only shown when admin enables it */}
          {signupEnabled && (
            <p className="text-center text-sm text-gray-400 mt-6">
              Need an account?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition">
                Sign up as Teacher
              </Link>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Default admin: admin / admin123
        </p>
      </div>
    </div>
  );
}
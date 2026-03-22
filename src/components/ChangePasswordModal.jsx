// 'use client';
// // src/components/ChangePasswordModal.jsx
// // Shows as a modal when user clicks "Change Password" in the header
// import { useState } from 'react';
// import API from '@/lib/api';
// import { X, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

// export default function ChangePasswordModal({ onClose }) {
//   const [form, setForm] = useState({
//     current_password: '',
//     new_password: '',
//     confirm_password: '',
//   });
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew, setShowNew]         = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [loading, setLoading]         = useState(false);
//   const [error, setError]             = useState('');
//   const [success, setSuccess]         = useState(false);

//   // Password strength checker
//   const strength = (pw) => {
//     if (!pw) return { score: 0, label: '', color: '' };
//     let score = 0;
//     if (pw.length >= 6)  score++;
//     if (pw.length >= 10) score++;
//     if (/[A-Z]/.test(pw)) score++;
//     if (/[0-9]/.test(pw)) score++;
//     if (/[^A-Za-z0-9]/.test(pw)) score++;
//     const map = [
//       { label: '',          color: '' },
//       { label: 'Weak',      color: 'bg-red-500' },
//       { label: 'Fair',      color: 'bg-orange-400' },
//       { label: 'Good',      color: 'bg-yellow-400' },
//       { label: 'Strong',    color: 'bg-green-400' },
//       { label: 'Very Strong', color: 'bg-green-500' },
//     ];
//     return { score, ...map[score] };
//   };

//   const pwStrength = strength(form.new_password);
//   const passwordsMatch = form.new_password && form.confirm_password &&
//                          form.new_password === form.confirm_password;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     if (form.new_password !== form.confirm_password) {
//       setError('New passwords do not match.');
//       return;
//     }
//     if (form.new_password.length < 6) {
//       setError('New password must be at least 6 characters.');
//       return;
//     }
//     setLoading(true);
//     try {
//       await API.post('/api/auth/change-password', form);
//       setSuccess(true);
//       setTimeout(() => onClose(), 2000);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to change password. Try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // Backdrop
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
//       onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl mx-4">

//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
//           <div className="flex items-center gap-2">
//             <Lock size={18} className="text-blue-400" />
//             <h2 className="font-bold text-white">Change Password</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-white transition rounded-lg p-1"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Success state */}
//         {success ? (
//           <div className="px-6 py-10 text-center">
//             <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
//             <p className="text-white font-bold text-lg mb-1">Password Changed!</p>
//             <p className="text-gray-400 text-sm">Your password has been updated successfully.</p>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

//             {/* Current Password */}
//             <div>
//               <label className="block text-xs text-gray-400 mb-1.5">Current Password</label>
//               <div className="relative">
//                 <input
//                   type={showCurrent ? 'text' : 'password'}
//                   value={form.current_password}
//                   onChange={e => setForm({ ...form, current_password: e.target.value })}
//                   placeholder="Enter your current password"
//                   required
//                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
//                 />
//                 <button type="button" onClick={() => setShowCurrent(v => !v)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
//                   {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
//                 </button>
//               </div>
//             </div>

//             {/* New Password */}
//             <div>
//               <label className="block text-xs text-gray-400 mb-1.5">New Password</label>
//               <div className="relative">
//                 <input
//                   type={showNew ? 'text' : 'password'}
//                   value={form.new_password}
//                   onChange={e => setForm({ ...form, new_password: e.target.value })}
//                   placeholder="Min 6 characters"
//                   required
//                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
//                 />
//                 <button type="button" onClick={() => setShowNew(v => !v)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
//                   {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
//                 </button>
//               </div>
//               {/* Strength bar */}
//               {form.new_password && (
//                 <div className="mt-2">
//                   <div className="flex gap-1 mb-1">
//                     {[1,2,3,4,5].map(i => (
//                       <div key={i}
//                         className={`h-1 flex-1 rounded-full transition-all ${
//                           i <= pwStrength.score ? pwStrength.color : 'bg-gray-700'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <p className={`text-xs ${
//                     pwStrength.score <= 1 ? 'text-red-400' :
//                     pwStrength.score <= 2 ? 'text-orange-400' :
//                     pwStrength.score <= 3 ? 'text-yellow-400' : 'text-green-400'
//                   }`}>{pwStrength.label}</p>
//                 </div>
//               )}
//             </div>

//             {/* Confirm New Password */}
//             <div>
//               <label className="block text-xs text-gray-400 mb-1.5">Confirm New Password</label>
//               <div className="relative">
//                 <input
//                   type={showConfirm ? 'text' : 'password'}
//                   value={form.confirm_password}
//                   onChange={e => setForm({ ...form, confirm_password: e.target.value })}
//                   placeholder="Repeat new password"
//                   required
//                   className={`w-full bg-gray-800 border rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 transition ${
//                     form.confirm_password
//                       ? passwordsMatch
//                         ? 'border-green-600 focus:border-green-500 focus:ring-green-500'
//                         : 'border-red-700 focus:border-red-500 focus:ring-red-500'
//                       : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
//                   }`}
//                 />
//                 <button type="button" onClick={() => setShowConfirm(v => !v)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
//                   {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
//                 </button>
//               </div>
//               {form.confirm_password && (
//                 <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
//                   {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
//                 </p>
//               )}
//             </div>

//             {/* Error */}
//             {error && (
//               <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-2.5 text-red-400 text-sm">
//                 {error}
//               </div>
//             )}

//             {/* Buttons */}
//             <div className="flex gap-3 pt-2">
//               <button type="button" onClick={onClose}
//                 className="flex-1 px-4 py-2.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition">
//                 Cancel
//               </button>
//               <button type="submit" disabled={loading}
//                 className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition">
//                 {loading ? 'Updating...' : 'Change Password'}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';
// src/components/ChangePasswordModal.jsx
import { useState } from 'react';
import API from '@/lib/api';
import { X, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const strength = (pw) => {
    if (!pw) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { label: '', color: '' },
      { label: 'Weak', color: 'bg-red-500' },
      { label: 'Fair', color: 'bg-orange-400' },
      { label: 'Good', color: 'bg-yellow-400' },
      { label: 'Strong', color: 'bg-green-400' },
      { label: 'Very Strong', color: 'bg-green-500' },
    ];
    return { score, ...map[score] };
  };

  const pwStrength = strength(form.new_password);
  const passwordsMatch = form.new_password && form.confirm_password &&
    form.new_password === form.confirm_password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.new_password !== form.confirm_password) {
      setError('New passwords do not match.');
      return;
    }
    if (form.new_password.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await API.post('/api/auth/change-password', form);
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-blue-400" />
            <h2 className="font-bold text-white text-sm">Change Password</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition rounded-lg p-1">
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-10 text-center">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <p className="text-white font-bold text-lg mb-1">Password Changed!</p>
            <p className="text-gray-400 text-sm">Your password has been updated successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={form.current_password}
                  onChange={e => setForm({ ...form, current_password: e.target.value })}
                  placeholder="Enter your current password"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
                <button type="button" onClick={() => setShowCurrent(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={form.new_password}
                  onChange={e => setForm({ ...form, new_password: e.target.value })}
                  placeholder="Min 8 characters"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
                <button type="button" onClick={() => setShowNew(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {form.new_password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength.score ? pwStrength.color : 'bg-gray-700'}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${pwStrength.score <= 1 ? 'text-red-400' : pwStrength.score <= 2 ? 'text-orange-400' : pwStrength.score <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {pwStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirm_password}
                  onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                  placeholder="Repeat new password"
                  required
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 transition ${form.confirm_password
                      ? passwordsMatch
                        ? 'border-green-600 focus:border-green-500 focus:ring-green-500'
                        : 'border-red-700 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {form.confirm_password && (
                <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-2.5 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition">
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
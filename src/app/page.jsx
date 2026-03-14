// 'use client';
// // src/app/page.jsx
// // FIX: Added missing </main> closing tag
// // FIX: Added UserManager component inline
// import { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '@/lib/auth';
// import { useRouter } from 'next/navigation';
// import { io } from 'socket.io-client';
// import API from '@/lib/api';
// import { Bell, Clock, Activity, LogOut, Wifi, WifiOff } from 'lucide-react';
// import ScheduleTable from '@/components/ScheduleTable';
// import RingLogs from '@/components/RingLogs';
// import ManualRing from '@/components/ManualRing';
// import UserManager from '@/components/UserManager';

// export default function Dashboard() {
//   const { user, logout, loading } = useAuth();
//   const router = useRouter();
//   const [status, setStatus]     = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [logs, setLogs]         = useState([]);
//   const [liveEvent, setLiveEvent] = useState(null);
//   const [activeTab, setActiveTab] = useState('dashboard');

//   // Redirect if not logged in
//   useEffect(() => {
//     if (!loading && !user) router.push('/login');
//   }, [user, loading, router]);

//   const loadData = useCallback(async () => {
//     try {
//       const [s, l, st] = await Promise.all([
//         API.get('/api/schedules'),
//         API.get('/api/logs'),
//         API.get('/api/status'),
//       ]);
//       setSchedules(s.data);
//       setLogs(l.data);
//       setStatus(st.data);
//     } catch (err) {
//       console.error('Load error:', err);
//     }
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     loadData();
//     const socket = io(process.env.NEXT_PUBLIC_WS_URL);
//     socket.on('bell_rang', (data) => {
//       setLiveEvent(data);
//       loadData();
//       setTimeout(() => setLiveEvent(null), 5000);
//     });
//     return () => socket.disconnect();
//   }, [user, loadData]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
//         <div className="text-center">
//           <div className="text-4xl mb-4 animate-pulse">🔔</div>
//           <p className="text-gray-400">Loading SmartBell...</p>
//         </div>
//       </div>
//     );
//   }
//   if (!user) return null;

//   const canEdit = ['admin', 'teacher'].includes(user.role);
//   const isAdmin = user.role === 'admin';

//   const tabs = ['dashboard', 'schedules', 'logs', ...(isAdmin ? ['users'] : [])];

//   return (
//     <div className="min-h-screen bg-gray-950 text-white">

//       {/* LIVE BELL BANNER */}
//       {liveEvent && (
//         <div className="fixed top-4 right-4 z-50 bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl shadow-2xl animate-bounce flex items-center gap-2">
//           <span>🔔</span>
//           <span>{liveEvent.name} rang at {liveEvent.time}</span>
//         </div>
//       )}

//       {/* HEADER */}
//       <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
//         <div className="flex items-center gap-3">
//           <Bell className="text-yellow-400" size={22} />
//           <span className="text-lg font-bold">SmartBell Dashboard</span>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-1 text-xs">
//             {status?.arduino === 'connected'
//               ? <><Wifi size={12} className="text-green-400" /><span className="text-green-400">Arduino</span></>
//               : <><WifiOff size={12} className="text-red-400" /><span className="text-red-400">No Arduino</span></>
//             }
//           </div>
//           <span className="text-sm text-gray-400">
//             {user.username} ·{' '}
//             <span className={`capitalize font-semibold ${
//               user.role === 'admin' ? 'text-red-400' :
//               user.role === 'teacher' ? 'text-blue-400' : 'text-green-400'
//             }`}>{user.role}</span>
//           </span>
//           <button onClick={logout} className="text-gray-400 hover:text-white transition" title="Logout">
//             <LogOut size={18} />
//           </button>
//         </div>
//       </header>

//       {/* NAV TABS */}
//       <nav className="bg-gray-900 border-b border-gray-800 px-6 flex gap-0 overflow-x-auto">
//         {tabs.map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition whitespace-nowrap ${
//               activeTab === tab
//                 ? 'border-blue-500 text-blue-400'
//                 : 'border-transparent text-gray-400 hover:text-white'
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </nav>

//       {/* MAIN CONTENT */}
//       <main className="p-6 max-w-6xl mx-auto">

//         {/* ── DASHBOARD TAB ── */}
//         {activeTab === 'dashboard' && (
//           <div className="space-y-6">

//             {/* STAT CARDS */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {[
//                 { label: 'Current Time', value: status?.time || '--:--', color: 'text-blue-400', icon: <Clock size={18}/> },
//                 { label: 'Rings Today',  value: status?.rings_today ?? 0, color: 'text-yellow-400', icon: <Bell size={18}/> },
//                 { label: 'Next Bell',    value: status?.next_bell?.ring_time || 'None', color: 'text-green-400', icon: <Activity size={18}/> },
//                 { label: 'Arduino',      value: status?.arduino || '--',
//                   color: status?.arduino === 'connected' ? 'text-green-400' : 'text-red-400',
//                   icon: status?.arduino === 'connected' ? <Wifi size={18}/> : <WifiOff size={18}/> },
//               ].map((s, i) => (
//                 <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
//                   <div className={`mb-2 ${s.color}`}>{s.icon}</div>
//                   <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
//                   <div className="text-xs text-gray-500 mt-1">{s.label}</div>
//                 </div>
//               ))}
//             </div>

//             {canEdit && <ManualRing onRing={loadData} />}
//             <RingLogs logs={logs.slice(0, 10)} />
//           </div>
//         )}

//         {/* ── SCHEDULES TAB ── */}
//         {activeTab === 'schedules' && (
//           <ScheduleTable
//             schedules={schedules}
//             canEdit={canEdit}
//             isAdmin={isAdmin}
//             onRefresh={loadData}
//           />
//         )}

//         {/* ── LOGS TAB ── */}
//         {activeTab === 'logs' && (
//           <RingLogs logs={logs} showAll />
//         )}

//         {/* ── USERS TAB (admin only) ── */}
//         {activeTab === 'users' && isAdmin && (
//           <UserManager onRefresh={loadData} />
//         )}

//       </main>
//     </div>
//   );
// }

'use client';
// src/app/page.jsx  — Updated with Change Password in header
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import API from '@/lib/api';
import { Bell, Clock, Activity, LogOut, Wifi, WifiOff, KeyRound } from 'lucide-react';
import ScheduleTable from '@/components/ScheduleTable';
import RingLogs from '@/components/RingLogs';
import ManualRing from '@/components/ManualRing';
import UserManager from '@/components/UserManager';
import ChangePasswordModal from '@/components/ChangePasswordModal';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [status, setStatus]         = useState(null);
  const [schedules, setSchedules]   = useState([]);
  const [logs, setLogs]             = useState([]);
  const [liveEvent, setLiveEvent]   = useState(null);
  const [activeTab, setActiveTab]   = useState('dashboard');
  const [showChangePw, setShowChangePw] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const loadData = useCallback(async () => {
    try {
      const [s, l, st] = await Promise.all([
        API.get('/api/schedules'),
        API.get('/api/logs'),
        API.get('/api/status'),
      ]);
      setSchedules(s.data);
      setLogs(l.data);
      setStatus(st.data);
    } catch (err) {
      console.error('Load error:', err);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    loadData();
    const socket = io(process.env.NEXT_PUBLIC_WS_URL);
    socket.on('bell_rang', (data) => {
      setLiveEvent(data);
      loadData();
      setTimeout(() => setLiveEvent(null), 5000);
    });
    return () => socket.disconnect();
  }, [user, loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🔔</div>
          <p className="text-gray-400">Loading SmartBell...</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  const canEdit = ['admin', 'teacher'].includes(user.role);
  const isAdmin = user.role === 'admin';
  const tabs    = ['dashboard', 'schedules', 'logs', ...(isAdmin ? ['users'] : [])];

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Change Password Modal */}
      {showChangePw && (
        <ChangePasswordModal onClose={() => setShowChangePw(false)} />
      )}

      {/* LIVE BELL BANNER */}
      {liveEvent && (
        <div className="fixed top-4 right-4 z-40 bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl shadow-2xl animate-bounce flex items-center gap-2">
          <span>🔔</span>
          <span>{liveEvent.name} rang at {liveEvent.time}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Bell className="text-yellow-400" size={22} />
          <span className="text-lg font-bold">SmartBell Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Arduino status */}
          <div className="flex items-center gap-1 text-xs hidden sm:flex">
            {status?.arduino === 'connected'
              ? <><Wifi size={12} className="text-green-400" /><span className="text-green-400">Arduino</span></>
              : <><WifiOff size={12} className="text-red-400" /><span className="text-red-400">No Arduino</span></>
            }
          </div>

          {/* User info */}
          <span className="text-sm text-gray-400 hidden sm:block">
            {user.username} ·{' '}
            <span className={`capitalize font-semibold ${
              user.role === 'admin' ? 'text-red-400' :
              user.role === 'teacher' ? 'text-blue-400' : 'text-green-400'
            }`}>{user.role}</span>
          </span>

          {/* Change password button */}
          <button
            onClick={() => setShowChangePw(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
            title="Change Password"
          >
            <KeyRound size={13} />
            <span className="hidden sm:block">Change Password</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-700 px-3 py-1.5 rounded-lg transition"
            title="Logout"
          >
            <LogOut size={13} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      {/* NAV TABS */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 flex gap-0 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition whitespace-nowrap ${
              activeTab === tab
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="p-6 max-w-6xl mx-auto">

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Current Time', value: status?.time || '--:--',          color: 'text-blue-400',  icon: <Clock size={18}/> },
                { label: 'Rings Today',  value: status?.rings_today ?? 0,         color: 'text-yellow-400', icon: <Bell size={18}/> },
                { label: 'Next Bell',    value: status?.next_bell?.ring_time || 'None', color: 'text-green-400', icon: <Activity size={18}/> },
                { label: 'Arduino',      value: status?.arduino || '--',
                  color: status?.arduino === 'connected' ? 'text-green-400' : 'text-red-400',
                  icon: status?.arduino === 'connected' ? <Wifi size={18}/> : <WifiOff size={18}/> },
              ].map((s, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className={`mb-2 ${s.color}`}>{s.icon}</div>
                  <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            {canEdit && <ManualRing onRing={loadData} />}
            <RingLogs logs={logs.slice(0, 10)} />
          </div>
        )}

        {activeTab === 'schedules' && (
          <ScheduleTable
            schedules={schedules}
            canEdit={canEdit}
            isAdmin={isAdmin}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'logs' && <RingLogs logs={logs} showAll />}

        {activeTab === 'users' && isAdmin && (
          <UserManager onRefresh={loadData} />
        )}

      </main>
    </div>
  );
}
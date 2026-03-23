// // src/app/layout.jsx
// import { AuthProvider } from '@/lib/auth';
// import './globals.css';

// export const metadata = {
//   title: 'SmartBell — School Bell System',
//   description: 'Smart School Bell Control Dashboard',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-950 text-white antialiased">
//         <AuthProvider>
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

// src/app/layout.jsx
import './globals.css';
import { AuthProvider } from '@/lib/auth';

export const metadata = {
  title: 'SmartBell v2 — School Bell System',
  description: 'Smart school bell management system with real-time scheduling',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
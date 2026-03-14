// src/app/layout.jsx
import { AuthProvider } from '@/lib/auth';
import './globals.css';

export const metadata = {
  title: 'SmartBell — School Bell System',
  description: 'Smart School Bell Control Dashboard',
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
'use client';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFocusMode = pathname === '/focus' || pathname === '/onboarding';

  if (isFocusMode) {
    return <div className="h-screen w-full bg-gray-950 text-white">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-transparent text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto ml-64 relative">
        {children}
      </main>
    </div>
  );
}

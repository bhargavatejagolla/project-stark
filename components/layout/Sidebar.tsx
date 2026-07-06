'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, FolderKanban, BookOpen, BarChart3, Settings, BrainCircuit, Target, Activity } from 'lucide-react';
import { JarvisAvatar } from './JarvisAvatar';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Mission Control', href: '/', icon: Home, badge: '' },
    { name: 'The 1Cr Engine', href: '/career', icon: Target, badge: 'FAANG' },
    { name: 'Analytics Brain', href: '/analytics', icon: Activity, badge: '' },
    { name: 'Settings', href: '/settings', icon: Settings, badge: '' },
  ];

  return (
    <div className="w-64 h-screen bg-black/20 border-r border-white/5 flex flex-col fixed left-0 top-0 backdrop-blur-xl z-40">
      <div className="p-6">
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <span className="text-indigo-500 drop-shadow-[0_0_8px_#6366f1]">PROJECT</span> STARK
        </h2>
        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.2em] font-bold">OS Level 2.0</p>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto hide-scrollbar">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                active 
                  ? 'bg-white/10 text-white shadow-lg border border-white/10 scale-[1.02]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <link.icon className={`h-4 w-4 transition-colors ${active ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`} />
                {link.name}
              </div>
              {link.badge && (
                <span className="text-[9px] uppercase tracking-widest font-black bg-white/10 px-2 py-1 rounded-md text-gray-300 shadow-sm border border-white/5">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6">
        <JarvisAvatar />
      </div>
    </div>
  );
}

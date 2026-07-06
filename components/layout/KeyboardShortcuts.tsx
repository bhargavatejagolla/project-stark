'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    let lastKey = '';
    let lastKeyTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const now = Date.now();
      const key = e.key.toLowerCase();

      // Space -> Focus Mode
      if (key === ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        router.push('/focus');
        return;
      }

      if (key === 'g') {
        lastKey = 'g';
        lastKeyTime = now;
        return;
      }

      // Check if within 1 second of pressing 'g'
      if (now - lastKeyTime < 1000 && lastKey === 'g') {
        switch (key) {
          case 'm': router.push('/'); toast('🚀 Mission Control'); break;
          case 'c': router.push('/career'); toast('💼 Career Brain'); break;
          case 'p': router.push('/projects'); toast('💻 Project Brain'); break;
          case 'l': router.push('/learning'); toast('📚 Learning Brain'); break;
          case 'a': router.push('/analytics'); toast('📈 Analytics Brain'); break;
          case 's': router.push('/settings'); toast('⚙️ Settings'); break;
        }
        lastKey = ''; // Reset
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null;
}

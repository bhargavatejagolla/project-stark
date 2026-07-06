'use client';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export function MorningBrief() {
  const [brief, setBrief] = useState<string>('');

  useEffect(() => {
    fetch('/api/cron/morning-brief')
      .then(res => res.json())
      .then(data => {
        if (data.success) setBrief(data.message);
      })
      .catch(() => {});
  }, []);

  if (!brief) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-xl p-4 mb-6 flex items-start gap-3 shadow-sm">
      <Sparkles className="h-5 w-5 mt-0.5 shrink-0 text-indigo-500" />
      <p className="text-sm font-medium italic leading-relaxed">{brief}</p>
    </div>
  );
}

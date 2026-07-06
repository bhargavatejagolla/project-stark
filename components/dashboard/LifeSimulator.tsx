'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LifeSimulator() {
  const [days, setDays] = useState(60);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const simulate = async () => {
    setLoading(true);
    const res = await fetch('/api/engine/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetDays: days })
    });
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">🔮 The Life Simulator</h3>
      <p className="text-xs text-gray-500 mb-4">Input days until deadline (e.g., Placements).</p>
      
      <div className="flex gap-2 mb-6">
        <Input type="number" value={days} onChange={e => setDays(Number(e.target.value))} className="w-24 font-bold" />
        <Button onClick={simulate} disabled={loading} variant="secondary" className="flex-1">
          {loading ? 'Simulating...' : 'Run Simulation'}
        </Button>
      </div>

      {results && results.paths && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border">
            <span className="font-bold text-sm block text-gray-700 dark:text-gray-300 mb-1">Path A: Current Pace</span>
            <span className="text-sm">{results.paths.a}</span>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50 rounded-xl border">
            <span className="font-bold text-sm block text-indigo-700 dark:text-indigo-400 mb-1">Path B: Grind Mode</span>
            <span className="text-sm text-indigo-900 dark:text-indigo-200">{results.paths.b}</span>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 rounded-xl border">
            <span className="font-bold text-sm block text-emerald-700 dark:text-emerald-400 mb-1">Path C: Strategic Pivot</span>
            <span className="text-sm text-emerald-900 dark:text-emerald-200">{results.paths.c}</span>
          </div>
        </div>
      )}
    </div>
  );
}

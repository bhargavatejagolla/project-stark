'use client';

import { useState } from 'react';
import { logMorningHealth } from '@/app/actions/health';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function MorningCheckIn() {
  const [sleep, setSleep] = useState(7);
  const [energy, setEnergy] = useState(7);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await logMorningHealth(sleep, energy);
      toast.success('Health logged. Decision Engine calibrating...');
      
      // Optionally trigger the Decision Engine API here
      await fetch('/api/engine/decision', { method: 'POST' });
      
      setDone(true);
    } catch (err) {
      toast.error('Failed to log health');
    } finally {
      setLoading(false);
    }
  };

  if (done) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border shadow-sm mb-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        🔋 Morning Calibrator
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Project Stark needs to know your energy levels to dynamically adjust your schedule today.
      </p>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span>Sleep</span>
            <span className={sleep < 6 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{sleep} hours</span>
          </div>
          <input 
            type="range" min="2" max="12" step="0.5" 
            value={sleep} onChange={e => setSleep(Number(e.target.value))}
            className="w-full accent-indigo-600" 
          />
        </div>
        <div>
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span>Energy Level</span>
            <span className={energy < 5 ? 'text-orange-500 font-bold' : 'text-green-600 font-bold'}>{energy}/10</span>
          </div>
          <input 
            type="range" min="1" max="10" 
            value={energy} onChange={e => setEnergy(Number(e.target.value))}
            className="w-full accent-indigo-600" 
          />
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="w-full font-bold">
          {loading ? 'Calibrating...' : 'Log & Run Decision Engine'}
        </Button>
      </div>
    </div>
  );
}

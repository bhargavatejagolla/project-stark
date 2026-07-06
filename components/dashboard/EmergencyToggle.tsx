'use client';
import { useState } from 'react';
import { toast } from 'sonner';

export function EmergencyToggle() {
  const [loading, setLoading] = useState(false);

  const handleEmergency = async (action: 'pause' | 'resume') => {
    setLoading(true);
    try {
      const res = await fetch('/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(data.error || 'Failed to trigger emergency mode');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      <button 
        onClick={() => handleEmergency('pause')}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full shadow-lg font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
      >
        🛑 Life Happened (Pause)
      </button>
      <button 
        onClick={() => handleEmergency('resume')}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
      >
        ▶️ Resume & Shift Deadlines
      </button>
    </div>
  );
}

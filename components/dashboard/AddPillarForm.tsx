'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addCustomPillar } from '@/app/actions/engines';
import { toast } from 'sonner';

export function AddPillarForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('100');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await addCustomPillar(name, parseInt(target) || 100);
      toast.success('New Neural Pillar Established.');
      setName('');
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add pillar');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full h-full min-h-[300px] border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-indigo-400 transition-all group glass-panel"
      >
        <Plus className="h-12 w-12 group-hover:scale-125 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-sm">Add Custom Course/Pillar</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full h-full min-h-[300px] border border-indigo-500/30 rounded-2xl p-8 flex flex-col justify-center glass-panel bg-indigo-950/20">
      <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6">Initialize New Pillar</h3>
      
      <div className="space-y-4 flex-1">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Pillar Name (e.g. Machine Learning)</label>
          <Input 
            autoFocus
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Course Name..."
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Target Mastery (Hours)</label>
          <Input 
            type="number"
            value={target} 
            onChange={(e) => setTarget(e.target.value)} 
            placeholder="100"
            className="bg-white/5 border-white/10 text-white"
            min="1"
            required
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => setIsOpen(false)}
          className="flex-1 text-gray-400 hover:text-white"
        >
          CANCEL
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'ESTABLISH'}
        </Button>
      </div>
    </form>
  );
}

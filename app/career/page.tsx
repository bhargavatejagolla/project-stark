import { getFAANGPillars } from '@/app/actions/engines';
import { AlertTriangle } from 'lucide-react';
import { AddPillarForm } from '@/components/dashboard/AddPillarForm';
import { PillarCard } from '@/components/dashboard/PillarCard';

export default async function CareerPage() {
  const pillars = await getFAANGPillars();

  return (
    <main className="min-h-screen w-full relative overflow-hidden text-white flex flex-col p-8 lg:p-12 animate-in fade-in duration-700">
      <header className="border-b border-white/10 pb-6 mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-8 bg-indigo-500 shadow-[0_0_10px_#6366f1]"></span>
          <p className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase drop-shadow-md">The 1Cr Engine</p>
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">FAANG Readiness</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl">
        {pillars.map((pillar: any) => (
          <PillarCard key={pillar.id} pillar={pillar} />
        ))}
        
        {/* The Manual Override Entry */}
        <div className="h-full">
          <AddPillarForm />
        </div>
      </div>
      
      {pillars.length > 0 && (
        <div className="mt-12 max-w-7xl">
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-1 shrink-0 animate-pulse" />
            <div>
              <h4 className="text-red-400 font-black uppercase tracking-widest mb-1 text-sm">System Warning</h4>
              <p className="text-red-200/80 text-sm font-medium leading-relaxed">
                Your overall FAANG readiness is insufficient. At your current velocity, you will not clear the L5 bar. You must aggressively log deep work sessions targeted at your weakest pillar immediately.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

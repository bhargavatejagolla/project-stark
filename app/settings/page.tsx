import { Settings2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <main className="min-h-screen w-full relative overflow-hidden text-white flex flex-col p-8 lg:p-12 animate-in fade-in duration-700">
      <header className="border-b border-white/10 pb-6 mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-8 bg-indigo-500 shadow-[0_0_10px_#6366f1]"></span>
          <p className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase drop-shadow-md">Configuration</p>
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">System Settings</h1>
      </header>

      <div className="max-w-3xl w-full space-y-12">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
            <Settings2 className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-bold tracking-tight">OS Preferences</h2>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-200">Weekly Available Hours</p>
                <p className="text-sm text-gray-500 mt-1">Used by Jarvis to calculate burnout risk and pacing.</p>
              </div>
              <div className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 font-mono text-emerald-400">
                25 h
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-200">Strict Focus Mode</p>
                <p className="text-sm text-gray-500 mt-1">Blocks exiting Focus Mode until timer completes.</p>
              </div>
              <div className="h-6 w-12 bg-indigo-500 rounded-full relative shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-200">Groq LLM Engine</p>
                <p className="text-sm text-gray-500 mt-1">Select the AI brain powering Jarvis.</p>
              </div>
              <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 font-mono text-gray-300 focus:outline-none focus:border-indigo-500">
                <option>llama-3.3-70b-versatile</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 backdrop-blur-md">
          <h2 className="text-xl font-bold tracking-tight text-red-400 mb-2">Danger Zone</h2>
          <p className="text-sm text-red-400/70 mb-6">Irreversible OS actions.</p>
          <button className="bg-red-500/20 text-red-400 border border-red-500/50 px-6 py-3 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-colors text-sm uppercase tracking-widest">
            Factory Reset OS
          </button>
        </div>
      </div>
    </main>
  );
}

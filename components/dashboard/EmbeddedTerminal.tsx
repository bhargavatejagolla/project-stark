'use client';

import { useState } from 'react';
import { Terminal, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function EmbeddedTerminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{role: string, text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setHistory(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/groq/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      setHistory(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      setHistory(prev => [...prev, { role: 'ai', text: 'Error connecting to neural link.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel mt-12 overflow-hidden flex flex-col h-[400px]">
      <div className="bg-black/50 border-b border-white/10 p-4 flex items-center gap-3">
        <Terminal className="h-5 w-5 text-indigo-400" />
        <h3 className="text-xs font-black tracking-[0.2em] uppercase text-indigo-300">Jarvis Neural Link // Active</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col font-mono text-sm hide-scrollbar">
        {history.length === 0 ? (
          <div className="text-gray-500 m-auto text-center max-w-md">
            <p>I am actively monitoring your metrics.</p>
            <p className="mt-2 text-xs">Request a micro-plan, ask for an interrogation, or demand a schedule rewrite.</p>
          </div>
        ) : (
          history.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white/10 text-gray-300 border border-white/5'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
             <div className="max-w-[80%] rounded-lg p-4 bg-white/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Processing...
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/30 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command Jarvis..."
            className="bg-white/5 border-white/10 text-white font-mono placeholder:text-gray-600 focus-visible:ring-indigo-500"
            autoComplete="off"
          />
          <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function FirstBoot() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const [companies, setCompanies] = useState('');
  const [hours, setHours] = useState('');
  
  // Waking up sequence
  useEffect(() => {
    const sequence = [
      "Initializing Project Stark Core Systems...",
      "Connecting to Neural Network...",
      "Hello Bhargava.",
      "Let's configure your Operating System."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setMessages(prev => [...prev, sequence[i]]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => setStep(1), 1000);
      }
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 md:p-24 flex flex-col justify-center items-start selection:bg-green-500 selection:text-black">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Terminal Output */}
        <div className="space-y-4 text-lg">
          {messages.map((msg, idx) => (
            <p key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              &gt; {msg}
            </p>
          ))}
        </div>

        {/* Interactive Steps */}
        {step >= 1 && (
          <div className="animate-in fade-in duration-1000 mt-12 space-y-12 border-t border-green-500/30 pt-12 text-lg">
            
            <div className="space-y-4">
              <p>1. What are you trying to become?</p>
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="[e.g., AI Engineer]" 
                className="bg-transparent border-b border-green-500/50 text-white focus:outline-none focus:border-green-400 w-full p-2 placeholder:text-gray-700"
                autoFocus
              />
            </div>
            
            {role.length > 2 && (
              <div className="space-y-4 animate-in fade-in">
                <p>2. Dream Companies? (comma separated)</p>
                <input 
                  type="text" 
                  value={companies}
                  onChange={(e) => setCompanies(e.target.value)}
                  placeholder="[e.g., Google, Microsoft, Amazon]" 
                  className="bg-transparent border-b border-green-500/50 text-white focus:outline-none focus:border-green-400 w-full p-2 placeholder:text-gray-700"
                />
              </div>
            )}

            {companies.length > 4 && (
              <div className="space-y-4 animate-in fade-in">
                <p>3. Weekly available hours?</p>
                <input 
                  type="number" 
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="[e.g., 20]" 
                  className="bg-transparent border-b border-green-500/50 text-white focus:outline-none focus:border-green-400 w-full p-2 placeholder:text-gray-700"
                />
              </div>
            )}

            {hours.length > 0 && (
              <div className="pt-8 animate-in fade-in duration-1000 space-y-8">
                 <p className="text-xl font-bold">&gt; Configuration Complete. Mission begins.</p>
                 <Button 
                   onClick={() => router.push('/')}
                   className="bg-green-500 text-black hover:bg-green-400 font-bold uppercase tracking-[0.2em] px-12 py-6 text-lg rounded-none w-full"
                 >
                   Boot OS
                 </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

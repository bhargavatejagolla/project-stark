'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export function Heatmap() {
  const [data, setData] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchLogs = async () => {
      const pastYear = subDays(new Date(), 364).toISOString();
      const { data: logs } = await supabase
        .from('daily_logs')
        .select('log_date, productivity_score')
        .eq('user_id', USER_ID)
        .gte('log_date', pastYear);
      
      const map: Record<string, number> = {};
      logs?.forEach((log) => { 
        map[log.log_date] = log.productivity_score; 
      });
      setData(map);
    };
    fetchLogs();
  }, []);

  // Generate last 364 days perfectly aligned by weeks
  const today = new Date();
  const startDate = subDays(today, 364);
  const startDay = startOfWeek(startDate);
  const endDay = endOfWeek(today);

  const days = eachDayOfInterval({ start: startDay, end: endDay });

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-max flex flex-col gap-1">
        <div className="grid grid-flow-col gap-1 auto-cols-max" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
          {days.map((date, i) => {
            const key = format(date, 'yyyy-MM-dd');
            // Hide dates outside the exact 365 window for clean edges
            if (date < startDate || date > today) {
               return <div key={i} className="w-3 h-3 bg-transparent" />;
            }
            const score = data[key] || 0;
            
            let bg = 'bg-gray-100 dark:bg-gray-800'; // Default Empty
            if (score >= 8) bg = 'bg-green-600';
            else if (score >= 6) bg = 'bg-green-500';
            else if (score >= 4) bg = 'bg-green-400';
            else if (score > 0) bg = 'bg-green-200';
            
            return (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-[2px] ${bg} hover:ring-1 hover:ring-black dark:hover:ring-white transition-all`} 
                title={`${key}: ${score} XP`} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';

import { toggleTaskStatus, addTask } from '@/app/actions/tasks';
import { useState, useTransition } from 'react';
import { CheckCircle2, Circle, Plus, ListTodo } from 'lucide-react'; 

type Task = {
  id: string;
  title: string;
  status: string;
  estimated_minutes: number;
  goals: { title: string } | null;
};

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [isPending, startTransition] = useTransition();
  const [newTask, setNewTask] = useState('');

  const handleToggle = (taskId: string, currentStatus: string) => {
    startTransition(async () => {
      await toggleTaskStatus(taskId, currentStatus);
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const title = newTask;
    setNewTask('');
    startTransition(async () => {
      await addTask(title);
    });
  };

  return (
    <div className="glass-panel p-6 border-indigo-500/20">
      <div className="flex items-center gap-3 mb-6">
        <ListTodo className="h-5 w-5 text-indigo-400" />
        <h3 className="text-sm font-black tracking-widest text-white uppercase">Today's Protocol</h3>
      </div>

      <div className="space-y-2 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {initialTasks.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-4 italic">No protocols active. Add one or ask Jarvis.</p>
        ) : (
          initialTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                task.status === 'done' 
                  ? 'bg-white/5 border-white/5 opacity-50' 
                  : 'bg-indigo-900/10 border-indigo-500/20 hover:border-indigo-500/40'
              }`}
            >
              <button
                onClick={() => handleToggle(task.id, task.status)}
                disabled={isPending}
                className="text-xl shrink-0 focus:outline-none"
              >
                {task.status === 'done' ? (
                  <CheckCircle2 className="text-emerald-500 fill-emerald-500/20 h-5 w-5" />
                ) : (
                  <Circle className="text-gray-400 h-5 w-5 hover:text-indigo-400 transition-colors" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                  {task.title}
                </p>
                {task.goals?.title && (
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate mt-0.5">
                    {task.goals.title}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAdd} className="relative">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Manual protocol entry..."
          disabled={isPending}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-gray-600"
        />
        <button 
          type="submit"
          disabled={isPending || !newTask.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-indigo-400 disabled:opacity-50 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

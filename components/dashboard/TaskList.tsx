'use client';

import { toggleTaskStatus } from '@/app/actions/tasks';
import { useTransition } from 'react';
import { CheckCircle2, Circle } from 'lucide-react'; 

type Task = {
  id: string;
  title: string;
  status: string;
  estimated_minutes: number;
  goals: { title: string } | null;
};

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (taskId: string, currentStatus: string) => {
    startTransition(async () => {
      await toggleTaskStatus(taskId, currentStatus);
    });
  };

  return (
    <div className="space-y-3">
      {initialTasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-sm hover:shadow-md transition-all"
        >
          <button
            onClick={() => handleToggle(task.id, task.status)}
            disabled={isPending}
            className="text-2xl text-primary hover:scale-110 transition-transform"
          >
            {task.status === 'done' ? (
              <CheckCircle2 className="text-green-500 fill-green-500" />
            ) : (
              <Circle className="text-gray-400" />
            )}
          </button>
          <div className="flex-1">
            <p className={`font-medium ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </p>
            <p className="text-xs text-gray-400">
              {task.goals?.title} • {task.estimated_minutes} min
            </p>
          </div>
          {task.status === 'done' && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ Done</span>
          )}
        </div>
      ))}
    </div>
  );
}

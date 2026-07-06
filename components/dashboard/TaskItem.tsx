'use client';

import { useState } from 'react';
import { updateTaskStatus } from '@/app/actions/tasks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Task = {
  id: string;
  title: string;
  estimated_minutes: number;
  goals?: { title: string } | null;
};

export default function TaskItem({ task }: { task: Task }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkDone = async () => {
    setIsUpdating(true);
    try {
      await updateTaskStatus(task.id, 'done');
      toast.success(`Completed: ${task.title}`);
    } catch (error) {
      toast.error('Failed to update task');
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm transition-all hover:border-primary/50">
      <div>
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
            {task.goals?.title || 'Uncategorized'}
          </span>
          <span>•</span>
          <span>{task.estimated_minutes || 30} min</span>
        </p>
      </div>
      <Button 
        onClick={handleMarkDone} 
        disabled={isUpdating}
        variant="outline"
        className="border-green-500/50 hover:bg-green-500/10 hover:text-green-600 text-green-600 font-bold transition-all"
      >
        {isUpdating ? 'Completing...' : 'Done ✓'}
      </Button>
    </div>
  );
}

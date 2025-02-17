
import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface KanbanTaskProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    position: number;
  };
}

const KanbanTask: React.FC<KanbanTaskProps> = ({ task }) => {
  return (
    <Card className="p-3 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}
      {task.due_date && (
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(task.due_date).toLocaleDateString()}
        </div>
      )}
    </Card>
  );
};

export default KanbanTask;

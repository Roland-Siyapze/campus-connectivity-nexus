
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import KanbanTask from "./KanbanTask";

interface KanbanListProps {
  list: {
    id: string;
    title: string;
    position: number;
  };
}

const KanbanList: React.FC<KanbanListProps> = ({ list }) => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", list.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("list_id", list.id)
        .order("position");
      
      if (error) {
        toast.error("Failed to load tasks");
        throw error;
      }
      
      return data;
    },
  });

  return (
    <Card className="flex-shrink-0 w-80 bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">{list.title}</h3>
        <Button variant="ghost" size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {tasks?.map((task) => (
          <KanbanTask key={task.id} task={task} />
        ))}
      </div>
    </Card>
  );
};

export default KanbanList;


import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import KanbanList from "@/components/kanban/KanbanList";

const KanbanBoard = () => {
  const { data: lists, isLoading } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .order("position");
      
      if (error) {
        toast.error("Failed to load lists");
        throw error;
      }
      
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add List
          </Button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          {lists?.map((list) => (
            <KanbanList key={list.id} list={list} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;

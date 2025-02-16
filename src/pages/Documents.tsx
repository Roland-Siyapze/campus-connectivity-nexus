import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FilePlus, File, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Documents = () => {
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [newDocTitle, setNewDocTitle] = React.useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: documents, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create documents",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("documents")
        .insert([
          {
            title: newDocTitle || "Untitled Document",
            owner_id: user.id,
            content: "",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document created successfully",
      });
      
      setCreateDialogOpen(false);
      setNewDocTitle("");
      await refetch();
      navigate(`/documents/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create document",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (id: string) => {
    const { error } = await supabase.from("documents").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Document deleted",
    });
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-campus-50 to-white">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Documents</h1>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FilePlus className="h-4 w-4 mr-2" />
                New Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateDocument} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="Enter document title"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents?.map((doc) => (
            <div
              key={doc.id}
              className="glass-card p-6 rounded-xl flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex items-center gap-2 cursor-pointer flex-1"
                  onClick={() => navigate(`/documents/${doc.id}`)}
                >
                  <File className="h-5 w-5" />
                  <h3 className="text-xl font-semibold">{doc.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteDocument(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Last updated:{" "}
                {new Date(doc.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Documents;

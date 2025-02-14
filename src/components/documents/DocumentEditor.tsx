
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [hasChanges, setHasChanges] = React.useState(false);

  const { data: document } = useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      if (!id) throw new Error("No document ID provided");
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setTitle(data.title);
      setContent(data.content || "");
      setHasChanges(false);
    },
  });

  const updateDocument = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("No document ID provided");
      const { error } = await supabase
        .from("documents")
        .update({ title, content })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document saved successfully",
      });
      setHasChanges(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      });
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasChanges(true);
  };

  const handleSave = () => {
    updateDocument.mutate();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/documents")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Input
                value={title}
                onChange={handleTitleChange}
                className="text-xl font-semibold w-[300px]"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <Textarea
          value={content}
          onChange={handleContentChange}
          className="min-h-[60vh] resize-none"
          placeholder="Start writing..."
        />
      </main>
    </div>
  );
};

export default DocumentEditor;

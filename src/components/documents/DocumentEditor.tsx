
import React, { useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Cursor from "./Cursor";

// Random color generation for cursors
const generateColor = () => {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33F5",
    "#33FFF5", "#F5FF33", "#FF3333", "#33FF33"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [hasChanges, setHasChanges] = React.useState(false);
  const [cursors, setCursors] = React.useState<{ [key: string]: { x: number; y: number; label: string; color: string } }>({});
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const cursorColor = React.useRef(generateColor());
  const [currentUser, setCurrentUser] = React.useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user.email || user.id);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!id || !currentUser) return;

    const channel = supabase.channel('document_cursors')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const newCursors: typeof cursors = {};
        
        Object.keys(state).forEach(clientId => {
          const presences = state[clientId] as any[];
          presences.forEach(presence => {
            if (presence.user !== currentUser) {
              newCursors[presence.user] = {
                x: presence.cursor.x,
                y: presence.cursor.y,
                label: presence.user,
                color: presence.color
              };
            }
          });
        });
        
        setCursors(newCursors);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user: currentUser,
            cursor: { x: 0, y: 0 },
            color: cursorColor.current
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, currentUser]);

  const updateCursorPosition = async (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!currentUser || !id) return;

    const rect = editorRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const channel = supabase.channel('document_cursors');
    await channel.track({
      user: currentUser,
      cursor: { x, y },
      color: cursorColor.current
    });
  };

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

      <main className="container mx-auto px-4 py-8 relative">
        <Textarea
          ref={editorRef}
          value={content}
          onChange={handleContentChange}
          onMouseMove={updateCursorPosition}
          className="min-h-[60vh] resize-none"
          placeholder="Start writing..."
        />
        {Object.entries(cursors).map(([userId, cursor]) => (
          <Cursor
            key={userId}
            x={cursor.x}
            y={cursor.y}
            label={cursor.label}
            color={cursor.color}
          />
        ))}
      </main>
    </div>
  );
};

export default DocumentEditor;

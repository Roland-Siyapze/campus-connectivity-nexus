
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Chat = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-campus-50 to-white">
        <Header />
        <main className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
            <p className="text-gray-600">
              You need to be signed in to access the chat.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-campus-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Chat</h1>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <p className="text-center text-gray-600">
              Chat functionality coming soon!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;

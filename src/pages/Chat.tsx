import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/layout/Header";

interface Message {
  id: number;
  text: string;
  username: string;
  timestamp: string;
}

export default function SimpleChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setNewMessageCount(0);
    }, 100);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
      }
    };

    const currentRef = chatContainerRef.current;
    currentRef?.addEventListener("scroll", handleScroll);
    return () => currentRef?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUserEmail(session.user.email);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, text, username, timestamp")
        .order("timestamp", { ascending: true });
      if (data) {
        setMessages(data);
        scrollToBottom();
      }
    };

    fetchMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        payload => {
          setMessages(current => [...current, payload.new as Message]);
          if (!isAtBottom) {
            setNewMessageCount(prev => prev + 1);
          } else {
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAtBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userEmail) return;

    try {
      await supabase.from("messages").insert([
        {
          text: newMessage,
          username: userEmail,
        },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

    if (!userEmail) {
      return (
        <div className='min-h-screen bg-gradient-to-b from-campus-50 to-white'>
          <Header />
          <main className='container mx-auto px-4 pt-24'>
            <div className='text-center'>
              <h1 className='text-3xl font-bold mb-4'>Please Sign In</h1>
              <p className='text-gray-600'>
                You need to be signed in to view Chat.
              </p>
            </div>
          </main>
        </div>
      );
    }

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <Header />
      <header className='mb-4 flex justify-between items-center mt-24'>
        <div>Chat</div>
      </header>

      <div
        ref={chatContainerRef}
        className='h-[500px]  border rounded p-4 mb-4 overflow-y-auto bg-gray-50 relative'
      >
        {messages.map(message => (
          <div
            key={message.id}
            className={`mb-2 p-3 rounded-lg max-w-[80%] ${
              message.username === userEmail
                ? "ml-auto bg-blue-500 text-white text-right"
                : "bg-gray-200 text-black text-left"
            }`}
          >
            <div className='text-sm font-bold mb-1'>{message.username}</div>
            <div className='break-words'>{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />

    
      </div>

      {userEmail && (
        <form onSubmit={handleSubmit} className='flex gap-2'>
          <input
            type='text'
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder='Type a message...'
            className='flex-1 p-2 border rounded'
          />
          <button
            type='submit'
            disabled={!newMessage.trim()}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}

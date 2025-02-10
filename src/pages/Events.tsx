
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { format } from "date-fns";
import CreateEventDialog from "@/components/events/CreateEventDialog";

const Events = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, profiles(username)")
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-campus-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Campus Events</h1>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {isLoading ? (
          <div>Loading events...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events?.map((event) => (
              <div key={event.id} className="glass-card p-6 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                  </div>
                  <Calendar className="h-5 w-5 text-campus-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Date:</strong>{" "}
                    {format(new Date(event.start_time), "PPP")}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Time:</strong>{" "}
                    {format(new Date(event.start_time), "p")} -{" "}
                    {format(new Date(event.end_time), "p")}
                  </p>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    RSVP
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <CreateEventDialog
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
        />
      </main>
    </div>
  );
};

export default Events;

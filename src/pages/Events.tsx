
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Users, Bell } from "lucide-react";
import Header from "@/components/layout/Header";
import CreateEventDialog from "@/components/events/CreateEventDialog";
import EventCard from "@/components/events/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const Events = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", selectedDate],
    queryFn: async () => {
      const startOfDay = new Date(selectedDate!);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate!);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_rsvps (
            status,
            user_id
          )
        `)
        .gte("start_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString())
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedDate,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Calendar Section */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
              />
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </div>

          {/* Events List Section */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">
              Events for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Today"}
            </h2>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-4">
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/3 mb-4" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))
              ) : events?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No events scheduled for this day
                </div>
              ) : (
                events?.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </div>
          </div>
        </div>

        <CreateEventDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </main>
    </div>
  );
};

export default Events;

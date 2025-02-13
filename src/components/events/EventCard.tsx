
import { format } from "date-fns";
import { MapPin, Users, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    start_time: string;
    end_time: string;
    max_attendees: number | null;
    category: string;
    is_private: boolean;
    event_rsvps: { status: string; user_id: string }[];
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const hasRSVPd = user && event.event_rsvps?.some(
    (rsvp) => rsvp.user_id === user.id
  );

  const handleRSVP = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to RSVP to events",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("event_rsvps").insert({
        event_id: event.id,
        user_id: user.id,
        status: "going",
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've successfully RSVP'd to this event",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to RSVP to the event",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(event.start_time), "h:mm a")}
              </div>
              {event.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.location}
                </div>
              )}
              {event.max_attendees && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {event.event_rsvps?.length || 0}/{event.max_attendees}
                </div>
              )}
            </div>
          </div>
          <Button
            variant={hasRSVPd ? "secondary" : "default"}
            onClick={handleRSVP}
            disabled={hasRSVPd}
          >
            {hasRSVPd ? "Going" : "RSVP"}
          </Button>
        </div>
        <Button
          variant="ghost"
          className="mt-4 w-full"
          onClick={() => setShowDetails(true)}
        >
          View Details
        </Button>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {format(new Date(event.start_time), "MMM d, yyyy h:mm a")} -{" "}
                  {format(new Date(event.end_time), "h:mm a")}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.max_attendees && (
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>
                    {event.event_rsvps?.length || 0}/{event.max_attendees} attending
                  </span>
                </div>
              )}
            </div>
            {event.description && (
              <p className="text-muted-foreground">{event.description}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowDetails(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;

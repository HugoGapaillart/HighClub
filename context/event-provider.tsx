// context/event-provider.tsx
import { ReactNode, createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";

type Event = {
  id: string;
  club_id: string;
  name: string;
  description: string | null;
  event_date: string;
  presale_end_time: string;
  ticket_price: number;
  max_capacity: number;
  sold_tickets: number;
  is_active: boolean | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

const EventContext = createContext<{
  events: Event[] | undefined;
  isLoading: boolean;
  isError: boolean;
}>({
  events: [],
  isLoading: false,
  isError: false,
});

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return (
    <EventContext.Provider value={{ events, isLoading, isError }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};

// services/supabaseServices.ts
import { supabase } from "@/config/supabase";

// Types
export type Club = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo: string | null;
  is_active: boolean;
  created_at: string;
  whatsapp_number: string | null;
};

export type Event = {
  id: string;
  club_id: string;
  name: string;
  description: string;
  event_date: string;
  presale_end_time: string;
  ticket_price: number;
  max_capacity: number;
  sold_tickets: number;
  is_active: boolean;
  image_url: string | null;
  club?: Club;
};

export type ConsumptionTicketType = {
  id: string;
  club_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
  image_url: string | null;
};

// === SERVICES CLUBS ===
export const clubServices = {
  // Récupérer tous les clubs actifs
  getAllClubs: async (): Promise<Club[]> => {
    const { data, error } = await supabase
      .from("club")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return data || [];
  },

  // Récupérer un club par ID
  getClubById: async (clubId: string): Promise<Club> => {
    const { data, error } = await supabase
      .from("club")
      .select("*")
      .eq("id", clubId)
      .single();

    if (error) throw error;
    return data;
  },
};

// === SERVICES ÉVÉNEMENTS ===
export const eventServices = {
  // Récupérer les événements d'un club
  getClubEvents: async (clubId: string): Promise<Event[]> => {
    const { data, error } = await supabase
      .from("event")
      .select(`
        *,
        club:club_id(name, logo)
      `)
      .eq("club_id", clubId)
      .eq("is_active", true)
      .order("event_date", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Récupérer tous les événements actifs
  getAllEvents: async (): Promise<Event[]> => {
    const { data, error } = await supabase
      .from("event")
      .select(`
        *,
        club:club_id(name, logo)
      `)
      .eq("is_active", true)
      .order("event_date", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Récupérer un événement par ID
  getEventById: async (eventId: string): Promise<Event> => {
    const { data, error } = await supabase
      .from("event")
      .select(`
        *,
        club:club_id(*)
      `)
      .eq("id", eventId)
      .single();

    if (error) throw error;
    return data;
  },
};

// === SERVICES CONSOMMATIONS ===
export const consumptionServices = {
  // Récupérer les types de consommation d'un club
  getClubConsumptionTypes: async (clubId: string): Promise<ConsumptionTicketType[]> => {
    const { data, error } = await supabase
      .from("consumption_ticket_type")
      .select("*")
      .eq("club_id", clubId)
      .eq("is_active", true)
      .order("category", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};

// === SERVICES UTILISATEUR ===
export const userServices = {
  // Récupérer les tickets d'un utilisateur pour un club
  getUserTicketsForClub: async (userId: string, clubId: string) => {
    const { data, error } = await supabase
      .from("ticket")
      .select(`
        *,
        event!inner(
          name,
          event_date,
          club_id
        )
      `)
      .eq("user_id", userId)
      .eq("event.club_id", clubId)
      .order("purchase_date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Récupérer les commandes d'un utilisateur pour un club
  getUserOrdersForClub: async (userId: string, clubId: string) => {
    const { data, error } = await supabase
      .from("consumption_order")
      .select(`
        *,
        event!inner(
          name,
          event_date,
          club_id
        )
      `)
      .eq("user_id", userId)
      .eq("event.club_id", clubId)
      .order("order_date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Récupérer tous les tickets d'un utilisateur
  getAllUserTickets: async (userId: string) => {
    const { data, error } = await supabase
      .from("ticket")
      .select(`
        *,
        event(
          name,
          event_date,
          club:club_id(name, logo)
        )
      `)
      .eq("user_id", userId)
      .order("purchase_date", { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

// === SERVICES ADMIN ===
export const adminServices = {
  // Récupérer les statistiques d'un club
  getClubStats: async (clubId: string) => {
    const [eventsResponse, ticketsResponse] = await Promise.all([
      supabase
        .from("event")
        .select("id, sold_tickets, max_capacity")
        .eq("club_id", clubId)
        .eq("is_active", true),
      
      supabase
        .from("ticket")
        .select(`
          id,
          price,
          event!inner(club_id)
        `)
        .eq("event.club_id", clubId)
    ]);

    if (eventsResponse.error) throw eventsResponse.error;
    if (ticketsResponse.error) throw ticketsResponse.error;

    const events = eventsResponse.data || [];
    const tickets = ticketsResponse.data || [];

    return {
      totalEvents: events.length,
      totalTicketsSold: events.reduce((sum, event) => sum + event.sold_tickets, 0),
      totalRevenue: tickets.reduce((sum, ticket) => sum + ticket.price, 0),
      averageCapacity: events.length > 0 
        ? events.reduce((sum, event) => sum + (event.sold_tickets / event.max_capacity), 0) / events.length
        : 0,
    };
  },
};
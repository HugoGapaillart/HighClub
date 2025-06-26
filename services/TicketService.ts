import { supabase } from "@/config/supabase";

export interface TicketWithEvent {
  id: string;
  event: string;
  date: string;
  time: string;
  image: string;
  status: "upcoming" | "active" | "used";
  totalSpent: number;
  consumptions: number;
  maxConsumptions: number;
  isUsed: boolean;
  venue: string;
  hasTicket: boolean;
}

export const getUserTickets = async (): Promise<TicketWithEvent[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw userError || new Error("User not found.");
  }

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select(
      `
      id,
      is_used,
      events (
        name,
        event_date,
        image_url,
        venue,
        status
      ),
      consumption_orders (
        total_amount,
        consumption_tickets (
          quantity
        )
      )
    `
    )
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching tickets:", error);
    throw new Error(error.message);
  }

  // Mapper les données brutes de Supabase à la structure attendue par l'UI
  return tickets.map((ticket: any) => {
    const event = ticket.events;
    const order = ticket.consumption_orders[0] || {};
    const consumptions =
      order.consumption_tickets?.reduce(
        (acc: number, ct: any) => acc + ct.quantity,
        0
      ) || 0;
      
    const eventDate = new Date(event.event_date);

    return {
      id: ticket.id,
      event: event.name,
      date: eventDate.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      time: eventDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      image: event.image_url,
      status: event.status,
      totalSpent: order.total_amount || 0,
      consumptions: consumptions,
      maxConsumptions: 8, // This should probably come from the event or ticket type
      isUsed: ticket.is_used,
      venue: event.venue,
      hasTicket: true,
    };
  });
};

export class TicketService {
  static async getAllUserTickets(userId: string) {
    const { data, error } = await supabase
      .from("tickets")
      .select("*, events(*)")
      .eq("user_id", userId);
    if (error) throw error;
    return data;
  }

  static async getUserTicketsForClub(userId: string, clubId: string) {
    const { data, error } = await supabase
      .from("tickets")
      .select("*, events!inner(*)")
      .eq("user_id", userId)
      .eq("events.club_id", clubId);
    if (error) throw error;
    return data;
  }

  static async getUserOrdersForClub(userId: string, clubId: string) {
    const { data, error } = await supabase
      .from("consumption_orders")
      .select("*, events!inner(*)")
      .eq("user_id", userId)
      .eq("events.club_id", clubId);
    if (error) throw error;
    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async validateEntry(id: string) {
    const { data, error } = await supabase
      .from("tickets")
      .update({ isUsed: true, usedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async refund(id: string) {
    // À adapter selon la logique métier (ex: changer le statut)
    const { data, error } = await supabase
      .from("tickets")
      .update({ status: "refunded" })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
} 
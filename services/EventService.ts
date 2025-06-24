import { supabase } from "@/config/supabase";

export class EventService {
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async createPresaleTicket(ticketData: any) {
    const { data, error } = await supabase
      .from("tickets")
      .insert([ticketData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async closePresale(eventId: string) {
    // Met à jour l'événement pour indiquer que la prévente est terminée
    const { data, error } = await supabase
      .from("events")
      .update({ isActive: false })
      .eq("id", eventId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async generateQRCode(eventId: string) {
    // À implémenter : généralement côté client ou via une fonction RPC
    // Ici, on retourne juste un placeholder
    return `qrcode-for-event-${eventId}`;
  }
} 
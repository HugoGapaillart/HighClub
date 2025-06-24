import { supabase } from "@/config/supabase";

export class TicketService {
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
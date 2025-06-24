import { supabase } from "@/config/supabase";

export class ConsumptionTicketService {
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("consumption_tickets")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async consume(id: string) {
    const { data, error } = await supabase
      .from("consumption_tickets")
      .update({ isConsumed: true, consumedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async validate(id: string, validationCode: string) {
    // À adapter selon la logique métier
    const { data, error } = await supabase
      .from("consumption_tickets")
      .update({ validationCode })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
} 
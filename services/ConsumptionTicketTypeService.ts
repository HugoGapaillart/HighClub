import { supabase } from "@/config/supabase";

export class ConsumptionTicketTypeService {
  static async getClubConsumptionTypes(clubId: string) {
    const { data, error } = await supabase
      .from("consumption_ticket_types")
      .select("*")
      .eq("club_id", clubId);
    if (error) throw error;
    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("consumption_ticket_types")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async activate(id: string) {
    const { data, error } = await supabase
      .from("consumption_ticket_types")
      .update({ isActive: true })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async deactivate(id: string) {
    const { data, error } = await supabase
      .from("consumption_ticket_types")
      .update({ isActive: false })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
} 
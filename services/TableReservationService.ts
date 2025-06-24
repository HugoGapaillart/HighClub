import { supabase } from "@/config/supabase";

export class TableReservationService {
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("table_reservations")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async confirm(id: string) {
    const { data, error } = await supabase
      .from("table_reservations")
      .update({ status: "confirmed" })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async cancel(id: string) {
    const { data, error } = await supabase
      .from("table_reservations")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from("table_reservations")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
} 
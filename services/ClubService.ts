import { supabase } from "@/config/supabase";

export class ClubService {
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async createEvent(eventData: any) {
    const { data, error } = await supabase
      .from("events")
      .insert([eventData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async manageBeverages(clubId: string, updates: any) {
    // À adapter selon la structure de la table des boissons (ex: "beverages")
    const { data, error } = await supabase
      .from("beverages")
      .update(updates)
      .eq("clubId", clubId);
    if (error) throw error;
    return data;
  }

  static async viewAnalytics(clubId: string) {
    // À adapter : peut nécessiter une vue ou une fonction RPC côté Supabase
    const { data, error } = await supabase
      .from("club_analytics")
      .select("*")
      .eq("clubId", clubId);
    if (error) throw error;
    return data;
  }
} 
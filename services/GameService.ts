import { supabase } from "@/config/supabase";

export class GameService {
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async start(id: string) {
    const { data, error } = await supabase
      .from("games")
      .update({ isActive: true, startDate: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async end(id: string) {
    const { data, error } = await supabase
      .from("games")
      .update({ isActive: false, endDate: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async selectWinner(id: string, winnerId: string) {
    // À adapter selon la logique métier (ex: stocker le gagnant dans une colonne ou une table liée)
    const { data, error } = await supabase
      .from("games")
      .update({ winnerId })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
} 
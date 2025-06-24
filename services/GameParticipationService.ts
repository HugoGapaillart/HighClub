import { supabase } from "@/config/supabase";

export class GameParticipationService {
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("game_participations")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async participate(participationData: any) {
    const { data, error } = await supabase
      .from("game_participations")
      .insert([participationData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async claimPrize(id: string, prize: string) {
    const { data, error } = await supabase
      .from("game_participations")
      .update({ isWinner: true, prizeWon: prize })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
} 
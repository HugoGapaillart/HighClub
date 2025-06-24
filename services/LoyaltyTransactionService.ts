import { supabase } from "@/config/supabase";

export class LoyaltyTransactionService {
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("loyalty_transactions")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async calculatePoints(id: string) {
    // À implémenter : peut nécessiter une fonction RPC ou une vue côté Supabase
    const transaction = await this.getById(id);
    return (transaction.pointsEarned || 0) - (transaction.pointsSpent || 0);
  }

  static async cashout(id: string) {
    // À adapter selon la logique métier (ex: changer le statut ou créer une opération de cashout)
    const { data, error } = await supabase
      .from("loyalty_transactions")
      .update({ type: "cashout" })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
} 
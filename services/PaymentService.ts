import { supabase } from "@/config/supabase";

export class PaymentService {
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async processPayment(id: string, updates: any) {
    // À adapter selon la logique métier (ex: mise à jour du statut)
    const { data, error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async refund(id: string, refundId: string) {
    const { data, error } = await supabase
      .from("payments")
      .update({ status: "refunded", refundId })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async getStatus(id: string) {
    const payment = await this.getById(id);
    return payment.status;
  }
} 
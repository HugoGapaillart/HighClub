import { supabase } from "@/config/supabase";

export class ConsumptionOrderService {
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("consumption_orders")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async calculateTotal(id: string) {
    // À implémenter : peut nécessiter une fonction RPC ou une vue côté Supabase
    // Ici, on retourne juste la valeur stockée
    const order = await this.getById(id);
    return order.totalAmount;
  }

  static async generateQR(id: string) {
    // À implémenter : généralement côté client ou via une fonction RPC
    return `qrcode-for-order-${id}`;
  }

  static async cancel(id: string) {
    const { data, error } = await supabase
      .from("consumption_orders")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
} 
import { supabase } from "@/config/supabase";

export class NotificationService {
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async send(notificationData: any) {
    const { data, error } = await supabase
      .from("notifications")
      .insert([notificationData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async markAsRead(id: string) {
    const { data, error } = await supabase
      .from("notifications")
      .update({ isRead: true })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
} 
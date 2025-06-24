import { supabase } from "@/config/supabase";

export class AdminService {
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async manageEvents(adminId: string, eventUpdates: any) {
    // À adapter selon la logique métier (ex: mise à jour d'événements liés à l'admin)
    const { data, error } = await supabase
      .from("events")
      .update(eventUpdates)
      .eq("adminId", adminId);
    if (error) throw error;
    return data;
  }

  static async scanQRCodes(adminId: string, scanData: any) {
    // À adapter : log d'un scan QR par un admin
    const { data, error } = await supabase
      .from("qr_scans")
      .insert([{ ...scanData, scannerId: adminId }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async viewReports(adminId: string) {
    // À adapter : peut nécessiter une vue ou une fonction RPC côté Supabase
    const { data, error } = await supabase
      .from("admin_reports")
      .select("*")
      .eq("adminId", adminId);
    if (error) throw error;
    return data;
  }
}

import { supabase } from "@/config/supabase";

export class QRScanService {
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("qr_scans")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async validate(id: string, isValid: boolean) {
    const { data, error } = await supabase
      .from("qr_scans")
      .update({ isValid })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async log(scanData: any) {
    const { data, error } = await supabase
      .from("qr_scans")
      .insert([scanData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
} 
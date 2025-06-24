import { supabase } from "@/config/supabase";

export class ProfileService {
  // Créer un utilisateur (attention : généralement, la création se fait via l'auth Supabase)
  static async create(userData: any) {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Récupérer un utilisateur par son id
  static async getById(id: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  // Mettre à jour un utilisateur
  static async updateProfile(id: string, updates: any) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Récupérer un utilisateur par email
  static async getByEmail(email: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;
    return data;
  }

  // Incrémenter les points de fidélité
  static async addLoyaltyPoints(id: string, points: number) {
    // Nécessite une fonction RPC côté Supabase nommée 'add_loyalty_points'
    const { data, error } = await supabase.rpc("add_loyalty_points", { user_id: id, points });
    if (error) throw error;
    return data;
  }

  // Vérifier un utilisateur
  static async verifyIdentity(id: string) {
    return this.updateProfile(id, { isVerified: true });
  }
}
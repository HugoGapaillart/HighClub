import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "@supabase/supabase-js";
import { supabase } from "@/config/supabase";
import { useAuth } from "./supabase-provider";

type UserProfile = {
  id: string;
  lastname: string | null;
  firstname: string | null;
  email: string | null;
  phone: string | null;
  identity_card_url: string | null;
  is_verified: boolean | null;
  loyalty_points: number | null;
  created_at: string | null;
  updated_at: string | null;
};

type UserState = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

export const UserContext = createContext<UserState>({
  user: null,
  profile: null,
  loading: true,
  updateProfile: async () => {},
  refreshProfile: async () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer le profil utilisateur
  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour le profil
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profile")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        throw error;
      }

      setProfile(data);
      console.log("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    }
  };

  // Fonction pour rafraîchir le profil
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Effet pour gérer les changements de session
  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      fetchProfile(session.user.id);
    } else {
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  }, [session]);

  // Optionnel : Écouter les changements en temps réel sur la table profile
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("profile_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profile",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Changement détecté dans le profil:", payload);
          if (payload.eventType === "UPDATE") {
            setProfile(payload.new as UserProfile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

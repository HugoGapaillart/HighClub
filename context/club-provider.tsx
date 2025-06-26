import React from "react";
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  import { supabase } from "@/config/supabase";
  import { useUser } from "@/context/user-provider";
  
  type Club = {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    logo: string | null;
    is_active: boolean;
    created_at: string;
    whatsapp_number: string | null;
  };
  
  type AdminClubState = {
    club: Club | null;
    loading: boolean;
    refreshClub: () => Promise<void>;
  };
  
  export const AdminClubContext = createContext<AdminClubState>({
    club: null,
    loading: true,
    refreshClub: async () => {},
  });
  
  export const useAdminClub = () => useContext(AdminClubContext);
  
  export function AdminClubProvider({ children }: PropsWithChildren) {
    const { isAdmin, adminProfile } = useUser();
    const [club, setClub] = useState<Club | null>(null);
    const [loading, setLoading] = useState(true);
  
    // Fonction pour récupérer le club de l'admin
    const fetchClub = async () => {
      if (!isAdmin || !adminProfile?.club_id) {
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("club")
          .select("*")
          .eq("id", adminProfile.club_id)
          .single();
  
        if (error) {
          console.error("Erreur lors de la récupération du club admin:", error);
          return;
        }
  
        setClub(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du club admin:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // Fonction pour rafraîchir le club
    const refreshClub = async () => {
      await fetchClub();
    };
  
    // Charger le club quand l'admin change
    useEffect(() => {
      if (isAdmin && adminProfile) {
        fetchClub();
      } else {
        setClub(null);
        setLoading(false);
      }
    }, [isAdmin, adminProfile]);
  
    // Realtime pour les mises à jour du club
    useEffect(() => {
      if (!isAdmin || !adminProfile?.club_id) return;
  
      const channel = supabase
        .channel(`admin_club_${adminProfile.club_id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "club",
            filter: `id=eq.${adminProfile.club_id}`,
          },
          (payload) => {
            console.log("Changement détecté dans le club admin:", payload);
            refreshClub();
          }
        )
        .subscribe();
  
      return () => {
        supabase.removeChannel(channel);
      };
    }, [isAdmin, adminProfile]);
  
    // Ne rendre le provider que pour les admins
    if (!isAdmin) {
      return <>{children}</>;
    }
  
    return (
      <AdminClubContext.Provider
        value={{
          club,
          loading,
          refreshClub,
        }}
      >
        {children}
      </AdminClubContext.Provider>
    );
  }
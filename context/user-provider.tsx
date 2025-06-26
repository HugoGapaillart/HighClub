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
  
  type AdminProfile = {
    id: string;
    club_id: string;
    email: string;
    role: string;
    first_name: string | null;
    last_name: string | null;
    is_active: boolean | null;
    created_at: string | null;
    updated_at: string | null;
    // Relation avec le club
    club?: {
      id: string;
      name: string;
      // autres champs du club
    };
  };
  
  type UserType = "user" | "admin";
  
  type UserState = {
    user: User | null;
    profile: UserProfile | null;
    adminProfile: AdminProfile | null;
    userType: UserType | null;
    loading: boolean;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    updateAdminProfile: (updates: Partial<AdminProfile>) => Promise<void>;
    refreshProfile: () => Promise<void>;
    getDisplayName: () => string;
    isAdmin: boolean;
    isUser: boolean;
  };
  
  export const UserContext = createContext<UserState>({
    user: null,
    profile: null,
    adminProfile: null,
    userType: null,
    loading: true,
    updateProfile: async () => {},
    updateAdminProfile: async () => {},
    refreshProfile: async () => {},
    getDisplayName: () => "",
    isAdmin: false,
    isUser: false,
  });
  
  export const useUser = () => useContext(UserContext);
  
  export function UserProvider({ children }: PropsWithChildren) {
    const { session } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
    const [userType, setUserType] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
  
    // Fonction pour récupérer le profil utilisateur
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("profile")
          .select("*")
          .eq("id", userId)
          .single();
  
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error("Erreur lors de la récupération du profil utilisateur:", error);
          return null;
        }
  
        return data;
      } catch (error) {
        console.error("Erreur lors de la récupération du profil utilisateur:", error);
        return null;
      }
    };
  
    // Fonction pour récupérer le profil admin
    const fetchAdminProfile = async (email: string) => {
      try {
        const { data, error } = await supabase
          .from("admin")
          .select(`*`)
          .eq("email", email)
          .eq("is_active", true)
          .single();
  
        if (error && error.code !== 'PGRST116') {
          console.error("Erreur lors de la récupération du profil admin:", error);
          return null;
        }
        console.log("[UserProvider] Profil admin récupéré:", data);
        console.log("[UserProvider] Email : " + email);
        console.log("[UserProvider] Error : " + JSON.stringify(error));
        return data;
      } catch (error) {
        console.error("Erreur lors de la récupération du profil admin:", error);
        return null;
      }
    };
  
    // Fonction principale pour déterminer le type d'utilisateur et charger les données
    const loadUserData = async (authUser: User) => {
      try {
        setLoading(true);
        
        // D'abord, vérifier si c'est un admin
        const adminData = await fetchAdminProfile(authUser.email!);
        console.log("[UserProvider] Chargement des données utilisateur:" + adminData);
        if (adminData) {
          // C'est un admin
          setAdminProfile(adminData);
          setProfile(null);
          setUserType("admin");
        } else {
          // Vérifier si c'est un utilisateur normal
          const userData = await fetchUserProfile(authUser.id);
          
          if (userData) {
            setProfile(userData);
            setAdminProfile(null);
            setUserType("user");
          } else {
            // Aucun profil trouvé
            setProfile(null);
            setAdminProfile(null);
            setUserType(null);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // Fonction pour mettre à jour le profil utilisateur
    const updateProfile = async (updates: Partial<UserProfile>) => {
      if (!user || userType !== "user") return;
  
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
        console.log("Profil utilisateur mis à jour avec succès");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        throw error;
      }
    };
  
    // Fonction pour mettre à jour le profil admin
    const updateAdminProfile = async (updates: Partial<AdminProfile>) => {
      if (!user || userType !== "admin" || !adminProfile) return;
  
      try {
        const { data, error } = await supabase
          .from("admin")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", adminProfile.id)
          .select(`
            *,
            club:club_id (
              id,
              name
            )
          `)
          .single();
  
        if (error) {
          console.error("Erreur lors de la mise à jour du profil admin:", error);
          throw error;
        }
  
        setAdminProfile(data);
        console.log("Profil admin mis à jour avec succès");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil admin:", error);
        throw error;
      }
    };
  
    // Fonction pour rafraîchir le profil
    const refreshProfile = async () => {
      if (user) {
        await loadUserData(user);
      }
    };
  
    // Fonction pour obtenir le nom d'affichage
    const getDisplayName = (): string => {
      if (userType === "admin" && adminProfile) {
        const { first_name, last_name } = adminProfile;
        if (first_name && last_name) return `${first_name} ${last_name}`;
        if (first_name) return first_name;
        if (last_name) return last_name;
        return "Administrateur";
      }
      
      if (userType === "user" && profile) {
        const { firstname, lastname } = profile;
        if (firstname && lastname) return `${firstname} ${lastname}`;
        if (firstname) return firstname;
        if (lastname) return lastname;
        return "Utilisateur";
      }
      
      return "Anonyme";
    };
  
    // Effet pour gérer les changements de session
    useEffect(() => {
      if (session?.user) {
        setUser(session.user);
        loadUserData(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setAdminProfile(null);
        setUserType(null);
        setLoading(false);
      }
    }, [session]);
  
    // Realtime pour les profils utilisateurs
    useEffect(() => {
      if (!user || userType !== "user") return;
  
      const channel = supabase
        .channel(`profile_changes_${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profile",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Changement détecté dans le profil utilisateur:", payload);
            if (payload.eventType === "UPDATE") {
              setProfile(payload.new as UserProfile);
            }
          }
        )
        .subscribe();
  
      return () => {
        supabase.removeChannel(channel);
      };
    }, [user, userType]);
  
    // Realtime pour les profils admin
    useEffect(() => {
      if (!user || userType !== "admin" || !adminProfile) return;
  
      const channel = supabase
        .channel(`admin_changes_${adminProfile.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "admin",
            filter: `id=eq.${adminProfile.id}`,
          },
          (payload) => {
            console.log("Changement détecté dans le profil admin:", payload);
            if (payload.eventType === "UPDATE") {
              // Recharger avec les relations
              refreshProfile();
            }
          }
        )
        .subscribe();
  
      return () => {
        supabase.removeChannel(channel);
      };
    }, [user, userType, adminProfile]);
  
    const isAdmin = userType === "admin";
    const isUser = userType === "user";
  
    return (
      <UserContext.Provider
        value={{
          user,
          profile,
          adminProfile,
          userType,
          loading,
          updateProfile,
          updateAdminProfile,
          refreshProfile,
          getDisplayName,
          isAdmin,
          isUser,
        }}
      >
        {children}
      </UserContext.Provider>
    );
  }
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useClubs } from "@/hooks/useQueries";

// Types
type Club = {
  id: string;
  name: string;
  address: string;
  logo: string | null;
};

type ClubSelectionContextType = {
  allClubs: Club[];
  selectedClub: Club | null;
  selectedClubId: string | null;
  selectClub: (clubId: string) => void;
  loading: boolean;
  error: any;
  refetch: () => void;
};

// Création du contexte
const ClubSelectionContext = createContext<ClubSelectionContextType | undefined>(undefined);

export const ClubSelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: allClubs = [], isLoading, error, refetch } = useClubs();
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

  // Charger la sélection sauvegardée au démarrage
  useEffect(() => {
    const loadSavedClub = async () => {
      if (allClubs.length === 0) return;
      try {
        const savedClubId = await AsyncStorage.getItem("selectedClubId");
        const clubExists = savedClubId && allClubs.find(c => c.id === savedClubId);
        if (clubExists) {
          setSelectedClubId(savedClubId);
        } else {
          const firstClubId = allClubs[0]?.id;
          if (firstClubId) {
            setSelectedClubId(firstClubId);
            await AsyncStorage.setItem("selectedClubId", firstClubId);
          }
        }
      } catch (error) {
        if (allClubs[0]) setSelectedClubId(allClubs[0].id);
      }
    };
    loadSavedClub();
  }, [allClubs]);

  // Sélectionner un club
  const selectClub = async (clubId: string) => {
    setSelectedClubId(clubId);
    try {
      await AsyncStorage.setItem("selectedClubId", clubId);
    } catch (error) {
      // Optionnel: gestion d'erreur
    }
  };

  const selectedClub = allClubs.find(club => club.id === selectedClubId) || null;

  return (
    <ClubSelectionContext.Provider
      value={{
        allClubs,
        selectedClub,
        selectedClubId,
        selectClub,
        loading: isLoading,
        error,
        refetch,
      }}
    >
      {children}
    </ClubSelectionContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useClubSelection = () => {
  const context = useContext(ClubSelectionContext);
  if (!context) {
    throw new Error("useClubSelection must be used within a ClubSelectionProvider");
  }
  return context;
};
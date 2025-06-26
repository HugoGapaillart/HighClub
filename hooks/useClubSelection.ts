import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useClubs } from "@/hooks/useQueries";

export const useClubSelection = () => {
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  
  // Utiliser React Query pour récupérer les clubs
  const { data: allClubs = [], isLoading, error, refetch } = useClubs();

  // Charger la sélection sauvegardée au démarrage
  useEffect(() => {
    const loadSavedClub = async () => {
      if (allClubs.length === 0) return;

      try {
        const savedClubId = await AsyncStorage.getItem("selectedClubId");
        
        // Vérifier que le club sauvegardé existe toujours
        const clubExists = savedClubId && allClubs.find(c => c.id === savedClubId);
        
        if (clubExists) {
          setSelectedClubId(savedClubId);
        } else {
          // Sélectionner le premier club par défaut
          const firstClubId = allClubs[0]?.id;
          if (firstClubId) {
            setSelectedClubId(firstClubId);
            await AsyncStorage.setItem("selectedClubId", firstClubId);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du club sauvegardé:", error);
        // Fallback sur le premier club
        if (allClubs[0]) {
          setSelectedClubId(allClubs[0].id);
        }
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
      console.error("Erreur lors de la sauvegarde du club:", error);
    }
  };

  // Obtenir le club sélectionné
  const selectedClub = allClubs.find(club => club.id === selectedClubId) || null;

  return {
    allClubs,
    selectedClub,
    selectedClubId,
    selectClub,
    loading: isLoading,
    error,
    refetch,
  };
};
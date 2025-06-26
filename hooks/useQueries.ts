import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClubService as clubServices } from "@/services/ClubService";
import { EventService as eventServices } from "@/services/EventService";
import { ConsumptionTicketTypeService as consumptionServices } from "@/services/ConsumptionTicketTypeService";
import { TicketService as userServices } from "@/services/TicketService";
import { AdminService as adminServices } from "@/services/AdminService";
import React from "react";
import { supabase } from "@/config/supabase";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";


// === QUERY KEYS ===
export const queryKeys = {
  // Clubs
  clubs: ["clubs"] as const,
  club: (id: string) => ["clubs", id] as const,
  
  // Events
  events: ["events"] as const,
  clubEvents: (clubId: string) => ["events", "club", clubId] as const,
  event: (id: string) => ["events", id] as const,
  
  // Consumptions
  consumptions: ["consumptions"] as const,
  clubConsumptions: (clubId: string) => ["consumptions", "club", clubId] as const,
  
  // User data
  userTickets: (userId: string) => ["user", userId, "tickets"] as const,
  userClubTickets: (userId: string, clubId: string) => 
    ["user", userId, "tickets", "club", clubId] as const,
  userOrders: (userId: string) => ["user", userId, "orders"] as const,
  userClubOrders: (userId: string, clubId: string) => 
    ["user", userId, "orders", "club", clubId] as const,
  
  // Admin data
  adminStats: (clubId: string) => ["admin", "stats", clubId] as const,
};

// === HOOKS CLUBS ===
export const useClubs = () => {
  return useQuery({
    queryKey: queryKeys.clubs,
    queryFn: clubServices.getAllClubs,
    staleTime: 10 * 60 * 1000, // 10 minutes - les clubs changent rarement
  });
};

export const useClub = (clubId: string | null) => {
  return useQuery({
    queryKey: queryKeys.club(clubId!),
    queryFn: () => clubServices.getClubById(clubId!),
    enabled: !!clubId,
    staleTime: 10 * 60 * 1000,
  });
};

// === HOOKS ÉVÉNEMENTS ===
export const useClubEvents = (clubId: string | null) => {
  return useQuery({
    queryKey: queryKeys.clubEvents(clubId!),
    queryFn: () => eventServices.getClubEvents(clubId!),
    enabled: !!clubId,
    staleTime: 2 * 60 * 1000, // 2 minutes - les événements changent plus souvent
  });
};

export const useAllEvents = () => {
  return useQuery({
    queryKey: queryKeys.events,
    queryFn: eventServices.getAllEvents,
    staleTime: 2 * 60 * 1000,
  });
};

export const useEvent = (eventId: string | null) => {
  return useQuery({
    queryKey: queryKeys.event(eventId!),
    queryFn: () => eventServices.getEventById(eventId!),
    enabled: !!eventId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// === HOOKS CONSOMMATIONS ===
export const useClubConsumptions = (clubId: string | null) => {
  return useQuery({
    queryKey: queryKeys.clubConsumptions(clubId!),
    queryFn: () => consumptionServices.getClubConsumptionTypes(clubId!),
    enabled: !!clubId,
    staleTime: 5 * 60 * 1000,
  });
};

// === HOOKS UTILISATEUR ===
export const useUserTickets = (userId: string | null) => {
  return useQuery({
    queryKey: queryKeys.userTickets(userId!),
    queryFn: () => userServices.getAllUserTickets(userId!),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useUserClubTickets = (userId: string | null, clubId: string | null) => {
  return useQuery({
    queryKey: queryKeys.userClubTickets(userId!, clubId!),
    queryFn: () => userServices.getUserTicketsForClub(userId!, clubId!),
    enabled: !!userId && !!clubId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useUserClubOrders = (userId: string | null, clubId: string | null) => {
  return useQuery({
    queryKey: queryKeys.userClubOrders(userId!, clubId!),
    queryFn: () => userServices.getUserOrdersForClub(userId!, clubId!),
    enabled: !!userId && !!clubId,
    staleTime: 1 * 60 * 1000,
  });
};

// === HOOKS ADMIN ===
export const useAdminStats = (clubId: string | null) => {
  return useQuery({
    queryKey: queryKeys.adminStats(clubId!),
    queryFn: () => adminServices.getClubStats(clubId!),
    enabled: !!clubId,
    staleTime: 30 * 1000, // 30 secondes - stats en temps quasi-réel
    refetchInterval: 60 * 1000, // Refetch toutes les minutes
  });
};

// === MUTATIONS ===
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    // Invalider toutes les données d'un club
    invalidateClubData: (clubId: string) => {
      queryClient.invalidateQueries({ queryKey: ["events", "club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["consumptions", "club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats", clubId] });
    },

    // Invalider les données utilisateur
    invalidateUserData: (userId: string) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },

    // Invalider tout le cache d'un type
    invalidateEvents: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },

    invalidateClubs: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  };
};

// === HOOK POUR LES DONNÉES EN TEMPS RÉEL ===
export const useRealtimeSubscription = (
  table: string,
  clubId: string | null,
  onUpdate: () => void
) => {
  const { invalidateClubData, invalidateEvents } = useInvalidateQueries();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!clubId) return;

    const channel = supabase
      .channel(`${table}_changes_${clubId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
          filter: `club_id=eq.${clubId}`,
        },
        (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
          console.log(`Changement détecté dans ${table}:`, payload);

          // Invalider les caches concernés
          if (table === "event") {
            invalidateEvents();
            invalidateClubData(clubId);
          } else if (table === "consumption_ticket_type") {
            queryClient.invalidateQueries({
              queryKey: ["consumptions", "club", clubId],
            });
          }

          // Callback personnalisé
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clubId, table, onUpdate, invalidateClubData, invalidateEvents, queryClient]);
};
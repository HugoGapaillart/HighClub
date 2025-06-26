import React from "react";
import { Tabs } from "expo-router";
import { House, Calendar, Tickets, User } from "lucide-react-native";
import { ClubSelectionProvider } from "@/context/club-selection-provider";

export default function TabsLayout() {
  return (
    <ClubSelectionProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: "#100f1b",
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: "#9400FF",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Accueil",
            tabBarIcon: ({ color }) => <House size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: "Évènements",
            tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: "Mes tickets",
            tabBarIcon: ({ color }) => <Tickets size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
    </ClubSelectionProvider>
  );
}

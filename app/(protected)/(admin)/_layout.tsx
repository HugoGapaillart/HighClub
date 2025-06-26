import React from "react";
import { Tabs } from "expo-router";
import { House, Calendar, Tickets, User } from "lucide-react-native";
import { AdminClubProvider } from "@/context/club-provider";

export default function AdminLayout() {
  return (
    <AdminClubProvider>
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
          name="events"
          options={{
            title: "Évènements",
            tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="qr-code"
          options={{
            title: "Scanner",
            tabBarIcon: ({ color }) => <Tickets size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: "Utilisateurs",
            tabBarIcon: ({ color }) => <House size={24} color={color} />,
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
    </AdminClubProvider>
  );
}

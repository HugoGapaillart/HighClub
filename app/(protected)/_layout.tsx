import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/context/supabase-provider";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function ProtectedLayout() {
  const { initialized, session } = useAuth();

  if (!initialized) {
    return null;
  }

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" /> {/* Page de redirection */}
      <Stack.Screen name="(tabs)" /> {/* Vos tabs utilisateur */}
      <Stack.Screen name="(admin)" /> {/* Vos routes admin */}
      <Stack.Screen name="event/[id]" options={{ presentation: "modal" }} />
    </Stack>
  );
}

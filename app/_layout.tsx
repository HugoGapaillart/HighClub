import "../global.css";

import { Stack } from "expo-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/context/supabase-provider";
import { UserProvider } from "@/context/user-provider";
import { EventProvider } from "@/context/event-provider";
import { useColorScheme } from "@/lib/useColorScheme";
import { colors } from "@/constants/colors";

// Configuration du QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function AppLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <EventProvider>
            <Stack
              screenOptions={{ headerShown: false, gestureEnabled: false }}
            >
              <Stack.Screen name="(protected)" />
              <Stack.Screen name="welcome" />
              <Stack.Screen
                name="sign-up"
                options={{
                  presentation: "modal",
                  headerShown: true,
                  headerTitle: "Sign Up",
                  headerStyle: {
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark.background
                        : colors.light.background,
                  },
                  headerTintColor:
                    colorScheme === "dark"
                      ? colors.dark.foreground
                      : colors.light.foreground,
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="sign-in"
                options={{
                  presentation: "modal",
                  headerShown: true,
                  headerTitle: "Sign In",
                  headerStyle: {
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark.background
                        : colors.light.background,
                  },
                  headerTintColor:
                    colorScheme === "dark"
                      ? colors.dark.foreground
                      : colors.light.foreground,
                  gestureEnabled: true,
                }}
              />
            </Stack>
          </EventProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

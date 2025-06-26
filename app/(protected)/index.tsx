import { Redirect } from "expo-router";
import { View, ActivityIndicator, Text } from "react-native";
import { useUser } from "@/context/user-provider";

export default function ProtectedIndex() {
  const { isAdmin, isUser, loading } = useUser();

  // Pendant le chargement
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }

  // Redirection selon le type d'utilisateur
  if (isAdmin) {
    return <Redirect href="/(protected)/(admin)/events" />;
  } else if (isUser) {
    return <Redirect href="/(protected)/(tabs)" />;
  } else {
    return <Redirect href="/welcome" />;
  }
}

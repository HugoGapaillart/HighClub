import { Redirect } from "expo-router";
import { View, ActivityIndicator, Text } from "react-native";
import { useUser } from "@/context/user-provider";

export default function ProtectedIndex() {
  const { userType, loading } = useUser();

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
  if (userType === "admin") {
    return <Redirect href="/(protected)/(admin)" />;
  } else if (userType === "user") {
    return <Redirect href="/(protected)/(tabs)" />;
  } else {
    return <Redirect href="/welcome" />;
  }
}

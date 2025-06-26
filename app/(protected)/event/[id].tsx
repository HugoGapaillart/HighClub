import { Button } from "@/components/ui/button";
import { useLocalSearchParams } from "expo-router";
import { Image, Text, View, ScrollView } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useEvents } from "@/context/event-provider";

export default function Event() {
  const { id } = useLocalSearchParams();
  const { events, isLoading, isError } = useEvents();

  if (isLoading) {
    return <Text>Chargement...</Text>;
  }

  if (isError) {
    return <Text>Erreur lors du chargement de l'évènement</Text>;
  }

  const eventId = id as string;

  // Trouver l'évènement dans la liste récupérée
  const filteredEvent = events?.find((event) => event.id === eventId);

  if (!filteredEvent) {
    return <Text>Évènement non trouvé</Text>;
  }

  const isAvailable =
    filteredEvent.is_active &&
    filteredEvent.sold_tickets < filteredEvent.max_capacity;

  let statutEvent = "";
  if (filteredEvent.is_active == false) {
    statutEvent = "Réservation terminé";
  } else if (filteredEvent.sold_tickets >= filteredEvent.max_capacity) {
    statutEvent = "Complet";
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#211f39]" edges={["top", "bottom"]}>
        <View className="flex-1">
          {filteredEvent.image_url ? (
            <Image
              source={{ uri: filteredEvent.image_url }}
              className="w-full h-60"
            />
          ) : (
            <Image
              source={require("assets/mandragora.webp")}
              className="w-full h-60"
            />
          )}
          <View className="px-6 mt-4">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1 mr-4">
                <Text className="text-3xl text-white font-bold leading-tight">
                  {filteredEvent.name}
                </Text>
              </View>
            </View>
            {filteredEvent.description && (
              <View className="mb-6">
                <Text className="text-white/90 text-base leading-relaxed">
                  {filteredEvent.description}
                </Text>
              </View>
            )}
            <View className="space-y-4 mb-4">
              <View className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <Text className="text-white/60 text-sm font-medium mb-1">
                  Date et heure
                </Text>
                <Text className="text-white text-lg font-semibold">
                  {new Date(filteredEvent.event_date).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </Text>
                <Text className="text-white/80 text-base">
                  {new Date(filteredEvent.event_date).toLocaleTimeString(
                    "fr-FR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </Text>
              </View>
            </View>
            {/* Prix */}
            <View className="space-y-4 mb-4">
              <View className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <Text className="text-white/60 text-sm font-medium mb-1">
                  Prix de la place
                </Text>
                <Text className="text-white text-2xl font-bold">
                  {filteredEvent.ticket_price}€
                </Text>
              </View>
            </View>
            {/* Fin des réservations */}
            <View className="space-y-4 mb-4">
              <View className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <Text className="text-white/60 text-sm font-medium mb-1">
                  Fin des réservations
                </Text>
                <Text className="text-white text-base font-semibold">
                  {new Date(filteredEvent.presale_end_time).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}{" "}
                  à{" "}
                  {new Date(filteredEvent.presale_end_time).toLocaleTimeString(
                    "fr-FR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </Text>
              </View>
            </View>
            {filteredEvent.sold_tickets > 0 && (
              <View className="mt-space-y-4">
                <View className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <Text className="text-white/60 mb-2">
                    {filteredEvent.sold_tickets} / {filteredEvent.max_capacity}{" "}
                    places réservées
                  </Text>
                  <View className="w-full bg-white/10 rounded-full h-2">
                    <View
                      className="bg-[#9400FF] h-2 rounded-full"
                      style={{
                        width: `${(filteredEvent.sold_tickets / filteredEvent.max_capacity) * 100}%`,
                      }}
                    />
                  </View>
                  <Text className="text-white/50 text-xs mt-2">
                    {filteredEvent.max_capacity - filteredEvent.sold_tickets}{" "}
                    places restantes
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
        {/* Fixed bottom button */}
        <View className="absolute bottom-8 left-4 right-4">
          <Button
            className={isAvailable ? "bg-[#9400FF]" : "bg-gray-500"}
            disabled={!isAvailable}
            onPress={() => {
              if (isAvailable) {
                // Action de réservation ici
              }
            }}
          >
            <Text className="text-white font-bold text-center">
              {statutEvent ? statutEvent : "Réserver une place"}
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

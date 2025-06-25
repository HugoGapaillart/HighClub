import { ScrollView, View, TouchableOpacity, Alert } from "react-native";
import { Image } from "@/components/image";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

const tickets = [
  {
    id: "1",
    event: "Soirée d'inauguration",
    date: "28 Juin 2024",
    time: "22:00",
    image: require("@/assets/events/inauguration.jpeg"), // Image de l'événement
    status: "upcoming", // "upcoming", "used", "active"
    entryUsed: false,
    totalSpent: 0,
    consumptions: 0,
    maxConsumptions: 5,
    venue: "Club Paradise",
  },
  {
    id: "2",
    event: "Rooftop Party",
    date: "12 Juillet 2024",
    time: "21:30",
    image: require("@/assets/events/soiree-dj.jpg"),
    status: "active",
    entryUsed: true,
    totalSpent: 45.5,
    consumptions: 3,
    maxConsumptions: 8,
    venue: "Sky Lounge",
  },
  {
    id: "3",
    event: "Pool Party",
    date: "2 Août 2024",
    time: "20:00",
    image: require("@/assets/events/soiree-lounge.jpg"),
    status: "used",
    entryUsed: true,
    totalSpent: 120.0,
    consumptions: 8,
    maxConsumptions: 8,
    venue: "Aqua Club",
  },
];

const getStatusInfo = (status: string, entryUsed: boolean) => {
  switch (status) {
    case "upcoming":
      return {
        text: "À venir",
        color: "bg-blue-500",
        textColor: "text-white",
      };
    case "active":
      return {
        text: entryUsed ? "En cours" : "Disponible",
        color: "bg-green-500",
        textColor: "text-white",
      };
    case "used":
      return {
        text: "Terminé",
        color: "bg-gray-500",
        textColor: "text-white",
      };
    default:
      return {
        text: "Inconnu",
        color: "bg-gray-400",
        textColor: "text-white",
      };
  }
};

const handleTicketPress = (ticket: any) => {
  if (ticket.status === "upcoming") {
    Alert.alert(
      "Événement à venir",
      `L'événement "${ticket.event}" aura lieu le ${ticket.date} à ${ticket.time}.`,
      [{ text: "OK" }]
    );
  } else if (ticket.status === "active") {
    Alert.alert("Actions disponibles", "Que souhaitez-vous faire ?", [
      { text: "Voir les détails", onPress: () => console.log("Détails") },
      {
        text: "Acheter des conso",
        onPress: () => console.log("Acheter conso"),
      },
      { text: "Annuler", style: "cancel" },
    ]);
  } else {
    Alert.alert(
      "Détails de l'événement",
      `Événement terminé\nTotal dépensé: ${ticket.totalSpent}€\nConsommations: ${ticket.consumptions}`,
      [{ text: "OK" }]
    );
  }
};

export default function Tickets() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#100f1b] pt-4 px-4" edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <H1 className="text-white mb-6">Mes Tickets</H1>
          <View className="flex-col gap-6 mb-10">
            {tickets.map((ticket) => {
              const statusInfo = getStatusInfo(ticket.status, ticket.entryUsed);

              return (
                <TouchableOpacity
                  key={ticket.id}
                  onPress={() => handleTicketPress(ticket)}
                  activeOpacity={0.7}
                >
                  <View className="rounded-2xl overflow-hidden">
                    {/* Image de l'événement */}
                    <Image source={ticket.image} className="w-full h-56" />

                    {/* Contenu principal */}
                    <View className="bg-[#211f39] p-4">
                      <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-2">
                          <Text
                            className="font-bold text-lg text-white"
                            numberOfLines={1}
                          >
                            {ticket.event}
                          </Text>
                          <Text className="text-sm text-white/80">
                            {ticket.venue}
                          </Text>
                        </View>

                        {/* Badge de statut */}
                        <View
                          className={`px-2 py-1 rounded-full ${statusInfo.color}`}
                        >
                          <Text
                            className={`text-xs font-medium ${statusInfo.textColor}`}
                          >
                            {statusInfo.text}
                          </Text>
                        </View>
                      </View>

                      {/* Date et heure */}
                      <View className="flex-row items-center mb-3">
                        <Text className="text-sm text-white/60">
                          {ticket.date} • {ticket.time}
                        </Text>
                      </View>

                      {/* Informations de consommation */}
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row gap-x-4">
                          <View>
                            <Text className="text-xs text-muted-foreground">
                              Dépensé
                            </Text>
                            <Text className="font-semibold text-white/80">
                              {ticket.totalSpent.toFixed(2)}€
                            </Text>
                          </View>

                          <View>
                            <Text className="text-xs text-muted-foreground">
                              Conso
                            </Text>
                            <Text className="font-semibold text-white/80">
                              {ticket.consumptions}/{ticket.maxConsumptions}
                            </Text>
                          </View>
                        </View>

                        {/* Indicateur d'entrée utilisée */}
                        {ticket.entryUsed && (
                          <View className="bg-[#9400FF]/20 px-2 py-1 rounded">
                            <Text className="text-xs text-[#9400FF] font-medium">
                              Entrée validée
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Barre de progression des consommations */}
                      {ticket.consumptions > 0 && (
                        <View className="mt-3">
                          <View className="w-full bg-gray-200 rounded-full h-2">
                            <View
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${(ticket.consumptions / ticket.maxConsumptions) * 100}%`,
                              }}
                            />
                          </View>
                        </View>
                      )}

                      {/* Actions rapides pour les tickets actifs */}
                      {ticket.status === "active" && (
                        <View className="flex-row gap-2 mt-6">
                          <TouchableOpacity
                            className="flex-1 bg-[#9400FF] py-2 px-3 rounded-lg"
                            onPress={() => console.log("Acheter conso")}
                          >
                            <Text className="text-primary-foreground text-center font-medium text-sm">
                              Acheter conso
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="flex-1 bg-secondary py-2 px-3 rounded-lg"
                            onPress={() => console.log("Voir détails")}
                          >
                            <Text className="text-secondary-foreground text-center font-medium text-sm">
                              Détails
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Message si aucun ticket */}
          {tickets.length === 0 && (
            <View className="mt-3">
              <Text className="text-white/60 text-center mt-8">
                Aucun ticket disponible
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

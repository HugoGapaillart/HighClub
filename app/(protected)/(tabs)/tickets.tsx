import { ScrollView, View, TouchableOpacity, Alert } from "react-native";
import { Image } from "@/components/image";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
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
    totalSpent: 45.50,
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
    totalSpent: 120.00,
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
    Alert.alert(
      "Actions disponibles",
      "Que souhaitez-vous faire ?",
      [
        { text: "Voir les détails", onPress: () => console.log("Détails") },
        { text: "Acheter des conso", onPress: () => console.log("Acheter conso") },
        { text: "Annuler", style: "cancel" },
      ]
    );
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
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <H1 className="text-center mb-6">Mes Tickets</H1>
        
        <View className="gap-y-4">
          {tickets.map((ticket) => {
            const statusInfo = getStatusInfo(ticket.status, ticket.entryUsed);
            
            return (
              <TouchableOpacity
                key={ticket.id}
                onPress={() => handleTicketPress(ticket)}
                className="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
                activeOpacity={0.7}
              >
                <View className="flex-row">
                  {/* Image de l'événement */}
                  <View className="w-24 h-24">
                    <Image 
                      source={ticket.image} 
                      className="w-full h-full"
                      style={{ resizeMode: 'cover' }}
                    />
                  </View>
                  
                  {/* Contenu principal */}
                  <View className="flex-1 p-4">
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1 mr-2">
                        <Text className="font-bold text-lg text-foreground" numberOfLines={1}>
                          {ticket.event}
                        </Text>
                        <Muted className="text-sm">{ticket.venue}</Muted>
                      </View>
                      
                      {/* Badge de statut */}
                      <View className={`px-2 py-1 rounded-full ${statusInfo.color}`}>
                        <Text className={`text-xs font-medium ${statusInfo.textColor}`}>
                          {statusInfo.text}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Date et heure */}
                    <View className="flex-row items-center mb-3">
                      <Text className="text-sm text-muted-foreground">
                        {ticket.date} • {ticket.time}
                      </Text>
                    </View>
                    
                    {/* Informations de consommation */}
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row gap-x-4">
                        <View>
                          <Text className="text-xs text-muted-foreground">Dépensé</Text>
                          <Text className="font-semibold text-foreground">
                            {ticket.totalSpent.toFixed(2)}€
                          </Text>
                        </View>
                        
                        <View>
                          <Text className="text-xs text-muted-foreground">Conso</Text>
                          <Text className="font-semibold text-foreground">
                            {ticket.consumptions}/{ticket.maxConsumptions}
                          </Text>
                        </View>
                      </View>
                      
                      {/* Indicateur d'entrée utilisée */}
                      {ticket.entryUsed && (
                        <View className="bg-green-100 px-2 py-1 rounded">
                          <Text className="text-xs text-green-700 font-medium">
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
                              width: `${(ticket.consumptions / ticket.maxConsumptions) * 100}%` 
                            }}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
                
                {/* Actions rapides pour les tickets actifs */}
                {ticket.status === "active" && (
                  <View className="border-t border-border p-3 bg-muted/30">
                    <View className="flex-row gap-x-2">
                      <TouchableOpacity 
                        className="flex-1 bg-primary py-2 px-3 rounded-lg"
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
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Message si aucun ticket */}
        {tickets.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-muted-foreground text-center">
              Aucun ticket disponible
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
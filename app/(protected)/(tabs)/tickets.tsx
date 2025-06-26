"use client"

import { ScrollView, View, TouchableOpacity } from "react-native"
import { Image } from "@/components/image"
import { Text } from "@/components/ui/text"
import { H1 } from "@/components/ui/typography"
import { useUser } from "@/context/user-provider"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"

const tickets = [
  {
    id: "1",
    event: "Soirée d'inauguration",
    date: "28 Juin 2024",
    time: "22:00",
    image: require("@/assets/events/inauguration.jpeg"),
    status: "upcoming",
    totalSpent: 0,
    consumptions: 0,
    venue: "Club Paradise",
    hasTicket: false,
  },
  {
    id: "2",
    event: "Rooftop Party",
    date: "12 Juillet 2024",
    time: "21:30",
    image: require("@/assets/events/soiree-dj.jpg"),
    status: "active",
    totalSpent: 45.5,
    consumptions: 3,
    venue: "Sky Lounge",
    hasTicket: true,
  },
  {
    id: "3",
    event: "Pool Party",
    date: "2 Août 2024",
    time: "20:00",
    image: require("@/assets/events/soiree-lounge.jpg"),
    status: "used",
    totalSpent: 120.0,
    consumptions: 8,
    venue: "Aqua Club",
    hasTicket: true,
  },
  {
    id: "4",
    event: "Summer Festival",
    date: "15 Août 2024",
    time: "21:00",
    image: require("@/assets/events/inauguration.jpeg"),
    status: "upcoming",
    totalSpent: 25.0,
    consumptions: 0,
    venue: "Beach Club",
    hasTicket: true,
  },
]

const getStatusInfo = (status: string) => {
  switch (status) {
    case "upcoming":
      return {
        text: "À venir",
        color: "bg-blue-500",
        textColor: "text-white",
      }
    case "active":
      return {
        text: "En cours",
        color: "bg-green-500",
        textColor: "text-white",
      }
    case "used":
      return {
        text: "Terminé",
        color: "bg-gray-500",
        textColor: "text-white",
      }
    default:
      return {
        text: "Inconnu",
        color: "bg-gray-400",
        textColor: "text-white",
      }
  }
}

const handleTicketPress = (ticket: any) => {
  // Si c'est un événement à venir sans ticket, aller vers la page événement
  if (ticket.status === "upcoming" && !ticket.hasTicket) {
    return
  }

  // Si c'est un événement à venir avec ticket, actif ou passé avec ticket, aller vers la page ticket
  if (ticket.hasTicket) {
    router.push({
      pathname: "/ticket/[id]",
      params: { id: ticket.id }
    })
  }
}

export default function Tickets() {
  const { user, profile, loading } = useUser()
  console.log("user:", user)
  console.log("profile:", profile)

  // Trier les tickets : "active" en premier, puis "upcoming", puis "used"
  const sortedTickets = [...tickets].sort((a, b) => {
    const statusOrder: Record<string, number> = { active: 0, upcoming: 1, used: 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#100f1b] pt-4 px-4" edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <H1 className="text-white mb-6">Mes Tickets</H1>
          <View className="flex-col gap-6 mb-10">
            {sortedTickets.map((ticket) => {
              const statusInfo = getStatusInfo(ticket.status)

              return (
                <TouchableOpacity key={ticket.id} onPress={() => handleTicketPress(ticket)} activeOpacity={0.7}>
                  <View className="rounded-2xl overflow-hidden">
                    {/* Image de l'événement */}
                    <Image source={ticket.image} className="w-full h-56" />

                    {/* Contenu principal */}
                    <View className="bg-[#211f39] p-4">
                      <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-2">
                          <Text className="font-bold text-lg text-white" numberOfLines={1}>
                            {ticket.event}
                          </Text>
                          <Text className="text-sm text-white/80">{ticket.venue}</Text>
                        </View>

                        {/* Badge de statut */}
                        <View className={`px-2 py-1 rounded-full ${statusInfo.color}`}>
                          <Text className={`text-xs font-medium ${statusInfo.textColor}`}>{statusInfo.text}</Text>
                        </View>
                      </View>

                      {/* Date et heure */}
                      <View className="flex-row items-center mb-3">
                        <Text className="text-sm text-white/60">
                          {ticket.date} • {ticket.time}
                        </Text>
                      </View>

                      {/* Informations simplifiées */}
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row gap-x-6">
                          <View>
                            <Text className="text-xs text-white/50">Total dépensé</Text>
                            <Text className="font-semibold text-white/80 text-base">
                              {ticket.totalSpent.toFixed(2)}€
                            </Text>
                          </View>

                          <View>
                            <Text className="text-xs text-white/50">Conso achetées</Text>
                            <Text className="font-semibold text-white/80 text-base">{ticket.consumptions}</Text>
                          </View>
                        </View>

                        {/* Indicateur si place achetée pour événements à venir */}
                        {ticket.status === "upcoming" && ticket.hasTicket && (
                          <View className="bg-[#9400FF]/20 px-2 py-1 rounded">
                            <Text className="text-xs text-[#9400FF] font-medium">Place achetée</Text>
                          </View>
                        )}
                      </View>

                      {/* Actions rapides pour les tickets actifs ou à venir avec place */}
                      {(ticket.status === "active" || (ticket.status === "upcoming" && ticket.hasTicket)) && (
                        <View className="flex-row gap-2 mt-6">
                          <TouchableOpacity
                            className="flex-1 bg-[#9400FF] py-2 px-3 rounded-lg"
                            onPress={() => console.log("Acheter conso")}
                          >
                            <Text className="text-white text-center font-medium text-sm">Acheter conso</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="flex-1 bg-white/10 py-2 px-3 rounded-lg"
                            onPress={() => console.log("Voir détails")}
                          >
                            <Text className="text-white text-center font-medium text-sm">Détails</Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {/* Action pour acheter une place si pas encore achetée */}
                      {ticket.status === "upcoming" && !ticket.hasTicket && (
                        <View className="mt-6">
                          <TouchableOpacity
                            className="w-full bg-[#9400FF] py-2 px-3 rounded-lg"
                            onPress={() => console.log("Acheter place")}
                          >
                            <Text className="text-white text-center font-medium text-sm">Acheter une place</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Message si aucun ticket */}
          {tickets.length === 0 && (
            <View className="mt-3">
              <Text className="text-white/60 text-center mt-8">Aucun ticket disponible</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

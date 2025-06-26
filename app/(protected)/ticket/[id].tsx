"use client"

import { ScrollView, View, TouchableOpacity, Alert, Share } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import QRCode from "react-native-qrcode-svg"
import { Image } from "@/components/image"
import { Text } from "@/components/ui/text"
import { H1, H2, Muted } from "@/components/ui/typography"

// Données simulées (à remplacer par votre API)
const getTicketData = (id: string) => {
  const tickets = {
    "1": {
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
      ticketNumber: "SI2024-000001",
      purchaseDate: "20 Juin 2024",
      entryPrice: 0,
      address: "789 Avenue Paradise, 75008 Paris",
    },
    "2": {
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
      ticketNumber: "RP2024-001234",
      purchaseDate: "5 Juillet 2024",
      entryPrice: 25.0,
      address: "123 Rue de la Fête, 75001 Paris",
    },
    "3": {
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
      ticketNumber: "PP2024-005678",
      purchaseDate: "25 Juillet 2024",
      entryPrice: 30.0,
      address: "456 Boulevard Aqua, 06000 Nice",
    },
    "4": {
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
      ticketNumber: "SF2024-009876",
      purchaseDate: "10 Juillet 2024",
      entryPrice: 25.0,
      address: "456 Boulevard de la Plage, 06000 Nice",
    },
  }
  return tickets[id]
}

export default function TicketDetail() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [showQR, setShowQR] = useState(true)

  const ticket = getTicketData(id as string)

  const handleLeaveReview = () => {
    Alert.alert("Laisser un avis", `Comment avez-vous trouvé l'événement "${ticket.event}" ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Écrire un avis",
        onPress: () => {
          // Navigation vers la page d'avis
          router.push(`/review/${ticket.id}`)
        },
      },
    ])
  }

  if (!ticket) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text>Ticket non trouvé</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-primary px-4 py-2 rounded-lg">
          <Text className="text-primary-foreground">Retour</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleRefundRequest = () => {
    Alert.alert("Demande de remboursement", "Êtes-vous sûr de vouloir demander un remboursement pour ce ticket ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Confirmer",
        style: "destructive",
        onPress: () => {
          // Logique de remboursement
          Alert.alert(
            "Demande envoyée",
            "Votre demande de remboursement a été envoyée. Vous recevrez une réponse sous 48h.",
          )
        },
      },
    ])
  }

  const handleBuyConsumptions = () => {
    // Navigation vers la page d'achat de consommations
    router.push(`/buy-consumptions/${ticket.id}`)
  }

  const handleShareTicket = async () => {
    try {
      await Share.share({
        message: `Mon ticket pour ${ticket.event} le ${ticket.date} à ${ticket.time} - ${ticket.venue}`,
        title: "Partager mon ticket",
      })
    } catch (error) {
      console.error("Erreur lors du partage:", error)
    }
  }

  const qrData = JSON.stringify({
    ticketId: ticket.id,
    ticketNumber: ticket.ticketNumber,
    event: ticket.event,
    date: ticket.date,
    venue: ticket.venue,
  })

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header avec image */}
      <View className="relative">
        <Image source={ticket.image} className="w-full h-48" style={{ resizeMode: "cover" }} />
        <View className="absolute inset-0 bg-black/40" />
        <View className="absolute bottom-4 left-4 right-4">
          <H1 className="text-white font-bold">{ticket.event}</H1>
          <Text className="text-white/90">{ticket.venue}</Text>
        </View>

        {/* Bouton retour */}
        <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-4 bg-black/50 rounded-full p-2">
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>
      </View>

      <View className="p-4 gap-y-4">
        {/* Informations du ticket */}
        <View className="bg-card rounded-xl border border-border p-4">
          <H2 className="mb-4">Informations du ticket</H2>
          <View className="gap-y-3">
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Numéro de ticket</Text>
              <Text className="font-mono">{ticket.ticketNumber}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Date & Heure</Text>
              <Text>
                {ticket.date} • {ticket.time}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Lieu</Text>
              <Text className="flex-1 text-right" numberOfLines={2}>
                {ticket.address}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Acheté le</Text>
              <Text>{ticket.purchaseDate}</Text>
            </View>
          </View>
        </View>

        {/* QR Code - seulement pour les événements actifs */}
        {ticket.status === "active" && (
          <View className="bg-card rounded-xl border border-border p-4">
            <View className="flex-row justify-between items-center mb-4">
              <H2>Code QR d'entrée</H2>
              <TouchableOpacity onPress={() => setShowQR(!showQR)} className="bg-secondary px-3 py-1 rounded">
                <Text className="text-secondary-foreground text-sm">{showQR ? "Masquer" : "Afficher"}</Text>
              </TouchableOpacity>
            </View>
            <View className="items-center">
              {showQR ? (
                <View className="items-center gap-y-3">
                  <View className="bg-white p-4 rounded-lg">
                    <QRCode value={qrData} size={200} backgroundColor="white" color="black" />
                  </View>
                  <Muted className="text-center">Présentez ce code à l'entrée</Muted>
                </View>
              ) : (
                <View className="py-8">
                  <Text className="text-muted-foreground text-center">Code QR masqué pour la sécurité</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Message pour les événements à venir avec ticket */}
        {ticket.status === "upcoming" && ticket.hasTicket && (
          <View className="bg-card rounded-xl border border-border p-4">
            <H2 className="mb-4">Événement à venir</H2>
            <Text className="text-muted-foreground text-center">
              Votre place est confirmée ! Vous pourrez acheter des consommations dès maintenant ou le jour J.
            </Text>
          </View>
        )}

        {/* Message pour les événements terminés */}
        {ticket.status === "used" && (
          <View className="bg-card rounded-xl border border-border p-4">
            <H2 className="mb-4">Événement terminé</H2>
            <Text className="text-muted-foreground text-center">
              Cet événement est maintenant terminé. Vous pouvez consulter vos dépenses ci-dessous.
            </Text>
          </View>
        )}

        {/* Statistiques */}
        <View className="bg-card rounded-xl border border-border p-4">
          <H2 className="mb-4">Mes dépenses</H2>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">{ticket.entryPrice.toFixed(2)}€</Text>
              <Muted>Prix d'entrée</Muted>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {(ticket.totalSpent - ticket.entryPrice).toFixed(2)}€
              </Text>
              <Muted>Consommations</Muted>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">{ticket.consumptions}</Text>
              <Muted>Conso achetées</Muted>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="gap-y-3">
          {/* Acheter des consommations - pour événements actifs ou à venir avec ticket */}
          {(ticket.status === "active" || (ticket.status === "upcoming" && ticket.hasTicket)) && (
            <TouchableOpacity onPress={handleBuyConsumptions} className="bg-primary py-3 px-4 rounded-lg">
              <Text className="text-primary-foreground font-medium text-center">Acheter des consommations</Text>
            </TouchableOpacity>
          )}

          {/* Partager le ticket - pour événements actifs ou à venir avec ticket */}
          {(ticket.status === "active" || (ticket.status === "upcoming" && ticket.hasTicket)) && (
            <TouchableOpacity onPress={handleShareTicket} className="border border-border py-3 px-4 rounded-lg">
              <Text className="text-center">Partager mon ticket</Text>
            </TouchableOpacity>
          )}

          {/* Laisser un avis - seulement si événement terminé */}
          {ticket.status === "used" && (
            <TouchableOpacity onPress={handleLeaveReview} className="bg-[#9400FF] py-3 px-4 rounded-lg">
              <Text className="text-white font-medium text-center">Laisser un avis</Text>
            </TouchableOpacity>
          )}

          {/* Demande de remboursement - seulement si événement à venir avec ticket */}
          {ticket.status === "upcoming" && ticket.hasTicket && (
            <TouchableOpacity
              onPress={handleRefundRequest}
              className="border border-red-200 bg-transparent py-3 px-4 rounded-lg"
            >
              <Text className="text-red-600 text-center">Demander un remboursement</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Informations importantes */}
        <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <Text className="text-yellow-800 text-sm">
            <Text className="font-semibold">Important :</Text> Gardez ce ticket accessible sur votre téléphone. Une
            pièce d'identité pourra vous être demandée à l'entrée.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

"use client";

import React from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";
import { H1, H2 } from "@/components/ui/typography";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  X,
  Check,
  XCircle,
  RefreshCw,
} from "lucide-react-native";

interface Event {
  id: number;
  title: string;
  date: string;
  description?: string;
  location?: string;
  image?: string;
  status: "active" | "cancelled";
  cancelledAt?: string;
  refundStatus?: "pending" | "processing" | "completed";
}

const initialEvents: Event[] = [
  {
    id: 1,
    title: "Tranceform - Mandragora, La P'tite Fumée & more",
    date: "Vendredi 28 juillet 23:30",
    description: "Soirée trance exceptionnelle",
    location: "Club XYZ",
    status: "active",
  },
  {
    id: 2,
    title: "Soirée Techno Underground",
    date: "2 août 23:30",
    description: "Techno underground avec les meilleurs DJs",
    location: "Warehouse 51",
    status: "cancelled",
    cancelledAt: "25 juillet 2024",
    refundStatus: "processing",
  },
  {
    id: 3,
    title: "Electro Chill Party",
    date: "10 août 23:30",
    description: "Ambiance chill et électro",
    location: "Rooftop Bar",
    status: "active",
  },
  {
    id: 4,
    title: "Mandragora Special Night",
    date: "17 août 23:30",
    description: "Nuit spéciale avec Mandragora",
    location: "Main Stage",
    status: "active",
  },
];

export default function DashboardEvents() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [searchValue, setSearchValue] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    location: "",
    image: "",
  });

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      description: "",
      location: "",
      image: "",
    });
    setEditingEvent(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      description: event.description || "",
      location: event.location || "",
      image: event.image || "",
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.date.trim()) {
      Alert.alert("Erreur", "Le titre et la date sont obligatoires");
      return;
    }

    if (editingEvent) {
      // Update existing event
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id ? { ...event, ...formData } : event
        )
      );
    } else {
      // Create new event (logique en dur pour présentation)
      const newEvent: Event = {
        id: Math.max(...events.map((e) => e.id)) + 1,
        ...formData,
        status: "active", // Nouveau événement toujours actif
      };
      setEvents([...events, newEvent]);

      // Simulation d'ajout réussi pour la présentation
      Alert.alert("Succès", "Événement créé avec succès !", [
        { text: "OK", onPress: () => {} },
      ]);
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (eventId: number) => {
    Alert.alert(
      "Supprimer l'événement",
      "Êtes-vous sûr de vouloir supprimer définitivement cet événement ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () =>
            setEvents(events.filter((event) => event.id !== eventId)),
        },
      ]
    );
  };

  const handleCancelEvent = (eventId: number) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    Alert.alert(
      "Annuler l'événement",
      `Êtes-vous sûr de vouloir annuler "${event.title}" ?\n\nLes participants seront automatiquement remboursés.`,
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: () => {
            const currentDate = new Date().toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            setEvents(
              events.map((event) =>
                event.id === eventId
                  ? {
                      ...event,
                      status: "cancelled",
                      cancelledAt: currentDate,
                      refundStatus: "pending",
                    }
                  : event
              )
            );

            // Simulation du processus de remboursement
            setTimeout(() => {
              setEvents((prevEvents) =>
                prevEvents.map((event) =>
                  event.id === eventId
                    ? { ...event, refundStatus: "processing" }
                    : event
                )
              );
            }, 2000);

            setTimeout(() => {
              setEvents((prevEvents) =>
                prevEvents.map((event) =>
                  event.id === eventId
                    ? { ...event, refundStatus: "completed" }
                    : event
                )
              );
            }, 5000);

            Alert.alert(
              "Événement annulé",
              "L'événement a été annulé. Les remboursements sont en cours de traitement."
            );
          },
        },
      ]
    );
  };

  const handleReactivateEvent = (eventId: number) => {
    Alert.alert(
      "Réactiver l'événement",
      "Voulez-vous réactiver cet événement ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réactiver",
          onPress: () => {
            setEvents(
              events.map((event) =>
                event.id === eventId
                  ? {
                      ...event,
                      status: "active",
                      cancelledAt: undefined,
                      refundStatus: undefined,
                    }
                  : event
              )
            );
            Alert.alert("Succès", "L'événement a été réactivé avec succès !");
          },
        },
      ]
    );
  };

  const getRefundStatusText = (status?: string) => {
    switch (status) {
      case "pending":
        return "Remboursements en attente...";
      case "processing":
        return "Remboursements en cours...";
      case "completed":
        return "Remboursements terminés ✅";
      default:
        return "";
    }
  };

  const getRefundStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400";
      case "processing":
        return "text-blue-400";
      case "completed":
        return "text-green-400";
      default:
        return "text-white/60";
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#100f1b]" edges={["top"]}>
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row items-center justify-between mb-6">
            <H1 className="text-white flex-1">Dashboard Événements</H1>
            <TouchableOpacity
              onPress={openCreateModal}
              className="bg-purple-600 rounded-full p-3 ml-4"
            >
              <Plus size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="relative mb-4">
            <TextInput
              className="border border-white/30 rounded-xl p-4 pl-12 text-white placeholder:text-white/50 bg-white/5"
              placeholder="Rechercher un événement..."
              value={searchValue}
              onChangeText={setSearchValue}
            />
            <View className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search size={20} color="rgba(255,255,255,0.5)" />
            </View>
          </View>
        </View>

        {/* Events List */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="pb-6">
            {filteredEvents.length === 0 ? (
              <View className="items-center justify-center py-12">
                <Calendar size={48} color="rgba(255,255,255,0.3)" />
                <Text className="text-white/60 text-center mt-4 text-lg">
                  {searchValue
                    ? "Aucun événement trouvé"
                    : "Aucun événement créé"}
                </Text>
                <Text className="text-white/40 text-center mt-2">
                  {!searchValue &&
                    "Appuyez sur + pour créer votre premier événement"}
                </Text>
              </View>
            ) : (
              filteredEvents.map((event) => (
                <View
                  key={event.id}
                  className={`rounded-xl p-4 mb-4 border ${
                    event.status === "cancelled"
                      ? "bg-red-900/20 border-red-500/30"
                      : "bg-white/10 border-white/20"
                  }`}
                >
                  {/* Status Badge */}
                  {event.status === "cancelled" && (
                    <View className="flex-row items-center mb-3">
                      <XCircle size={16} color="#ef4444" />
                      <Text className="text-red-400 font-semibold ml-2">
                        ÉVÉNEMENT ANNULÉ
                      </Text>
                    </View>
                  )}

                  {event.image && (
                    <View className="w-full h-32 bg-white/5 rounded-lg mb-3 items-center justify-center">
                      <Text className="text-4xl">🖼️</Text>
                      <Text className="text-white/50 text-xs mt-1">
                        Image de l'événement
                      </Text>
                    </View>
                  )}

                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 mr-3">
                      <Text
                        className={`font-semibold text-lg mb-1 ${
                          event.status === "cancelled"
                            ? "text-white/60 line-through"
                            : "text-white"
                        }`}
                      >
                        {event.title}
                      </Text>
                      <View className="flex-row items-center mb-2">
                        <Clock size={16} color="rgba(255,255,255,0.7)" />
                        <Text className="text-white/70 ml-2">{event.date}</Text>
                      </View>
                      {event.location && (
                        <Text className="text-white/60 text-sm">
                          📍 {event.location}
                        </Text>
                      )}
                      {event.description && (
                        <Text className="text-white/60 text-sm mt-2">
                          {event.description}
                        </Text>
                      )}

                      {/* Cancellation Info */}
                      {event.status === "cancelled" && (
                        <View className="mt-3 p-3 bg-red-900/30 rounded-lg border border-red-500/20">
                          <Text className="text-red-300 text-sm font-medium">
                            Annulé le {event.cancelledAt}
                          </Text>
                          {event.refundStatus && (
                            <View className="flex-row items-center mt-2">
                              <RefreshCw size={14} color="#60a5fa" />
                              <Text
                                className={`text-sm ml-2 ${getRefundStatusColor(event.refundStatus)}`}
                              >
                                {getRefundStatusText(event.refundStatus)}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                    <View className="flex-row">
                      {event.status === "active" ? (
                        <>
                          <TouchableOpacity
                            onPress={() => openEditModal(event)}
                            className="bg-blue-600/20 rounded-lg p-2 mr-2"
                          >
                            <Edit3 size={18} color="#60a5fa" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleCancelEvent(event.id)}
                            className="bg-orange-600/20 rounded-lg p-2 mr-2"
                          >
                            <XCircle size={18} color="#f97316" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDelete(event.id)}
                            className="bg-red-600/20 rounded-lg p-2"
                          >
                            <Trash2 size={18} color="#f87171" />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleReactivateEvent(event.id)}
                          className="bg-green-600/20 rounded-lg p-2"
                        >
                          <RefreshCw size={18} color="#10b981" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Create/Edit Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView className="flex-1 bg-[#100f1b]">
            <View className="flex-1">
              {/* Modal Header */}
              <View className="flex-row items-center justify-between p-4 border-b border-white/20">
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X size={24} color="white" />
                </TouchableOpacity>
                <H2 className="text-white">
                  {editingEvent ? "Modifier" : "Nouvel"} Événement
                </H2>
                <TouchableOpacity onPress={handleSave}>
                  <Check size={24} color="#10b981" />
                </TouchableOpacity>
              </View>

              {/* Form */}
              <ScrollView className="flex-1 p-4">
                <View className="space-y-4">
                  <View>
                    <Text className="text-white/80 mb-2 font-medium">
                      Titre *
                    </Text>
                    <TextInput
                      className="border border-white/30 rounded-xl p-4 text-white bg-white/5"
                      placeholder="Nom de l'événement"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={formData.title}
                      onChangeText={(text) =>
                        setFormData({ ...formData, title: text })
                      }
                    />
                  </View>

                  <View>
                    <Text className="text-white/80 mb-2 font-medium">
                      Date et heure *
                    </Text>
                    <TextInput
                      className="border border-white/30 rounded-xl p-4 text-white bg-white/5"
                      placeholder="Ex: Vendredi 28 juillet 23:30"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={formData.date}
                      onChangeText={(text) =>
                        setFormData({ ...formData, date: text })
                      }
                    />
                  </View>

                  <View>
                    <Text className="text-white/80 mb-2 font-medium">Lieu</Text>
                    <TextInput
                      className="border border-white/30 rounded-xl p-4 text-white bg-white/5"
                      placeholder="Lieu de l'événement"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={formData.location}
                      onChangeText={(text) =>
                        setFormData({ ...formData, location: text })
                      }
                    />
                  </View>

                  <View>
                    <Text className="text-white/80 mb-2 font-medium">
                      Description
                    </Text>
                    <TextInput
                      className="border border-white/30 rounded-xl p-4 text-white bg-white/5 h-24"
                      placeholder="Description de l'événement"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={formData.description}
                      onChangeText={(text) =>
                        setFormData({ ...formData, description: text })
                      }
                      multiline
                      textAlignVertical="top"
                    />
                  </View>

                  <View>
                    <Text className="text-white/80 mb-2 font-medium">
                      Image de l'événement
                    </Text>
                    <TouchableOpacity
                      className="border border-dashed border-white/30 rounded-xl p-6 items-center justify-center bg-white/5 min-h-[120px]"
                      onPress={() => {
                        // Simulation d'upload d'image pour la présentation
                        setFormData({ ...formData, image: "image_uploaded" });
                        Alert.alert(
                          "Image ajoutée",
                          "Image ajoutée avec succès pour la démonstration !"
                        );
                      }}
                    >
                      {formData.image ? (
                        <View className="items-center">
                          <View className="w-16 h-16 bg-purple-600/20 rounded-lg items-center justify-center mb-2">
                            <Text className="text-2xl">🖼️</Text>
                          </View>
                          <Text className="text-white/70 text-sm">
                            Image sélectionnée
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              setFormData({ ...formData, image: "" })
                            }
                            className="mt-2 bg-red-600/20 rounded-lg px-3 py-1"
                          >
                            <Text className="text-red-400 text-xs">
                              Supprimer
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className="items-center">
                          <View className="w-16 h-16 bg-white/10 rounded-lg items-center justify-center mb-2">
                            <Plus size={24} color="rgba(255,255,255,0.5)" />
                          </View>
                          <Text className="text-white/50 text-center">
                            Appuyez pour ajouter une image
                          </Text>
                          <Text className="text-white/30 text-xs text-center mt-1">
                            JPG, PNG (optionnel)
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>

              {/* Save Button */}
              <View className="p-4 border-t border-white/20">
                <TouchableOpacity
                  onPress={handleSave}
                  className="bg-purple-600 rounded-xl p-4 items-center"
                >
                  <Text className="text-white font-semibold text-lg">
                    {editingEvent ? "Mettre à jour" : "Créer"} l'événement
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

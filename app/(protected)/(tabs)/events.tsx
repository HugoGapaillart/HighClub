import {
  View,
  ScrollView,
  TextInput,
  Text,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventCard from "@/app/components/event-card";
import { useState } from "react";
import { H1 } from "@/components/ui/typography";
import { useEvents } from "@/context/event-provider"; // le hook qu'on a défini

export default function Events() {
  const [value, setValue] = useState<string>("");
  const { events, isLoading, isError } = useEvents();

  const filteredEvents = events?.filter((event) =>
    event.name.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-[#100f1b] pt-4 px-4" edges={["top"]}>
      <View className="mb-4">
        <H1 className="text-white mb-6">Évènements</H1>
        <TextInput
          className="border border-white/30 rounded-md p-2 text-white placeholder:text-white/30"
          placeholder="Rechercher"
          value={value}
          onChangeText={setValue}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" className="mt-10" />
      ) : isError ? (
        <Text className="text-red-500 mt-8 text-center">
          Erreur lors du chargement
        </Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mt-3">
            {filteredEvents?.length === 0 ? (
              <Text className="text-white/60 text-center mt-8">
                Aucun évènement trouvé.
              </Text>
            ) : (
              filteredEvents?.map((event) => (
                <View className="mb-6" key={event.id}>
                  <EventCard
                    id={event.id}
                    title={event.name}
                    image_url={event.image_url}
                    date={new Date(event.event_date).toLocaleString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

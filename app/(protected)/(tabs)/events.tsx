import { View, ScrollView, TextInput, Text } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import EventCard from "@/app/components/event-card";
import { useState } from "react";
import { H1 } from "@/components/ui/typography";

const mockEvents = [
  {
    id: 1,
    title: "Tranceform - Mandragora, La P'tite Fumée & more",
    date: "Vendredi 28 juillet 23:30",
  },
  { id: 2, title: "Soirée Techno Underground", date: "2 août 23:30" },
  { id: 3, title: "Electro Chill Party", date: "10 août 23:30" },
  { id: 4, title: "Mandragora Special Night", date: "17 août 23:30" },
];

export default function Events() {
  const [value, setValue] = useState<string>("");

  const filteredEvents = mockEvents.filter((event) =>
    event.title.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background pt-4 px-4" edges={["top"]}>
        <View className="mb-4">
          <H1 className="mb-6">Évènements</H1>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            placeholder="Rechercher"
            value={value}
            onChangeText={setValue}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mt-3">
            {filteredEvents.length === 0 ? (
              <Text className="text-gray-500 text-center mt-8">
                Aucun évènement trouvé.
              </Text>
            ) : (
              filteredEvents.map((event) => (
                <View className="mb-6" key={event.id}>
                  <EventCard title={event.title} date={event.date} />
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

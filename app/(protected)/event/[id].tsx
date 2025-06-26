import { Button } from "@/components/ui/button";
import { router, useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

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

export default function Event() {
  const { id } = useLocalSearchParams();

  const filteredEvent = mockEvents.find((event) => event.id === Number(id));

  if (!filteredEvent) {
    return <Text>Event not found</Text>;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#211f39]" edges={["top", "bottom"]}>
        <View className="flex-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 right-4 z-10"
          >
            <View className="w-10 h-10 rounded-full overflow-hidden">
              <BlurView
                intensity={12}
                tint="light"
                className="absolute top-0 left-0 right-0 bottom-0"
              >
                <View className="w-10 h-10 bg-white/10 items-center justify-center">
                  <X color="white" />
                </View>
              </BlurView>
            </View>
          </TouchableOpacity>
          <Image
            source={require("assets/mandragora.webp")}
            className="w-full h-60"
          />
          <View className="mt-6 px-4">
            <Text className="text-2xl text-white font-bold">
              {filteredEvent.title}
            </Text>
            <Text className="text-white/60 mt-3">{filteredEvent.date}</Text>
          </View>

          {/* Fixed bottom button */}
          <View className="absolute bottom-4 left-4 right-4">
            <Button className="bg-[#9400FF]">
              <Text className="text-white font-bold text-center">
                Réserver une place
              </Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

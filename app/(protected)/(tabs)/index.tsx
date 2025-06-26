import { H1 } from "@/components/ui/typography";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Tickets, Gamepad2, CircleDollarSign } from "lucide-react-native";
import EventCard from "@/app/components/event-card";
import { router } from "expo-router";
import { useUser } from "@/context/user-provider";
import { ClubSelector } from "@/components/club-selection";
import { useClubSelection } from "@/hooks/useClubSelection";

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

export default function Home() {
  const { user, profile, getDisplayName } = useUser();
  const name = getDisplayName();
  const { allClubs, selectedClub, selectClub } = useClubSelection();

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#100f1b] pt-4 px-4" edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <H1 className="text-white">{name}</H1>
          <Text className="text-white mt-1">
            {profile?.loyalty_points ?? 0} points
          </Text>

          <View className="mt-6">
            <ClubSelector
              clubs={allClubs}
              selectedClub={selectedClub}
              onSelectClub={selectClub}
            />
          </View>

          <View className="flex-row gap-2 mt-10 mb-2">
            <TouchableOpacity className="bg-[#211f39] px-2 py-6 border border-white/5 flex-1 items-center justify-center gap-4 rounded-md">
              <Tickets size={24} color="white" />
              <Text className="text-white">Acheter une entrée</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#211f39] px-2 py-4 border border-white/5 flex-1 items-center justify-center gap-4 rounded-md">
              <Tickets size={24} color="white" />
              <Text className="text-white">Acheter une conso</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity className="bg-[#211f39] px-2 py-4 border border-white/5 flex-1 items-center justify-center gap-4 rounded-md">
              <Gamepad2 size={24} color="white" />
              <Text className="text-white">Jeux</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#211f39] px-2 py-4 border border-white/5 flex-1 items-center justify-center gap-4 rounded-md">
              <CircleDollarSign size={24} color="white" />
              <Text className="text-white">Récompenses</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-10">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">Évènements</Text>
              <TouchableOpacity
                onPress={() => router.push("/(protected)/(tabs)/events")}
              >
                <Text className="text-[#9400FF] font-medium">Voir plus</Text>
              </TouchableOpacity>
            </View>

            <View className="my-5 flex-col gap-6">
              {mockEvents.map((event) => (
                <View key={event.id}>
                  <EventCard
                    id={event.id}
                    title={event.title}
                    date={event.date}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";
import { useUser } from "@/context/user-provider";
import ProfilEdit from "@/app/components/profil-edit";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { signOut } = useAuth();
  const { profile } = useUser();

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#100f1b] pt-4 px-4" edges={["top"]}>
        <View className="flex-1 ">
          <View className="mb-6">
            <H1 className="text-white">Mon Profil</H1>
          </View>

          <View className="bg-[#211f39] rounded-xl p-4 mb-6">
            <Text className="text-gray-300 text-base mb-1">
              Nom :{" "}
              <Text className="text-white font-semibold">
                {profile?.firstname} {profile?.lastname}
              </Text>
            </Text>
            <Text className="text-gray-300 text-base mb-1">
              Email :{" "}
              <Text className="text-white font-semibold">{profile?.email}</Text>
            </Text>
            <Text className="text-gray-300 text-base mb-1">
              Téléphone :{" "}
              <Text className="text-white font-semibold">{profile?.phone}</Text>
            </Text>
            <Text className="text-gray-300 text-base">
              Points de fidélité :{" "}
              <Text className="text-white font-semibold">
                {profile?.loyalty_points} pts
              </Text>
            </Text>
          </View>

          <ProfilEdit />

          <Button
            className="w-full bg-red-600 mt-6 rounded-lg p-4"
            size="default"
            variant="default"
            onPress={async () => {
              await signOut();
            }}
          >
            <Text className="text-white font-semibold">Se déconnecter</Text>
          </Button>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

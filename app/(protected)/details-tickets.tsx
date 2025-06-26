import { Image, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { H1 } from "@/components/ui/typography";

export default function DetailsTicket() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#100f1b] pt-4 px-4" edges={["top"]}>
        <View className="mb-4">
          <H1 className="text-white mb-6">Évènements</H1>
          <View className="flex justify-center items-center mt-8">
            <Image
              source={require("assets/QR_Code.png")}
              className="w-80 h-80 bg-white"
              resizeMode="contain"
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

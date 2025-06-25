import React from "react";
import { Text, View, Image } from "react-native";

export default function EventCard() {
  return (
    <View className="rounded-2xl overflow-hidden">
      <Image
        source={require("assets/mandragora.webp")}
        className="w-full h-56"
        resizeMode="cover"
      />
      <View className="bg-slate-200 p-4">
        <Text className="text-gray-500 text-sm">Vendredi 22 avril 23:30</Text>
        <Text className="font-bold text-lg mt-2 leading-snug">
          {"Tranceform - Mandragora, La P'tite Fumée & more"}
        </Text>
      </View>
    </View>
  );
}

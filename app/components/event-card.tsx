import { router } from "expo-router";
import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";

export default function EventCard({
  id,
  title,
  date,
}: {
  id: number;
  title: string;
  date: string;
}) {
  const handlePress = () => {
    router.push(`/event/${id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="rounded-2xl overflow-hidden">
        <Image
          source={require("assets/mandragora.webp")}
          className="w-full h-56"
          resizeMode="cover"
        />
        <View className="bg-slate-200 p-4">
          <Text className="text-gray-500 text-sm">{date}</Text>
          <Text className="font-bold text-lg mt-2 leading-snug">{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

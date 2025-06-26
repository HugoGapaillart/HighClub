import { router } from "expo-router";
import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";

export default function EventCard({
  id,
  title,
  date,
  image_url,
}: {
  id: string;
  title: string;
  date: string;
  image_url: string | null;
}) {
  const handlePress = () => {
    router.push(`/event/${id}`);
  };
  const imageSource =
    image_url && image_url.trim() !== ""
      ? { uri: image_url }
      : require("assets/mandragora.webp");
  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="rounded-2xl overflow-hidden">
        <Image
          source={imageSource}
          className="w-full h-56"
          resizeMode="cover"
        />
        <View className="bg-[#211f39] p-4">
          <Text className="text-white/60 text-sm">{date}</Text>
          <Text className="font-bold text-lg mt-2 leading-snug text-white">
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

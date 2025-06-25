import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/context/supabase-provider";

export default function ProfilEdit() {
  const { session } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("profile")
      .update({ firstname, lastname, phone })
      .eq("id", session?.user.id);

    if (error) {
      console.error("Erreur lors de la mise à jour :", error.message);
    } else {
      setModalVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-blue-600 rounded-lg p-2 w-full"
      >
        <Text className="text-white text-center">Modifier le profil</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl p-6 w-11/12">
            <Text className="text-xl font-bold mb-4">Modifier mes infos</Text>
            <TextInput
              placeholder="Prénom"
              value={firstname}
              onChangeText={setFirstname}
              className="border border-gray-300 rounded p-2 mb-2"
            />
            <TextInput
              placeholder="Nom"
              value={lastname}
              onChangeText={setLastname}
              className="border border-gray-300 rounded p-2 mb-2"
            />
            <TextInput
              placeholder="Téléphone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              className="border border-gray-300 rounded p-2 mb-4"
            />

            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-red-500">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdate}>
                <Text className="text-blue-600 font-bold">Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useUser } from "@/context/user-provider"; // 🔥 utilise le contexte
import { useAuth } from "@/context/supabase-provider";

export default function ProfilEdit() {
  const { session } = useAuth();
  const { refreshProfile, profile, updateProfile } = useUser(); // 🔥
  const [modalVisible, setModalVisible] = useState(false);

  const [firstname, setFirstname] = useState(profile?.firstname || "");
  const [lastname, setLastname] = useState(profile?.lastname || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [emailError, setEmailError] = useState("");

  const handleUpdate = async () => {
    await updateProfile({ firstname, lastname, phone, email });
    await refreshProfile();
    setModalVisible(false);
  };

  const formatPhone = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 10);
    return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  };

  function isValidEmail(email: string) {
    // Regex simple pour vérifier l'email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-blue-600 rounded-lg p-4 w-full"
      >
        <Text className="text-white text-center font-semibold">
          Modifier le profil
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="w-full"
            >
              <ScrollView
                contentContainerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 40,
                  paddingHorizontal: 20,
                }}
              >
                <View className="bg-white rounded-xl p-6 w-full">
                  <Text className="text-xl font-bold mb-4">
                    Modifier mes infos
                  </Text>

                  <Text className="text-gray-700 mb-1">Prénom</Text>
                  <TextInput
                    placeholder="Prénom"
                    value={firstname}
                    onChangeText={setFirstname}
                    className="border border-gray-300 rounded px-3 py-2 mb-3"
                  />

                  <Text className="text-gray-700 mb-1">Nom</Text>
                  <TextInput
                    placeholder="Nom"
                    value={lastname}
                    onChangeText={setLastname}
                    className="border border-gray-300 rounded px-3 py-2 mb-3"
                  />

                  <Text className="text-gray-700 mb-1">Email</Text>
                  <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setEmailError(isValidEmail(text) ? "" : "Email invalide");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className={`border ${
                      emailError ? "border-red-500" : "border-gray-300"
                    } rounded px-3 py-2`}
                  />
                  {emailError ? (
                    <Text className="text-red-500 text-sm mt-1">
                      {emailError}
                    </Text>
                  ) : null}

                  <Text className="text-gray-700 mb-1 mt-3">Téléphone</Text>
                  <TextInput
                    placeholder="Téléphone"
                    value={phone}
                    onChangeText={(text) => setPhone(formatPhone(text))}
                    keyboardType="phone-pad"
                    className="border border-gray-300 rounded px-3 py-2 mb-4"
                  />

                  <View className="flex-row justify-between mt-4">
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Text className="text-red-500">Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUpdate}>
                      <Text className="text-blue-600 font-bold">
                        Enregistrer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

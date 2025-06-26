
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  Pressable,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { QrCode, X } from 'lucide-react-native';

interface QRButtonProps {
  data: string;
  size?: number;
  iconSize?: number;
  buttonClassName?: string;
  qrSize?: number;
}

export const QRButton: React.FC<QRButtonProps> = ({
  data,
  size = 50,
  iconSize = 24,
  buttonClassName = '',
  qrSize = 200,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {/* Bouton avec icône uniquement */}
      <TouchableOpacity
        className={`bg-blue-500 rounded-xl justify-center items-center shadow-lg ${buttonClassName}`}
        style={{ width: size, height: size }}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <QrCode size={iconSize} color="#ffffff" />
      </TouchableOpacity>

      {/* Modale avec QR Code */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            {/* Header de la modale */}
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-semibold text-gray-900">
                QR Code
              </Text>
              <TouchableOpacity
                className="p-1 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* QR Code */}
            <View className="items-center mb-5 p-4 bg-gray-50 rounded-xl">
              <QRCode
                value={data}
                size={qrSize}
                backgroundColor="white"
                color="black"
              />
            </View>

            {/* Données affichées */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Données encodées:
              </Text>
              <Text className="text-xs text-gray-500 bg-gray-100 p-3 rounded-lg text-center">
                {data}
              </Text>
            </View>

            {/* Bouton fermer */}
            <TouchableOpacity
              className="bg-blue-500 py-3 px-6 rounded-lg items-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-base font-medium">
                Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
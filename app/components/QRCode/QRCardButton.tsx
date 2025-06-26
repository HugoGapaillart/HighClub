import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { QrCode, X, Download, Share } from 'lucide-react-native';

interface QRCardButtonProps {
  title: string;
  description?: string;
  data: string;
  children?: React.ReactNode;
  qrSize?: number;
  buttonSize?: number;
  iconSize?: number;
}

export const QRCardButton: React.FC<QRCardButtonProps> = ({
  title,
  description,
  data,
  children,
  qrSize = 200,
  buttonSize = 40,
  iconSize = 20,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {/* Card avec bouton QR */}
      <View className="bg-white rounded-xl p-5 shadow-sm mb-4">
        <Text className="text-lg font-semibold text-gray-900 mb-1">
          {title}
        </Text>
        {description && (
          <Text className="text-sm text-gray-500 mb-4">
            {description}
          </Text>
        )}
        
        {/* Contenu personnalisé */}
        {children}

        {/* Bouton QR en bas à droite */}
        <View className="flex-row justify-end mt-4">
          <TouchableOpacity
            className="bg-blue-500 rounded-xl justify-center items-center shadow-lg"
            style={{ width: buttonSize, height: buttonSize }}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <QrCode size={iconSize} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modale avec QR Code */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-4/5">
            {/* Header de la modale */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                {title}
              </Text>
              <TouchableOpacity
                className="p-2 rounded-full bg-gray-100"
                onPress={() => setModalVisible(false)}
              >
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* QR Code */}
            <View className="items-center mb-6 p-6 bg-gray-50 rounded-2xl">
              <QRCode
                value={data}
                size={qrSize}
                backgroundColor="white"
                color="black"
              />
            </View>

            {/* Données affichées */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                Données encodées:
              </Text>
              <Text className="text-xs text-gray-500 bg-gray-100 p-4 rounded-xl">
                {data}
              </Text>
            </View>

            {/* Boutons d'action */}
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-gray-100 py-3 px-4 rounded-xl flex-row justify-center items-center">
                <Share size={18} color="#6b7280" />
                <Text className="text-gray-700 font-medium ml-2">
                  Partager
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-1 bg-blue-500 py-3 px-4 rounded-xl flex-row justify-center items-center">
                <Download size={18} color="#ffffff" />
                <Text className="text-white font-medium ml-2">
                  Sauvegarder
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
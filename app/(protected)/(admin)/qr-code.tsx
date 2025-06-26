"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  X,
  CheckCircle,
  AlertCircle,
  Scan,
  RefreshCw,
} from "lucide-react-native";

interface QRData {
  id: string;
  content: string;
  timestamp: string;
  isValid: boolean;
  metadata?: {
    type: string;
    value: string;
    expiresAt?: string;
    usageCount?: number;
    maxUsage?: number;
  };
}

export default function QRCodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  // Fonction pour décrypter les données du QR code
  const decryptQRData = (data: string): QRData | null => {
    try {
      // Simulation du décryptage - remplacez par votre logique de décryptage
      const decryptedData = JSON.parse(atob(data));

      return {
        id: decryptedData.id || Date.now().toString(),
        content: data,
        timestamp: new Date().toISOString(),
        isValid: decryptedData.isValid !== false,
        metadata: decryptedData.metadata || {
          type: decryptedData.type || "unknown",
          value: decryptedData.value || "N/A",
          expiresAt: decryptedData.expiresAt,
          usageCount: decryptedData.usageCount || 0,
          maxUsage: decryptedData.maxUsage || 1,
        },
      };
    } catch (error) {
      // Si ce n'est pas du JSON encodé en base64, traiter comme texte simple
      return {
        id: Date.now().toString(),
        content: data,
        timestamp: new Date().toISOString(),
        isValid: true,
        metadata: {
          type: "text",
          value: data,
        },
      };
    }
  };

  // Fonction pour valider et consommer le QR code
  const validateAndConsumeQR = async (qrData: QRData) => {
    setIsValidating(true);

    try {
      // Simulation d'un appel API pour valider et marquer comme consommé
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Vérifier si le QR code est encore valide
      if (!qrData.isValid) {
        Alert.alert(
          "QR Code invalide",
          "Ce QR code a déjà été utilisé ou a expiré."
        );
        return false;
      }

      // Vérifier la limite d'utilisation
      if (
        qrData.metadata?.maxUsage &&
        (qrData.metadata?.usageCount ?? 0) >= qrData.metadata.maxUsage
      ) {
        Alert.alert(
          "Limite atteinte",
          "Ce QR code a atteint sa limite d'utilisation."
        );
        return false;
      }

      // Vérifier l'expiration
      if (
        qrData.metadata?.expiresAt &&
        new Date(qrData.metadata.expiresAt) < new Date()
      ) {
        Alert.alert("QR Code expiré", "Ce QR code a expiré.");
        return false;
      }

      // Marquer comme consommé
      const updatedQRData: QRData = {
        ...qrData,
        isValid: false, // Désactiver après consommation
        metadata: {
          ...qrData.metadata,
          type: qrData.metadata?.type || "unknown",
          value: qrData.metadata?.value || "N/A",
          usageCount: (qrData.metadata?.usageCount || 0) + 1,
        },
      };

      setQrData(updatedQRData);

      Alert.alert(
        "Validation réussie",
        "Le QR code a été validé et consommé avec succès.",
        [{ text: "OK", onPress: () => {} }]
      );

      return true;
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la validation.");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    setIsProcessing(true);
    setScannerVisible(false);

    try {
      const decryptedData = decryptQRData(data);
      if (decryptedData) {
        setQrData(decryptedData);
      } else {
        Alert.alert(
          "Erreur",
          "Impossible de décrypter les données du QR code."
        );
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors du traitement du QR code.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setQrData(null);
    setIsProcessing(false);
    setIsValidating(false);
  };

  const openScanner = () => {
    setScannerVisible(true);
    setScanned(false);
  };

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">
          Demande de permission pour la caméra...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <AlertCircle size={64} color="#ef4444" />
        <Text className="text-xl font-bold text-gray-800 mt-4 text-center">
          Permission caméra refusée
        </Text>
        <Text className="text-gray-600 mt-2 text-center">
          Veuillez autoriser l'accès à la caméra dans les paramètres pour
          utiliser le scanner QR.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white shadow-sm border-b border-gray-200 pt-12 pb-4 px-6">
        <Text className="text-2xl font-bold text-gray-800">
          Scanner QR Code
        </Text>
        <Text className="text-gray-600 mt-1">
          Scannez et validez vos QR codes
        </Text>
      </View>

      <ScrollView className="flex-1 p-6">
        {/* Scanner Button */}
        {!qrData && (
          <TouchableOpacity
            onPress={openScanner}
            disabled={isProcessing}
            className={`bg-blue-500 rounded-xl p-6 items-center shadow-lg ${isProcessing ? "opacity-50" : ""}`}
          >
            <Scan size={48} color="white" />
            <Text className="text-white text-xl font-semibold mt-3">
              {isProcessing ? "Traitement..." : "Scanner un QR Code"}
            </Text>
            <Text className="text-blue-100 mt-1 text-center">
              Appuyez pour ouvrir le scanner
            </Text>
          </TouchableOpacity>
        )}

        {/* QR Data Display */}
        {qrData && (
          <View className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Status Header */}
            <View
              className={`p-4 ${qrData.isValid ? "bg-green-50" : "bg-red-50"}`}
            >
              <View className="flex-row items-center">
                {qrData.isValid ? (
                  <CheckCircle size={24} color="#10b981" />
                ) : (
                  <X size={24} color="#ef4444" />
                )}
                <Text
                  className={`ml-2 font-semibold text-lg ${qrData.isValid ? "text-green-800" : "text-red-800"}`}
                >
                  {qrData.isValid ? "QR Code Valide" : "QR Code Consommé"}
                </Text>
              </View>
            </View>

            {/* Data Content */}
            <View className="p-6">
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  ID
                </Text>
                <Text className="text-gray-800 font-mono text-sm mt-1">
                  {qrData.id}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Type
                </Text>
                <Text className="text-gray-800 font-semibold mt-1">
                  {qrData.metadata?.type || "Non spécifié"}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Valeur
                </Text>
                <Text className="text-gray-800 mt-1">
                  {qrData.metadata?.value || "N/A"}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Scanné le
                </Text>
                <Text className="text-gray-800 mt-1">
                  {new Date(qrData.timestamp).toLocaleString("fr-FR")}
                </Text>
              </View>

              {qrData.metadata?.usageCount !== undefined && (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Utilisation
                  </Text>
                  <Text className="text-gray-800 mt-1">
                    {qrData.metadata.usageCount} /{" "}
                    {qrData.metadata.maxUsage || "∞"}
                  </Text>
                </View>
              )}

              {qrData.metadata?.expiresAt && (
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Expire le
                  </Text>
                  <Text className="text-gray-800 mt-1">
                    {new Date(qrData.metadata.expiresAt).toLocaleString(
                      "fr-FR"
                    )}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View className="flex-row space-x-3">
                {qrData.isValid && (
                  <TouchableOpacity
                    onPress={() => validateAndConsumeQR(qrData)}
                    disabled={isValidating}
                    className={`flex-1 bg-green-500 rounded-lg py-3 px-4 ${isValidating ? "opacity-50" : ""}`}
                  >
                    <Text className="text-white font-semibold text-center">
                      {isValidating
                        ? "Validation..."
                        : "Valider & Désactiver le QR Code"}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={resetScanner}
                  className="flex-1 bg-gray-500 rounded-lg py-3 px-4"
                >
                  <View className="flex-row items-center justify-center">
                    <RefreshCw size={16} color="white" />
                    <Text className="text-white font-semibold ml-2">
                      Nouveau Scan
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Scanner Modal */}
      <Modal
        visible={scannerVisible}
        animationType="slide"
        onRequestClose={() => setScannerVisible(false)}
      >
        <View className="flex-1 bg-black">
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Scanner Overlay */}
          <View className="flex-1 justify-center items-center">
            <View className="absolute top-12 left-6 right-6 flex-row justify-between items-center">
              <Text className="text-white text-lg font-semibold">
                Scanner QR Code
              </Text>
              <TouchableOpacity
                onPress={() => setScannerVisible(false)}
                className="bg-black/50 rounded-full p-2"
              >
                <X size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Scanner Frame */}
            <View className="w-64 h-64 border-2 border-white rounded-2xl relative">
              <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl" />
              <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl" />
              <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl" />
              <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-2xl" />
            </View>

            <Text className="text-white text-center mt-8 px-8">
              Positionnez le QR code dans le cadre pour le scanner
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

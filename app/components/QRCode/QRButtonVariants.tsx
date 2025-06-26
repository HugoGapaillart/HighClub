
import React from 'react';
import { View } from 'react-native';
import { QRButton } from './QRButton';

// Exemples d'utilisation avec différents styles
export const QRButtonExamples = () => {
  return (
    <View className="flex-row flex-wrap justify-around items-center p-5 gap-4">
      {/* Bouton standard */}
      <QRButton
        data="https://github.com"
        size={50}
        iconSize={24}
      />

      {/* Bouton plus grand */}
      <QRButton
        data="mailto:contact@example.com"
        size={60}
        iconSize={28}
        buttonClassName="bg-emerald-500"
      />

      {/* Bouton avec style personnalisé */}
      <QRButton
        data="tel:+33123456789"
        size={45}
        iconSize={22}
        buttonClassName="bg-violet-500 rounded-full"
        qrSize={180}
      />

      {/* Bouton outline */}
      <QRButton
        data="WIFI:T:WPA;S:MonWiFi;P:motdepasse123;;"
        size={50}
        iconSize={24}
        buttonClassName="bg-transparent border-2 border-blue-500"
      />

      {/* Petit bouton */}
      <QRButton
        data="Bonjour le monde!"
        size={40}
        iconSize={20}
        buttonClassName="bg-red-500 rounded-lg"
      />
    </View>
  );
};
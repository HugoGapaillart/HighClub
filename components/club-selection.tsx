import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { ChevronDown, X, CheckCircle } from "lucide-react-native";

type Club = {
  id: string;
  name: string;
  address: string;
  logo: string | null;
};

type ClubSelectorProps = {
  clubs: Club[];
  selectedClub: Club | null;
  onSelectClub: (clubId: string) => void;
  style?: any;
  placeholder?: string;
};

const { width } = Dimensions.get("window");

export const ClubSelector = ({
  clubs,
  selectedClub,
  onSelectClub,
  style,
  placeholder = "Sélectionner un club",
}: ClubSelectorProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleClubSelect = (clubId: string) => {
    onSelectClub(clubId);
    setModalVisible(false);
  };

  if (clubs.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.placeholder}>Aucun club disponible</Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.clubInfo}>
          {selectedClub?.logo && (
            <Image source={{ uri: selectedClub.logo }} style={styles.logo} />
          )}
          <Text style={styles.clubName} numberOfLines={1}>
            {selectedClub?.name || placeholder}
          </Text>
        </View>
        <ChevronDown size={20} color="black" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choisir un club</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={20} color="black" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={clubs}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.clubItem,
                      selectedClub?.id === item.id && styles.selectedClub,
                    ]}
                    onPress={() => handleClubSelect(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.clubItemContent}>
                      {item.logo && (
                        <Image
                          source={{ uri: item.logo }}
                          style={styles.itemLogo}
                        />
                      )}
                      <View style={styles.clubTextInfo}>
                        <Text style={styles.clubItemName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.clubAddress} numberOfLines={1}>
                          {item.address}
                        </Text>
                      </View>
                    </View>
                    {selectedClub?.id === item.id && (
                        <CheckCircle size={20} color="green" />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clubInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
  },
  clubName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  placeholder: {
    fontSize: 16,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f4",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  clubItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  clubItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedClub: {
    backgroundColor: "#f0f8ff",
  },
  itemLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 16,
  },
  clubTextInfo: {
    flex: 1,
  },
  clubItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  clubAddress: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#f1f3f4",
    marginLeft: 76,
  },
});

import { useState } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, Image, StatusBar } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: "active" | "inactive"
  avatar: string
  location: string
  joinDate: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+33 6 12 34 56 78",
    role: "Administrateur",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    location: "Paris, France",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Pierre Martin",
    email: "pierre.martin@email.com",
    phone: "+33 6 87 65 43 21",
    role: "Utilisateur",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    location: "Lyon, France",
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Sophie Laurent",
    email: "sophie.laurent@email.com",
    phone: "+33 6 11 22 33 44",
    role: "Modérateur",
    status: "inactive",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    location: "Marseille, France",
    joinDate: "2024-03-10",
  },
  {
    id: "4",
    name: "Thomas Moreau",
    email: "thomas.moreau@email.com",
    phone: "+33 6 55 66 77 88",
    role: "Utilisateur",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    location: "Toulouse, France",
    joinDate: "2024-04-05",
  },
]

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [menuUser, setMenuUser] = useState<User | null>(null)

  // Formulaire pour nouvel utilisateur
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
    setIsMenuVisible(false)
  }

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: "Utilisateur",
        status: "active",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
        location: "France",
        joinDate: new Date().toISOString().split("T")[0],
      }
      setUsers([...users, user])
      setNewUser({ name: "", email: "", phone: "" })
      setIsAddModalVisible(false)
    }
  }

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Administrateur":
        return "bg-red-100 border-red-200"
      case "Modérateur":
        return "bg-blue-100 border-blue-200"
      default:
        return "bg-gray-100 border-gray-200"
    }
  }

  const getRoleTextStyle = (role: string) => {
    switch (role) {
      case "Administrateur":
        return "text-red-800"
      case "Modérateur":
        return "text-blue-800"
      default:
        return "text-gray-700"
    }
  }

  const getStatusBadgeStyle = (status: string) => {
    return status === "active" ? "bg-green-100 border-green-200" : "bg-gray-100 border-gray-200"
  }

  const getStatusTextStyle = (status: string) => {
    return status === "active" ? "text-green-800" : "text-gray-600"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const UserCard = ({ user }: { user: User }) => (
    <View className="bg-white rounded-xl mb-3 shadow-sm border border-gray-100">
      <View className="p-4 flex-row items-start">
        {/* Avatar et infos principales */}
        <View className="flex-1 flex-row gap-3">
          <View className="items-center">
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} className="w-12 h-12 rounded-full" />
            ) : (
              <View className="w-12 h-12 rounded-full bg-blue-100 justify-center items-center">
                <Text className="text-blue-600 font-semibold text-base">{getInitials(user.name)}</Text>
              </View>
            )}
          </View>

          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-base font-semibold text-gray-900 flex-1" numberOfLines={1}>
                {user.name}
              </Text>
              <View className={`px-2 py-1 rounded-full border ${getStatusBadgeStyle(user.status)}`}>
                <Text className={`text-xs font-medium ${getStatusTextStyle(user.status)}`}>
                  {user.status === "active" ? "Actif" : "Inactif"}
                </Text>
              </View>
            </View>

            <View className="mb-2">
              <View className={`px-2 py-1 rounded-full border self-start ${getRoleBadgeStyle(user.role)}`}>
                <Text className={`text-xs font-medium ${getRoleTextStyle(user.role)}`}>{user.role}</Text>
              </View>
            </View>

            <View className="gap-1">
              <Text className="text-sm text-gray-600" numberOfLines={1}>
                ✉️ {user.email}
              </Text>
              <Text className="text-sm text-gray-600">📞 {user.phone}</Text>
              <Text className="text-sm text-gray-600">📍 {user.location}</Text>
            </View>
          </View>
        </View>

        {/* Menu actions */}
        <TouchableOpacity
          className="p-2"
          onPress={() => {
            setMenuUser(user)
            setIsMenuVisible(true)
          }}
        >
          <Text className="text-xl text-gray-500 font-bold">⋮</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 py-4">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-blue-100 rounded-lg justify-center items-center">
                <Text className="text-xl">👥</Text>
              </View>
              <View>
                <Text className="text-xl font-bold text-gray-900">Utilisateurs</Text>
                <Text className="text-sm text-gray-500">{users.length} utilisateurs</Text>
              </View>
            </View>

            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg" onPress={() => setIsAddModalVisible(true)}>
              <Text className="text-white font-semibold text-sm">+ Ajouter</Text>
            </TouchableOpacity>
          </View>

          {/* Barre de recherche */}
          <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-200 px-3">
            <Text className="text-base mr-2">🔍</Text>
            <TextInput
              className="flex-1 py-3 text-base text-gray-900"
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity className="p-1">
              <Text className="text-base">⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Liste des utilisateurs */}
        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}

          {filteredUsers.length === 0 && (
            <View className="items-center py-12">
              <Text className="text-5xl mb-4">👥</Text>
              <Text className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur trouvé</Text>
              <Text className="text-sm text-gray-500">Essayez de modifier votre recherche</Text>
            </View>
          )}
        </ScrollView>

        {/* Modal d'ajout */}
        <Modal visible={isAddModalVisible} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row justify-between items-center px-4 py-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Text className="text-base text-gray-600">Annuler</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-gray-900">Nouvel utilisateur</Text>
              <TouchableOpacity onPress={handleAddUser}>
                <Text className="text-base text-blue-600 font-semibold">Créer</Text>
              </TouchableOpacity>
            </View>

            <View className="p-4 gap-5">
              <View className="gap-2">
                <Text className="text-base font-medium text-gray-900">Nom complet</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
                  placeholder="Nom et prénom"
                  value={newUser.name}
                  onChangeText={(text) => setNewUser({ ...newUser, name: text })}
                />
              </View>

              <View className="gap-2">
                <Text className="text-base font-medium text-gray-900">Email</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
                  placeholder="email@exemple.com"
                  value={newUser.email}
                  onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="gap-2">
                <Text className="text-base font-medium text-gray-900">Téléphone</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
                  placeholder="+33 6 12 34 56 78"
                  value={newUser.phone}
                  onChangeText={(text) => setNewUser({ ...newUser, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Modal menu actions */}
        <Modal visible={isMenuVisible} transparent={true} animationType="fade">
          <TouchableOpacity
            className="flex-1 bg-black/50 justify-center items-center"
            onPress={() => setIsMenuVisible(false)}
          >
            <View className="bg-white rounded-xl min-w-[200px] overflow-hidden">
              <TouchableOpacity
                className="px-4 py-4 border-b border-gray-100"
                onPress={() => {
                  setSelectedUser(menuUser)
                  setIsMenuVisible(false)
                  setIsEditModalVisible(true)
                }}
              >
                <Text className="text-base text-gray-900">✏️ Modifier</Text>
              </TouchableOpacity>

              <TouchableOpacity className="px-4 py-4" onPress={() => menuUser && handleDeleteUser(menuUser.id)}>
                <Text className="text-base text-red-600">🗑️ Supprimer</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Modal d'édition */}
        <Modal visible={isEditModalVisible} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row justify-between items-center px-4 py-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Text className="text-base text-gray-600">Annuler</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-gray-900">Modifier</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Text className="text-base text-blue-600 font-semibold">Sauver</Text>
              </TouchableOpacity>
            </View>

            <View className="p-4 gap-5">
              <View className="gap-2">
                <Text className="text-base font-medium text-gray-900">Nom complet</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
                  defaultValue={selectedUser?.name}
                />
              </View>

              <View className="gap-2">
                <Text className="text-base font-medium text-gray-900">Email</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
                  defaultValue={selectedUser?.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="gap-2">
                <Text className="text-base font-medium text-gray-900">Téléphone</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
                  defaultValue={selectedUser?.phone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

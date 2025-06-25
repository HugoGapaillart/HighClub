import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import ProfilEdit from "@/app/components/profil-edit";

export default function Profile() {
  const { signOut, session } = useAuth();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch user profile data
      supabase
        .from("profile")
        .select("firstname, lastname, email, phone, loyalty_points")
        .eq("id", session.user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching user profile:", error.message);
            return;
          }
          if (data) {
            setFirstName(data.firstname);
            setLastName(data.lastname);
            setEmail(data.email);
            setPhone(data.phone);
            setLoyaltyPoints(data.loyalty_points);
          }
        });
    }
  }, [session]);

  return (
    <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
      <H1 className="text-center">Profil</H1>
      <Text className="text-white">
        {firstName} {lastName}
      </Text>
      <Text className="text-white">{loyaltyPoints}</Text>
      <ProfilEdit />
      <Button
        className="w-full bg-red-600"
        size="default"
        variant="default"
        onPress={async () => {
          await signOut();
        }}
      >
        <Text className="text-white">Sign Out</Text>
      </Button>
    </View>
  );
}

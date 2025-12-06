import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MenuScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams(); // Get the role parameter

  const isAdmin = role === "admin";

  return (
    <LinearGradient colors={["#D5F4DF", "#68952A"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Menu</Text>

        <View style={{ width: 30 }} />
      </View>

      {/* Menu Buttons */}
      <View style={styles.menuList}>
        {isAdmin && (
          <MenuButton
            icon="medkit-outline"
            label="Healthy & Prescription"
            onPress={() => router.push("/mn_test")}
          />
        )}
        <MenuButton
          icon="time-outline"
          label="Recent"
          onPress={() => router.push("/mn_recent")}
        />
        <MenuButton
          icon="cloud-upload-outline"
          label="My Uploads"
          onPress={() => router.push("/mn_uploads")}
        />
        <MenuButton
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => router.push("/mn_help")}
        />
        <MenuButton
          icon="information-circle-outline"
          label="About"
          onPress={() => router.push("/mn_about")}
        />
        <MenuButton
          icon="exit-outline"
          label="Exit"
          onPress={() => router.replace("/")}
        />
      </View>
    </LinearGradient>
  );
}

// Menu Button Component
const MenuButton = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <Ionicons name={icon} size={26} color="#2d5016" />
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2d5016",
  },
  menuList: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffaa",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 14,
    marginBottom: 12,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight: "600",
    color: "#2d5016",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleNextPress = () => {
    setShowUserTypeModal(true);
  };

  const handleUserTypeSelect = (type: any) => {
    setShowUserTypeModal(false);
    if (type === "admin") {
      setShowAdminLogin(true);
    } else {
      router.push({
        pathname: "/home",
        params: { role: "user" },
      });
    }
  };

  const handleAdminLogin = () => {
    if (username === "admin" && password === "admin") {
      setShowAdminLogin(false);
      setUsername("");
      setPassword("");
      router.push({
        pathname: "/home",
        params: { role: "admin" },
      });
    } else {
      Alert.alert("Error", "Invalid username or password");
    }
  };

  const handleCancelLogin = () => {
    setShowAdminLogin(false);
    setUsername("");
    setPassword("");
  };

  return (
    <LinearGradient colors={["#D5F4DF", "#68952A"]} style={styles.container}>
      <Image
        source={require("../../assets/images/SLfinalLogo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>SmartLeaf</Text>
      <Text style={styles.subtitle}>Mango Leaf Disease Detection</Text>

      <Text style={styles.welcome}>Welcome!</Text>
      <Text style={styles.tagline}>Detect Early, Protect Naturally.</Text>

      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Ionicons name="arrow-forward-circle" size={50} color="#2e7d32" />
      </TouchableOpacity>

      {/* User Type Selection Modal */}
      <Modal
        visible={showUserTypeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select User Type</Text>

            <TouchableOpacity
              style={styles.userTypeButton}
              onPress={() => handleUserTypeSelect("normal")}
            >
              <Ionicons name="person" size={24} color="#2e7d32" />
              <Text style={styles.userTypeButtonText}>Normal User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.userTypeButton}
              onPress={() => handleUserTypeSelect("admin")}
            >
              <Ionicons name="shield-checkmark" size={24} color="#2e7d32" />
              <Text style={styles.userTypeButtonText}>Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowUserTypeModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Admin Login Modal */}
      <Modal
        visible={showAdminLogin}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelLogin}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Admin Login</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#2e7d32"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#2e7d32"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleAdminLogin}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelLogin}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: { width: 210, height: 210, resizeMode: "contain", marginBottom: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#1b5e20" },
  subtitle: { fontSize: 14, color: "#388e3c", marginBottom: 30 },
  welcome: { fontSize: 24, fontWeight: "600", color: "#1b5e20" },
  tagline: { fontSize: 16, color: "#388e3c", marginTop: 5, marginBottom: 50 },
  nextButton: { marginTop: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 25,
  },
  userTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D5F4DF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 15,
    width: "100%",
    justifyContent: "center",
  },
  userTypeButtonText: {
    fontSize: 18,
    color: "#1b5e20",
    fontWeight: "600",
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
});

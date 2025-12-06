import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// GitHub API info
const GITHUB_API_URL =
  "https://api.github.com/repos/jraay12/mango-new/contents/api.txt";
const GITHUB_TOKEN = "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"; // <-- Add your token here

const categoriesList = [
  "Healthy",
  "Anthracnose",
  "Bacterial Canker",
  "Cutting Weevil",
  "Die Back",
  "Gall Midge",
  "Powdery Mildew",
  "Sooty Mould",
];

export default function MnTestGithub() {
  const [data, setData] = useState<any>({});
  const [sha, setSha] = useState<string>("");
  const [newPrescription, setNewPrescription] = useState<any>({});

  // Load GitHub file
  const loadFromGithub = async () => {
    try {
      const res = await fetch(GITHUB_API_URL, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      });
      const json = await res.json();
      setSha(json.sha);

      const decoded = atob(json.content.replace(/\n/g, ""));
      const parsed = JSON.parse(decoded);

      const merged: any = {};
      categoriesList.forEach((cat) => (merged[cat] = parsed[cat] || []));
      setData(merged);
    } catch (err) {
      console.error("Error loading GitHub file:", err);
      Alert.alert("Error", "Failed to load data from GitHub.");
    }
  };

  // Save updated data to GitHub
  const saveToGithub = async (updatedData: any) => {
    try {
      const content = btoa(JSON.stringify(updatedData, null, 2));
      const res = await fetch(GITHUB_API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
          message: "Updated prescriptions via React Native",
          content,
          sha,
        }),
      });
      const result = await res.json();
      if (result.content) {
        Alert.alert("Success", "GitHub file updated!");
        await loadFromGithub();
      } else {
        throw new Error("GitHub update failed");
      }
    } catch (err) {
      console.error("Error updating GitHub file:", err);
      Alert.alert("Error", "Failed to update GitHub file.");
    }
  };

  useEffect(() => {
    loadFromGithub();
  }, []);

  // Add or update prescription
  const handleAddPrescription = async (category: string) => {
    const item = newPrescription[category];
    if (!item || item.trim() === "") return;

    const updated = { ...data };
    updated[category] = [...updated[category], item]; // add new item

    setData(updated);
    setNewPrescription((prev: any) => ({ ...prev, [category]: "" }));
    await saveToGithub(updated);
  };

  // Edit existing prescription
  const handleEditPrescription = (category: string, index: number) => {
    Alert.prompt(
      "Edit Prescription",
      "",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: async (text: any) => {
            if (!text) return;
            const updated = { ...data };
            updated[category][index] = text;
            setData(updated);
            await saveToGithub(updated);
          },
        },
      ],
      "plain-text",
      data[category][index]
    );
  };

  // Delete prescription
  const handleDeletePrescription = (category: string, index: number) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = { ...data };
          updated[category].splice(index, 1);
          setData(updated);
          await saveToGithub(updated);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {categoriesList.map((category) => (
        <View key={category} style={styles.categoryCard}>
          <Text style={styles.categoryTitle}>{category}</Text>

          {data[category] && data[category].length > 0 ? (
            data[category].map((item: string, index: number) => (
              <View key={index} style={styles.prescriptionRow}>
                <Text style={styles.prescriptionText}>{item}</Text>
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    onPress={() => handleEditPrescription(category, index)}
                    style={{ marginRight: 10 }}
                  >
                    <Ionicons name="pencil-outline" size={22} color="#2d5016" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeletePrescription(category, index)}
                  >
                    <Ionicons name="trash-outline" size={22} color="#b00020" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noPrescriptions}>No prescriptions yet.</Text>
          )}

          {/* Add new prescription */}
          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              placeholder="Add prescription..."
              value={newPrescription[category] || ""}
              onChangeText={(text) =>
                setNewPrescription((prev: any) => ({
                  ...prev,
                  [category]: text,
                }))
              }
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => handleAddPrescription(category)}
            >
              <Ionicons name="add-circle-outline" size={32} color="#2d5016" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#e8f5e9",
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d5016",
    marginBottom: 10,
  },
  prescriptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    alignItems: "center",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  prescriptionText: {
    fontSize: 16,
    flex: 1,
  },
  noPrescriptions: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
    marginBottom: 6,
  },
  addRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  addBtn: {
    marginLeft: 10,
  },
});

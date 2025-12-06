import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";

const fileUri = `${FileSystem.documentDirectory}disease_prescriptions.txt`;
const GITHUB_API_URL =
  "https://api.github.com/repos/jraay12/mango-disease/contents/api.txt";
// const GITHUB_TOKEN = "YOUR_TOKEN_HERE"; // Optional if you need to push

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const imageUri = params.imageUri as string;
  const prediction = params.prediction as string;
  const confidence = parseFloat(params.confidence as string);

  const [prescriptions, setPrescriptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load prescriptions from GitHub or local file
  const loadPrescriptions = async () => {
    try {
      setLoading(true);

      // Try fetching from GitHub
      const res = await fetch(GITHUB_API_URL);
      const json = await res.json();
      let data: any = {};
      if (json.content) {
        const decoded = atob(json.content.replace(/\n/g, "")); // decode base64
        data = JSON.parse(decoded);

        // Cache to local file for offline use
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2));
      } else {
        // fallback to local file
        const info = await FileSystem.getInfoAsync(fileUri);
        if (info.exists) {
          const text = await FileSystem.readAsStringAsync(fileUri);
          data = JSON.parse(text);
        }
      }

      const diseasePrescriptions = data[prediction] || [];
      setPrescriptions(diseasePrescriptions);
    } catch (err) {
      console.error("Error loading prescriptions:", err);

      // fallback to local file
      try {
        const info = await FileSystem.getInfoAsync(fileUri);
        if (info.exists) {
          const text = await FileSystem.readAsStringAsync(fileUri);
          const data = JSON.parse(text);
          const diseasePrescriptions = data[prediction] || [];
          setPrescriptions(diseasePrescriptions);
        } else {
          setPrescriptions([]);
        }
      } catch (error) {
        console.error("Error loading local prescriptions:", error);
        setPrescriptions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, [prediction]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrescriptions();
    setRefreshing(false);
  };

  const getDiseaseInfo = (diseaseName: string) => {
    const diseaseData: {
      [key: string]: {
        description: string;
        symptoms: string[];
        causes: string;
        severity: "low" | "medium" | "high";
      };
    } = {
      Healthy: {
        description:
          "The leaf appears to be healthy with no visible signs of disease or pest damage.",
        symptoms: [
          "Green, vibrant leaf color",
          "No spots, lesions, or discoloration",
          "Proper leaf structure and shape",
          "No signs of wilting or damage",
        ],
        causes: "Good plant health maintenance and proper care.",
        severity: "low",
      },
      Anthracnose: {
        description:
          "A fungal disease caused by Colletotrichum gloeosporioides that causes dark, sunken lesions on leaves, stems, and fruits.",
        symptoms: [
          "Dark brown to black spots on leaves",
          "Sunken lesions with defined borders",
          "Premature leaf drop",
          "Black spots on fruits",
          "Die-back of young shoots",
        ],
        causes:
          "Caused by fungal infection, spread through water splash, high humidity, and warm temperatures.",
        severity: "high",
      },
      "Bacterial Canker": {
        description:
          "Bacterial infection caused by Xanthomonas campestris causing cankers, lesions, and dieback on mango plants.",
        symptoms: [
          "Water-soaked lesions on leaves",
          "Dark brown to black cankers on stems",
          "Gummy exudates from infected areas",
          "Leaf spots with yellow halos",
          "Progressive wilting and dieback",
        ],
        causes:
          "Bacterial infection spread through rain, wind, pruning tools, and insect wounds.",
        severity: "high",
      },
      "Cutting Weevil": {
        description:
          "Pest damage caused by mango stem borer weevil (Hypomeces squamosus) larvae that bore into young shoots and stems.",
        symptoms: [
          "Wilting of young shoots",
          "Holes in stems with frass outside",
          "Yellowing and drooping of leaves",
          "Stunted growth of affected shoots",
          "Dead and dried young branches",
        ],
        causes:
          "Adult weevils lay eggs in stem tissue; larvae bore into stems causing damage.",
        severity: "medium",
      },
      "Die Back": {
        description:
          "Progressive death of shoots, branches, and twigs starting from the tip and moving backwards, caused by Lasiodiplodia theobromae fungus.",
        symptoms: [
          "Drying of twigs from tip downwards",
          "Browning and withering of leaves",
          "Black discoloration under bark",
          "Gum exudation from affected areas",
          "Complete death of branches in severe cases",
        ],
        causes:
          "Fungal infection favored by water stress, poor drainage, and nutrient deficiency.",
        severity: "high",
      },
      "Gall Midge": {
        description:
          "Insect pest (Procontarinia matteiana) that causes abnormal growths (galls) on leaves, flowers, and young fruits.",
        symptoms: [
          "Cone-shaped galls on leaf surfaces",
          "Distorted and curled leaves",
          "Small white larvae inside galls",
          "Reduced flowering and fruiting",
          "Premature dropping of affected leaves",
        ],
        causes:
          "Adult midges lay eggs in tender plant tissue; larvae develop inside causing gall formation.",
        severity: "medium",
      },
      "Powdery Mildew": {
        description:
          "Fungal disease caused by Oidium mangiferae appearing as white powdery coating on leaves, flowers, and young fruits.",
        symptoms: [
          "White powdery coating on leaf surfaces",
          "Affected leaves become pale and distorted",
          "Flower infection leads to poor fruit set",
          "Young fruits covered with white powder",
          "Premature leaf and fruit drop",
        ],
        causes:
          "Fungal infection favored by dry weather, high humidity at night, and moderate temperatures.",
        severity: "medium",
      },
      "Sooty Mould": {
        description:
          "Black fungal growth on leaves and branches, developing on honeydew secreted by sap-sucking insects like scales, mealybugs, and aphids.",
        symptoms: [
          "Black sooty coating on leaves and stems",
          "Reduced photosynthesis",
          "Sticky honeydew on plant surfaces",
          "Presence of scale insects or mealybugs",
          "Weakened plant growth",
        ],
        causes:
          "Secondary fungal growth on honeydew excreted by sap-sucking insects.",
        severity: "low",
      },
    };
    return (
      diseaseData[diseaseName] || {
        description: "Unknown condition detected. Further examination needed.",
        symptoms: ["Unidentified symptoms"],
        causes: "Unknown cause",
        severity: "medium" as const,
      }
    );
  };

  const diseaseInfo = getDiseaseInfo(prediction);
  const isHealthy = prediction === "Healthy";

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "#22c55e";
      case "medium":
        return "#f59e0b";
      case "high":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "low":
        return "Low Risk";
      case "medium":
        return "Moderate Risk";
      case "high":
        return "High Risk";
      default:
        return "Unknown";
    }
  };

  const handleNewScan = () => {
    router.back();
  };

  return (
    <LinearGradient colors={["#D5F4DF", "#68952A"]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>

        <View
          style={[
            styles.predictionCard,
            isHealthy ? styles.healthyCard : styles.diseaseCard,
          ]}
        >
          <View style={styles.predictionHeader}>
            <Ionicons
              name={isHealthy ? "checkmark-circle" : "alert-circle"}
              size={40}
              color={isHealthy ? "#22c55e" : "#ef4444"}
            />
            <View style={styles.predictionTextContainer}>
              <Text style={styles.predictionLabel}>Diagnosis</Text>
              <Text style={styles.predictionText}>{prediction}</Text>
            </View>
          </View>

          {!isHealthy && (
            <View
              style={[
                styles.severityBadge,
                { backgroundColor: getSeverityColor(diseaseInfo.severity) },
              ]}
            >
              <Ionicons name="warning" size={16} color="#fff" />
              <Text style={styles.severityText}>
                {getSeverityText(diseaseInfo.severity)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color="#2d5016" />
            <Text style={styles.infoTitle}>Description</Text>
          </View>
          <Text style={styles.infoText}>{diseaseInfo.description}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical" size={24} color="#2d5016" />
            <Text style={styles.infoTitle}>Symptoms</Text>
          </View>
          {diseaseInfo.symptoms.map((symptom, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listItemText}>{symptom}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="help-circle" size={24} color="#2d5016" />
            <Text style={styles.infoTitle}>Causes</Text>
          </View>
          <Text style={styles.infoText}>{diseaseInfo.causes}</Text>
        </View>

        <View style={[styles.infoCard, styles.treatmentCard]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medkit" size={24} color="#fff" />
            <Text style={[styles.infoTitle, styles.treatmentTitle]}>
              Treatment Prescriptions
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.loadingText}>Loading prescriptions...</Text>
            </View>
          ) : prescriptions.length > 0 ? (
            prescriptions.map((prescription, index) => (
              <View key={index} style={styles.treatmentItem}>
                <View style={styles.treatmentNumber}>
                  <Text style={styles.treatmentNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.treatmentItemText}>{prescription}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noPrescriptionsContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="#fff" />
              <Text style={styles.noPrescriptionsText}>
                No treatment prescriptions available for this condition yet.
              </Text>
              <Text style={styles.noPrescriptionsSubtext}>
                Consult with an agricultural expert for recommendations.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleNewScan}>
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>New Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.push("/mn_test")}
          >
            <Ionicons name="medkit-outline" size={20} color="#4ade80" />
            <Text style={styles.secondaryButtonText}>Manage Treatments</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </LinearGradient>
  );
}

// Keep your existing styles...

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d5016",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  predictionCard: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  healthyCard: {
    backgroundColor: "#f0fdf4",
  },
  diseaseCard: {
    backgroundColor: "#fef2f2",
  },
  predictionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  predictionTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  predictionLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  predictionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 15,
    gap: 6,
  },
  severityText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d5016",
  },
  infoText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 22,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  bulletPoint: {
    fontSize: 18,
    color: "#4ade80",
    fontWeight: "bold",
    marginTop: -2,
  },
  listItemText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
    flex: 1,
  },
  treatmentCard: {
    backgroundColor: "#2d5016",
  },
  treatmentTitle: {
    color: "#fff",
  },
  treatmentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    gap: 12,
  },
  treatmentNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4ade80",
    justifyContent: "center",
    alignItems: "center",
  },
  treatmentNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  treatmentItemText: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
    flex: 1,
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: {
    color: "#fff",
    fontSize: 14,
  },
  noPrescriptionsContainer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
  },
  noPrescriptionsText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  noPrescriptionsSubtext: {
    color: "#d1d5db",
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    margin: 20,
    marginTop: 0,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4ade80",
    paddingVertical: 15,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4ade80",
  },
  secondaryButtonText: {
    color: "#4ade80",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpace: {
    height: 40,
  },
});
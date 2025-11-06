import React, { useState, useEffect } from "react";
import {View,Text,StyleSheet,ScrollView,TextInput,TouchableOpacity,Switch,Alert,Modal,FlatList,SafeAreaView,Image,ActivityIndicator,LayoutAnimation,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const workerInfo = {
  services: [
    {
      name: "Yaparista",
      rate: "300",
      description: "Fixing light electricals and small repairs.",
    },
    {
      name: "Plumber",
      rate: "500",
      description: "Pipe maintenance and leak repairs.",
    },
  ],
};

// --- Masking Helpers ---
const maskPhone = (phone) => {
  if (!phone) return "N/A";
  return phone.replace(/\d(?=\d{3})/g, "*");
};

const maskEmail = (email) => {
  if (!email || !email.includes("@")) return "N/A";
  const [user, domain] = email.split("@");
  const maskedUser = user[0] + "*".repeat(Math.max(user.length - 2, 1)) + user.slice(-1);
  return `${maskedUser}@${domain}`;
};


export default function MyServiceScreen({ navigation }) {
  const [isOnline, setIsOnline] = useState(true);
  const [selectedService, setSelectedService] = useState(workerInfo.services[0]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSaveChanges = () => {
    Alert.alert("Saved", "Your service details have been updated successfully.");
    setIsEditing(false);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setShowServiceModal(false);
  };

  const toggleEdit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing((prev) => !prev);
  };

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const fakeClients = [
          {
            id: 1,
            name: "Jeremy Albuera",
            email: "albuera@gmail.com",
            phone: "09123456789",
            service: "Yaparista",
            budget: "₱300",
            date: "10-18-2025",
            time: "9:00AM - 12:00PM",
            location: "Zone 2, Albuera, Leyte",
            note: "Please arrive early and bring materials.",
            photo: null,
          },
          {
            id: 2,
            name: "Maria Santos",
            email: "maria@gmail.com",
            phone: "09999999999",
            service: "Plumber",
            budget: "₱500",
            date: "10-20-2025",
            time: "1:00PM - 3:00PM",
            location: "Barangay 2, Street 10",
            note: "Urgent repair needed.",
            photo: null,
          },
          {
            id: 3,
            name: "Bogart Balagtas",
            email: "bogart@gmail.com",
            phone: "09999999999",
            service: "Eletrical",
            budget: "₱400",
            date: "10-20-2025",
            time: "1:00PM - 2:00PM",
            location: "Barangay 2, Street 10",
            note: "Urgent repair needed.",
            photo: null,
          },
          
          
        ];
        setClients(fakeClients);
      } catch (err) {
        console.log("Error loading clients:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

    const confirmAccept = (client) => {
    Alert.alert(
      "Confirm Acceptance",
      `Are you sure you want to accept ${client.name}'s request for ${client.service}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Accept",
          style: "default",
          onPress: () => handleAccept(client),
        },
      ]
    );
  };

  const handleAccept = (client) => {
    Alert.alert("Request Accepted", `You accepted ${client.name}'s request.`, [
      {
        text: "OK",
        onPress: () => navigation.navigate("ClientAccepted", { client }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* STATUS CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>My Status</Text>
          <View style={styles.statusRow}>
            <Text style={[styles.statusText, { color: isOnline ? "#2E7D32" : "#777" }]}>
              {isOnline ? "Online" : "Offline"}
            </Text>
            <Switch
              trackColor={{ false: "#ccc", true: "#f1b7e2" }}
              thumbColor={isOnline ? "#c20884" : "#f4f3f4"}
              ios_backgroundColor="#ccc"
              onValueChange={() => setIsOnline((prev) => !prev)}
              value={isOnline}
            />
          </View>
        </View>

        {/* SERVICE SETTINGS */}
        <View style={styles.card}>
          <View style={styles.editHeader}>
            <Text style={styles.sectionTitle}>Service Information</Text>
            <TouchableOpacity onPress={toggleEdit}>
              <Ionicons
                name={isEditing ? "close-circle" : "create-outline"}
                size={22}
                color="#c20884"
              />
            </TouchableOpacity>
          </View>

          {/* Display Mode */}
          {!isEditing && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Service:</Text> {selectedService.name}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Rate:</Text> ₱{selectedService.rate}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Description:</Text> {selectedService.description}
              </Text>
            </View>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <View style={{ marginTop: 10 }}>
              {workerInfo.services.length > 1 && (
                <>
                  <Text style={styles.label}>Service</Text>
                  <TouchableOpacity style={styles.picker} onPress={() => setShowServiceModal(true)}>
                    <Text style={styles.pickerText}>{selectedService.name}</Text>
                    <Ionicons name="chevron-down" size={20} color="#555" />
                  </TouchableOpacity>
                </>
              )}

              <Text style={styles.label}>Service Rate (₱)</Text>
              <TextInput
                style={styles.input}
                value={selectedService.rate}
                onChangeText={(text) => setSelectedService({ ...selectedService, rate: text })}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={selectedService.description}
                onChangeText={(text) => setSelectedService({ ...selectedService, description: text })}
                multiline
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* WAITING CLIENTS */}
        <Text style={styles.sectionTitle}>Waiting Clients</Text>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#c20884" />
            <Text style={{ color: "#555", marginTop: 10 }}>Loading clients...</Text>
          </View>
        ) : clients.length === 0 ? (
          <Text style={styles.noData}>No client requests found.</Text>
        ) : (
            clients.map((item) => {
            const maskedEmail = maskEmail(item.email);
            const maskedPhone = maskPhone(item.phone);

            return (
              <View key={item.id} style={styles.clientCard}>
                <View style={styles.profileHeader}>
                  <Image
                    source={item.photo ? { uri: item.photo } : require("../assets/default-profile.png")}
                    style={styles.avatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.info}>{maskedEmail}</Text>
                    <Text style={styles.info}>{maskedPhone}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.details}>
                  <Detail icon="briefcase-outline" label="Service Needed" value={item.service} />
                  <Detail icon="cash-outline" label="Budget" value={item.budget} />
                  <Detail icon="calendar-outline" label="Date Required" value={item.date} />
                  <Detail icon="time-outline" label="Preferred Time" value={item.time} />
                  <Detail icon="location-outline" label="Location" value={item.location} />
                  {item.note && <Detail icon="document-text-outline" label="Note" value={item.note} />}
                </View>

                <View style={styles.buttonRow}>
                   <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => confirmAccept(item)}
                >
                  <Text style={styles.acceptText}>Accept Request</Text>
                </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* MODAL: Select Service */}
      <Modal visible={showServiceModal} transparent animationType="fade" onRequestClose={() => setShowServiceModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select a Service</Text>
            <FlatList
              data={workerInfo.services}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    item.name === selectedService.name && styles.modalItemSelected,
                  ]}
                  onPress={() => handleSelectService(item)}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      item.name === selectedService.name && { color: "#c20884" },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* Reusable Detail Row */
const Detail = ({ label, value, icon }) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon} size={16} color="#c20884" style={{ marginRight: 8 }} />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8", paddingHorizontal: 18, paddingTop: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  editHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  statusText: { fontSize: 16, fontWeight: "500" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 10 },
  label: { fontSize: 14, color: "#444", fontWeight: "600", marginTop: 14, marginBottom: 5 },
  input: { backgroundColor: "#F3F3F3", borderRadius: 8, padding: 12, fontSize: 15, color: "#333" },
  multilineInput: { height: 100, textAlignVertical: "top" },
  saveButton: { backgroundColor: "#c20884", borderRadius: 10, paddingVertical: 14, marginTop: 18, alignItems: "center" },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  bold: { fontWeight: "700" },
  detailText: { fontSize: 15, color: "#333", marginBottom: 6 },
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 8,
    padding: 12,
  },
  pickerText: { fontSize: 15, color: "#333" },
  clientCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  profileHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: { width: 55, height: 55, borderRadius: 28, backgroundColor: "#eee", marginRight: 12 },
  name: { fontSize: 16, fontWeight: "700", color: "#333" },
  info: { fontSize: 13, color: "#666" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 5, flexWrap: "wrap" },
  detailLabel: { fontSize: 14, fontWeight: "600", color: "#444", width: 130 },
  detailValue: { fontSize: 14, color: "#333", flexShrink: 1 },
  buttonRow: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  button: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderRadius: 25, paddingHorizontal: 40 },
  acceptButton: {flexDirection: "row",alignItems: "center",justifyContent: "center",backgroundColor: "#4CAF50",borderRadius: 25,paddingVertical: 10,paddingHorizontal: 20,marginTop: 10,},
  acceptText: { color: "#fff", fontWeight: "600", fontSize: 15, marginLeft: 6 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15, marginLeft: 6 },
  noData: { textAlign: "center", color: "#777", marginVertical: 30, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "85%", backgroundColor: "#fff", borderRadius: 12, padding: 20, maxHeight: "70%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#222" },
  modalItem: { paddingVertical: 15 },
  modalItemSelected: { backgroundColor: "#f9e3f2", borderRadius: 6 },
  modalItemText: { fontSize: 16, color: "#333" },
});

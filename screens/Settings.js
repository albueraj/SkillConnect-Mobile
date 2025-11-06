import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Settings({ navigation, setIsLoggedIn }) {
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }], // Redirect to Home after logout
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Account Section */}
      <Text style={styles.sectionHeader}>Account</Text>

      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("VerifyPhoneForPassword")}>
        <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon}/>
        <Text style={styles.label}>Change Password</Text>
        <Ionicons name="chevron-forward" size={18} color="#999" style={styles.chevron}/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("Notification")}>
        <Ionicons name="notifications-outline" size={20} color="#333" style={styles.icon}/>
        <Text style={styles.label}>Notification</Text>
        <Ionicons name="chevron-forward" size={18} color="#999" style={styles.chevron}/>
      </TouchableOpacity>

      {/* About Section */}
      <Text style={styles.sectionHeader}>About</Text>

      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("TermsPolicies")}>
        <Ionicons name="document-text-outline" size={20} color="#333" style={styles.icon}/>
        <Text style={styles.label}>Terms & Policies</Text>
        <Ionicons name="chevron-forward" size={18} color="#999" style={styles.chevron}/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <Ionicons name="information-circle-outline" size={20} color="#333" style={styles.icon}/>
        <Text style={styles.label}>About Us</Text>
        <Ionicons name="chevron-forward" size={18} color="#999" style={styles.chevron}/>
      </TouchableOpacity>

      {/* Log out */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f1eceaff",
    fontWeight: "600",
    color: "#555"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
  },
  icon: { marginRight: 12 },
  label: { flex: 1, fontSize: 14, paddingVertical: 14, color: "#333" },
  chevron: {},
  logoutBtn: {
    marginTop: 30,
    alignItems: "center",
  },
  logoutText: {
    color: "red",
    fontSize: 16,
    fontWeight: "600",
  },
});

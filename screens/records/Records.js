import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Records({ navigation, route }) {
  // Determine user role (client or worker)
  const role = route?.params?.role || "client";

  // State for tabs and search
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // --- Client Records ---
  const clientOrders = [
    {
      id: "1",
      date: "Oct 18, 10:30 AM",
      address: "Blk 7 Lot 3, Brgy. San Isidro, Quezon City",
      worker: "Miguel Reyes",
      type: "Plumbing",
      price: "₱400.00",
      status: "Working",
    },
    {
      id: "2",
      date: "Oct 12, 1:15 PM",
      address: "Unit 8, Greenview Residences",
      worker: "Maria Santos",
      type: "House Cleaning",
      price: "₱350.00",
      status: "Completed",
    },
    {
      id: "3",
      date: "Oct 10, 9:00 AM",
      address: "Zone 2, Brgy. San Miguel, Manila",
      worker: "Carlo Dizon",
      type: "Carpentry",
      price: "₱600.00",
      status: "Cancelled",
    },
    {
      id: "4",
      date: "Sep 29, 4:20 PM",
      address: "Sta. Rosa Village",
      worker: "Jessa Bautista",
      type: "Gardening",
      price: "₱250.00",
      status: "Completed",
    },
  ];

  // --- Worker Records ---
  const workerOrders = [
    {
      id: "1",
      date: "Oct 19, 1:20 PM",
      address: "Zone 3, Brgy. San Roque, Manila",
      client: "Luis Gomez",
      type: "Electrical",
      price: "₱600.00",
      status: "Working",
    },
    {
      id: "2",
      date: "Oct 15, 9:45 AM",
      address: "Blk 8 Lot 2, Brgy. Mabini, Caloocan",
      client: "Ana Cruz",
      type: "Plumbing",
      price: "₱450.00",
      status: "Completed",
    },
    {
      id: "3",
      date: "Oct 9, 3:30 PM",
      address: "Phase 1, Brgy. San Antonio, Pasig City",
      client: "Jose Perez",
      type: "Painting",
      price: "₱500.00",
      status: "Completed",
    },
  ];

  // Select which data set to use
  const orders = role === "client" ? clientOrders : workerOrders;

  // Tabs for filtering
  const tabs =
    role === "client"
      ? ["All", "Working", "Completed", "Cancelled"]
      : ["All", "Working", "Completed"];

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesTab = selectedTab === "All" || order.status === selectedTab;
    const matchesQuery =
      (order.worker?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.type.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesQuery;
  });

  // Status color indicator
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#4CAF50";
      case "Cancelled":
        return "#E53935";
      case "Working":
        return "#FFC107";
      default:
        return "#9E9E9E";
    }
  };

  // Render each order card
  const renderOrder = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate("OrderDetails", { order: item })}
    >
      <Animated.View
        style={[
          styles.orderCard,
          { borderLeftColor: getStatusColor(item.status) },
        ]}
      >
        <Text style={styles.date}>{item.date}</Text>

        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color="#444" />
          <Text style={styles.address} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.worker}>
              {role === "client" ? item.worker : item.client}
            </Text>
            <Text style={styles.type}>{item.type}</Text>
          </View>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder={
            role === "client"
              ? "Search by address, worker, or type"
              : "Search by address, client, or type"
          }
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[styles.tabText, selectedTab === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <View style={styles.noResultContainer}>
          <Image
            source={require("../../assets/records.png")}
            style={styles.noResultImage}
          />
          <Text style={styles.noResultText}>No records found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F5",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 15,
  },
  searchInput: { flex: 1, fontSize: 14 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeTab: { backgroundColor: "#ce4da3ff" },
  tabText: { fontSize: 13, color: "#777", fontWeight: "500" },
  activeTabText: { color: "#fff", fontWeight: "700" },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
  },
  date: { fontSize: 12, color: "#777", marginBottom: 4 },
  addressRow: { flexDirection: "row", alignItems: "center" },
  address: { fontSize: 12, color: "#555", marginLeft: 5, flex: 1 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  worker: { fontSize: 13, fontWeight: "600" },
  type: { fontSize: 13, color: "#555" },
  price: { fontSize: 14, fontWeight: "700", color: "#222" },
  noResultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultImage: {
    width: 100,
    height: 100,
    opacity: 0.5,
    marginBottom: 10,
  },
  noResultText: { color: "#888", fontSize: 15, fontWeight: "500" },
});

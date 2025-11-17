import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Sample data, replace with API or storage retrieval
    setNotifications([
      {
        id: "1",
        title: "Help us improve our service! ?",
        body: "We value your feedback & would appreciate it if you could take a few minutes to complete this survey...",
        date: "Aug 21",
      },
      {
        id: "2",
        title: "All Deliveries with FREE Insurance!",
        body: "Mula pick-up hanggang drop-off, insured ang bawat delivery mo with no added costs!",
        date: "Jun 19",
      },
    ]);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
      </View>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  item: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    color: "#555",
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginLeft: 8,
    width: 60,
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
});

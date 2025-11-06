import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";
import { sendNotification } from "../helpers/notificationHelper";

/**
 * Unified chat screen for both worker and client.
 * route.params:
 *  - role: "worker" | "client"    // your current user's role
 *  - other: object                // the other party (client object if role=worker, worker object if role=client)
 *
 * Example navigation:
 *  navigation.navigate("UnifiedChat", { role: "worker", other: clientObj })
 */

export default function Chat({ route, navigation }) {
  const { role = "client", other = {} } = route.params || {};
  const isWorker = role === "worker";

  // example initial messages (you'll replace with real data / socket)
  const [messages, setMessages] = useState([
    // depending on role, message senders are "worker" / "client"
    { id: 1, text: isWorker ? "Hello, I’m on my way!" : "Hello! Are you available today?", sender: isWorker ? "worker" : "client" },
    { id: 2, text: isWorker ? "Okay, thank you!" : "Yes, I’m on standby. What time?", sender: isWorker ? "client" : "worker" },
  ]);

  const [input, setInput] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef(null);

  // scroll to bottom on new messages
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // keyboard visibility
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // foreground notification listener (for debugging)
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received:", notification);
    });
    return () => subscription.remove();
  }, []);

  // send text + images
  const handleSend = useCallback(() => {
    if (!input.trim() && selectedImages.length === 0) return;

    // create message object(s)
    if (input.trim()) {
      const newMessage = { id: Date.now(), text: input, sender: isWorker ? "worker" : "client" };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
    }

    if (selectedImages.length > 0) {
      const imageMessages = selectedImages.map((uri, idx) => ({
        id: Date.now() + idx + Math.random(),
        image: uri,
        sender: isWorker ? "worker" : "client",
      }));
      setMessages((prev) => [...prev, ...imageMessages]);
      setSelectedImages([]);
    }

    // simulate reply from the other party (replace with real backend/socket)
    setTimeout(async () => {
      const reply = {
        id: Date.now() + 1,
        text: isWorker ? "Got it! See you soon." : "Got it! I’ll be there soon.",
        sender: isWorker ? "client" : "worker",
      };
      setMessages((prev) => [...prev, reply]);

      // send local/remote notification via helper
      await sendNotification({
        title: `New message from ${isWorker ? "client" : "worker"}`,
        body: reply.text,
      });
    }, 1100);
  }, [input, selectedImages, isWorker]);

  // pick images
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
      });

      // result.canceled (expo-image-picker v14+) OR result.assets depending on SDK
      if (!result.canceled && result.assets) {
        const uris = result.assets.map((a) => a.uri);
        setSelectedImages((prev) => [...prev, ...uris]);
      } else if (result && result.uri) { // fallback older SDK
        setSelectedImages((prev) => [...prev, result.uri]);
      }
    } catch (err) {
      console.log("Pick image error:", err);
    }
  };

  const handleRemoveImage = (uri) => {
    setSelectedImages((prev) => prev.filter((u) => u !== uri));
  };

  // render a message bubble
  const renderMessage = ({ item }) => {
    const senderIsWorker = item.sender === "worker";
    const bubbleIsFromCurrentUser = (isWorker && senderIsWorker) || (!isWorker && !senderIsWorker);

    return (
      <View style={[styles.messageRow, bubbleIsFromCurrentUser ? styles.currentUserRow : styles.otherUserRow]}>
        <View style={[styles.messageBubble, bubbleIsFromCurrentUser ? styles.currentUserBubble : styles.otherUserBubble]}>
          {item.text && <Text style={bubbleIsFromCurrentUser ? styles.currentUserText : styles.otherUserText}>{item.text}</Text>}
          {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
        </View>
      </View>
    );
  };

  // header title and info
  const headerTitle = isWorker ? "Chat with Client" : "Chat with Worker";

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>

        {/* Other party info box */}
        <View style={styles.infoBox}>
          <Image
            source={other?.photo ? { uri: other.photo } : require("../assets/default-profile.png")}
            style={styles.infoImage}
          />
          <View style={styles.infoText}>
            <Text style={styles.infoName}>{other?.name || (isWorker ? "Client Name" : "Worker Name")}</Text>
            {isWorker ? (
              // worker sees client details
              <>
                {other?.service ? <Text style={styles.infoDetail}>Service: {other.service}</Text> : null}
                {other?.budget ? <Text style={styles.infoDetail}>Budget: {other.budget}</Text> : null}
                {other?.location ? <Text style={styles.infoDetail}>Location: {other.location}</Text> : null}
              </>
            ) : (
              // client sees worker details
              <>
                {other?.skill ? <Text style={styles.infoDetail}>Service: {other.skill}</Text> : null}
                {other?.rate ? <Text style={styles.infoDetail}>Rate: ₱{other.rate}</Text> : null}
                {other?.location ? <Text style={styles.infoDetail}>Location: {other.location}</Text> : null}
              </>
            )}
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Selected images preview */}
        {selectedImages.length > 0 && (
          <ScrollView horizontal style={styles.previewContainer} showsHorizontalScrollIndicator={false}>
            {selectedImages.map((uri) => (
              <View key={uri} style={styles.previewBox}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity onPress={() => handleRemoveImage(uri)} style={styles.removeButton}>
                  <Ionicons name="close-circle" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Input bar */}
        <View style={[styles.inputWrapper, { marginBottom: keyboardVisible ? 5 : -15 }]}>
          <TouchableOpacity onPress={handlePickImage} style={styles.imageButton}>
            <Ionicons name="image-outline" size={24} color="#c20884" />
          </TouchableOpacity>

          <TextInput
            placeholder="Type a message..."
            style={styles.input}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />

          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#c20884" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* Styles (merged & simplified) */
const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#F9F9F9" },
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginTop: 10, marginBottom: 6 },
  headerTitle: { fontSize: 18, fontWeight: "700", marginLeft: 12, color: "#333" },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    alignItems: "center",
  },
  infoImage: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  infoText: { flex: 1 },
  infoName: { fontSize: 16, fontWeight: "700" },
  infoDetail: { fontSize: 13, color: "#555", marginTop: 2 },

  messageRow: { flexDirection: "row", marginVertical: 6, paddingHorizontal: 18 },
  currentUserRow: { justifyContent: "flex-end" },
  otherUserRow: { justifyContent: "flex-start" },
  messageBubble: { borderRadius: 18, paddingVertical: 10, paddingHorizontal: 14, maxWidth: "78%" },
  currentUserBubble: { backgroundColor: "#c20884" },
  otherUserBubble: { backgroundColor: "#EAEAEA" },
  currentUserText: { color: "#fff", fontSize: 15 },
  otherUserText: { color: "#000", fontSize: 15 },
  messageImage: { width: 150, height: 150, borderRadius: 12, marginTop: 6 },

  previewContainer: { paddingHorizontal: 18, marginBottom: 8 },
  previewBox: { position: "relative", marginRight: 8 },
  previewImage: { width: 78, height: 78, borderRadius: 10 },
  removeButton: { position: "absolute", top: 4, right: 4, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 12, padding: 2 },

  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 25, margin: 14, paddingHorizontal: 10, paddingVertical: 6, elevation: 3 },
  input: { flex: 1, fontSize: 15, paddingHorizontal: 12 },
  sendButton: { borderRadius: 20, padding: 10 },
  imageButton: { padding: 8, marginRight: 6 },
});

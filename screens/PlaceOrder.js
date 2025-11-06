import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PlaceOrder() {
  const navigation = useNavigation();
  const route = useRoute();

  // Get previous order data (if available)
  const previousOrder = route?.params?.previousOrder || null;

  const [name, setName] = useState("Jeremy Albuera");
  const [address, setAddress] = useState("Sitio Tibagan");
  const [phone, setPhone] = useState("09123456789");
  const [typeOfWork, setTypeOfWork] = useState("Plumbing");
  const [time, setTime] = useState("Morning");
  const [favWorker, setFavWorker] = useState(false);
  const [budget, setBudget] = useState("300");
  const [note, setNote] = useState("ayosin mo lang accla");
  const [loading, setLoading] = useState(false);

  // 🧩 Prefill details when coming from OrderDetails screen
  useEffect(() => {
    if (previousOrder) {
      if (previousOrder.worker) setName(previousOrder.worker);
      if (previousOrder.address) setAddress(previousOrder.address);
      if (previousOrder.type) setTypeOfWork(previousOrder.type);
      if (previousOrder.price) setBudget(previousOrder.price.toString());
      if (previousOrder.date)
        setNote(`Reorder request based on previous service on ${previousOrder.date}`);
    }
  }, [previousOrder]);

  const validateInputs = () => {
    if (!name.trim()) return "Full name is required.";
    if (!address.trim()) return "Address is required.";
    if (!phone.trim()) return "Phone number is required.";
    if (!/^(09\d{9})$/.test(phone))
      return "Enter a valid 11-digit phone number (starts with 09).";
    if (!typeOfWork) return "Please select a type of work.";
    if (!time) return "Please select your preferred time.";
    if (!budget.trim()) return "Budget is required.";
    if (isNaN(budget) || Number(budget) <= 0)
      return "Budget must be a valid positive number.";
    return null;
  };

  const handleOrder = async () => {
    const error = validateInputs();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    const orderData = {
      name,
      address,
      phone,
      typeOfWork,
      time,
      favWorker,
      budget,
      note: note.trim(),
    };

    setLoading(true);
    navigation.navigate("WaitingForWorker", { orderData });

    // Reset form
    setName("");
    setAddress("");
    setPhone("");
    setTypeOfWork("");
    setTime("");
    setFavWorker(false);
    setBudget("");
    setNote("");
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Name */}
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              placeholder="Enter your full name"
              onChangeText={setName}
            />

            {/* Address */}
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              value={address}
              placeholder="Enter your address"
              onChangeText={setAddress}
            />

            {/* Phone */}
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={phone}
              placeholder="09xxxxxxxxx"
              onChangeText={setPhone}
              maxLength={11}
            />

            {/* Type of Work */}
            <Text style={styles.label}>Type of Work *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={typeOfWork}
                onValueChange={setTypeOfWork}
                style={styles.picker}
              >
                <Picker.Item label="Select work type" value="" />
                <Picker.Item label="Plumbing" value="Plumbing" />
                <Picker.Item label="Electrical" value="Electrical" />
                <Picker.Item label="Carpentry" value="Carpentry" />
                <Picker.Item label="Painting" value="Painting" />
                <Picker.Item label="Cleaning" value="Cleaning" />
              </Picker>
            </View>

            {/* Time */}
            <Text style={styles.label}>Preferred Time *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={time}
                onValueChange={setTime}
                style={styles.picker}
              >
                <Picker.Item label="Select time" value="" />
                <Picker.Item label="Morning" value="Morning" />
                <Picker.Item label="Afternoon" value="Afternoon" />
                <Picker.Item label="Evening" value="Evening" />
              </Picker>
            </View>

            {/* Favorite Worker */}
            <View style={styles.switchRow}>
              <Text style={styles.label}>Assign to favourite worker first</Text>
              <Switch
                value={favWorker}
                onValueChange={setFavWorker}
                thumbColor={favWorker ? "#ce4da3ff" : "#ccc"}
                trackColor={{ false: "#ddd", true: "#f5b0e1" }}
              />
            </View>

            {/* Budget */}
            <Text style={styles.label}>Budget (₱) *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={budget}
              placeholder="Enter budget amount"
              onChangeText={setBudget}
            />

            {/* Note */}
            <Text style={styles.label}>Note to Worker (Optional)</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              multiline
              placeholder="Additional instructions (optional)"
              value={note}
              onChangeText={setNote}
            />

            {/* Submit */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ce4da3ff" }]}
              onPress={handleOrder}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Placing Order..." : "Place Order"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 26,
    paddingTop: 40,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  noteInput: {
    height: 90,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 55,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f9f9f9",
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

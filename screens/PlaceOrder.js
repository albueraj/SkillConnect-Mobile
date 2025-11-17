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
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PlaceOrder() {
  const navigation = useNavigation();
  const route = useRoute();

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

  // ⚡ Review Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  useEffect(() => {
    if (previousOrder) {
      if (previousOrder.worker) setName(previousOrder.worker);
      if (previousOrder.address) setAddress(previousOrder.address);
      if (previousOrder.type) setTypeOfWork(previousOrder.type);
      if (previousOrder.price) setBudget(previousOrder.price.toString());
      if (previousOrder.date)
        setNote(
          `Reorder request based on previous service on ${previousOrder.date}`
        );
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

  const handleNext = () => {
    const error = validateInputs();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    const data = {
      name,
      address,
      phone,
      typeOfWork,
      time,
      favWorker,
      budget,
      note,
    };

    setReviewData(data);
    setShowReviewModal(true);
  };

  const placeFinalOrder = () => {
    setShowReviewModal(false);

    navigation.navigate("WaitingForWorker", { orderData: reviewData });

    // Reset fields
    setName("");
    setAddress("");
    setPhone("");
    setTypeOfWork("");
    setTime("");
    setFavWorker(false);
    setBudget("");
    setNote("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          {/* FORM SCROLL */}
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

            {/* Preferred Time */}
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

          </ScrollView>

          {/* NEXT BUTTON FOOTER */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ce4da3ff", marginBottom: 0 }]}
              onPress={handleNext}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>

        </View>
      </TouchableWithoutFeedback>

      {/* REVIEW ORDER MODAL */}
      <Modal visible={showReviewModal} animationType="slide" transparent>

        {/* TAP OUTSIDE CLOSES MODAL */}
        <TouchableWithoutFeedback onPress={() => setShowReviewModal(false)}>
          <View style={styles.modalBackground} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainerFull}>
          <Text style={styles.modalTitle}>Review Your Order</Text>

          {/* FULL-VIEW CONTENT — NO SCROLL */}
          <View style={styles.fullContent}>
            <Text style={styles.modalLabel}>Full Name</Text>
            <Text style={styles.modalValue}>{reviewData?.name}</Text>

            <Text style={styles.modalLabel}>Address</Text>
            <Text style={styles.modalValue}>{reviewData?.address}</Text>

            <Text style={styles.modalLabel}>Phone</Text>
            <Text style={styles.modalValue}>{reviewData?.phone}</Text>

            <Text style={styles.modalLabel}>Type of Work</Text>
            <Text style={styles.modalValue}>{reviewData?.typeOfWork}</Text>

            <Text style={styles.modalLabel}>Preferred Time</Text>
            <Text style={styles.modalValue}>{reviewData?.time}</Text>

            <Text style={styles.modalLabel}>Favorite Worker</Text>
            <Text style={styles.modalValue}>
              {reviewData?.favWorker ? "Yes, prioritize" : "No"}
            </Text>

            <Text style={styles.modalLabel}>Budget (₱)</Text>
            <Text style={styles.modalValue}>{reviewData?.budget}</Text>

            <Text style={styles.modalLabel}>Note</Text>
            <Text style={styles.modalValue}>{reviewData?.note || "None"}</Text>
          </View>

          {/* PLACE ORDER BUTTON FOOTER */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ce4da3ff", marginBottom: 0 }]}
              onPress={placeFinalOrder}
            >
              <Text style={styles.buttonText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Modal>

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
    paddingBottom: 20,
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
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // FOOTER BUTTON
  footer: {
    padding: 16,
    marginBottom: 20,
  },

  // MODAL STYLES
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainerFull: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "75%",
    justifyContent: "flex-start",
  },
  fullContent: {
    flexGrow: 1,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 12,
    color: "#555",
  },
  modalValue: {
    fontSize: 15,
    color: "#222",
    marginBottom: 5,
  },
});

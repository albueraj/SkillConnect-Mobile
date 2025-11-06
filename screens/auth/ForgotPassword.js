import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../api"; // make sure this points to your axios instance

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email address is required.";
    if (!emailRegex.test(value)) return "Please enter a valid email address.";
    return "";
  };

  const handleResetPassword = async () => {
    const error = validateEmail(email);
    if (error) {
      setValidationError(error);
      Alert.alert("Validation Error", error);
      return;
    }

    setIsSubmitting(true);
    setValidationError("");

    try {
      const { data } = await api.post("/user/forgot-password", { email });

      if (data.success) {
        Alert.alert(
          "Email Sent!",
          `We've sent a password reset link to ${email}. Please check your inbox.`
        );
        navigation.goBack(); // Return to login screen
      } else {
        Alert.alert("Error", data.message || "Failed to send reset email.");
      }
    } catch (error) {
      Alert.alert(
        "Request Failed",
        error.response?.data?.message ||
          "Unable to send password reset email. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your registered email and we’ll send you a password reset link.
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" />
          <TextInput
            style={[styles.input, validationError && styles.errorInput]}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setValidationError("");
            }}
          />
        </View>

        {validationError ? (
          <Text style={styles.errorText}>{validationError}</Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.resetButton,
            isSubmitting && { opacity: 0.7 },
          ]}
          onPress={handleResetPassword}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator color="#fff" />
              <Text style={styles.resetText}>  Sending...</Text>
            </>
          ) : (
            <Text style={styles.resetText}>SEND RESET EMAIL</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#ce4da3ff" />
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ce4da3ff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 5,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 5,
  },
  errorInput: {
    borderColor: "red",
  },
  resetButton: {
    backgroundColor: "#ce4da3ff",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },
  resetText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  backText: {
    color: "#ce4da3ff",
    marginLeft: 5,
    fontWeight: "600",
  },
});

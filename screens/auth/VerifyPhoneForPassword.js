import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function VerifyPhoneForPassword({ navigation }) {
  const [phone, setPhone] = useState("+63 99");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);

  // Timer countdown effect
  useEffect(() => {
    let timer;
    if (otpSent && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, otpSent]);

  const handleContinue = () => {
    if (phone.trim().length < 10) {
      Alert.alert("Invalid number", "Please enter a valid phone number.");
      return;
    }
    setOtpSent(true);
    setResendTimer(60);
    Alert.alert("Verification code sent!", `Sent to ${phone}`);
  };

  const handleVerify = () => {
    if (otp.join("").length < 4) {
      Alert.alert("Incomplete code", "Please enter the 4-digit code.");
      return;
    }
    Alert.alert("Verified", "Phone number successfully verified!");
    navigation.navigate("Profile");
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(60);
      Alert.alert("Code resent", `New verification code sent to ${phone}`);
    }
  };

  if (otpSent) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity onPress={() => setOtpSent(false)} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Verify your phone number</Text>
        <Text style={styles.subtitle}>
          Enter the 4-digit code sent to{" "}
          <Text style={{ fontWeight: "600" }}>{phone}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.resendContainer}
          onPress={handleResend}
          disabled={resendTimer > 0}
        >
          <Text
            style={[
              styles.resendText,
              { color: resendTimer > 0 ? "#999" : "#d6215dff" },
            ]}
          >
            {resendTimer > 0
              ? `Resend via SMS in ${resendTimer}s`
              : "Resend via SMS"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={handleVerify}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>To change your password, verify your phone number</Text>

      <TextInput
        style={styles.input}
        placeholder="+63 99** *** **88"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        You will receive an SMS for verification
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    padding: 25,
    backgroundColor: "#fff",
  },
  backBtn: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 15,
  },
  subtitle: {
    color: "#555",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  continueButton: {
    backgroundColor: "#ce4da3ff",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoText: {
    marginTop: 10,
    color: "#777",
    fontSize: 13,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    marginTop: 20,
  },
  otpInput: {
    width: 55,
    height: 55,
    borderWidth: 1.5,
    borderColor: "#d6215dff",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    color: "#000",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation, setIsLoggedIn }) {
  const [selectedRole, setSelectedRole] = useState("Service Provider");
  const [email, setEmail] = useState("jeremy@gmail.com");
  const [password, setPassword] = useState("1234");
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    const pendingScreen = await AsyncStorage.getItem("pendingScreen");

    if (pendingScreen) {
      await AsyncStorage.removeItem("pendingScreen");
      navigation.replace(pendingScreen);
    } else {
      navigation.replace("Home");
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email address and password are required.");
      return;
    }

    await AsyncStorage.setItem("userRole", selectedRole);

    if (selectedRole === "Service Provider") {
      navigation.navigate("Home");
    } else if (selectedRole === "Community Member") {
      navigation.navigate("PlaceOrder");
    } else {
      Alert.alert("Error", "Invalid role selected.");
    }

    handleLoginSuccess();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <Image
          source={{ uri: "https://i.ibb.co/MxKr7FVx/1000205778-removebg-preview.png" }}
          style={styles.logo}
        />

        {/* Title */}
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subTitle}>Sign in to your account</Text>

        {/* Role Selection */}
        <Text style={styles.label}>Login as:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedRole}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedRole(itemValue)}
          >
            <Picker.Item label="Service Provider" value="Service Provider" />
            <Picker.Item label="Community Member" value="Community Member" />
          </Picker>
        </View>

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Text style={styles.registerText}>
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate("Register")}
            >
              Create an Account
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
    paddingBottom: 60,
  },
  logo: {
    width: 150,
    height: 100,
    resizeMode: "contain",
    marginBottom: 8,
    marginTop: -40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ce4da3ff",
    marginBottom: 3,
    },
  subTitle: {
    fontSize: 16,
    color: "#ce4da3ff",
    marginBottom: 20,

  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "600",
    marginTop: 10,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 2,
    width: "100%",
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 17,
    marginTop: 5,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  loginButton: {
    width: "100%",
    padding: 18,
    backgroundColor: "#ce4da3ff",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  loginText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: 100,
  },
  forgotText: {
    color: "#ce4da3ff",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 12,
  },
  registerText: {
    marginTop: 10,
    fontSize: 17,
    color: "#000",
  },
  registerLink: {
    color: "#ce4da3ff",
    fontWeight: "600",
  },
});

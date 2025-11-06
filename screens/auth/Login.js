import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load remembered email if exists
  useEffect(() => {
    const loadRememberedEmail = async () => {
      const rememberedEmail = await AsyncStorage.getItem("rememberedEmail");
      if (rememberedEmail) setEmail(rememberedEmail);
    };
    loadRememberedEmail();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Please enter a valid email address.";

    if (!password.trim()) newErrors.password = "Password is required.";
    else if (password.length < 4)
      newErrors.password = "Password must be at least 4 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      // Simulate successful login (replace with API later)
      const userData = { email, isVerified: true };
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("isAuthorized", "true");

      setIsLoggedIn(true);
      Alert.alert("Login Successful", `Welcome back!`);

      // Navigate based on verification or user type
      navigation.replace("Home"); // or "PlaceOrder"
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={{
            uri: "https://i.ibb.co/MxKr7FVx/1000205778-removebg-preview.png",
          }}
          style={styles.logo}
        />

        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subTitle}>Sign in to your account</Text>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" />
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            placeholder="Enter your email address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Password */}
        <View style={styles.passwordContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" />
          <TextInput
            style={[styles.passwordInput, errors.password && styles.errorInput]}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <ActivityIndicator color="#fff" />
              <Text style={styles.loginText}>  Signing In...</Text>
            </>
          ) : (
            <Text style={styles.loginText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate("Register")}
            >
              Create one here
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
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    width: "100%",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 5,
  },
  loginButton: {
    width: "100%",
    padding: 18,
    backgroundColor: "#ce4da3ff",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 5,
  },
  loginText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: 80,
  },
  forgotText: {
    color: "#ce4da3ff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  registerText: {
    fontSize: 15,
    color: "#000",
  },
  registerLink: {
    color: "#ce4da3ff",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  errorInput: {
    borderColor: "red",
  },
});

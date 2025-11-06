import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { subscribeToUserDataChange } from "../utils/storageEvents";

const { width } = Dimensions.get("window");

export default function CustomDrawer({ children, isLoggedIn, setIsLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const translateX = useRef(new Animated.Value(-width * 0.75)).current;
  const navigation = useNavigation();

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("userData");
      const role = await AsyncStorage.getItem("userRole");
      if (savedUser) setUserData(JSON.parse(savedUser));
      if (role) setUserRole(role);
    } catch (err) {
      console.log("Error loading user data:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
    const unsubscribe = subscribeToUserDataChange(fetchUserData);
    return () => unsubscribe();
  }, [isLoggedIn]);

  // Smooth drawer toggle
  const toggleDrawer = () => {
    const toValue = isOpen ? -width * 0.75 : 0;
    setIsOpen(!isOpen);
    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 30,
    }).start();
  };

  // Navigation helper
  const navAndClose = async (screen, requiresAuth = false) => {
    toggleDrawer();
    if (requiresAuth && !isLoggedIn) {
      await AsyncStorage.setItem("pendingScreen", screen);
      navigation.navigate("Login");
    } else {
      navigation.navigate(screen);
    }
  };

  // Dynamic menu items
  const menuItems = useMemo(() => {
    if (!userRole) return [];
    const commonItems = [{ name: "Settings", icon: "settings-outline", screen: "Settings" }];

    if (userRole === "Community Member") {
      return [
        { name: "Place Order", icon: "cart-outline", screen: "PlaceOrder" },
        { name: "Records", icon: "document-outline", screen: "Records" },
        { name: "Workers", icon: "people-outline", screen: "Workers" },
        ...commonItems,
      ];
    }
    if (userRole === "Service Provider") {
      return [
        { name: "My Service", icon: "briefcase-outline", screen: "Service" },
        { name: "Records", icon: "document-outline", screen: "ClientRecords" },
        { name: "Reviews", icon: "star-outline", screen: "ProfileReviews" },
        ...commonItems,
      ];
    }
    return [];
  }, [userRole]);

  return (
    <View style={{ flex: 1 }}>
      {children(toggleDrawer)}

      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleDrawer}
        />
      )}

      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        {/* Gradient Header */}
        <LinearGradient
          colors={["#c20884", "#ff6fb5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerRow}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              toggleDrawer();
              if (isLoggedIn) navigation.navigate("Profile");
              else navigation.navigate("Login");
            }}
            style={styles.headerContent}
          >
            <View style={styles.profileSection}>
              <Image
                source={
                  userData?.profilePic
                    ? { uri: userData.profilePic }
                    : require("../assets/default-profile.png")
                }
                style={styles.profileImage}
              />

              {!isLoggedIn ? (
                <Text style={styles.authButton}>Login / Register</Text>
              ) : (
                <View>
                  <Text style={styles.emailText}>
                    {userData?.firstName || "User"}
                  </Text>
                  <Text style={styles.roleText}>{userRole}</Text>
                </View>
              )}
            </View>

            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#fff"
              style={styles.chevron}
            />
          </TouchableOpacity>
        </LinearGradient>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navAndClose("Home")}
          >
            <Ionicons name="home-outline" size={22} style={styles.icon} />
            <Text style={styles.text}>Home</Text>
          </TouchableOpacity>

          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.item}
              onPress={() => navAndClose(item.screen, true)}
            >
              <Ionicons name={item.icon} size={22} style={styles.icon} />
              <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 999,
  },
  headerRow: { 
    paddingVertical: 35,
    paddingHorizontal: 20,
    borderTopRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#ff0396ff",
    marginRight: 16,
  },
  authButton: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
  emailText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  roleText: {
    color: "#f7f7f7",
    fontSize: 14,
    marginTop: 3,
  },
  chevron: {
    marginLeft: 8,
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14
  },
  icon: {
    marginRight: 12,
    color: "#c20884",
  },
  text: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

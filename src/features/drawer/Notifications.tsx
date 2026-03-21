import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxUtils/store";
import { TouchableOpacity } from "react-native";
import { translate } from "../../utils/languageUtils/I18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { colorConfig, needUpdate, dashboardData, userId } = useSelector(
    (state: RootState) => state.userInfo,
  );

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem("notifications");
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }
        console.error(
          " loading notifications from AsyncStorage:",
          storedNotifications,
        );
      } catch (error) {
        console.error("Error loading notifications from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const clearNotifications = async () => {
    try {
      await AsyncStorage.removeItem("notifications");
      setNotifications([]);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };
  const renderNotificationItem = ({ item }) => (
    <LinearGradient
      colors={[colorConfig.secondaryColor, colorConfig.primaryColor]}
      style={styles.notificationItem}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationBody}>{item.body}</Text>
      <Text style={styles.notificationDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </LinearGradient>
  );

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <Text style={styles.header}>{translate("Notifications")} </Text>
      <TouchableOpacity
        onPress={() => clearNotifications()}
        style={styles.trashButton}
      >
        <Text style={styles.trashIcon}>{translate("Clear All")}</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : notifications.length > 0 ? (
          <FlatList
            data={[...notifications].reverse()}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderNotificationItem}
          />
        ) : (
          <Text style={styles.noNotificationsText}>
            {translate("No Notifications available")}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F7F7",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  trashButton: {
    alignItems: "center",
    marginBottom: 10,
  },

  trashIcon: {
    fontSize: 16,
    color: "#FF5555",
    fontWeight: "bold",
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#fff",
  },
  notificationBody: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
  },
  notificationDate: {
    fontSize: 14,
    color: "#fff",
    textAlign: "right",
  },
  noNotificationsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

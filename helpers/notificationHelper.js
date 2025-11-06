// /helpers/notificationHelper.js
import * as Notifications from "expo-notifications";

// Configure foreground notification handler (show alert & sound)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Schedule a push notification
export const sendNotification = async ({ title, body }) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Immediate
    });
  } catch (error) {
    console.log("Notification Error:", error);
  }
};

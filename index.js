import 'react-native-reanimated'; 
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import { enableScreens } from 'react-native-screens';

enableScreens(true);
global.Buffer = Buffer;

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';
import notifee, { EventType, AndroidStyle } from '@notifee/react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1. FCM Background Message Handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('FCM Background Message:', remoteMessage);
    
    // Notification data extract karein
    const { notification, data } = remoteMessage;

    if (notification) {
        // Notification History Save Karein
        try {
            const notificationData = {
                title: notification.title,
                body: notification.body,
                createdAt: new Date().toISOString(),
            };
            const stored = await AsyncStorage.getItem('notifications');
            let notifications = stored ? JSON.parse(stored) : [];
            notifications.push(notificationData);
            await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
        } catch (e) {
            console.error("Storage Error in Background:", e);
        }

        // AGAR aapka server 'data-only' message bhej raha hai, 
        // toh yahan displayNotification call karna hoga.
        // Agar notification already server se aa rahi hai, toh Notifee ki zaroorat nahi hai.
    }
});

// 2. Notifee Background Event Handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification } = detail;
    if (type === EventType.PRESS) {
        console.log('User pressed notification:', notification);
        // Important: New Arch mein yahan navigation ke liye hum aksar
        // Linking.openURL or deep links use karte hain.
    }
});

LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => App);
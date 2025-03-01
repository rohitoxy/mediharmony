
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyB94X9S5P1-1XVx1nEL3RfXcTD2QPBnABc",
  authDomain: "mediharmony-app.firebaseapp.com",
  projectId: "mediharmony-app",
  storageBucket: "mediharmony-app.appspot.com",
  messagingSenderId: "583764012345",
  appId: "1:583764012345:web:a3c9c5b8d4e6f7a0123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Get registration token for FCM
      const token = await getToken(messaging, {
        vapidKey: "BLW8Ckh6RtxavT7yJEW_5TnUvZFn0tXJwdwxZXUxvG6XmQgkZ9aJNc2kQ-exArXgLcM0zjRLmzpC8HE5CQsjxNo"
      });
      
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

// Handle incoming messages when app is in foreground
export const setupMessageListener = (callback) => {
  return onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);
    callback(payload);
  });
};

export default app;

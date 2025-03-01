
// Import and configure the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB94X9S5P1-1XVx1nEL3RfXcTD2QPBnABc",
  authDomain: "mediharmony-app.firebaseapp.com",
  projectId: "mediharmony-app",
  storageBucket: "mediharmony-app.appspot.com",
  messagingSenderId: "583764012345",
  appId: "1:583764012345:web:a3c9c5b8d4e6f7a0123456"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data,
    tag: payload.data?.groupKey || 'medication-alert',
    renotify: true
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click: ', event);
  event.notification.close();

  // This looks for the matching client to focus
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes('/') && 'focus' in client) {
            return client.focus();
          }
        }
        // If no matching client opens a new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

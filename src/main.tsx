
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful:', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed:', err);
      });
      
    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Received message from service worker:', event.data);
      
      if (event.data.type === 'NOTIFICATION_CLICK') {
        // Dispatch as a custom event for components to react to
        window.dispatchEvent(new CustomEvent('serviceworkermessage', {
          detail: event.data
        }));
      }
    });
  });
}

// Set up a listener for notification permission changes
if ('Notification' in window) {
  // Initial permission check
  console.log('Current notification permission:', Notification.permission);
  
  // Modern browsers don't support the permissionchange event yet,
  // but we'll add it for future compatibility
  if ('onpermissionchange' in navigator) {
    // @ts-ignore - TypeScript doesn't recognize this yet
    navigator.permissions.addEventListener('permissionchange', (e) => {
      if (e.permission === 'notifications') {
        console.log('Notification permission changed to:', Notification.permission);
      }
    });
  }
}

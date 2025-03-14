
const CACHE_NAME = 'mediharmony-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Handle notifications from the application
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    
    const title = data.title || 'MediHarmony';
    const options = {
      body: data.body || '',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.tag || 'default',
      data: data.data || {},
      vibrate: data.vibrate || [100, 50, 100]
    };
    
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});

// Handle notification clicks in the service worker
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Extract medication data
  const medicationId = event.notification.data?.medicationId;
  
  // This looks for the matching client to focus
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if ('focus' in client) {
            client.focus();
            // Post a message to the client with the medication ID
            if (medicationId) {
              client.postMessage({
                type: 'NOTIFICATION_CLICK',
                medicationId: medicationId,
                timestamp: Date.now()
              });
            }
            return;
          }
        }
        
        // If no matching client opens a new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});


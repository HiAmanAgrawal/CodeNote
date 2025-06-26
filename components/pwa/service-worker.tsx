'use client';

import { useEffect, useState, useCallback } from 'react';

interface ServiceWorkerRegistration {
  installing: ServiceWorker | null;
  waiting: ServiceWorker | null;
  active: ServiceWorker | null;
  scope: string;
  updateViaCache: RequestCache;
  onupdatefound: ((this: ServiceWorkerRegistration, ev: Event) => any) | null;
  oncontrollerchange: ((this: ServiceWorkerRegistration, ev: Event) => any) | null;
  onstatechange: ((this: ServiceWorkerRegistration, ev: Event) => any) | null;
  update(): Promise<void>;
  unregister(): Promise<boolean>;
  getNotifications(filter?: GetNotificationOptions): Promise<Notification[]>;
  showNotification(title: string, options?: NotificationOptions): Promise<void>;
  closeNotification(tag: string): Promise<void>;
  getPushSubscription(): Promise<PushSubscription | null>;
  pushManager: PushManager;
  sync: SyncManager;
  periodicSync: PeriodicSyncManager;
  backgroundFetch: BackgroundFetchManager;
  navigationPreload: NavigationPreloadManager;
  cookies: CookieStoreManager;
}

interface ServiceWorkerHook {
  isSupported: boolean;
  isInstalled: boolean;
  isUpdating: boolean;
  registration: ServiceWorkerRegistration | null;
  install: () => Promise<void>;
  uninstall: () => Promise<void>;
  update: () => Promise<void>;
  skipWaiting: () => Promise<void>;
}

export function useServiceWorker(): ServiceWorkerHook {
  const [isSupported, setIsSupported] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Check if service worker is supported
  useEffect(() => {
    setIsSupported('serviceWorker' in navigator);
  }, []);

  // Register service worker
  const install = useCallback(async () => {
    if (!isSupported) {
      console.log('Service Worker is not supported in this browser');
      return;
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      setRegistration(reg);
      setIsInstalled(true);

      // Handle updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setIsUpdating(true);
              console.log('New version available!');
            }
          });
        }
      });

      // Handle controller change
      reg.addEventListener('controllerchange', () => {
        setIsUpdating(false);
        console.log('App updated successfully!');
        window.location.reload();
      });

      console.log('Service Worker installed successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }, [isSupported]);

  // Uninstall service worker
  const uninstall = useCallback(async () => {
    if (!registration) return;

    try {
      const success = await registration.unregister();
      if (success) {
        setIsInstalled(false);
        setRegistration(null);
        console.log('Service Worker uninstalled');
      } else {
        console.log('Failed to uninstall Service Worker');
      }
    } catch (error) {
      console.error('Service Worker uninstall failed:', error);
    }
  }, [registration]);

  // Update service worker
  const update = useCallback(async () => {
    if (!registration) return;

    try {
      await registration.update();
      console.log('Checking for updates...');
    } catch (error) {
      console.error('Service Worker update failed:', error);
    }
  }, [registration]);

  // Skip waiting (force update)
  const skipWaiting = useCallback(async () => {
    if (!registration || !registration.waiting) return;

    try {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      console.log('Updating to new version...');
    } catch (error) {
      console.error('Skip waiting failed:', error);
    }
  }, [registration]);

  // Auto-install on mount
  useEffect(() => {
    if (isSupported && !isInstalled) {
      install();
    }
  }, [isSupported, isInstalled, install]);

  return {
    isSupported,
    isInstalled,
    isUpdating,
    registration,
    install,
    uninstall,
    update,
    skipWaiting,
  };
}

// Service Worker component
interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

export const ServiceWorkerProvider: React.FC<ServiceWorkerProviderProps> = ({ children }) => {
  const { isSupported, isInstalled, isUpdating, update, skipWaiting } = useServiceWorker();

  return (
    <>
      {children}
      
      {/* Update Notification */}
      {isUpdating && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <h4 className="font-medium">Update Available</h4>
                <p className="text-sm text-muted-foreground">
                  A new version of the app is available
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={update}
                  className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Update
                </button>
                <button
                  onClick={skipWaiting}
                  className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                >
                  Force
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Service Worker script (to be placed in public/sw.js)
export const serviceWorkerScript = `
// Service Worker for CodeNote PWA

const CACHE_NAME = 'codenote-v1';
const STATIC_CACHE = 'codenote-static-v1';
const DYNAMIC_CACHE = 'codenote-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('codenote-') && cacheName !== STATIC_CACHE;
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if available
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from CodeNote',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/favicon.ico',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.ico',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('CodeNote', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Sync offline data
    const offlineData = await getOfflineData();
    if (offlineData.length > 0) {
      await syncOfflineData(offlineData);
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Get offline data from IndexedDB
async function getOfflineData() {
  // Implementation depends on your data structure
  return [];
}

// Sync offline data with server
async function syncOfflineData(data) {
  // Implementation depends on your API
  console.log('Syncing offline data:', data);
}
`;

export default useServiceWorker; 
const PRECACHE = 'precache-v1641913792';
const RUNTIME = 'runtime';
const OFFLINE_URL = '/offline.html';
// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    OFFLINE_URL,
    '/manifest.json',
    '/assets/images/dx_icon.ico',
    '/assets/images/app_logo.png',
    '/assets/images/app_icon_192.png',
    '/assets/images/app_icon_512.png',
    '/assets/images/app_icon_192.jpg',
    '/assets/images/app_icon_512.jpg',
    '/assets/images/apple_splash_2048.jpeg',
    '/assets/images/apple_splash_1668.jpeg',
    '/assets/images/apple_splash_1536.jpeg',
    '/assets/images/apple_splash_1125.jpeg',
    '/assets/images/apple_splash_1242.jpeg',
    '/assets/images/apple_splash_750.jpeg',
    '/assets/images/apple_splash_640.jpeg',
    '/src/*'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
        .then(cache => cache.addAll(PRECACHE_URLS))
        .then(self.skipWaiting())
    );
});

self.addEventListener('message', function(event) {
    console.log("Message: " + JSON.stringify(event.data));
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
    if (event.request.url.startsWith(self.location.origin)) {
        if (event.request.mode === 'navigate') {
            event.respondWith(
                fetch(event.request)
                .then((response) => {
                    return response;
                })
                .catch(() => caches.match(OFFLINE_URL)).then(function(response) {
                    if (response) {
                        return response;
                    }
                }));
        } else {
            return fetch(event.request);
        }
    } else {
        return fetch(event.request);
    }
    //TODO: Figure this out...
    // Skip cross-origin requests, like those for Google Analytics.
    /*if (event.request.url.startsWith(self.location.origin)) {
        if (event.request.mode === 'navigate') {
            event.respondWith(
                fetch(event.request)
                .then((response) => {
                    return response;
                })
                .catch(() => caches.match(OFFLINE_URL)).then(function(response) {
                    if (response) {
                        return response;
                    }
                }));
        } else {
            console.log("Not navigate");
            event.respondWith(
                caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                }, () => {
                    return fetch(event.request);
                }).catch(() => {
                    return fetch(event.request);
                }));
        }
    } else {
        return fetch(event.request);
    }*/
});
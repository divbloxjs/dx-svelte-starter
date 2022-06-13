const PRECACHE = 'precache-v1641913792';
const RUNTIME = 'runtime';
const OFFLINE_URL = '/offline.html';
// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    OFFLINE_URL,
    'manifest.json',
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
    '/assets/images/apple_splash_640.jpeg'
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

self.addEventListener('fetch', function(event) {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(OFFLINE_URL)).then(function(response) {
                if (response) {
                    return response;
                }
            })

        );
    }

    let req = event.request.clone();
    if (req.method == "GET") {
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return event.respondWith(response);
                }
            });

        // event.respondWith(
        //     caches.match(event.request)
        //     .then(function(response) {
        //         // Cache hit - return response
        //         if (response) {
        //             return response;
        //         }
        //     })
        // );
        // event.respondWith(fetch(event.request));
    } else {
        event.respondWith(fetch(event.request));
    }


});
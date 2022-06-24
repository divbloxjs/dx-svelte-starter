const PRECACHE = "precache-5";
const RUNTIME = "runtime-5";

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    "/manifest.json",
    "/assets/images/dx_icon.ico",
    "/assets/images/app_icon_192.png",
    "/assets/images/app_icon_512.png",
    "/assets/images/app_icon_192.jpg",
    "/assets/images/app_icon_512.jpg",
    "/assets/images/apple_splash_2048.jpg",
    "/assets/images/apple_splash_1668.jpg",
    "/assets/images/apple_splash_1536.jpg",
    "/assets/images/apple_splash_1242.jpg",
    "/assets/images/apple_splash_1125.jpg",
    "/assets/images/apple_splash_750.jpg",
    "/assets/images/apple_splash_640.jpg",
    "/assets/images/apple_splash_2048.png",
    "/assets/images/apple_splash_1668.png",
    "/assets/images/apple_splash_1536.png",
    "/assets/images/apple_splash_1242.png",
    "/assets/images/apple_splash_1125.png",
    "/assets/images/apple_splash_750.png",
    "/assets/images/apple_splash_640.png",
];

// A list of keywords that we do not want to cache for dev purposes
const NONCACHE_KEYWORDS = ["@vite", "/src/", "/node_modules"];

/**
 * Matches the given string with one of the keywords provided in NONCACHE_KEYWORDS
 * @param {*} inputString The string to check on
 * @returns {boolean} True if matches, false otherwise
 */
const matchNonCacheKeywords = (inputString = "") => {
    for (const keyword of NONCACHE_KEYWORDS) {
        if (inputString.includes(keyword)) {
            return true;
        }
    }
    return false;
};

// The install handler takes care of precaching the resources we always need.
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(self.skipWaiting())
    );
});

self.addEventListener("message", (event) => {
    console.log(`The client sent me a message: ${event.data}`);
    if (event.data.action === "skipWaiting") {
        self.skipWaiting();
    }
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter(
                    (cacheName) => !currentCaches.includes(cacheName)
                );
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        return caches.delete(cacheToDelete);
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener("fetch", (event) => {
    // Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then((cache) => {
                    return fetch(event.request).then((response) => {
                        if (!matchNonCacheKeywords(event.request.url)) {
                            // Put a copy of the response in the runtime cache.
                            return cache
                                .put(event.request, response.clone())
                                .then(() => {
                                    return response;
                                });
                        } else {
                            return response;
                        }
                    });
                });
            })
        );
    }
});

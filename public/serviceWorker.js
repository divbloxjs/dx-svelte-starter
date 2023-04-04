//////////////////////////////////////////
// DIVBLOX GENERATED CODE - DO NOT MODIFY!
const dxBuildTimeStamp = "1680611704151";
const fcmConfig = {
    isFcmEnabled: true,
    firebaseConfig: {
        apiKey: "AIzaSyCLEn3_LRBzMVM8HFARiPN5ApxVQunJdjI",
        authDomain: "divblox.firebaseapp.com",
        databaseURL: "https://divblox.firebaseio.com",
        projectId: "divblox",
        storageBucket: "divblox.appspot.com",
        messagingSenderId: "83768644040",
        appId: "1:83768644040:web:dabaa26be6ce4e8d1eb0fd",
        measurementId: "G-TGBJP6VTSB",
    },
    firebaseVapidKey: "BOoYXjdhsgf6XJyDx7V4M9vLO2EvtO__mJcKUS_AW6NznFxZEZYNkT5K1zemT7n1JNi0E-ZB45kVX9h5oHdzq7g",
    pushSubscriptionEndpoint:
        "http://localhost:3000/api/dxPushNotifications/pushSubscription?vapidPublicKey=BOoYXjdhsgf6XJyDx7V4M9vLO2EvtO__mJcKUS_AW6NznFxZEZYNkT5K1zemT7n1JNi0E-ZB45kVX9h5oHdzq7g",
};
//////////////////////////////////////////
// DIVBLOX GENERATED CODE - ENDS

const PRECACHE = "precache-" + dxBuildTimeStamp;
const RUNTIME = "runtime-" + dxBuildTimeStamp;

// VAPID KEY For push notifications
const applicationServerKey = fcmConfig.firebaseVapidKey;
// Backend endpoint to store push subscriptions
const pushSubscriptionEndpoint = fcmConfig.pushSubscriptionEndpoint;

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
self.addEventListener("activate", async (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
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

    if (fcmConfig.isFcmEnabled && self.registration.pushManager) {
        // Web Push supported.
        try {
            const options = { applicationServerKey, userVisibleOnly: true };
            const subscription = await self.registration.pushManager.subscribe(options);

            //Save this to backend with the provided endpoint
            console.log("Push subscription:", subscription);
            const saveResult = await fetch(pushSubscriptionEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ pushSubscriptionObject: subscription }),
            });
        } catch (err) {
            console.log("Error", err);
        }
    } else {
        // Web Push not supported.
        console.log("Web push not supported");
    }
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener("fetch", (event) => {
    // Skip cross-origin requests, like those for Google Analytics.
    let req = event.request.clone();
    if (req.clone().url.startsWith(self.location.origin) && req.clone().method == "GET") {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then((cache) => {
                    return fetch(event.request).then((response) => {
                        if (!matchNonCacheKeywords(event.request.url)) {
                            // Put a copy of the response in the runtime cache.
                            return cache.put(event.request, response.clone()).then(() => {
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

self.addEventListener("push", function (event) {
    if (event.data) {
        const pushData = event.data.json();

        const options = {};
        const title = pushData.notification.title ? pushData.notification.title : "";

        for (const option of Object.keys(pushData.notification)) {
            options[option] = pushData.notification[option];
        }

        self.registration.showNotification(title, options);
    } else {
        console.log("Push event but no data");
    }
});

self.addEventListener("notificationclick", (event) => {
    const clickedNotification = event.notification;
    clickedNotification.close();

    // Do something as the result of the notification click
    //const promiseChain = doSomething();
    //event.waitUntil(promiseChain);
});

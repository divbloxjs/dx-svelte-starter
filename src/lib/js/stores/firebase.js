import { get, writable } from "svelte/store";
import { getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { serviceWorkerRegistration } from "$src/lib/js/stores/serviceWorker";
import { firebaseConfig, firebaseVapidKey } from "$src/lib/js/stores/configurations";

const defaultUserNotificationPreferences = { ignored: true, accepted: false, rejected: false };

let userNotificationPreferences = writable(
    JSON.parse(localStorage.getItem("userNotificationPreferences")) || defaultUserNotificationPreferences
);

userNotificationPreferences.subscribe((val) =>
    localStorage.setItem("userNotificationPreferences", JSON.stringify(val))
);

let fcmOptions = {
    vapidKey: firebaseVapidKey,
};

export const initFirebase = async () => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Init FCM Messaging
    const messaging = getMessaging();

    fcmOptions["serviceWorkerRegistration"] = get(serviceWorkerRegistration);

    return {
        app: app,
        messaging: messaging,
        fcmOptions: fcmOptions,
        initComplete: fcmOptions.serviceWorkerRegistration !== null,
    };
};

/**
 *
 * @returns {{ignored: boolean, accepted: boolean, rejected: boolean}}
 */
export const checkUserNotificationPreferences = () => {
    return get(userNotificationPreferences);
};
/**
 *
 * @param {{ignored: boolean, accepted: boolean, rejected: boolean}} preferences
 */
export const setUserNotificationPreferences = (preferences) => {
    const currentUserPreferences = get(userNotificationPreferences);
    for (const key of Object.keys(preferences)) {
        currentUserPreferences[key] = preferences[key];
    }
    userNotificationPreferences.set(currentUserPreferences);
};

import { isNotificationPermissionsGranted } from "./stores";

let isNotificationPermissionsGrantedValue = 'default';

const unsubscribe = isNotificationPermissionsGranted.subscribe(val => isNotificationPermissionsGrantedValue = val);

export const requestNotificationPermission = async() => {
    if (!('PushManager' in window)) {
        isNotificationPermissionsGranted.set("denied");
        return "denied";
    }

    if (isNotificationPermissionsGrantedValue === 'denied') {
        return isNotificationPermissionsGrantedValue;
    }

    const permission = await window.Notification.requestPermission();

    // value of permission can be 'granted', 'default', 'denied'
    // granted: user has accepted the request
    // default: user has dismissed the notification permission popup by clicking on x
    // denied: user has denied the request.
    isNotificationPermissionsGranted.set(permission);
    return permission;
}
import { writable, readable, derived } from 'svelte/store';
import logo from "../../assets/images/divblox_icon_violet.png";

export const isAuthenticated = writable(JSON.parse(localStorage.getItem("isAuthenticated")) || false);
isAuthenticated.subscribe(val => localStorage.setItem("isAuthenticated", JSON.stringify(val)));

export const isNotificationPermissionsGranted = writable(JSON.parse(localStorage.getItem("isNotificationPermissionsGranted")) || false);
isNotificationPermissionsGranted.subscribe(val => localStorage.setItem("isNotificationPermissionsGranted", JSON.stringify(val)));

// Update this to customize your app details
export const domainRoot = "https://divblox.com";
export const appName = "Divblox";
export const defaultLandingPage = "/";
export const appLogo = logo;
export const shouldRequestForNotificationSupport = true;

// Add your app stores functionality here
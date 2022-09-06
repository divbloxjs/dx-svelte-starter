import logo from "$src/assets/images/divblox_icon_violet.png";
import logoAlternateDarkMode from "$src/assets/images/divblox_logo_white.png";
import logoAlternateLightMode from "$src/assets/images/divblox_logo_black.png";
import { get, writable } from "svelte/store";

// Update this to customize your app details
export const domainRoot = "https://divblox.com";
export const appName = "Divblox";
export const defaultLandingPage = "/";
export const appLogo = logo;
export const backendRoot = "http://localhost:4000";

const isSystemThemeDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

export const userSelectedTheme = writable(
    localStorage.getItem("userSelectedTheme") || (isSystemThemeDark ? "dark" : "light")
);

userSelectedTheme.subscribe((val) => localStorage.setItem("userSelectedTheme", val));

let isDarkMode = get(userSelectedTheme) === "dark";

export const appLogoAlternate = writable(isDarkMode ? logoAlternateDarkMode : logoAlternateLightMode);

export const setUserSelectedTheme = (theme = "dark") => {
    userSelectedTheme.set(theme);
    appLogoAlternate.set(get(userSelectedTheme) === "dark" ? logoAlternateDarkMode : logoAlternateLightMode);

    const dataTheme = get(userSelectedTheme) === "dark" ? "divbloxDark" : "divbloxLight";
    document.documentElement.setAttribute("data-theme", dataTheme);
};

export const toggleUserSelectedTheme = () => {
    setUserSelectedTheme(get(userSelectedTheme) === "dark" ? "light" : "dark");
};

setUserSelectedTheme(get(userSelectedTheme));

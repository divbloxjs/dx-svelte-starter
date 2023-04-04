import { writable } from "svelte/store";

// Making then serviceWorkerRegistration available globally to be used by services such as firebase messaging.
export let serviceWorkerRegistration = writable(null);

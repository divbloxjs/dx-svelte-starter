import { get } from "svelte/store";

/**
 * Wrapper function to sync svelte stores with local storage
 *
 * @param {string } key The key to store the value under in local storage
 * @param {import("svelte/store").Writable} store Svelte store you would like to sync with local storage
 * @returns {import("svelte/store").Writable<*>}
 */
export function syncLocalStorage(key = "", store) {
    if (!key || typeof key !== "string" || key.trim() === "") {
        console.warn("Local storage key not provided or invalid!");
    }

    function loadFromStorage() {
        let valueStr;
        try {
            valueStr = localStorage.getItem(key);
            if (valueStr !== null) {
                const json = JSON.parse(valueStr);
                store.set(json);
            }
        } catch (e) {
            if (valueStr === "") {
            } else {
                // probably it was a primitive
                if (valueStr.toLowerCase() === "false" || valueStr.toLowerCase() === "true") {
                    // boolean state
                    store.set(valueStr.toLowerCase() === "true");
                } else if (!Number.isNaN(Number(valueStr))) {
                    store.set(Number(valueStr));
                } else {
                    store.set(valueStr);
                }
            }
        }
    }

    function saveToStorage(value) {
        if (typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
            localStorage.setItem(key, value.toString());
        } else if (typeof value === "object") {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    function set(value) {
        saveToStorage(value);
        store.set(value);
    }

    function update(fn) {
        const value = fn(get(store));
        saveToStorage(value);
        store.update(fn);
    }

    loadFromStorage();

    return {
        subscribe: store.subscribe,
        set,
        update
    };
}

// EXAMPLE:
// export const storeBoolean = syncLocalStorage("localStorageBooleanKey", writable(false));
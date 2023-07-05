import { writable } from "svelte/store";

export const isAuthenticated = writable(JSON.parse(localStorage.getItem("isAuthenticated")) || false);

isAuthenticated.subscribe((val) => localStorage.setItem("isAuthenticated", JSON.stringify(val)));
import { domainRoot, isAuthenticated, defaultLandingPage } from '../js/stores';
import {push, pop, replace} from "svelte-spa-router";

let isAuthenticatedValue = false;

const unsubscribe = isAuthenticated.subscribe(val => isAuthenticatedValue = val);

/**
 * Checks whether the current user is authenticated and either redirects to a given page or calls a callback function, based
 * on the result.
 * @param {function|null} isNotAuthenticatedCallback A callback function to call when not authenticated. This overrides the redirect behaviour.
 * @param {function|null} isAuthenticatedCallback A callback function to call when authenticated. This overrides the redirect behaviour.
 * @param {string|null} isNotAuthenticatedRedirect The page to redirect to when not authenticated
 * @param {string|null} isAuthenticatedRedirect The page to redirect to when authenticated
 */
export const checkAuthentication = (
    isNotAuthenticatedCallback = null,
    isAuthenticatedCallback = null,
    isNotAuthenticatedRedirect = "/login",
    isAuthenticatedRedirect = defaultLandingPage) => {

        if (!isAuthenticatedValue) {
            if (typeof isNotAuthenticatedCallback === "function") {
                isNotAuthenticatedCallback();
            } else {
                push(isNotAuthenticatedRedirect);
            }
        } else {
            if (typeof isAuthenticatedCallback === "function") {
                isAuthenticatedCallback();
            } else {
                push(isAuthenticatedRedirect);
            }
        }

}

/**
 * Attempts to authenticate the user with the username and password provided.
 * @param {string} username The user's username
 * @param {string} password The user's password
 * @param {function|null} successCallback The callback function when authentication was successful. This overrides the redirect behaviour
 * @param {function|null} failureCallback The callback function when authentication was NOT successful. This overrides the redirect behaviour
 * @param {string|null} successRedirect The page to redirect to when authentication succeeds
 */
export const authenticate = (
    username, 
    password, 
    successCallback, 
    failureCallback,
    successRedirect = defaultLandingPage) => {

        //TODO: Implement this function correctly. For now, this function just sets the isAuthenticated flag to true when called
        isAuthenticated.set(true);

        if (typeof successCallback === "function"){
            successCallback();
        } else {
            push(successRedirect);
        }
}

/**
 * Attempts to logout the current user
 * @param {function|null} logoutCallback The callback function that is called after a successful logout. This overrides the redirect behaviour
 * @param {function|null} errorCallback The callback function that is called when something goes wrong
 * @param {string|null} logoutRedirect The page to redirect to when logout succeeds
 */
export const logout = (
    logoutCallback, 
    errorCallback,
    logoutRedirect = "/login") => {

        //TODO: Implement this function properly. For now it just sets the "isAuthenticated" flag to false
        isAuthenticated.set(false);

        if (typeof logoutCallback === "function"){
            logoutCallback();
        } else {
            replace(logoutRedirect);
        }
}
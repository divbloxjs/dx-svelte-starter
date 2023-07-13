import { isAuthenticated } from "$src/lib/js/stores/authentication.store.js";
import { defaultLandingPage } from "$src/lib/js/stores/configurations.js";
import { get } from "svelte/store";
import { push, replace } from "svelte-spa-router";
import { updateProfilePicturePath } from "$src/lib/js/stores/userData.js";


/**
 * Checks whether the current user is authenticated and either redirects to a given page or calls a callback function, based
 * on the result.
 * @param {string|null} isNotAuthenticatedRedirect The page to redirect to when not authenticated. If set to null, no redirect will happen
 * @param {string|null} isAuthenticatedRedirect The page to redirect to when authenticated. If set to null, no redirect will happen
 * @returns {Promise<boolean>} True if the user is authenticated
 *
 */
export const checkAuthentication = async (
    isNotAuthenticatedRedirect = "/login",
    isAuthenticatedRedirect = defaultLandingPage
) => {
    if (!get(isAuthenticated)) {
        if (isNotAuthenticatedRedirect !== null) {
            push(isNotAuthenticatedRedirect);
        }

        return false;
    }

    if (isAuthenticatedRedirect !== null) {
        push(isAuthenticatedRedirect);
    }

    return true;
};

/**
 * Attempts to authenticate the user with the username and password provided.
 * @param {string} username The user's username
 * @param {string} password The user's password
 * @param {string|null} successRedirect The page to redirect to when authentication succeeds. If set to null, no redirect will happen
 * @returns {Promise<boolean>} True if the authentication was successful
 */
export const authenticate = async (username, password, successRedirect = defaultLandingPage) => {
    // TODO: Implement this function correctly.
    // For now, this function assumes a successful authentication and just sets the isAuthenticated flag to true when called
    isAuthenticated.set(true);

    // This updates the profilePicturePath store upon authentication to ensure synchronicity with server
    updateProfilePicturePath();

    if (successRedirect !== null) {
        push(successRedirect);
    }

    return get(isAuthenticated);
};

/**
 * Attempts to logout the current user
 * @param {string|null} logoutRedirect The page to redirect to when logout succeeds. If set to null, no redirect will happen
 * @returns {Promise<boolean>} True if the user was logged out successfully
 */
export const logout = async (logoutRedirect = "/login") => {
    //TODO: Implement this function properly. For now it just sets the "isAuthenticated" flag to false

    handleAfterLogout(logoutRedirect);

    return !get(isAuthenticated);
};

/**
 * Handles the after logout action
 * @param {string|null} logoutRedirect The page to redirect to after logout. If set to null, no redirect will happen
 */
export const handleAfterLogout = (logoutRedirect = "/login") => {
    isAuthenticated.set(false);
    if (logoutRedirect !== null) {
        replace(logoutRedirect);
    }
};
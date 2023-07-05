import { handleAfterLogout } from "$src/lib/js/api/authentication.api.js";
import { errorToast } from "$src/lib/js/utilities/swalMixins.utilities.js";
import { isAuthenticated } from "../stores/authentication.store";

/**
 * Wrapper function for a POST fetch that deals with fetch init and response handling
 *
 * @param {string} endpointUrl Base endpoint URL
 * @param {Object} urlSearchParams query parameters object
 * @param {Object} postBody Post body of the request
 * @param {boolean} showErrorAlert Whether or not to show a toast on error
 * @param {Object} customInit Any custom init required for the native fetch API - overwrites the default
 * @returns {Promise<{error:boolean}|null>} The JS object result of the response, or null if an unhandled error occurred
 */
export const dxPost = async (
    endpointUrl = "",
    urlSearchParams = {},
    postBody = {},
    showErrorAlert = false,
    customInit = {}
) => {
    const postInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    };

    postInit.body = JSON.stringify(postBody);

    Object.keys(customInit).forEach((initKey) => {
        postInit[initKey] = customInit[initKey];
    });

    return await dxFetch("POST", endpointUrl, urlSearchParams, postBody, showErrorAlert, postInit);
};

/**
 * Wrapper function for a POST fetch that deals with fetch init and response handling
 *
 * @param {string} endpointUrl Base endpoint URL
 * @param {Object} urlSearchParams query parameters object
 * @param {FormData} formData Post body of the request
 * @param {boolean} showErrorAlert Whether or not to show a toast on error
 * @param {Object} customInit Any custom init required for the native fetch API - overwrites the default
 * @returns {Promise<{error:boolean}|null>} The JS object result of the response, or null if an unhandled error occurred
 */
export const dxFormPost = async (
    endpointUrl = "",
    urlSearchParams = {},
    formData = new FormData(),
    showErrorAlert = false,
    customInit = {}
) => {
    const postInit = {
        method: "POST",
        credentials: "include",
    };

    postInit.body = formData;

    Object.keys(customInit).forEach((initKey) => {
        postInit[initKey] = customInit[initKey];
    });

    const url = new URL(endpointUrl);
    url.search = new URLSearchParams(urlSearchParams).toString();

    try {
        const response = await fetch(url, postInit);
        const responseCode = response.status;

        if (responseCode === 401) {
            isAuthenticated.set(false);
            showErrorAlert = false;
            throw new Error("Not authorized");
        }

        try {
            const result = await response.json();

            result.error = !response.ok;
            if (!response.ok) {
                const title = result.message ? result.message : "Something went wrong. <br>Please try again.";
                if (showErrorAlert) {
                    dxFetchErrorToast(title);
                }
            }

            return result;
        } catch (error) {
            if (showErrorAlert) {
                dxFetchErrorToast("Something went wrong. <br>Please try again.");
            }
            return { error: true };
        }
    } catch (error) {
        if (showErrorAlert) {
            dxFetchErrorToast("Something went wrong. <br>Please try again.");
        }
    }

    return { error: true };
};

/**
 * Wrapper function for a GET fetch that deals with fetch init and response handling
 *
 * @param {string} endpointUrl Base endpoint URL
 * @param {Object} urlSearchParams query parameters object
 * @param {boolean} showErrorAlert Whether or not to show a toast on error
 * @param {Object} customInit Any custom init required for the native fetch API - overwrites the default
 * @returns {Promise<{error:boolean}|null>} The JS object result of the response, or null if an unhandled error occurred
 */
export const dxGet = async (endpointUrl = "", urlSearchParams = {}, showErrorAlert = false, customInit = {}) => {
    const getInit = {
        method: "GET",
        credentials: "include",
    };

    Object.keys(customInit).forEach((initKey) => {
        getInit[initKey] = customInit[initKey];
    });

    return await dxFetch("GET", endpointUrl, urlSearchParams, {}, showErrorAlert, getInit);
};

/**
 * Wrapper function for a PUT fetch that deals with fetch init and response handling
 *
 * @param {string} endpointUrl Base endpoint URL
 * @param {Object} urlSearchParams query parameters object
 * @param {Object} postBody Post body of the request
 * @param {boolean} showErrorAlert Whether or not to show a toast on error
 * @param {Object} customInit Any custom init required for the native fetch API - overwrites the default
 * @returns {Promise<{error:boolean}|null>} The JS object result of the response, or null if an unhandled error occurred
 */
export const dxPut = async (
    endpointUrl = "",
    urlSearchParams = {},
    postBody = {},
    showErrorAlert = false,
    customInit = {}
) => {
    const putInit = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    };

    putInit.body = JSON.stringify(postBody);

    Object.keys(customInit).forEach((initKey) => {
        putInit[initKey] = customInit[initKey];
    });

    return await dxFetch("PUT", endpointUrl, urlSearchParams, {}, showErrorAlert, putInit);
};

/**
 * Wrapper function for a PATCH fetch that deals with fetch init and response handling
 *
 * @param {string} endpointUrl Base endpoint URL
 * @param {Object} urlSearchParams query parameters object
 * @param {Object} postBody Post body of the request
 * @param {boolean} showErrorAlert Whether or not to show a toast on error
 * @param {Object} customInit Any custom init required for the native fetch API - overwrites the default
 * @returns {Promise<{error:boolean}|null>} The JS object result of the response, or null if an unhandled error occurred
 */
export const dxPatch = async (
    endpointUrl = "",
    urlSearchParams = {},
    postBody = {},
    showErrorAlert = false,
    customInit = {}
) => {
    const putInit = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    };

    putInit.body = JSON.stringify(postBody);

    Object.keys(customInit).forEach((initKey) => {
        putInit[initKey] = customInit[initKey];
    });

    return await dxFetch("PATCH", endpointUrl, urlSearchParams, {}, showErrorAlert, putInit);
};

/**
 * Wrapper function for a DELETE fetch that deals with fetch init and response handling
 *
 * @param {string} endpointUrl Base endpoint URL
 * @param {Object} urlSearchParams query parameters object
 * @param {Object} postBody Post body of the request
 * @param {boolean} showErrorAlert Whether or not to show a toast on error
 * @param {Object} customInit Any custom init required for the native fetch API - overwrites the default
 * @returns {Promise<{error:boolean}|null>} The JS object result of the response, or null if an unhandled error occurred
 */
export const dxDelete = async (
    endpointUrl = "",
    urlSearchParams = {},
    postBody = {},
    showErrorAlert = false,
    customInit = {}
) => {
    const putInit = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    };

    putInit.body = JSON.stringify(postBody);

    Object.keys(customInit).forEach((initKey) => {
        putInit[initKey] = customInit[initKey];
    });

    return await dxFetch("DELETE", endpointUrl, urlSearchParams, {}, showErrorAlert, putInit);
};

/**
 * Wrapper function for fetch that deals with fetch init and response handling
 *
 * @param {string} method HTTP method to use
 * @param {string} endpointUrl Base endpoint URL
 * @param {Object} urlSearchParams query parameters object
 * @param {Object} postBody Post body of the request
 * @param {boolean} showErrorAlert Whether or not to show a toast on error
 * @param {Object} customInit Any custom init required for the native fetch API - overwrites the default
 * @returns {Promise<{error:boolean}|null>} The JS object result of the response, or null if an unhandled error occurred
 */
export const dxFetch = async (
    method = "GET",
    endpointUrl = "",
    urlSearchParams = {},
    postBody = {},
    showErrorAlert = false,
    customInit = {}
) => {
    const postInit = {
        method: method,
        credentials: "include",
    };

    if (Object.keys(postBody) > 0) {
        postInit.body = JSON.stringify(postBody);
    }

    Object.keys(customInit).forEach((initKey) => {
        postInit[initKey] = customInit[initKey];
    });

    const url = new URL(endpointUrl);
    url.search = new URLSearchParams(urlSearchParams).toString();

    try {
        const response = await fetch(url, postInit);
        const responseCode = response.status;

        if (responseCode === 401) {
            isAuthenticated.set(false);
            showErrorAlert = false;
            throw new Error("Not authorized");
        }

        try {
            const result = await response.json();

            result.error = !response.ok;
            if (!response.ok) {
                const title = result.message ? result.message : "Something went wrong. <br>Please try again.";
                if (showErrorAlert) {
                    dxFetchErrorToast(title);
                }
            }

            return result;
        } catch (error) {
            if (showErrorAlert) {
                dxFetchErrorToast("Something went wrong. <br>Please try again.");
            }
            return { error: true };
        }
    } catch (error) {
        if (showErrorAlert) {
            dxFetchErrorToast("Something went wrong. <br>Please try again.");
        }
    }

    return { error: true };
};

const handleFetchResponse = async (response, showErrorAlert = false) => {
    const responseCode = response.status;
    let responseOk = response.ok;

    switch (responseCode) {
        case 401:
            handleAfterLogout();
            if (showErrorAlert) {
                dxFetchErrorToast("You have been logged out");
            }
            throw new Error("Not authorized");
    }

    return responseOk;
};

export let dxFetchErrorToast = (title) => {
    errorToast.fire({
        html: title,
        confirmButtonText: "OK",
        timer: 5000,
    });
};

import { handleAfterLogout } from "../stores/authentication";
import defaultImage from "../../../assets/images/no_image.svg";
export const defaultImagePath = defaultImage;

/**
 *
 * @param {number} responseCode - HTTP response code received
 */
export const handleFetchResponse = (responseCode) => {
    switch (responseCode) {
        case 401:
            handleAfterLogout();
            break;
        default:
            break;
    }
};

export const disableNonNumericInput = (event) => {
    if (event.which < 48 || event.which > 57) {
        event.preventDefault();
    }
};

export const asyncTimeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const sleep = async (fn, ...args) => {
    await asyncTimeout(3000);
    return fn(...args);
};

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

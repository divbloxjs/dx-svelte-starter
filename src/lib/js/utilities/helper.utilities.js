import defaultImage from "../../../assets/images/no_image.svg";
export const defaultImagePath = defaultImage;

export const disableNonNumericInput = (event) => {
    if (event.which < 48 || event.which > 57) {
        event.preventDefault();
    }
};

export const asyncTimeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const sleep = async (fn, timeOut = 3000, ...args) => {
    await asyncTimeout(timeOut);
    return fn(...args);
};

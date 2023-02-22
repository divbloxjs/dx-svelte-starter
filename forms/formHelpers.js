export const handleKeypress = async (keypress) => {
    if (keypress === 13) {
        doCreateFormName();
    }
};

export const resetForm = async (formInputs) => {
    Object.keys(formInputs).forEach((attributeName) => {
        formInputs[attributeName].component.resetInput();
    });
};

export const validateForm = async (formInputs) => {
    let isValid = true;

    for (const attributeName of Object.keys(formInputs)) {
        // @ts-ignore
        isValid &= await formInputs[attributeName].component.validate(true);
    }

    // Other custom validations

    return Boolean(isValid); // &&= vs &=, &&= for some reason stops 2+ components validating.
};

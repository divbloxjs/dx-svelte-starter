const fs = require("fs");
const fsAsync = require("fs").promises;
const dxUtils = require("dx-utilities");

const defaultFormFolderPath = "forms/";
const formGenerationRoot = "dx_tools/form_generation/";
const baseFormPath = formGenerationRoot + "base-form.tpl";
const baseCreateFormPath = formGenerationRoot + "base-create.tpl";
const baseUpdateFormPath = formGenerationRoot + "base-update-form.tpl";
const defaultFormButtonsPath = formGenerationRoot + "default-form-buttons.json";
const defaultFormActionsPath = formGenerationRoot + "default-form-actions.json";

const generateDxForm = async () => {
    const formConfigString = await getFormConfigData();

    const formConfigObj = await validateFormConfigData(formConfigString);

    Object.entries(formConfigObj).forEach(([formName, formConfig]) => {
        const formFileString = await createFormFile(formConfig);

        let finalFormPath = await dxUtils.getCommandLineInput(
            "Please provide the path you would like to save the form (Defaults to forms/" + formName + "):"
        );
    
        if (!finalFormPath) {
            finalFormPath = defaultFormFolderPath + formName;
        }
    
        await writeFormIntoFile(finalFormPath, formFileString);
    })


};

// dx_tools/form_generation/example-form.json

const getFormConfigData = async () => {
    const formConfigPath = await dxUtils.getCommandLineInput("Please provide a path for your form config JSON file:");

    try {
        if (!fs.existsSync(formConfigPath)) {
            dxUtils.printErrorMessage(
                "Could not open '" +
                    formConfigPath +
                    "'. Does this file exist? Remember to specify the path from the root of your project."
            );
            process.exit(1);
        }
    } catch (error) {
        dxUtils.printErrorMessage(error);
        process.exit(1);
    }

    try {
        const formConfigBuffer = await fsAsync.readFile(formConfigPath);
        return formConfigBuffer.toString();
    } catch (error) {
        dxUtils.printErrorMessage(error);
        process.exit(1);
    }
};

const validateFormConfigData = async (formConfigString = "") => {
    if (!dxUtils.isJsonString(formConfigString)) {
        dxUtils.printErrorMessage("Invalid JSON provided.");
        process.exit(1);
    }

    const formConfig = JSON.parse(formConfigString);
    if 

    if (!formConfig.hasOwnProperty("name")) {
        dxUtils.printErrorMessage("No valid form name provided.");
        process.exit(1);
    }

    if (!formConfig.hasOwnProperty("elements")) {
        dxUtils.printErrorMessage("No valid elements provided.");
        process.exit(1);
    }

    if (!formConfig.hasOwnProperty("data")) {
        dxUtils.printErrorMessage("No valid data endpoints provided.");
        process.exit(1);
    }

    if (!formConfig.hasOwnProperty("actions")) {
        dxUtils.printErrorMessage("No valid actions provided.");
        process.exit(1);
    }

    // TODO more robust property checks

    return formConfig;
};

// dx_tools/form_generation/example-form.json
const createFormFile = async (formConfig) => {
    const { elements, data, actions } = formConfig;
    const formType = formConfig.formType;
    const JsHtml = await createJsHtml(formType);
    const elementHtml = await createElementHtml(elements);

    return JsHtml + elementHtml;
};

const createJsHtml = async (formType) => {
    try {
        const baseFormTemplateBuffer = await fsAsync.readFile(baseCreateFormPath);
        let baseFormTemplateString = baseFormTemplateBuffer.toString();
        baseFormTemplateString = baseFormTemplateString.replace("((js))", 'let x = "1"');
        return baseFormTemplateString;
    } catch (error) {
        dxUtils.printErrorMessage(error);
        process.exit(1);
    }
};

const createElementHtml = async (elements) => {
    let inputHtmlArray = [];
    for (const [elementName, elementData] of Object.entries(elements)) {
        switch (elementName) {
            case "btnCreate":
            case "btnUpdate":
            case "btnDelete":
                inputHtmlArray[elementName] = await buildButtonHtml(elementName, elementData);
                continue;
        }

        let inputHtmlTemplatePath = null;
        switch (elementData.inputType) {
            case "text":
                inputHtmlTemplatePath = "dx_tools/form_generation/partials/_validatedInputHtml.tpl";
                break;
        }

        try {
            const inputHtmlTemplateBuffer = await fsAsync.readFile(inputHtmlTemplatePath);
            let inputHtmlTemplateString = inputHtmlTemplateBuffer.toString();

            inputHtmlTemplateString = inputHtmlTemplateString.replace("((displayLabel))", elementData.displayLabel);
            inputHtmlTemplateString = inputHtmlTemplateString.replace("((validateAs))", elementData.validateAs);

            for (let [propertyName, propertyValue] of Object.entries(elementData.options)) {
                inputHtmlTemplateString = inputHtmlTemplateString.replace("((" + propertyName + "))", propertyValue);
            }

            inputHtmlArray[elementName] = inputHtmlTemplateString;
        } catch (error) {
            dxUtils.printErrorMessage(error);
            process.exit(1);
        }
    }

    console.log("inputHtmlArray", inputHtmlArray);
    inputHtmlArray = Object.values(inputHtmlArray).join("\n");
    console.log("inputHtmlArray", inputHtmlArray);
    return inputHtmlArray;
};

//#region Inner workings
const buildButtonHtml = async (buttonType, formButtonConfig) => {
    const buttonHtmlTemplatePath = formGenerationRoot + "partials/_buttonHtml.tpl";
    let buttonHtmlTemplateString;
    try {
        const buttonHtmlTemplateBuffer = await fsAsync.readFile(buttonHtmlTemplatePath);
        buttonHtmlTemplateString = buttonHtmlTemplateBuffer.toString();
    } catch (error) {
        dxUtils.printErrorMessage(error);
        process.exit(1);
    }

    let defaultFormButtonsConfig;
    try {
        const defaultFormButtonsBuffer = await fsAsync.readFile(defaultFormButtonsPath);
        const defaultFormButtonsString = defaultFormButtonsBuffer.toString();
        defaultFormButtonsConfig = JSON.parse(defaultFormButtonsString);
    } catch (error) {
        dxUtils.printErrorMessage(error);
        process.exit(1);
    }

    if (formButtonConfig === true) {
        formButtonConfig = defaultFormButtonsConfig[buttonType];
    } else if (formButtonConfig === false) {
        return "";
    }

    console.log("formButtonConfig", formButtonConfig);
    // buttonHtmlTemplateString = buttonHtmlTemplateString.replace("((displayLabel))", formButtonConfig.options.btnText);

    for (let [name, value] of Object.entries(formButtonConfig.options)) {
        console.log("name", name);
        console.log("value", value);
        if (configuredDataActions.includes(value)) {
            value = value.toLowerCase();
        }

        buttonHtmlTemplateString = buttonHtmlTemplateString.replace("((" + name + "))", value);
    }
    return buttonHtmlTemplateString;
};

const configuredDataActions = ["POST", "PUT", "DELETE", "GET"];
// dx_tools/form_generation/example-form.json
//#endregion

const writeFormIntoFile = async (finalFormPath, formFileString) => {
    if (fs.existsSync(finalFormPath + ".svelte")) {
        dxUtils.printErrorMessage("Warning! A file already exists with path '" + finalFormPath + ".svelte'.");
        const overWriteFile = await dxUtils.getCommandLineInput("Would you like to overwrite it? [y/n]");

        if (overWriteFile.toLowerCase() !== "y") {
            dxUtils.printFormattedMessage("Ending process. Try again with a non-existent form name");
            process.exit(1);
        }
    }

    if (!fs.existsSync(defaultFormFolderPath)) {
        fs.mkdirSync(defaultFormFolderPath, { recursive: true });
    }

    try {
        await fsAsync.writeFile(finalFormPath + ".svelte", formFileString);
        console.log("formFileString", formFileString);
        dxUtils.printSuccessMessage("Form successfully saved!");
    } catch (error) {
        dxUtils.printErrorMessage("Failed to save form:\n " + error);
    }
};

generateDxForm();

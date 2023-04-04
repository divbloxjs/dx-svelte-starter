#!/usr/bin/env node

const fs = require("fs");
const fsAsync = require("fs").promises;
const path = require("path");
const dxUtils = require("dx-utilities");
const PUBLIC_DIR = path.join(__dirname, ".", "public");
const serviceWorkerFilePath = PUBLIC_DIR + "/serviceWorker.js";
const appConfigFilePath = "./app.config.json";

const getServiceWorkerContents = async () => {
    try {
        if (!fs.existsSync(serviceWorkerFilePath)) {
            dxUtils.printErrorMessage(
                "Path to 'serviceWorker.js' is not valid. Expecting '" + serviceWorkerFilePath + "'"
            );
            return null;
        }
    } catch (err) {
        dxUtils.printErrorMessage(err);
        return null;
    }

    const fileContentBuffer = await fsAsync.readFile(serviceWorkerFilePath);
    return fileContentBuffer.toString();
};

const updateServiceWorkerContents = async (currentContents = "") => {
    if (currentContents === null) {
        dxUtils.printErrorMessage("Invalid service worker content found!");
        return;
    }

    dxUtils.printInfoMessage("Updating service worker content");

    const currentTime = Date.now();

    const generatedCodeTemplate =
        "//////////////////////////////////////////\n" +
        "// DIVBLOX GENERATED CODE - DO NOT MODIFY!\n" +
        'const dxBuildTimeStamp = "' +
        currentTime +
        '";\n' +
        "const fcmConfig = " +
        JSON.stringify(await getFcmConfig(), null, 4) +
        ";\n" +
        "//////////////////////////////////////////\n" +
        "// DIVBLOX GENERATED CODE - ENDS\n";

    if (currentContents.indexOf("DIVBLOX GENERATED CODE") < 0) {
        // This means the Divblox generated code does not exist, so we can safely add it.
        currentContents = generatedCodeTemplate + currentContents;
    } else {
        // This means the Divblox generated code exists, so we can safely replace it.
        const generatedCodeEndTag = "// DIVBLOX GENERATED CODE - ENDS";
        if (currentContents.indexOf(generatedCodeEndTag) === -1) {
            dxUtils.printErrorMessage(
                'Failed to update service worker contents:\nThe tag "// DIVBLOX GENERATED CODE - ENDS" is not present. Please update the service worker manually'
            );

            return;
        }
        const generatedCodeEndIndex = currentContents.indexOf(generatedCodeEndTag) + generatedCodeEndTag.length + 1;
        currentContents = generatedCodeTemplate + currentContents.substring(generatedCodeEndIndex);
    }

    try {
        await fsAsync.writeFile(serviceWorkerFilePath, currentContents);
        dxUtils.printSuccessMessage("Service worker cache updated!");
    } catch (err) {
        dxUtils.printErrorMessage("Failed to update service worker contents:\n " + err);
    }
};

const runDxPreBuild = async () => {
    dxUtils.printHeadingMessage("Running Divblox pre build functions");
    dxUtils.printSubHeadingMessage("Updating service worker cache");
    await updateServiceWorkerContents(await getServiceWorkerContents());
};

const getFcmConfig = async () => {
    try {
        if (!fs.existsSync(appConfigFilePath)) {
            dxUtils.printErrorMessage("Path to 'app.config.json' is not valid. Expecting '" + appConfigFilePath + "'");
            return null;
        }
    } catch (err) {
        dxUtils.printErrorMessage(err);
        return null;
    }
    const fileContentBuffer = await fsAsync.readFile(appConfigFilePath);
    const appConfig = JSON.parse(fileContentBuffer.toString());
    return appConfig.pushNotifications;
};

runDxPreBuild();

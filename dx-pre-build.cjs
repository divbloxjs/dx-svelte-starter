#!/usr/bin/env node

const fs = require("fs");
const fsAsync = require("fs").promises;
const path = require("path");
const dxUtils = require("dx-utils");
const PUBLIC_DIR = path.join(__dirname, ".", "public");
const serviceWorkerFilePath = PUBLIC_DIR + "/serviceWorker.js";

const getServiceWorkerContents = async () => {
    try {
        if (!fs.existsSync(serviceWorkerFilePath)) {
            dxUtils.printErrorMessage(
                "Path to 'serviceWorker.js' is not valid. Expecting '" +
                    serviceWorkerFilePath +
                    "'"
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
        "//////////////////////////////////////////\n";

    if (currentContents.indexOf("DIVBLOX GENERATED CODE") < 0) {
        // This means the Divblox generated code does not exist, so we can safely add it.
        currentContents = generatedCodeTemplate + currentContents;
    } else {
        // This means the Divblox generated code exists, so we can safely replace it.

        // break the currentContents into an array of lines
        const lines = currentContents.split("\n");
        // remove 4 lines, starting at the first position
        lines.splice(0, 4);
        // join the array back into a single string
        currentContents = generatedCodeTemplate + lines.join("\n");
    }

    try {
        await fsAsync.writeFile(serviceWorkerFilePath, currentContents);
        dxUtils.printSuccessMessage("Service worker cache updated!");
    } catch (err) {
        dxUtils.printErrorMessage(
            "Failed to update service worker contents:\n " + err
        );
    }
};

const runDxPreBuild = async () => {
    dxUtils.printHeadingMessage("Running Divblox pre build functions");
    dxUtils.printSubHeadingMessage("Updating service worker cache");
    await updateServiceWorkerContents(await getServiceWorkerContents());
};

runDxPreBuild();

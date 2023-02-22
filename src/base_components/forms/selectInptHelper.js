export const getOptionsArray = (dataArray, keyToUseForUniqueId, keyToUseForDisplayLabel) => {
    let options = {};
    dataArray.forEach((data) => {
        options[data[keyToUseForUniqueId]] = data[keyToUseForDisplayLabel];
    });

    return options;
};

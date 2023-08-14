class StorageHelper {
    constructor() {}

    GetLocalData(key) {
        return window.localStorage.getItem(key);
    }

    async GetExtensionData(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([key], function (result) {
                if (result[key] === undefined) {
                    reject();
                } else {
                    resolve(result[key]);
                }
            });
        });
    }

    GetAllItems() {
        return Object.entries(window.localStorage);
    }

    SaveData(key, value) {
        var StringData = JSON.stringify(value);
        if (window.IsExtension) {
            chrome.storage.local.set({ [key]: StringData });
        }
        window.localStorage.setItem(key, StringData);
        try {
            window.Settings.UpdateDataSize();
        } catch {}
    }
}

export default new StorageHelper();

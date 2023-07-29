window.Http = {
    GetImageBase64: (url) => DownloadBase64Image(url),
    GetFaviconBase64: (url) => DownloadBase64Image(url, true),
};

async function DownloadBase64Image(url, type) {
    try {
        var data;
        if (type) {
            data = await fetch(
                "https://api.fluxpoint.dev/hpp_getimage?url=" + url + "&favicon"
            );
        } else {
            data = await fetch(
                "https://api.fluxpoint.dev/hpp_getimage?url=" + url
            );
        }

        if (!data.ok) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }

        var json = await data.json();

        return new Promise((resolve) => {
            resolve(json);
        });
    } catch {}
    return new Promise((resolve) => {
        resolve(null);
    });
}

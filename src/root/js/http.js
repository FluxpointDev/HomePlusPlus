window.Http = {
    GetImageBase64: (url) => DownloadBase64Image(url),
    GetImageFormBase64: (url, formData) =>
        DownloadBase64Image(url, false, formData),
    GetFaviconBase64: (url) => DownloadBase64Image(url, true),
};

async function DownloadBase64Image(url, type, formData) {
    try {
        var response;
        if (type) {
            response = await fetch(
                "https://api.fluxpoint.dev/hpp_getimage?url=" + url + "&favicon"
            );
        } else {
            if (formData) {
                console.log("FORM");
                response = await fetch(
                    "https://api.fluxpoint.dev/hpp_getimage",
                    {
                        method: "POST", // *GET, POST, PUT, DELETE, etc.
                        mode: "cors", // no-cors, *cors, same-origin
                        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                        headers: {
                            "Sec-Fetch-Mode": "cors",
                            "Content-Type": formData.Type,
                            TE: "trailers",
                        },
                        body: formData.Image,
                    }
                );
            } else {
                response = await fetch(
                    "https://api.fluxpoint.dev/hpp_getimage?url=" + url
                );
            }
        }

        console.log(response);

        if (!response || !response.ok) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }

        var json = await response.json();

        return new Promise((resolve) => {
            resolve(json);
        });
    } catch {}
    return new Promise((resolve) => {
        resolve(null);
    });
}

class HttpModule {
    constructor() {
        this.BaseUrl = "https://api.fluxpoint.dev/hpp_getimage";
    }

    async GetFaviconBase64(url) {
        return await this.SendRequest(
            this.BaseUrl + "?url=" + url + "&favicon"
        );
    }

    async GetImageBase64(url) {
        return await this.SendRequest(this.BaseUrl + "?url=" + url);
    }

    async GetBackgroundUploadBase64(data) {
        return await this.SendFormData(this.BaseUrl, data);
    }

    async SendRequest(url) {
        try {
            var response = await fetch(url);

            if (!response || !response.ok) {
                throw Error("Error response");
            }

            var json = await response.json();

            return new Promise((resolve) => {
                resolve(json);
            });
        } catch (error) {
            throw Error("Failed to send request: " + error);
        }
    }

    async SendFormData(url, data) {
        try {
            var response = await fetch(url, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    "Sec-Fetch-Mode": "cors",
                    "Content-Type": formData.Type,
                    TE: "trailers",
                },
                body: formData.Image,
            });

            if (!response || !response.ok) {
                throw Error("Error response.");
            }

            var json = await response.json();

            return new Promise((resolve) => {
                resolve(json);
            });
        } catch (error) {
            throw Error("Failed to post request: " + error);
        }
    }
}

export default new HttpModule();

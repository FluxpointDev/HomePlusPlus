class UtilsModule {
    HexToRGB(hex) {
        if (hex.startsWith("#")) {
            hex = hex.substring(1);
        }
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;

        return r + "," + g + "," + b;
    }

    SetDocumentStyle(key, style) {
        document.documentElement.style.setProperty(key, style);
    }

    GenerateRandomID() {
        var length = 10;
        var chars =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz".split(
                ""
            );

        if (!length) {
            length = Math.floor(Math.random() * chars.length);
        }

        var str = "";
        for (var i = 0; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }
}

export default new UtilsModule();

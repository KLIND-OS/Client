// In webview preload

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info
 *
 **/
var Base64 = {
  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output =
        output +
        this._keyStr.charAt(enc1) +
        this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) +
        this._keyStr.charAt(enc4);
    } // Whend

    return output;
  }, // End Function encode

  // public method for decoding
  decode: function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }

      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    } // Whend

    output = Base64._utf8_decode(output);

    return output;
  }, // End Function decode

  // private method for UTF-8 encoding
  _utf8_encode: function (string) {
    var utftext = "";
    string = string.replace(/\r\n/g, "\n");

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    } // Next n

    return utftext;
  }, // End Function _utf8_encode

  // private method for UTF-8 decoding
  _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c, c1, c2, c3;
    c = c1 = c2 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63),
        );
        i += 3;
      }
    } // Whend

    return string;
  }, // End Function _utf8_decode
};

const fs = require("fs");
const os = require("os");
const pathmodule = require("path");
const { promisify } = require("util");
const mimeTypes = require("mime-types");

const exists = promisify(fs.exists);
const fsReadFile = promisify(fs.readFile);

function showfilemanager(el) {
  var main = document.createElement("div");
  main.style.display = "flex";
  main.style.position = "absolute";
  main.style.zIndex = "6156816231";
  main.style.height = "100vh";
  main.style.width = "100vw";
  main.style.top = "0";
  main.style.left = "0";
  main.style.alignItems = "center";
  main.style.justifyContent = "center";
  main.style.background = "white";
  var inner = document.createElement("div");
  inner.style.height = "100px";
  inner.style.width = "300px";
  inner.style.background = "white";
  inner.style.borderRadius = "15px";
  var h1 = document.createElement("h1");
  h1.textContent = "Zadejte cestu k souboru který chcete nahrát";
  inner.appendChild(h1);
  var input = document.createElement("input");
  input.placeholder = "Zadejte cestu např /moje-dokumenty/hesla.txt";
  input.classList.add("inputvalue");
  inner.appendChild(input);
  var submit = document.createElement("button");
  submit.textContent = "Nahrát";
  submit.onclick = async () => {
    async function getFile(location) {
      const filepath = pathmodule.join(os.homedir() + "/usrfiles", location);

      if (!(await exists(filepath))) {
        return true;
      }

      return await fsReadFile(filepath, "binary");
    }
    const path = input.value;
    const fls = await getFile(path);
    if (fls === false) {
      main.remove();
      alert("Soubor neexistuje!");
      return;
    }
    const binaryData = fls;
    const buffer = new ArrayBuffer(binaryData.length);
    const bufferView = new Uint8Array(buffer);
    for (let i = 0; i < binaryData.length; i++) {
      bufferView[i] = binaryData.charCodeAt(i);
    }

    var mimeType = "application/octet-stream";
    if (path.includes(".")) {
      const parts = path.split(".");
      const fileExtension = parts[parts.length - 1];
      mimeType = mimeTypes.lookup(fileExtension);
    }
    var blob = new Blob([buffer], { type: mimeType });
    const parts = path.split("/");
    const filename = parts[parts.length - 1];
    var file = new window.File([blob], filename, {
      type: mimeType,
    });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    el.files = dataTransfer.files;
    el.dispatchEvent(new Event("change"));
    main.remove();
  };
  inner.appendChild(submit);
  main.appendChild(inner);
  document.body.appendChild(main);
}

var doneInputs = [];
setInterval(() => {
  document.querySelectorAll("input[type='file']").forEach((input) => {
    if (doneInputs.includes(input)) return;
    doneInputs.push(input);
    input.addEventListener("click", (e) => {
      e.preventDefault();
      showfilemanager(e.target);
    });
  });
}, 200);

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.color = "black";
});

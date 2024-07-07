const fs = require("fs");
const os = require("os");
const pathmodule = require("path");
const { promisify } = require("util");
const mimeTypes = require("mime-types");

const exists = promisify(fs.exists);
const fsReadFile = promisify(fs.readFile);

// This is huge hack and like 99% time it will not work.

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

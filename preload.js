const fs = require("fs");
const fsExtra = require("fs-extra");
const { promisify } = require("util");
const mimeTypes = require("mime-types");

if (
  window.location.hostname !== "localhost" ||
  (window.location.port != 10000 &&
    window.location.pathname !== "/security.html")
) {
  if (
    window.location.protocol === "file:" &&
    !window.location.href.endsWith("/errors/noserver.html")
  ) {
    window.location.replace("http://localhost:10000/security.html");
  } else if (window.location.protocol !== "file:") {
    window.location.replace("http://localhost:10000/security.html");
  }
}

var doneInputs = [];
setInterval(() => {
  document.querySelectorAll("input[type='file']").forEach((input) => {
    if (doneInputs.includes(input)) return;
    doneInputs.push(input);
    input.addEventListener("click", (e) => {
      e.preventDefault();
      window.control.fileManager.fileSelect({
        success: async (path) => {
          const binaryData = await mainFileManager.getContent(path);
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
          e.target.files = dataTransfer.files;
          e.target.dispatchEvent(new Event("change"));
        },
        closed: () => {},
      });
    });
  });
}, 200);

var doneIframes = [];
setInterval(() => {
  document.querySelectorAll("iframe").forEach((iframe) => {
    if (doneIframes.includes(iframe)) return;
    doneIframes.push(iframe);
    iframe.addEventListener("load", (e) => {
      e.target.contentWindow.eval(`var doneInputs = []
            setInterval(() => {
               document.querySelectorAll("input[type='file']").forEach(input => {
                   if (doneInputs.includes(input)) return
                   doneInputs.push(input)
                   input.addEventListener("click", (e) => {
                       e.preventDefault();
                       parent.control.fileManager.fileSelect({
                           success: async (path) => {
                               const binaryData = await mainFileManager.getContent(path);
                               const buffer = new ArrayBuffer(binaryData.length);
                               const bufferView = new Uint8Array(buffer);
                               for (let i = 0; i < binaryData.length; i++) {
                                 bufferView[i] = binaryData.charCodeAt(i);
                               }
                               var mimeType = "application/octet-stream"
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
                               e.target.files = dataTransfer.files;
                               e.target.dispatchEvent(new Event('change'));
                           },
                           closed: () => {}
                       })
                   })
               })
           }, 200);`);
    });
  });
}, 200);

var doneA = [];
setInterval(() => {
  document.querySelectorAll("a").forEach((a) => {
    if (doneA.includes(a)) return;
    doneA.push(a);
    a.setAttribute("target", "_blank");
  });
}, 200);

class LowLevelApi {
  static Volume = require("./modules/output_sound");
  static Printers = require("./modules/printers");
  static Packages = require("./modules/packages");
  static Power = require("./modules/power");
  static InputSound = require("./modules/input_sound");
  static HID = require("./modules/HID");
  static Apps = require("./modules/apps");
  static Updates = require("./modules/updates");
  static Logs = require("./modules/logs");
  static Branch = require("./modules/branch");
  static child_process = require("child_process");
  static process = process;
  static filesystem = {
    fs: require("fs"),
    promisify: promisify,
    readdir: promisify(fs.readdir),
    stat: promisify(fs.stat),
    path: require("path"),
    os: require("os"),
    unlink: promisify(fs.unlink),
    rm: promisify(fs.rm),
    mkdir: promisify(fs.mkdir),
    exists: async function (path) {
      try {
        await promisify(fs.access)(path, fs.constants.F_OK);
        return true;
      } catch (error) {
        return false;
      }
    },
    rename: promisify(fs.rename),
    writeFile: promisify(fs.writeFile),
    readFile: promisify(fs.readFile),
    open: promisify(fs.open),
    mimeTypes: mimeTypes,
    migrations: {
      migrateToBinary: require("./filemanagement/migrations/migrateToBinary"),
    },
    fsExtra: fsExtra,
  };
  static DiskManagement = require("./filemanagement/diskmanagement");
  static Battery = require("./modules/battery");
  static setZoom = require("./modules/zoom");
  static Debugging = require("./modules/debugging");
  static NodePackages = require("./modules/nodePackages");
  static Program = require("./modules/program");
}
window.LowLevelApi = LowLevelApi;

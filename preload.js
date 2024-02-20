const fs = require("fs");
const path = require("path");
const mime = require("mime");
const { exec } = require("child_process");
const sudo = require("sudo-prompt");
const storage = require("electron-json-storage");
const os = require("os");
const { promisify } = require("util");
const mimeTypes = require("mime-types");
window.tempDataInfo = "";

storage.setDataPath(path.join(os.homedir(), "usrfiles"));
window.storage = storage;

const originalget = window.storage.get;
window.storage.get = (key, options, callback) => {
  key = key.replaceAll("/", "$");
  return originalget(key, options, callback);
};

const originalGetMany = window.storage.getMany;
window.storage.getMany = (keys, options, callback) => {
  keys = keys.map((path) => path.replaceAll("/", "$"));
  return originalGetMany(keys, options, callback);
};

const originalGetSync = window.storage.getSync;
window.storage.getSync = (key, options) => {
  key = key.replaceAll("/", "$");
  return originalGetSync(key, options);
};

const originalHas = window.storage.has;
window.storage.has = (key, options, callback) => {
  key = key.replaceAll("/", "$");
  return originalHas(key, options, callback);
};

const originalRemove = window.storage.remove;
window.storage.remove = (key, options, callback) => {
  key = key.replaceAll("/", "$");
  return originalRemove(key, options, callback);
};

const originalSet = window.storage.set;
window.storage.set = (key, json, options, callback, retries) => {
  key = key.replaceAll("/", "$");
  return originalSet(key, json, options, callback, retries);
};

const originalSetSync = window.storage.setSync;
window.storage.setSync = (key, json, options) => {
  key = key.replaceAll("/", "$");
  return originalSetSync(key, json, options);
};

if (
  window.location.hostname !== "localhost" ||
  (window.location.port != 10000 &&
    window.location.pathname !== "/security.html")
) {
  window.location.replace("http://localhost:10000/security.html");
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
          var uint8Array = new Uint8Array(binaryData);
          var mimeType = "application/octet-stream";
          if (path.includes(".")) {
            const parts = path.split(".");
            const fileExtension = parts[parts.length - 1];
            mimeType = mimeTypes.lookup(fileExtension);
          }
          var blob = new Blob([uint8Array], { type: mimeType });
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
                               var uint8Array = new Uint8Array(binaryData);
                               var mimeType = "application/octet-stream"
                               if (path.includes(".")) {
                                 const parts = path.split(".");
                                 const fileExtension = parts[parts.length - 1];
                                 mimeType = mimeTypes.lookup(fileExtension);
                               }
                               var blob = new Blob([uint8Array], { type: mimeType });
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
      migrateToBinary: require("./filemanagement/migrations/migrateToBinary")
    }
  };
  static DiskManagement = require("./filemanagement/diskmanagement");
}
window.LowLevelApi = LowLevelApi;

const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");
const { URL } = require("url");
var setupDisks = require("./modules/disks");
var setupScripts = require("./modules/scripts")
const Base64 = require("./modules/base64")
var XMLHttpRequest = require('xhr2');

var runningAsDev = process.argv[2] == "dev"

var win;
function createWindow() {
  win = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js'),
      icon: path.join(__dirname, "logo.png"),
      contextIsolation: false,
      sandbox: false
    },
  });
  globalShortcut.register("F12", () => {
    win.webContents.toggleDevTools();
  });
  win.loadURL("http://localhost:10000");
  win.setMenu(null);
  ipcMain.on("getLocalStorage", (event, data) => {
    win.webContents.executeJavaScript("storage.getAll((x, e) => {window.tempDataInfo = e})")
    setTimeout(() => {
      win.webContents.executeJavaScript("window.tempDataInfo")
      .then(result => {
        event.reply(data, result)
      })
    }, 2000)
  })
  // Set custom download dialog
  win.webContents.session.on("will-download", async (event, item) => {
    event.preventDefault();
    const url = item.getURL();
    const name = item.getFilename();
    await win.webContents.executeJavaScript(`downloadStatusStorage.push(new DownloadStatus("${name}"))`);
    const downloadStatusNumber = await win.webContents.executeJavaScript(`downloadStatusStorage.length - 1`);
    if (new URL(url).protocol == "data:") {
      await win.webContents.executeJavaScript(`downloadStatusStorage[${downloadStatusNumber}].converting()`);
      setTimeout(() => {
        win.webContents.executeJavaScript(
          `mainFileManager.saveFromUri("${url}", "${name}")`
        ).then(() => {
          win.webContents.executeJavaScript(`downloadStatusStorage[${downloadStatusNumber}].finish()`);
        })
      }, 200);
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";

      xhr.onprogress = function(event) {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          win.webContents.executeJavaScript(`downloadStatusStorage[${downloadStatusNumber}].updatePercentage(${percentage})`);
        }
      };

      xhr.onload = async function() {
        var buffer = xhr.response;
        await win.webContents.executeJavaScript(`downloadStatusStorage[${downloadStatusNumber}].converting()`);
        setTimeout(() => {
          const uint8Array = new Uint8Array(buffer);
          if (xhr.getResponseHeader("content-type") == "text/plain") {
            const textDecoder = new TextDecoder('utf-8');
            const utf8String = textDecoder.decode(uint8Array);
            var base64String = Base64.encode(utf8String);
          } else {
            var utf8String = "";
            for (let i = 0; i < uint8Array.length; i++) {
              utf8String += String.fromCharCode(uint8Array[i]);
            }
            var base64String = btoa(utf8String);
          }
          var uri = `data:${xhr.getResponseHeader("content-type")};base64,${base64String}`;
          win.webContents.executeJavaScript(
            `mainFileManager.saveFromUri("${uri}", "${name}")`
          ).then(() => {
            win.webContents.executeJavaScript(`downloadStatusStorage[${downloadStatusNumber}].finish()`);
          });
        }, 200)
      }
      xhr.send();
    }
  });

  // Set preload to all webviews
  const PRELOAD_WEBVIEW_PATH = path.join(__dirname, 'preload-webview.js');
  setInterval(() => {
    try {
      win.webContents.executeJavaScript(`
      var webviews = document.querySelectorAll('webview');
      webviews.forEach(webview => {
        webview.setAttribute('preload', 'file://${PRELOAD_WEBVIEW_PATH}');
      });
    `);
    }catch{}
  }, 1000);
  if (!runningAsDev) {
    setupDisks(win.webContents)
    setupScripts(win.webContents)
  }

  win.show();
}


app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Catch all new window dialogs
app.on("web-contents-created", (_, wc) => {
  wc.setWindowOpenHandler((details) => {
    const url = details.url;
    win.webContents.executeJavaScript(`windows.open('brow', '${url}')`).catch(()=>{})
    return { action: "deny" };
  });
});

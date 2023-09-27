const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const { URL } = require("url");
var fetch = require("node-fetch");
var setupDisks = require("./modules/disks");


var win;
function createWindow() {
  win = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      sandbox: false
    },
  });
  globalShortcut.register("F12", () => {
    win.webContents.toggleDevTools();
  });
  win.loadURL("http://localhost:10000");
  win.setMenu(null);

  // Set custom download dialog
  win.webContents.session.on("will-download", async (event, item) => {
    event.preventDefault();
    win.webContents.executeJavaScript(
      "spawnNotification('Stahování', 'Soubor se začíná stahovat')"
    );
    const url = item.getURL();
    const name = item.getFilename();
    if (new URL(url).protocol == "data:") {
      var uri = url;
    } else {
      const response = await fetch(url);
      var buffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);

      let binaryString = "";
      for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }

      const base64String = btoa(binaryString);

      var uri = `data:${response.headers.get(
        "content-type"
      )};base64,${base64String}`;
    }

    win.webContents.executeJavaScript(
      `mainFileManager.saveFromUri("${uri}", "${name}")`
    );
    win.closeDeveloperTools();
  });

  // Set preload to all webviews
  const PRELOAD_WEBVIEW_PATH = path.join(__dirname, 'preload-webview.js');
  setInterval(() => {
    win.webContents.executeJavaScript(`
      var webviews = document.querySelectorAll('webview');
      webviews.forEach(webview => {
        webview.setAttribute('preload', 'file://${PRELOAD_WEBVIEW_PATH}');
      });
    `);
  }, 1000);

  setupDisks(win.webContents)

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
app.on("web-contents-created", (e, wc) => {
  wc.setWindowOpenHandler((details) => {
    const url = details.url;
    win.webContents.executeJavaScript(`windows.open('brow', '${url}')`).catch(()=>{})
    return { action: "deny" };
  });
});
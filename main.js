const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");
const handleDownloadFromInternet = require("./filemanagement/downloadFromInternet");
var setupDisks = require("./modules/disks");
var setupScripts = require("./modules/scripts");
var runningAsDev = process.argv[2] == "dev";
app.commandLine.appendSwitch("disable-http-cache");

var win;
function createWindow() {
  win = new BrowserWindow({
    fullscreen: !runningAsDev,
    webPreferences: {
      webviewTag: true,
      preload: path.join(__dirname, "preload.js"),
      icon: path.join(__dirname, "logo.png"),
      contextIsolation: false,
      sandbox: false,
      webSecurity: false,
    },
  });

  // Load
  win.loadURL("http://localhost:10000");
  win.setMenu(null);

  // Error handling
  win.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      if (isMainFrame) {
        win.loadFile("errors/noserver.html");
      }
    },
  );

  // Dev menu
  globalShortcut.register("F12", () => {
    win.webContents.toggleDevTools();
  });

  // Set custom download dialog
  win.webContents.session.on("will-download", async (event, item) => {
    await handleDownloadFromInternet(win, event, item);
  });

  // API
  ipcMain.on("set-zoom", (_, content) => {
    win.webContents.setZoomFactor(content);
  });
  ipcMain.on("closeapp", () => {
    app.quit();
  });

  ipcMain.on("isDev", (event) => {
    event.reply("isDevResponse", runningAsDev);
  });

  // Set preload to all webviews
  const PRELOAD_WEBVIEW_PATH = path.join(__dirname, "preload-webview.js");
  setInterval(() => {
    try {
      win.webContents.executeJavaScript(`
      var webviews = document.querySelectorAll('webview');
      webviews.forEach(webview => {
        webview.setAttribute('preload', 'file://${PRELOAD_WEBVIEW_PATH}');
      });
    `);
    } catch {}
  }, 1000);

  // Disks
  if (!runningAsDev) {
    setupDisks(win.webContents);
    setupScripts(win.webContents);
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
    win.webContents
      .executeJavaScript(`windows.open('brow', '${url}')`)
      .catch(() => {});
    return { action: "deny" };
  });
});

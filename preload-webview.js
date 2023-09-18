const mainWindow = require("electron").ipcRenderer.sendSync("get-main-window");

console.log(mainWindow);

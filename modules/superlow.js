const { ipcRenderer } = require("electron");

class SuperLowLevel {
  static isDev() {
    return new Promise((resolve, reject) => {
      ipcRenderer.send("isDev");

      ipcRenderer.once("isDevResponse", (_, data) => {
        resolve(data);
      });

      ipcRenderer.once("error", (_, error) => {
        reject(error);
      });
    });
  }
}

module.exports = SuperLowLevel;

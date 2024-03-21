const { ipcRenderer } = require("electron");

class Program {
  static close() {
    ipcRenderer.send("closeapp");
  }
}

module.exports = Program;

const { ipcRenderer } = require("electron");

module.exports = (zoomFactor) => {
  ipcRenderer.send('set-zoom', zoomFactor)
};

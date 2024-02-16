const fs = require("fs");

module.exports = async (win, event, item) => {
  const filename = item.getFilename();
  const currentTime = new Date().getTime();
  const mime = item.getMimeType();

  if (!fs.existsSync("/tmp/klindosdownload/")) {
    fs.mkdirSync("/tmp/klindosdownload");
  }
  item.setSavePath("/tmp/klindosdownload/" + currentTime);

  await win.webContents.executeJavaScript(
    `downloadStatusStorage.push(new DownloadStatus("${filename}"))`,
  );
  const downloadStatusNumber = await win.webContents.executeJavaScript(
    `downloadStatusStorage.length - 1`,
  );

  function roundToTwoDecimalPlaces(number) {
      let roundedNumber = Math.round(number * 100) / 100;
      return roundedNumber.toFixed(2);
  }

  item.on("updated", (event, state) => {
    const receivedBytes = item.getReceivedBytes();
    const totalBytes = item.getTotalBytes();
    const percentage = roundToTwoDecimalPlaces((receivedBytes / totalBytes) * 100);
    win.webContents.executeJavaScript(
      `downloadStatusStorage[${downloadStatusNumber}].updatePercentage(${percentage})`,
    );
  });
  item.once("done", async (event, state) => {
    if (state === "completed") {
      await win.webContents.executeJavaScript(
        `downloadStatusStorage[${downloadStatusNumber}].converting()`,
      );
      const contents = await fs.promises.readFile(
        "/tmp/klindosdownload/" + currentTime,
        { encoding: "base64" },
      );
      var uri = `data:${mime};base64,${contents}`;
      await win.webContents.executeJavaScript(
        `mainFileManager.saveFromUri("${uri}", "${filename}")`,
      );
      await fs.promises.unlink("/tmp/klindosdownload/" + currentTime);
      await win.webContents.executeJavaScript(`downloadStatusStorage[${downloadStatusNumber}].finish()`);
    } else {
      console.error("Pepa");
    }
  });
};

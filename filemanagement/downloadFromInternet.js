const fs = require("fs");
const path = require("path");
const os = require("os");

module.exports = async (win, event, item) => {
  console.log("hello")
  const filename = item.getFilename();
  const filepath = path.join(
    os.homedir() + "/usrfiles/Downloads/",
    filename,
  );
  item.setSavePath(filepath);

  if (!fs.existsSync(os.homedir() + "/usrfiles/Downloads/")) {
    fs.mkdirSync(os.homedir() + "/usrfiles/Downloads/");
  }

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

  item.on("updated", () => {
    const receivedBytes = item.getReceivedBytes();
    const totalBytes = item.getTotalBytes();
    const percentage = roundToTwoDecimalPlaces(
      (receivedBytes / totalBytes) * 100,
    );
    win.webContents.executeJavaScript(
      `downloadStatusStorage[${downloadStatusNumber}].updatePercentage(${percentage})`,
    );
  });
  item.once("done", async (_, state) => {
    if (state === "completed") {
      await win.webContents.executeJavaScript(
        `downloadStatusStorage[${downloadStatusNumber}].finish()`,
      );
    }
  });
};

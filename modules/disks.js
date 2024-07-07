const fs = require("fs");
const path = require("path");
const os = require("os");
const { exec } = require("child_process");

function setupDisks(webContents) {
  setInterval(() => {
    testAdd(webContents);
    testRemove(webContents);
  }, 1000);
}

function testAdd(webContents) {
  const content = fs.readFileSync(
    path.join(os.homedir(), "automount/disks_add.json"),
    "utf8",
  );
  const data = JSON.parse(content);
  if (data.length > 0) {
    fs.writeFileSync(path.join(os.homedir(), "automount/disks_add.json"), "[]");

    data.forEach((disk) => {
      const diskName = "sdb";
      exec(
        `sudo fdisk -l /dev/${diskName} | grep -E '^/dev/${diskName}'`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
          }

          const partitions = stdout.trim().split("\n");
          var final = [];
          partitions.forEach((partition) => {
            final.push(partition.split(" ")[0].replace("/dev/", ""));
          });
          webContents.executeJavaScript(
            `DiskManager.add('${disk}', '${final.join(",")}')`,
          );
        },
      );
    });
  }
}

function testRemove(webContents) {
  const content = fs.readFileSync(
    path.join(os.homedir(), "automount/disks_remove.json"),
    "utf8",
  );
  const data = JSON.parse(content);
  if (data.length > 0) {
    fs.writeFileSync(
      path.join(os.homedir(), "automount/disks_remove.json"),
      "[]",
    );
    data.forEach((disk) => {
      webContents.executeJavaScript(`DiskManager.remove('${disk}')`);
    });
  }
}

module.exports = setupDisks;

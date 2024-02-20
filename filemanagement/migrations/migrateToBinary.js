const fs = require("fs").promises;
const fsExtra = require("fs-extra");
const path = require("path");
const os = require("os");
const mimeTypes = require("mime-types");

async function migrateToBinary(folders) {
  const folder = path.join(os.homedir(), "usrfiles");
  const tmpFolder = path.join(os.homedir(), "usrfiles.tmp");
  await fs.mkdir(tmpFolder);
  var folderExists = false;
  try {
    const res = await fs.stat(folder);
    if (res.isDirectory()) {
      folderExists = true;
    }
  } catch {}
  if (!folderExists) return;

  const allElements = await fs.readdir(folder);

  await Promise.all(
    folders.map(async (folder) => {
      const finalPath = path.join(tmpFolder, folder[1], folder[0]);
      await fs.mkdir(finalPath);
    }),
  );

  for (const file of allElements) {
    const filePath = path.join(folder, file);
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) continue;
    if (!file.endsWith(".json")) continue;
    const fileContent = await fs.readFile(filePath, { encoding: "utf8" });
    try {
      var jsonContent = JSON.parse(fileContent);
    } catch {
      console.log("Invalid json!");
      continue;
    }

    for (const element of jsonContent) {
      const filename = element[0];
      const mimeType = element[2];
      const parentFolder = element[5];
      const extension = mimeTypes.extension(mimeType);
      const newName = extension ? `${filename}.${extension}` : filename
      const finalPath = path.join(tmpFolder, parentFolder, newName);
      const binaryContent = Buffer.from(
        element[4].split(";")[1].split(",")[1],
        "base64",
      );

      await fs.writeFile(finalPath, binaryContent);
    }
  }

  await fsExtra.rm(folder, { recursive: true });

  await fs.rename(tmpFolder, folder);
}

module.exports = migrateToBinary;

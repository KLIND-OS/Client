const path = require("path");
const os = require("os");
const fs = require("fs");
const fsExtra = require("fs-extra");
const { exec } = require("child_process");
const { promisify } = require("util");

((module) => {
  const execPromise = promisify(exec);
  const getRelativePath = (package, context) =>
    path.join(os.homedir(), "packages", context, "node_modules", package);

  class NodePackages {
    static async createContext(appName) {
      await fs.promises.mkdir(path.join(os.homedir(), "packages", appName));
      await execPromise(`npm init -y`, {
        cwd: path.join(os.homedir(), "packages", appName),
      });
    }
    static async removeContext(context) {
      await fsExtra.rm(path.join(os.homedir(), "packages", context), {
        recursive: true,
      });
    }
    static get(nodepackage, context) {
      return require(getRelativePath(nodepackage, context));
    }
    static async install(nodepackages, context) {
      await execPromise(`npm install '${nodepackages}'`, {
        cwd: path.join(os.homedir(), "packages", context),
      });
    }
    static async _update() {
      await execPromise(`npm update`, {
        cwd: path.join(os.homedir(), "packages", "node_modules"),
      });
    }
  }

  module.exports = NodePackages;
})(module);

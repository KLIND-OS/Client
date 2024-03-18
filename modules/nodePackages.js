const path = require("path");
const os = require("os");
const { exec } = require("child_process");
const { promisify } = require("util");

((module) => {
  const execPromise = promisify(exec);
  const getRelativePath = (package) =>
    path.join(os.homedir(), "packages", "node_modules", package);

  class NodePackages {
    static get(nodepackage) {
      const packages = new Set(
        JSON.parse(localStorage.getItem("nodePackages") || "[]"),
      );

      if (packages.has(nodepackage)) {
        return require(getRelativePath(nodepackage));
      }
      throw new Error(
        "Package was not found! Make sure that specific package is installed!",
      );
    }
    static async install(nodepackages) {
      const listPackages = new Set(nodepackages.split(" "));
      const packages = new Set(
        JSON.parse(localStorage.getItem("nodePackages") || "[]"),
      );

      await execPromise(`npm install '${nodepackages}'`, {
        cwd: path.join(os.homedir(), "packages"),
      });

      localStorage.setItem("nodePackages", JSON.stringify(
        Array.from(
          new Set([...packages, ...listPackages])
        )
      ));
    }
    static async _update() {
      await execPromise(`npm update`, {
        cwd: path.join(os.homedir(), "packages", "node_modules"),
      });
    }
  }

  module.exports = NodePackages;
})(module);

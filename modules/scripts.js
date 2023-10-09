const fs = require("fs");
const path = require("path")
const os = require("os")

function setupScripts(webContents) {
    setInterval(() => {
        const content = fs.readFileSync(path.join(os.homedir(), "scripts_run.json"), "utf8")
        const data = JSON.parse(content);
        if (data.length > 0) {
            fs.writeFileSync(path.join(os.homedir(), "scripts_run.json"), "[]")
            data.forEach(script => {
                webContents.executeJavaScript(script)
            });
        }
    }, 500);
}

module.exports = setupScripts;
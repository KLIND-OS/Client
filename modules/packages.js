const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class Packages {
    static install(repo, packageName, callback) {
        if (repo == "official") {
            exec(`sudo pacman -S --noconfirm '${packageName}'`, function (error, stdout, stderr) {
                if (error) {
                    callback("error");
                } else {
                    callback("success");
                }
            });
        } else if (repo == "aur") {
            const tempDir = path.join(__dirname, 'aur_temp');
            const originalDir = process.cwd();
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }
            exec(`git clone https://aur.archlinux.org/${packageName}.git ${tempDir}/${packageName}`, function (error, stdout, stderr) {
                if (error) {
                    callback("error");
                    return;
                }

                process.chdir(path.join(tempDir, packageName));

                exec(`makepkg -si --noconfirm`, function (error, stdout, stderr) {
                    process.chdir(originalDir);
                    if (error) {
                        callback("error");
                    } else {
                        exec(`rm -rf ${tempDir}/${packageName}`);
                        callback("success");
                    }
                });
            });
        } else {
            callback("error");
        }
    }
}

module.exports = Packages;

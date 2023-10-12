const { exec } = require('child_process');

class Printers {
    static listAll(callback) {
        exec("lpstat -a | awk '{print $1}'", function (error, stdout, stderr) {
            if (error) {
                callback(new Error("Cannnot read printers"))
                return
            }
            if (stdout.trim() == "lpstat: No destinations added.") {
                callback([])
                return
            }
            
            var data = stdout.split("\n")
            var final = []
            for (const printerName of data) {
                if (printerName.trim() == "") continue

                final.push(printerName.trim())
            }
            callback(final)
        })
    }
    // Maybe create some api for easy printing of files. For now developers of application will need to make there own ways to print files. I'll try to create my own for file editor.
    /* static printFile(printer, file, callback) {
    } */

    static printPlainText(printer, text, callback) {
        exec(`echo "${text}" | lpr -P ${printer}`)
    }
}

module.exports = Printers;
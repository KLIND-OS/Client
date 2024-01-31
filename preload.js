const fs = require('fs');
const path = require('path');
const mime = require("mime");
const { exec } = require('child_process');
const sudo = require('sudo-prompt');
const storage = require("electron-json-storage")
const os = require("os");

storage.setDataPath(path.join(os.homedir(), "usrfiles"));
window.storage = storage;

const originalget = window.storage.get;
window.storage.get = (key, options, callback) => {
  key = key.replaceAll("/", "$");
  return originalget(key, options, callback)
}

const originalGetMany = window.storage.getMany;
window.storage.getMany = (keys, options, callback) => {
  keys = keys.map(path => path.replaceAll("/", "$"))
  return originalGetMany(keys, options, callback);
}

const originalGetSync = window.storage.getSync;
window.storage.getSync = (key, options) => {
  key = key.replaceAll("/", "$");
  return originalGetSync(key, options);
}

const originalHas = window.storage.has;
window.storage.has = (key, options, callback) => {
  key = key.replaceAll("/", "$");
  return originalHas(key, options, callback);
}

const originalRemove = window.storage.remove;
window.storage.remove = (key, options, callback) => {
  key = key.replaceAll("/", "$");
  return originalRemove(key, options, callback);
}

const originalSet = window.storage.set;
window.storage.set = (key, json, options, callback, retries) => {
  key = key.replaceAll("/", "$");
  return originalSet(key, json, options, callback, retries);
}

const originalSetSync = window.storage.setSync;
window.storage.setSync = (key, json, options) => {
  key = key.replaceAll("/", "$");
  return originalSetSync(key, json, options)
}

if (window.location.hostname !== "localhost" || window.location.port != 10000 && window.location.pathname !== "/security.html") {
    window.location.replace("http://localhost:10000/security.html")
}

var doneInputs = []
setInterval(() => {
    document.querySelectorAll("input[type='file']").forEach(input => {
        if (doneInputs.includes(input)) return
        doneInputs.push(input)
        input.addEventListener("click", (e) => {
            e.preventDefault();
            window.control.fileManager.fileSelect({
                success: (data_array) => {
                    var dataURI = data_array[4]
                    var byteString = Base64.decode(dataURI.split(',')[1]);
                    var mimeString = data_array[2]
                    var arrayBuffer = new ArrayBuffer(byteString.length);
                    var uint8Array = new Uint8Array(arrayBuffer);
                    for (var i = 0; i < byteString.length; i++) {
                        uint8Array[i] = byteString.charCodeAt(i);
                    }
                    var blob = new Blob([uint8Array], { type: mimeString });
                    var file = new window.File([blob], data_array[0], { type: mimeString, lastModified: new Date(data_array[3])});
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    e.target.files = dataTransfer.files;
                    e.target.dispatchEvent(new Event('change'));
                },
                closed: () => {}
            })
        })
    })
}, 200);


var doneIframes = []
setInterval(() => {
    document.querySelectorAll("iframe").forEach(iframe => {
        if (doneIframes.includes(iframe)) return
        doneIframes.push(iframe)
        iframe.addEventListener("load", e => {
            e.target.contentWindow.eval(`var doneInputs = []
            setInterval(() => {
               document.querySelectorAll("input[type='file']").forEach(input => {
                   if (doneInputs.includes(input)) return
                   doneInputs.push(input)
                   input.addEventListener("click", (e) => {
                       e.preventDefault();
                       parent.control.fileManager.fileSelect({
                           success: (data_array) => {
                               var dataURI = data_array[4]
                               var byteString = Base64.decode(dataURI.split(',')[1]);
                               var mimeString = data_array[2]
                               var arrayBuffer = new ArrayBuffer(byteString.length);
                               var uint8Array = new Uint8Array(arrayBuffer);
                               for (var i = 0; i < byteString.length; i++) {
                                   uint8Array[i] = byteString.charCodeAt(i);
                               }
                               var blob = new Blob([uint8Array], { type: mimeString });
                               var file = new window.File([blob], data_array[0], { type: mimeString, lastModified: new Date(data_array[3])});
                               const dataTransfer = new DataTransfer();
                               dataTransfer.items.add(file);
                               e.target.files = dataTransfer.files;
                               e.target.dispatchEvent(new Event('change'));
                           },
                           closed: () => {}
                       })
                   })
               })
           }, 200);`)
        })
    })
}, 200);

var doneA = []
setInterval(() => {
    document.querySelectorAll("a").forEach(a => {
        if (doneA.includes(a)) return
        doneA.push(a)
        a.setAttribute("target", "_blank")
    })
}, 200);



class LowLevelApi {
    static readDiskFromStorage(partition, folderPath) {
        var directory = "/mnt/"+partition 
        var folders = JSON.parse(localStorage.getItem("folders-uploaded"))
    
    
        function listFilesAndFolders(directory) {
            try {
                const items = fs.readdirSync(directory);
            
                items.forEach((item) => {
                    const itemPath = path.join(directory, item);
                    const stats = fs.statSync(itemPath);
                
                    if (stats.isDirectory()) {
                        const parentDirectory = path.join(folderPath, path.dirname(itemPath.replace("/mnt/"+partition+"/","")))+"/";
                        const name = path.basename(itemPath);
    
    
                        
                        if (folders) {
                            folders.push([name, parentDirectory])
                        }
                        else {
                            folders = [[name, parentDirectory]]
                        }
    
                        return listFilesAndFolders(itemPath);
                    } else if (stats.isFile()) {
                        try {
                            const parentDirectory = path.join(folderPath, path.dirname(itemPath.replace("/mnt/"+partition+"/","")))+"/";
                            const name = path.basename(itemPath);
    
    
                            const data = fs.readFileSync(itemPath);
                            const mimeType = mime.getType(itemPath) || 'application/octet-stream';
    
                            const base64Data = Buffer.from(data).toString('base64');
                            const uri = `data:${mimeType};base64,${base64Data}`;
    
                            mainFileManager.saveFromUri(uri, name, parentDirectory, false)
                        } catch (err) {
                            console.error('Error reading file:', err);
                        }
                    }
                });
            } catch (err) {
                
            }
        }
    
        listFilesAndFolders(directory)
        localStorage.setItem("folders-uploaded", JSON.stringify(folders))
    }
    static writeDiskFromStorage(fold, partition) {
        function listFolders(fl) {
            var storage = JSON.parse(localStorage.getItem("folders-uploaded"));
            var files = []
            for (const value of storage) {
                if (value[1] == fl) files.push(value)
            }
            return files
        }
        function listFiles(fl) {
            var storage = storage.getSync(fl);
            if (storage) {
                return storage;
            }
            return []
        }
        function getRelativePath(basePath, fullPath) {
            const baseParts = basePath.split('/').filter(part => part !== '');
            const fullParts = fullPath.split('/').filter(part => part !== '');
            
            let i = 0;
            while (i < baseParts.length && i < fullParts.length && baseParts[i] === fullParts[i]) {
                i++;
            }
            
            const relativeParts = fullParts.slice(i);
            return '/' + relativeParts.join('/');
        }
    
        function list(flx) {
            const folders = listFolders(flx)
            const files = listFiles(flx)
            for (const file of files) {
                const location = "/mnt/"+partition+getRelativePath(fold, file[5]+file[0])
    
    
                
                const dataUriParts = file[4].split(',');
                var base64Data = dataUriParts[1];
                if (!base64Data) {
                    var base64Data = Base64.encode(file[4]);
                }
                sudo.exec(`sudo touch "${location}"`)
    
                const command = `echo '${base64Data}' | base64 -d > '${location}'`;
    
                sudo.exec(command, { name: 'KLIND OS' }, function (error, stdout, stderr) {
                    if (error) {
                        console.error(error);
                    } else {
                        
                    }
                });
            }
            for (const folder of folders) {
                // UPLOAD FOLDER AND RUN list AGAIN with that folder
                const location = "/mnt/"+partition+getRelativePath(fold, folder[1]+folder[0])
                exec(`sudo mkdir "${location}"`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error: ${error.message}`);
                    }
                    else if (stderr) {
                        console.error(`Error: ${stderr}`);
                    }
                    else {
                        
                    }
                });
                list (flx+folder[0] + "/")
            }
        }
        sudo.exec("rm -rf /mnt/"+partition+"/*", { name: 'KLIND OS' }, (error, stdout) => {
            list(fold)
        })
    }
    static Volume = require("./modules/output_sound")
    static Printers = require("./modules/printers")
    static Packages = require("./modules/packages")
    static Power = require("./modules/power")
    static InputSound = require("./modules/input_sound")
    static HID = require("./modules/HID")
    static Apps = require("./modules/apps")
    static Updates = require("./modules/updates")
    static Logs = require("./modules/logs")
    static Branch = require("./modules/branch")
}
window.LowLevelApi = LowLevelApi

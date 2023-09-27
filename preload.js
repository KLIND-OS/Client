const fs = require('fs');
const path = require('path');
const mime = require("mime")

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
                    if (data_array[2] == "text/plain") {
                        data_array[4] = "data:text/plain;base64,"+window.btoa(fls[4]);
                    }
                    var dataURI = data_array[4]
                    var byteString = window.atob(dataURI.split(',')[1]);
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


var doneA = []
setInterval(() => {
    document.querySelectorAll("a").forEach(a => {
        if (doneA.includes(a)) return
        doneA.push(a)
        a.setAttribute("target", "_blank")
    })
}, 200);


window.readDiskFromStorage = (partition, folderPath) => {
    directory = "/mnt/"+partition 
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
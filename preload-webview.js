// In webview preload
const { ipcRenderer } = require('electron');

function showfilemanager(el) {
    function getLocalStorage(callback) {
        const id = (length => Array.from({ length }, () => Math.random().toString(36).charAt(2)).join(''))(10)
        ipcRenderer.send('getLocalStorage', id);
        ipcRenderer.on(id, (event,data) => {
            callback(data)
        })
    }

    var main = document.createElement("div")
    main.style.display = "flex"
    main.style.position = "absolute"
    main.style.zIndex = "6156816231"
    main.style.height = "100vh"
    main.style.width = "100vw"
    main.style.top = "0";
    main.style.left = "0";
    main.style.alignItems = "center";
    main.style.justifyContent = "center";
    main.style.background = "white";
    var inner = document.createElement("div")
    inner.style.height = "100px"
    inner.style.width = "300px"
    inner.style.background = "white"
    inner.style.borderRadius = "15px"
    var h1 = document.createElement("h1")
    h1.textContent = "Zadejte cestu k souboru který chcete nahrát"
    inner.appendChild(h1)
    var input = document.createElement("input")
    input.placeholder = "Zadejte cestu např /moje-dokumenty/hesla.txt"
    input.classList.add("inputvalue")
    inner.appendChild(input)
    var submit = document.createElement("button")
    submit.textContent = "Nahrát"
    submit.onclick = () => {
        getLocalStorage(localStorage => {
            function getFile(location) {
                function removebyindex(array, index) {
                    var doacgajs = [];
                    for (var i = 0; i < array.length; i++) {
                      if (i != index) {
                        doacgajs.push(array[i]);
                      }
                    }
                    return doacgajs;
                  }
                try {
                  locationsplit = location.split("/");
                  namefile = locationsplit[locationsplit.length - 1];
                  folder =
                    removebyindex(locationsplit, locationsplit.length - 1).join("/") + "/";
                  var stored = JSON.parse(localStorage);
                  if (stored) {
                    for (var i = 0; i < stored.length; i++) {
                      if (stored[i][5] == folder) {
                        if (stored[i][0] == namefile) {
                          return stored[i];
                        }
                      }
                    }
                  }
                  return false;
                } catch {
                  return false;
                }
            }
            const path = input.value
            const fls = getFile(path)
            if (fls === false) {
                main.remove()
                alert("Soubor neexistuje!")
                return;
            }
            if (fls[2] == "text/plain") {
                let encodedText = btoa(fls[4]);
                fls[4] = 'data:text/plain;charset=utf-8,' + encodedText;
            }
            var byteString = window.atob(fls[4].split(',')[1]);
            var arrayBuffer = new ArrayBuffer(byteString.length);
            var uint8Array = new Uint8Array(arrayBuffer);
            for (var i = 0; i < byteString.length; i++) {
                uint8Array[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([uint8Array], { type: fls[2] });
            var file = new window.File([blob], fls[0], { type: fls[2], lastModified: new Date(fls[3])});
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            el.files = dataTransfer.files;
            el.dispatchEvent(new Event('change'));
            main.remove()
        })
    }
    inner.appendChild(submit)
    main.appendChild(inner)
    document.body.appendChild(main)
}

var doneInputs = []
setInterval(() => {
    document.querySelectorAll("input[type='file']").forEach(input => {
        if (doneInputs.includes(input)) return
        doneInputs.push(input)
        input.addEventListener("click", e => {
            e.preventDefault()
            showfilemanager(e.target)
        })
    })
}, 200);
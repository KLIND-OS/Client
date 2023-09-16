if (window.location.hostname !== "localhost" || window.location.port != 10000 && window.location.pathname !== "/security.html") {
    window.location.replace("http://localhost:10000/security.html")
}

if (
  window.location.hostname !== "localhost" ||
  (window.location.port != 10000 &&
    window.location.pathname !== "/security.html")
) {
  window.location.replace("http://localhost:10000/security.html");
}




added = []
setInterval(() => {
    document.querySelectorAll("input[type='file']").forEach(input => {
        if (added.includes(input)) return
        added.push(input)
        input.addEventListener("click", (e) => {
            e.preventDefault();
            window.control.fileManager.fileSelect({
                success: (data_array) => {
                    if (data_array[2] == "text/plain") {
                        const encodedText = btoa(fls[4]);
                        data_array[4] = `data:text/plain;base64,${encodedText}`;
                    }
                    var dataURI = data_array[4]
                    var byteString = atob(dataURI.split(',')[1]);
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
                    console.log(e.target)
                    e.target.files = dataTransfer.files;
                    e.target.dispatchEvent(new Event('change'));
                },
                closed: () => {}
            })
        })
    })
}, 500);
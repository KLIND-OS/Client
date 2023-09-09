if (window.location.hostname !== "localhost" || window.location.port != 10000 && window.location.pathname !== "/security.html") {
    window.location.replace("http://localhost:10000/security.html")
}
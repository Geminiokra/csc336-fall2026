import http from "http";

// Render tells our server which port to use with the PORT environment variable.
// On your own computer, PORT isn't set, so we use 3000 instead.
let port = process.env.PORT || 3000;

// This function runs once for every request that comes in.
let server = http.createServer((req, res) => {
    // On Render, this shows up in the Logs page (Render's version of the terminal).
    console.log(req.method + " " + req.url);

    // This runs fresh for every request, so the time changes every time you refresh.
    // A static host like GitHub Pages can't do this: it only sends files.
    let now = new Date();

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello from my server! The server's clock says " + now.toString());
});

server.listen(port, () => {
    console.log("Server running on port " + port);
});
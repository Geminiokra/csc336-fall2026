import http from "http";

// Render tells our server which port to use with the PORT environment variable.
// On your own computer, PORT isn't set, so we use 3000 instead.
const port = process.env.PORT || 3000;

// This function runs once for every request that comes in.
let server = http.createServer((req, res) => {
    // On Render, this shows up in the Logs page (Render's version of the terminal).
    console.log(req.method + " " + req.url);

    express.static("public")
});

server.listen(port, () => {
    console.log("Server running on port " + port);
});
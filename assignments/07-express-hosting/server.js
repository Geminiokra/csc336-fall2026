// load the express library so file can create web server
import express from "express";

// Render provide PORT when app is deployed; use 3000 during local development
const port = process.env.PORT || 3000;

// create express application; receives browser requests
const server = express();

// make files in public folder available to visitors
server.use(express.static("public"));

// listen for requests; print message when server is ready
server.listen(port, () => {
    console.log("Server running on port " + port);
});
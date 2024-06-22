
const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");
const PORT = 3000;
const app = express();

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
// define some variables
let players = {};
let currentPlayer = 'W';


// set ejs
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")))


app.get("/", (req, res) => {
    res.render("index", { title: "Custom Chess Game" });
})


// socket related
io.on("connection", (uniqueSocket) => { // socket has uniuqe code
    console.log(`Connected on ${uniqueSocket.id}`)
})


server.listen(PORT, () => {
    console.log(`Server Listen at ${PORT}`)
})
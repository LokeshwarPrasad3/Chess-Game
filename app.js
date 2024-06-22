
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
let currentPlayer = 'w';


// set ejs
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")))


app.get("/", (req, res) => {
    res.render("index", { title: "Own Chess Game" });
})


// socket related
io.on("connection", (uniqueSocket) => { // socket has uniuqe code
    console.log(`Socket connected on ${uniqueSocket.id}`);
    // id is each time unique

    if (!players.white) {
        players.white = uniqueSocket.id;
        // sent to every another user that one is connected 
        uniqueSocket.emit("playerRole", "w");
    } else if (!players.black) {
        players.black = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "b");
    } else {
        uniqueSocket.emit("spectatorRole");
    }

    uniqueSocket.on("disconnect", () => {
        if (uniqueSocket.id === players.white) {
            delete players.white;
        } else if (uniqueSocket.id === players.black) {
            delete players.black;
        }
    })

    uniqueSocket.on("move", (move) => {
        try {
            // if not valid move then simply return
            if (chess.turn() == "w" && uniqueSocket.id !== players.white) return;
            if (chess.turn() == "b" && uniqueSocket.id !== players.black) return;

            const result = chess.move(move);
            if (result) {
                currentPlayer = chess.turn(); // chess automatically change turn
                io.emit("move", move); // broadcast what move to all
                // send new state of board
                io.emit("boardState", chess.fen()) // long equation that show state board of all elements
                console.log("successfully moved");
            } else {
                console.log(`Invalid move : ${move}`);
                uniqueSocket.emit("invalidMove", move)

            }


        } catch (error) {
            console.log(`Invalid Move Error ${error}`);
            uniqueSocket.emit(`Invalid move ${move}`)
        }
    })

})


server.listen(PORT, () => {
    console.log(`Server Listen at ${PORT}`)
})
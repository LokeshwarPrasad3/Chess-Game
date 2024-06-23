const socket = io();
// initialize chess
const chess = new Chess();

const boardElement = document.querySelector(".chessboard");
const turnElement = document.getElementById("turnValue");
const showConnectedElement = document.getElementById("showConnected");
const statusConnectionElement = document.getElementById("statusConnection");

// global variables
let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const piceMoveAudio = new Audio("../audio/move_piece.mp3");
const checkMateAudio = new Audio("../audio/checkmate.wav");
const gameOverAudio = new Audio("../audio/game-over.mp3");
const gameWonAudio = new Audio("../audio/game_won.mp3");

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    // console.log(board);
    board.forEach((row, rowIndex) => {
        // console.log(row, rowIndex);
        row.forEach((square, squareIndex) => {
            // console.log(square, squareIndex)
            const squareElement = document.createElement("div");
            squareElement.classList.add("square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );

            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            // if sqaure is not null means have piece
            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", square.color === 'w' ? 'white' : 'black');
                // pieceElement.innerText = getPieceUnicode(square);
                const updatedSquare = { // solve image problem
                    type: `${square.color === "b" ? square.type.toUpperCase() : square.type}`,
                    color: square.color
                }
                pieceElement.innerHTML = getPieceUnicode(updatedSquare);
                pieceElement.draggable = playerRole === square.color;
                pieceElement.addEventListener("dragstart", (event) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: squareIndex };
                        event.dataTransfer.setData("text/plain", "");
                    }
                })
                pieceElement.addEventListener("dragend", (event) => {
                    draggedPiece = null;
                    sourceSquare = null;
                })
                squareElement.appendChild(pieceElement)
            }
            squareElement.addEventListener("dragover", function (e) {
                e.preventDefault();
            })
            squareElement.addEventListener("drop", function (e) {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSource = { // get x,y quardinates
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    }
                    handleMove(sourceSquare, targetSource)
                }
            })
            boardElement.appendChild(squareElement);
        })
    })

    if (playerRole === "b") {
        boardElement.classList.add("flipped");
    } else {
        boardElement.classList.remove("flipped");
    }
    whoTakeTurnNow(playerRole);
}

const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: "q",
    }
    socket.emit("move", move);
}

const getPieceUnicode = (piece) => {
    // console.log("Pieces ", piece)
    // const unicodePieces = {
    //     p: "\u2659", // White pawn
    //     r: "\u2656", // White rook
    //     n: "\u2658", // White knight
    //     b: "\u2657", // White bishop
    //     q: "\u2655", // White queen
    //     k: "\u2654", // White king
    //     P: "\u265F", // Black pawn
    //     R: "\u265C", // Black rook
    //     N: "\u265E", // Black knight
    //     B: "\u265D", // Black bishop
    //     Q: "\u265B", // Black queen
    //     K: "\u265A"  // Black king
    // };


    // const unicodePieces = {p: "♙",r: "♖",n: "♘", b: "♗",q: "♕", k: "♔", P: "♟",R: "♜",N: "♞",B: "♝",Q: "♛",K: "♚",    }


    const unicodePieces = {
        p: `<img src=${"/images/white_pawn.png"} />`, // White pawn
        r: `<img src=${"/images/white_rook.png"} />`, // White rook
        n: `<img src=${"/images/white_knight.png"} />`, // White knight
        b: `<img src=${"/images/white_bishop.png"} />`, // White bishop
        q: `<img src=${"/images/white_queen.png"} />`, // White queen
        k: `<img src=${"/images/white_king.png"} />`, // White king
        P: `<img src=${"/images/black_pawn.png"} />`, // Black pawn
        R: `<img src=${"/images/black_rook.png"} />`, // Black rook
        N: `<img src=${"/images/black_knight.png"} />`, // Black knight
        B: `<img src=${"/images/black_bishop.png"} />`, // Black bishop
        Q: `<img src=${"/images/black_queen.png"} />`, // Black queen
        K: `<img src=${"/images/black_king.png"} />`  // Black king
    };


    return unicodePieces[piece.type] || "";
}

const whoTakeTurnNow = (turnerName) => {
    socket.emit("whoTurn", turnerName);
    // console.log("actual turner ", turnerName, chess.turn())

}

socket.on("playerRole", function (role) {
    playerRole = role;
    renderBoard();
})

socket.on("spectatorRole", function () {
    playerRole = null;
    renderBoard();
})

socket.on("boardState", function (fen) {
    chess.load(fen);
    renderBoard();
})

socket.on("move", function (move) {
    chess.move(move);
    piceMoveAudio.play();
    renderBoard();
    console.log(chess.fen())
    console.log("checkout", chess.isCheckmate(), chess.isDraw(), chess.isGameOver())
})

// which player have turn shows
socket.on("getTurn", function (instruction) {
    turnElement.innerHTML = instruction;

})

// show connected and live
socket.on("connectedPlayers", (instruction) => {
    showConnectedElement.innerHTML = instruction;
})

// opponenet disconnected in playing time
socket.on("opponentNotConnected", (instruction) => {
    statusConnectionElement.innerHTML = instruction;
})

// handle if game is check mate
socket.on("checkmate", (instruction) => {
    turnElement.innerHTML = instruction;
    console.log("checkmate", instruction);
    checkMateAudio.play();
})

socket.on('gameOver', (message) => {
    turnElement.innerHTML = message;
    console.log("game over", message);
    gameOverAudio.play();
});


socket.on('invalidMove', (move) => {
    console.log("invalid ", move)
});

renderBoard();

// modal notice scripts
document.addEventListener("DOMContentLoaded", function () {
    // Function to detect if the device is a PC or laptop
    function isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    }

    // Show modal notice only if on a mobile device
    if (isMobile()) {
        // Select modal and close button
        const modal = document.getElementById('modalNoticeBackdrop');
        const closeModalBtn = document.getElementById('closeModalNoticeBtn');

        // Show modal when page loads
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Close modal function
        function closeModal() {
            modal.classList.add('hidden');
        }

        // Close modal on close button click
        closeModalBtn.addEventListener('click', closeModal);

        // Close modal on outside click (optional)
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });

        // Close modal on Escape key press (optional)
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    } else {
        const modal = document.getElementById('modalNoticeBackdrop');
        // Show modal when page loads
        modal.classList.remove('flex');
        modal.classList.add('hidden');

    }
});

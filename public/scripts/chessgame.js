const socket = io();
// initialize chess
const chess = new Chess();

const boardElement = document.querySelector(".chessboard");
const turnElement = document.getElementById("turnValue");

// global variables
let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;


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
                pieceElement.innerText = getPieceUnicode(square);
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
    const unicodePieces = {
        p: "\u2659", // White pawn
        r: "\u2656", // White rook
        n: "\u2658", // White knight
        b: "\u2657", // White bishop
        q: "\u2655", // White queen
        k: "\u2654", // White king
        P: "\u265F", // Black pawn
        R: "\u265C", // Black rook
        N: "\u265E", // Black knight
        B: "\u265D", // Black bishop
        Q: "\u265B", // Black queen
        K: "\u265A"  // Black king
    };


    // const unicodePieces = {p: "♙",r: "♖",n: "♘", b: "♗",q: "♕", k: "♔", P: "♟",R: "♜",N: "♞",B: "♝",Q: "♛",K: "♚",    }



    return unicodePieces[piece.type] || "";
}

const whoTakeTurnNow = (turnerName) => {
    socket.emit("whoTurn", turnerName);
    console.log("actual turner ", turnerName, chess.turn())

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
    renderBoard();
})

socket.on("getTurn", function (instruction) {
    turnElement.innerHTML = instruction;

})


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
        // Show modal when page loads
        modal.classList.remove('flex');
        modal.classList.add('hidden');

    }
});

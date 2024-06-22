const socket = io();
// initialize chess
const chess = new Chess();

const boardElement = document.querySelector(".chessboard");

// global variables
let draggedPiece = null;
let sourceSquare = null;
let playRole = null;


const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    // console.log(board);
    board.forEach((row, rowIndex) => {
        // console.log(row, rowIndex);
        row.forEach((square, squareIndex) => {
            console.log(square, squareIndex)
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
                pieceElement.draggable = playRole === square.color;
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

}

const handleMove = () => {

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

renderBoard();
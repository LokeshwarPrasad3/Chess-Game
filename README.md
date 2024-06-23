# Own Chess Game

A real-time multiplayer chess game built with Node.js, Express, Socket.IO, and `chess.js` for the game engine. This project allows two players to play a game of chess against each other while spectators can watch the game in progress.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [License](#license)

## Features

- Real-time chess game between two players
- Spectators can watch the game
- Automatic handling of turns
- Check, checkmate, and draw detection
- Displays status updates for players and spectators

## Screenshot

![Main Page Screenshot](https://i.ibb.co/Ykvk0dC/chess.jpg)

Click [here](https://ibb.co/cFzFY8B) for a larger view.

## Technologies Used

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-000000?style=for-the-badge&logo=socketdotio&logoColor=white)
![Chess.js](https://img.shields.io/badge/Chess.js-C73E1D?style=for-the-badge&logo=chessdotjs&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-6441A4?style=for-the-badge&logo=ejs&logoColor=white)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/LokeshwarPrasad3/Chess-Game.git
   cd Chess-Game
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Start the server:

   ```sh
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `server.js`: Main server file that sets up the game logic and handles socket connections.
- `public/`: Contains static assets and client-side code.
- `views/`: Contains EJS templates for rendering the HTML pages.

## Contributing

Contributions are welcome to enhance this chess project. If you have ideas for improvements, new features, or bug fixes, please fork the repository, create a new branch, and submit a pull request. Your contributions are highly valued.

## Live Demo

Experience the interactive live demo of the chess game at https://lokeshwar-chess.onrender.com .

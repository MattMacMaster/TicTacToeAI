
const Player = ((val) => {
    this.value = val;

    const getSign = () => {
        return val;
    }
    return { getSign };
});

const gameBoard = (() => {
    const board = ["O", "X", "O", "X", "X", "O", "", "", ""];
    const setField = (index, val) => {
        if (index > board.length) return;
        board[index] = val;
    }
    const getField = (index) => {
        if (index > board.length) return;
        return board[index];
    };
    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };
    const returnBoard = () => { return board };
    const clearIndex = (index) => { board[index] = "" };
    const availSpots = () => {
        var indices = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] == "") {
                indices.push(i);
            }
        }
        return indices;
    };
    return { setField, getField, reset, availSpots, returnBoard, clearIndex };
})();


const displayController = (() => {
    const squares = [...document.querySelectorAll('[data-index]')];
    const msg = document.getElementById('message');
    const resetBtn = document.getElementById('reset');
    squares.forEach(square => {
        square.addEventListener('click', (e) => {
            if (e.target.textContent != "") return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();
        });
        resetBtn.addEventListener("click", (e) => {
            gameBoard.reset();
            gameController.reset();
            updateGameboard();
            setMessageElement("Player X's turn");
        });
    });
    const updateGameboard = () => {
        for (let i = 0; i < squares.length; i++) {
            squares[i].textContent = gameBoard.getField(i);
        }
    }
    const setResultMessage = (winner) => {
        if (winner == 'Draw') {
            setMessageElement(`The Game is a ${winner}`);
        }
        else {
            setMessageElement(`The Winner is ${winner}`);
        }
    };
    const setMessageElement = (text) => {
        msg.textContent = text;
    };
    return { setMessageElement, setResultMessage, updateGameboard }
})();

const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let round = 1;
    let isOver = false;

    const playRound = async (index) => {
        if (!isOver) {
            gameBoard.setField(index, getCurrentPlayerVal());
            if (!checkWinner()) {
                round = round + 1;
                displayController.setMessageElement(`Player ${getCurrentPlayerVal()}'s Turn`);

            }
            if (round == 10) {
                displayController.setResultMessage('Draw');
            }
            if (round % 2 == 0) {

                playRound(computerController.best_move());
            }

        }
    };
    const getCurrentPlayerVal = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    };
    const checkWinner = () => {
        const winOptions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        let winCon = false;
        winOptions.forEach(winSet => {
            if (
                gameBoard.getField(winSet[0]) == gameBoard.getField(winSet[1])
                &&
                gameBoard.getField(winSet[2]) == gameBoard.getField(winSet[0])
                &&
                gameBoard.getField(winSet[2]) == gameBoard.getField(winSet[1])
                &&
                gameBoard.getField(winSet[2]) != ""
            ) {
                winCon = true;
            }
        });
        if (winCon) {
            displayController.setResultMessage(getCurrentPlayerVal());
            isOver = true;
            return true;
        }
        return false;
    };
    const reset = () => {
        round = 1;
        isOver = false;
    }

    return { playRound, reset, getCurrentPlayerVal };
})();


const computerController = (() => {
    //Use this function insetead of the best move function for simply random choices
    const compRandChoice = () => {
        var choice = Math.floor((Math.random() * gameBoard.availSpots().length));
        return gameBoard.availSpots()[choice];
    };
    const checkWinnerAI = (board) => {
        const winOptions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        winOptions.forEach(winSet => {
            if (board[winSet[0]] == board[winSet[1]] &&
                board[winSet[2]] == board[winSet[0]] &&
                board[winSet[2]] == board[winSet[1]] &&
                board[winSet[2]] != ""
            ) {
                if (board[winSet[0]] == "O") {
                    //1 Means AI Wins
                    return 1;
                }
                else {
                    //2 Means Player Wins
                    return 2;
                }
            };
        });
        //3 Means a Tie
        //Null means game goes on with more choices to be made
        if (board.includes("")) { return null } else return 3;
    };

    const availableIndexes = (board) => {
        var indexes = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] == "") {
                indexes.push(i);
            }
        }
        return indexes;
    };

    const best_move = () => {
        let bestScore = -Infinity;
        let bestMove;
        let tempBoard = Array.from(gameBoard.returnBoard());

        gameBoard.availSpots().forEach((index) => {
            tempBoard[index] = "O";
            let score = minimax(false, tempBoard, 0);
            tempBoard[index] = "";
            console.log(`Score:${score}`);

            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            };
        });
        return bestMove;
    };


    const minimax = (isMaxTurn, board, depth) => {
        let currBoard = board;
        const result = checkWinnerAI(currBoard);
        console.log(currBoard);

        if (result == 2) {
            return -1;
        }
        else if (result == 1) {
            return 1;
        }
        else if (result == 3) {

            return 0;
        }
        else {
            if (isMaxTurn) {
                let bestScore = -Infinity;
                availableIndexes(currBoard).forEach((index) => {
                    currBoard[index] = "O";
                    let score = minimax(!isMaxTurn, currBoard, depth + 1);
                    currBoard[index] = "";
                    bestScore = Math.max(score, bestScore);
                });
                return bestScore;
            } else {
                let bestScore = Infinity;
                availableIndexes(currBoard).forEach((index) => {
                    currBoard[index] = "X";
                    let score = minimax(!isMaxTurn, currBoard, depth + 1);
                    currBoard[index] = "";
                    bestScore = Math.min(score, bestScore);
                });
                return bestScore;
            };

        }
    };

    return { best_move, compRandChoice }

})();


displayController.updateGameboard();

const aiButton = document.getElementById('ai');
const humanButton = document.getElementById('human');
humanButton.addEventListener('click', (e) => {
    gameController.setPlayers(e.target.dataset.value);
});
aiButton.addEventListener('click', (e) => {
    gameController.setPlayers(e.target.dataset.value);
});
let isOver = false;
// false is Human game, True is an AI game
let gameType = false;
aiButton.classList.remove('disabled');
humanButton.classList.add('disabled');

const Player = ((val) => {
    this.value = val;

    const getSign = () => {
        return val;
    }
    return { getSign };
});

const gameBoard = (() => {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    const setField = (index, val) => {
        if (index > 8 || index < 0) return;

        if (index < 3) {
            board[0][index] = val;
        }
        else if (index > 2 && index < 6) {
            board[1][index % 3] = val;
        }
        else {
            board[2][index % 6] = val;
        }
    }
    const getField = (index) => {
        if (index > 8 || index < 0) return;
        if (index < 3) {
            return board[0][index];
        }
        else if (index > 2 && index < 6) {
            return board[1][index % 3];
        }
        else {
            return board[2][index % 6];
        }

    };
    const reset = () => {
        for (let i = 0; i < 3; i++) {
            for (let x = 0; x < 3; x++) {
                board[i][x] = '';
            }
        }
    };
    const returnBoard = () => { return board };
    const clearIndex = (index) => {
        if (index < 3) {
            board[0][index] = '';
        }
        else if (index > 2 && index < 6) {
            board[1][index % 3] = '';
        }
        else {
            board[2][index % 6] = '';
        }
    };
    const availSpots = () => {
        var indices = [];
        for (let i = 0; i < 3; i++) {
            for (let x = 0; x < 3; x++) {
                if (board[i][x] == "") {
                    indices.push([i, x]);
                }
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
            setMessageElement("Player X's Turn");
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

    //Round to be played
    const playRound = (index) => {
        //has the game finished
        if (!isOver) {
            gameBoard.setField(index, getCurrentPlayerVal());

            let result = checkWinner();
            if (result == "tie") {
                displayController.setResultMessage('Draw');
                isOver = true;

            };
            round = round + 1;
            if (!result) {
                displayController.setMessageElement(`Player ${getCurrentPlayerVal()}'s Turn`);
            };
            if (round % 2 == 0 && gameType) {
                playRound(bestMove(gameBoard.returnBoard()));
            };
        }



    };
    //Gets what players turn it is based on round
    const getCurrentPlayerVal = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    };
    // resets disable, and round count
    const reset = () => {
        round = 1;
        isOver = false;
    }
    const setPlayers = (value) => {
        if (value == 0) {
            aiButton.disabled = false;
            humanButton.disabled = true;
            gameType = true;
            aiButton.classList.remove('disabled');
            humanButton.classList.add('disabled');


        } else {
            humanButton.disabled = false;
            aiButton.disabled = true;
            gameType = false;
            humanButton.classList.remove('disabled');
            aiButton.classList.add('disabled');
        }
        gameType = !gameType;
        reset();
        gameBoard.reset();
        displayController.updateGameboard();
    };

    return { playRound, reset, getCurrentPlayerVal, setPlayers };
})();


function checkWinner() {
    let winCon = null;

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
            isOver = true;
            winCon = gameController.getCurrentPlayerVal();
        }
    });
    if (winCon == null && gameBoard.availSpots().length == 0) {
        return "tie";
    }
    //No winner Yet if null, or return winner X or O
    if (winCon != null) {
        displayController.setResultMessage(winCon);
        return winCon;
    }
    return winCon;
};

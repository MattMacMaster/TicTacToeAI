
const Player = ((val) => {
    this.value = val;

    const getSign = () => {
        return val;
    }
    return { getSign };
});

const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
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
    const availSpots = () => {
        var indices = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] == "") {
                indices.push(i);
            }
        }
        return indices;
    };
    return { setField, getField, reset, availSpots };
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
                playRound(computerController.compChoice());
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
    };
    return { playRound, reset };
})();


const computerController = (() => {

    const compChoice = () => {
        var choice = Math.floor((Math.random() * gameBoard.availSpots().length));
        console.log(choice);
        return gameBoard.availSpots()[choice];
    };
    return { compChoice }

})();


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

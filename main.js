
const Player = ((val) => {
    this.value = val;

    const getSign = () => {
        return value;
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
    return { setField, getField, reset };
});


const displayController = (() => {
    const squares = [...document.querySelectorAll('[data-index]')];
    const msg = document.getElementById('message');
    const resetBtn = document.getElementById('reset');
    squares.forEach(square => {
        square.addEventListener('click', (e) => {
            if (e.target.textContent !== "") return;
            console.log('REEE');
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
    const setResultMessage = () => { };
    const setMessageElement = () => { };

});

const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let round = 1;
    let isOver = false;

    const playRound = () => { };
    const getCurrentPlayerVal = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    };
    const checkWinner = () => { };
    const getIsOver = () => { };
    const reset = () => { };
});





// Matthew MacMaster
// Explanation of algorithm
/*
The minMax algorithm for this usage takes in the playing board, and evaluates every possible
end result of alternating turns of the player vs ai.The algorithm will loop through all options,
until a terminal state is reached(game is won, or tied).Upon reaching every possible terminal state,
the terminal state will be scored, in this instance 10(AI wins), 0(Ties), or -10(loses).

The algorithm will then pass up these values and then make the most logical move based
on the passed up scores, and a decision will be made for its next move. At this point I chose not to include
the depth value of the options.This will still lead to the ai either tying or winning the game eventually but not at
its soonest possibility.

A distinct way to see the difference made by depths added would be choosing 
row:1, col:2->row:2, col:1 -> row:3, col:2

*/

//Checks if all values match
function equals3(a, b, c) {
    return a == b && b == c && a != '';
}
function checkWinnerAI(board) {
    let winner = null;

    // horizontal check
    for (let i = 0; i < 3; i++) {
        if (equals3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
        }
    }

    // Vertical check
    for (let i = 0; i < 3; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
        }
    }

    // Diagonal check
    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
        winner = board[2][0];
    }
    //Checks for open sections
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                openSpots++;
            }
        }
    }
    //If no spots are left and no winner, its a tie
    if (winner == null && openSpots == 0) {
        return 'tie';
    } else {
        return winner;
    }
}


function bestMove(board) {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            val = 0;
            if (board[i][j] == '') {
                board[i][j] = "O";
                let score = minimax(board, 0, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    if (i == 1) {
                        val = 3
                    } else if (i == 2) {
                        val = 6
                    }
                    move = val + j;
                }

            }
        }
    }
    return move;
}

let scores = {
    O: 10,
    X: -10,
    tie: 0
};

function minimax(board, depth, isMaximizing) {
    let result = checkWinnerAI(board);
    //Null means the algorithm needs to keep further, as all terminal states are not found
    if (result !== null) {
        //Sends score for who wins this terminal state
        return scores[result];
    }
    //True: AI's turn, False: Players turn
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}
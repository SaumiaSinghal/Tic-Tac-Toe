var board;
const player = 'O';
const bot = 'X';
const winningCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[6,4,2],
	[0,3,6],
]

const cells = document.querySelectorAll('.cell');
startGame();


function startGame() {
	document.querySelector('.endGame').style.display = 'none';
	board = Array.from(Array(9).keys());

	for(var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	// body...
	if(typeof board[square.target.id] == 'number') {
		console.log("Human Player move : " + square.target.id);
		turn(square.target.id, player);	
		let gameWon = checkWin(board, player);
		if(gameWon) 
		gameOver(gameWon);
		if(!checkTie())
			turn(bestSpot(), bot);
	}
}

function turn(squareId, player) {
	board[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(board, player);
	if(gameWon) 
		gameOver(gameWon);
}

function checkWin(borad, player) {
	let plays = board.reduce((a, e, i) => 
		(e == player) ? a.concat(i) : a, []);
	let gameWon = null;
	for(let [index, val] of winningCombos.entries()) {
		 if (val.every(elem => plays.indexOf(elem) > -1)) {
		 	gameWon = { index : index, player : player};
		 	break;
		 }
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winningCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor = 
			gameWon.player == player ? 'blue' : 'red';
	}
	for (var i = cells.length - 1; i >= 0; i--) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	announceWinner(gameWon.player == player ? "You win!" : "You lose");
}

function emptySpots() {
	return board.filter(s => typeof s == 'number'); 
}

function bestSpot() {
	 return minimax(board, bot).index;
}

function checkTie() {
	let gameWon = checkWin(board, player);
	if(gameWon) 
		gameOver(gameWon);	
	if(emptySpots().length == 0) {
		for(var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		announceWinner("Tie Game!");
		return true;
	}
	return false;
}

function announceWinner(who) {
	document.querySelector('.endGame').style.display = "block";
	document.querySelector('.endGame .text').innerText = who;
}

function minimax(newboard, currPlayer) {
	var availableSpots = emptySpots(newboard);

	if(checkWin(newboard, player)) {
		return {score : -10};
	} else if(checkWin(newboard, bot)) {
		return {score : 10};
	} else if(availableSpots.length == 0) {
		return {score : 0};
	}

	var moves = [];
	for (var i = 0; i < availableSpots.length; i++) {
		var move = {};
		move.index = newboard[availableSpots[i]];
		newboard[availableSpots[i]] = currPlayer;

		if(currPlayer == bot) {
			var result = minimax(newboard, player);
			move.score = result.score;
		} else {
			 var result = minimax(newboard, bot);
			 move.score = result.score;
		}

		newboard[availableSpots[i]] = move.index;
		moves.push(move);
	}

	var bestMove;
	if(currPlayer == bot) {
		var bestScore = -100000;
		for (var i = moves.length - 1; i >= 0; i--) {
			if(moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;	
			}
		}	
	} else {
		var bestScore = 100000;
		for (var i = moves.length - 1; i >= 0; i--) {
			if(moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;	
			}
		}
	}
	return moves[bestMove];
}
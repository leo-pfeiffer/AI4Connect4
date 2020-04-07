(function() {

	const ConnectFour = function () {

		const getMoveFromAI = function () {
			alert("Unleash the power of AI...?");

			// POST
			fetch('/ai-action', {

				method: 'POST',

				// JSON payload
				body: JSON.stringify({
					gameBoard
				})
			}).then(function (response) {
				return response.text();
			}).then(function (text) {

				console.log(text);

				// assign updated gameBoard
				// gameBoard = json;
				// console.log(gameBoard);
				return text
			}).then(markNextFree);

		};

		// check whether there are four connected pieces
		const checkDirection = function (currentX, currentY, direction) {

			// chainLength gives largest number of connected elements from current piece
			let chainLength, directions;

			// move according to the specified array: [[x1, y1], [x2, y2], ...]
			directions = {
				horizontal: [[0, -1], [0, 1]],
				vertical: [[-1, 0], [1, 0]],
				diagonal: [[-1, -1], [1, 1], [-1, 1], [1, -1]]
			};

			chainLength = 1;

			directions[direction].forEach(function (coords) {

				let i = 1;

				// Search chain: chain on board && only currentPlayer
				while (onBoard(currentX + (coords[0] * i), currentY + (coords[1] * i)) &&
					(gameBoard[currentX + (coords[0] * i)][currentY + (coords[1] * i)] === currentPlayer)
					) {
					chainLength = chainLength + 1;
					i = i + 1;
				}

			});

			return (chainLength >= 4);

		};

		// check whether current player wins. return true if so.
		const isWinner = function (currentX, currentY) {
			return checkDirection(currentX, currentY, 'vertical') ||
				checkDirection(currentX, currentY, 'diagonal') ||
				checkDirection(currentX, currentY, 'horizontal');
		};

		// clearBoard after end of game
		const clearBoard = function () {

			// reset attributes
			Array.prototype.forEach.call(document.querySelectorAll('circle'), function (piece) {
				piece.setAttribute('class', 'free');
			});

			// reset gameBoard
			gameBoard = {};

			for (let x = 0; x <= numRows; x++) {

				gameBoard[x] = {};

				for (let y = 0; y <= numCols; y++) {
					gameBoard[x][y] = 'free';
				}

				// console.log(gameBoard);
			}

			// reset turns
			numTurns = 0;

			return gameBoard;

		};
		const markNextFree = function (x) {
			// x: x-value of clicked column
			// get the next free position in the column or alert that column is full
			console.log(typeof x)
			let nextY;
			nextY = false;

			for (let y = 0; y < numRows; y++) {
				if (gameBoard[x][y] === 'free') {
					nextY = y;
					break;
				}
			}

			if (nextY === false) {
				alert('Column full. Choose another.');
				return false;
			}

			// mark free position with piece of current player
			gameBoard[x][nextY] = currentPlayer;

			// set the attribute of the played position to currentPlayer ('red' or 'yellow')
			document.querySelector('#column-' + x + ' .row-' + nextY + ' circle').setAttribute(
				'class', currentPlayer
			);

			// check if game is over
			if (isWinner(parseInt(x), nextY)) {
				alert(currentPlayer + ' wins!');
				console.log(gameBoard);
				clearBoard();
				return true;
			}

			numTurns = numTurns + 1;

			if (numTurns >= numRows * numCols) {
				alert('DRAW!');
				clearBoard();
				return true;
			}

			// change player color
			currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';

		};

		// check whether a coordinate is on the board
		const onBoard = function (x, y) {
			return (gameBoard.hasOwnProperty(x) && typeof gameBoard[x][y] !== 'undefined');

		};

		let gameBoard = {};
		let currentPlayer = 'red';
		let numRows = 6;
		let numCols = 7;
		let numTurns = 0;

		let _init = function () {

			// initiate gameBoard with all positions free
			for (let x = 0; x <= numRows; x++) {

				gameBoard[x] = {};

				for (let y = 0; y <= numCols; y++) {
					gameBoard[x][y] = 'free';
				}
			}

			let columns;
			// get all columns from html file
			columns = document.querySelectorAll('.column');

			// add EventListener to all columns. Whenever new click => Add new piece
			// here: for one player, substitute EventListener with AI Selector
			Array.prototype.forEach.call(columns, function (col) {
				col.addEventListener('click', function () {
					markNextFree(col.getAttribute('data-x'));
				});
			});

			let startAI;

			startAI = document.querySelector('button');

			// add AI getter
			startAI.addEventListener('click', getMoveFromAI);

		};

		_init();

	};

	ConnectFour();

})();
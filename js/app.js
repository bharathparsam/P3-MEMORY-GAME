// Variables and Constants

let cards = document.querySelectorAll('.deck .card');

let unmatchedCards, moves, lifes, t, scoreUp;

const starsArea = document.querySelector('.stars');

let star = starsArea.firstElementChild.outerHTML;

const lifesArea = document.querySelector('.lifes');

let openedCards = [];

const restartBtn = document.querySelector('.restart');

let minutes = document.getElementById("minutes");

let life = lifesArea.firstElementChild.outerHTML;

let movesNumberTxt = document.querySelector('.moves');

let seconds = document.getElementById("seconds");

let closeButton = document.querySelector('.close');

let tryAgainButton = document.getElementById('tryAgain');

let points = document.querySelector('#points');

let totalSeconds = 0;

let modal = document.querySelector('.modal');

// restartGame(): restarts the game and reset all gaming variables


function restartGame() {
	let starsNumber = starsArea.childElementCount;
	let lifesNumber = lifesArea.childElementCount;

	modalHidden();
	unmatchedCards = 16;
	lifes = 10;
	moves = 0;
	movesNumberTxt.innerText = moves;

	ResetTime();
	clearInterval(scoreUp);

	if(openedCards.length > 0) {
		openedCards.pop();
	}

	cardShuffling();

	for(let i = starsNumber; i < 3; i++) {
		if(starsNumber < 3) {
			let li = document.createElement('li');
			starsArea.insertAdjacentHTML('afterbegin', star);
		}
	}

	for(let i = lifesNumber; i < 10; i++) {
		if(lifesNumber < 10) {
			let li = document.createElement('li');
			lifesArea.insertAdjacentHTML('afterbegin', life);
		}
	}

	for(let i = 0; i < cards.length; i++) {
		cards[i].className = 'card';
	}
}

// Enables the game reset through the circular arrow button

restartBtn.addEventListener('click', function() {
	restartGame();
});

/*
 * Shuffle(): shuffles an array or a list
 * Shuffle function from http://stackoverflow.com/a/2450976
 */

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// cardShuffling(): This function shuffles all the cards using shuffle() function

function cardShuffling() {
	let cardClass = [];
	let shuffledCard;

	for(let i = 0; i < cards.length; i++) {
		cardClass[i] = cards[i].firstElementChild.className;
	}

	shuffledCard = shuffle(cardClass);

	for(let i = 0; i < cards.length; i++) {
		cards[i].firstElementChild.className = shuffledCard[i];
	}
}

/*
 * Game gets loded once all the elements are loded and started upon first selection
 * First DOM is loded
 */

document.addEventListener('DOMContentLoaded', function() {
	restartGame();
	scoreUp = setInterval(scoreUpdate, 1000);

	for(let card of cards) {
		card.addEventListener('click', function() {
			if(card.className === 'card') {
				viewCard(card);
				cardListAddition(card);
				verifycard();
				startTime();
			}
		});
	}
});


// Time Functions

// 	- updateTime(): updates the timer

function updateTime() {
	++totalSeconds;
	seconds.innerHTML = clock(totalSeconds % 60);
	minutes.innerHTML = clock(parseInt(totalSeconds / 60));
}

// 	- clock(val): Total seconds are converted into mm:ss

function clock(val) {
	var valStr = val + "";
	if (valStr.length < 2) {
		return "0" + valStr;
	} else {
		return valStr;
	}
}

// - startTime(): stars the timer

function startTime() {
	if(moves === 0) {
		t = setInterval(updateTime, 1000);
	}
}

// - stopTime(): stops the timer

function stopTime() {
	clearInterval(t);
}

//- ResetTime(): resets the timer

function ResetTime() {
	stopTime();
	totalSeconds = 0;
	seconds.innerHTML = "00";
	minutes.innerHTML = "00";
}

/*
 * Gaming functions:
*/
 // - viewCard(card): selected card is opened with animation
function viewCard(card) {
	card.className = 'card open show animated rubberBand';
}

//	- cardListAddition(card): Upon successful opening it is added to open stack

function cardListAddition(card) {
	openedCards.push(card);
}

//verifycard() :verifes the last two opened cards and once verified the open card stack is made empty

function verifycard() {
	let n = openedCards.length;

	if(n === 2) {
		movesUpdate();
		if(openedCards[0].firstElementChild.className === openedCards[1].firstElementChild.className) {
			correctMatch();
		} else {
			wrongMatch();
		}
		for(let i = n; i > 0; i--) {
			openedCards.pop();
		}
	}
}

// 	- correctMatch(): Only the correct cards are stored in grid and animated with effect upon match

function correctMatch() {
	for(let card of openedCards) {
		card.className = 'card match animated jello';
		setTimeout(function() {
			card.classList.remove('animated');
			card.classList.remove('jello');
		}, 500);
	}

	unmatchedCards -= 2;

	if(unmatchedCards === 0) {
		stopTime();
		viewModal();
	}
}

//- wrongMatch(): Displays wrong match and animates with flash and life is deducted

function wrongMatch() {
	chanceUpdate();

	if(lifes !== 0) {
		for(let card of openedCards) {
			card.className = 'card wrong animated flash';
			setTimeout(function() {
				card.className = 'animated tada card';
			}, 750);
			setTimeout(function() {
				card.classList.remove('animated');
				card.classList.remove('tada');
			}, 1250);
		}
	} else {
		for(let card of cards) {
			if(card.className !== 'card match') {
				card.className = 'card wrong animated tada';
			}
		}
		stopTime();
		let starsNumber = starsArea.childElementCount;
		for(let i = 0; i < starsNumber; i++) {
			starsArea.firstElementChild.remove();
		}
		viewModal();
	}
}

//- movesUpdate() - Updates moves counter

function movesUpdate() {
	moves++;
	movesNumberTxt.innerText = moves;
}

// -chanceUpdate() - Updates the chances counter

function chanceUpdate() {
	lifesArea.firstElementChild.remove();
	lifes--;
}

// - scoreUpdate(): Score is updated based on time conditions

function scoreUpdate() {
	if(totalSeconds === 20 || totalSeconds === 30 || totalSeconds === 40) {
		starsArea.firstElementChild.remove();
	}
}

/*
 * Modal functions
 */

// - viewmodal(): Displays modal when game is completed either win or lose!

function viewModal() {
	let starsNumber = starsArea.childElementCount;
	let modalTitle = document.querySelector('.modal-title');
	let modalText = document.querySelector('.modal-text');

	modal.style.display = 'block';

	if(lifes !== 0) {
		modalTitle.innerText = 'You won it bud';
		modalText.innerText = `Final Scores \n\n Total Moves: ${moves} - Total Lifes left: ${lifes}\nTotal Game time: ${clock(parseInt(totalSeconds / 60))}:${clock(totalSeconds % 60)}`;
		for(let i = 0; i < starsNumber; i++) {
			points.insertAdjacentHTML('beforeend', star);
		}
	} else {
		modalTitle.innerText = 'GAME OVER';
		modalText.innerText = `Final Scores\n\nTotal Moves: ${moves}\nTotal Game time: ${clock(parseInt(totalSeconds / 60))}:${clock(totalSeconds % 60)}`;
	}
}

// - modalHidden(): Hides Modal when user clicks on screen or click on X button

function modalHidden() {
	let starsNumber = points.childElementCount;

	for(let i = 0; i < starsNumber; i++) {
		points.firstElementChild.remove();
	}

	modal.style.display = 'none';
}

window.addEventListener('click', function(event) {
    if(event.target === modal) {
		modalHidden();
    }
});

closeButton.addEventListener('click', function() {
	modalHidden();
});

// Try Again Button

tryAgainButton.addEventListener('click', function() {
	restartGame();
});


/*
 * set up the event listener for a card. If a card is clicked:   -->Completed
 *  - display the card's symbol (put this functionality in another function that you call from this one) -->Completed
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one) -->Completed
 *  - if the list already has another card, check to see if the two cards match-->completed
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one) -->Completed
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one) -->Completed
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one) -->Completed
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one) -->Completed
 */

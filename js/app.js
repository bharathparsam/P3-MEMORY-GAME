// Document.Ready Waits till DOM content is Loaded before running scripts
document.addEventListener('DOMContentLoaded', _ => {

  //Initial Declarations of the deck, the Cards and other variables
  const deck = document.querySelector('.deck');

  let card = document.getElementsByClassName('card');

  let cards = ['anchor', 'anchor', 'bicycle', 'bicycle', 'bolt', 'bolt', 'bomb', 'bomb', 'cube', 'cube', 'diamond', 'diamond', 'leaf', 'leaf', 'paper-plane-o', 'paper-plane-o'];

  let moves = document.querySelector('.moves');

  let rating = document.getElementsByClassName('fa-star');

  let countOfCard = cards.length / 2;

  let openedCards = [];

  let match = 0;

  let movingCount = 0;

  let pairOfCard = [];

  let stars = [...rating];

  let seconds = 0;

  let minutes = 0;

  let timer = document.querySelector('.timer');

  let currentTime;

  let startTime = false;

  let modal = document.querySelector('.modal');

  let message = document.querySelector('.modal-text');

  let button = document.getElementById('ok');

  let close = document.querySelector('.x');

  // Shuffle function from http://stackoverflow.com/a/2450976

  function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        }
        return array;
    }

    //Game play function
    let play = _ => {

      let newPlay = shuffle(cards);

      //A lightweight DOM is created and added
      let fragment = document.createDocumentFragment();
      //deck is kept empty for the next game
      deck.innerHTML = '';
      match = 0;
      movingCount = 0;
      moves.textContent = '0';

      for (let i = 0; i < newPlay.length; i++) {
        let cardContainer = document.createElement('li');
        cardContainer.classList.add('card');
        let icon = document.createElement('i');
        icon.classList.add('fa', 'fa-' + newPlay[i]);
        cardContainer.appendChild(icon);

        //Reflows and repaints are avoided
        fragment.appendChild(cardContainer);
        }

        //Reflow and repaints occurs only once
        deck.appendChild(fragment);
        timer.innerHTML = `0:00 s`
    }

    //play function is being called to play the game
    play();

    /*
    *A listing function that defines what happens to cards when being clicked during the game
    *Bug prevented when cards open card is clicked or flipped
    */

    let clicksListener = e => {

      //Double clicking or changing opened card is prevented

      if (e.target.classList.contains('card') && !e.target.classList.contains('match') && !e.target.classList.contains('show', 'open')) {
        e.target.classList.add('show', 'open');

        //counter is for counting the number of moves
        movingCount++;
        // Every card pair = a move.prevent 1.5 by using math.floor
        moves.innerHTML = Math.floor(movingCount / 2);

        //Timer is started with myTime

        myTime();
        //function for displaying live Rating
        score(movingCount);
        let currentCard = e.target;
        let icons = currentCard.firstElementChild.classList[1];

        /*
        *openedCards and pairOfCard are Temporary arrays for storing two icons and comparing
        */
        openedCards.push(icons);
        pairOfCard.push(currentCard);

        // Comparision Condition for openedCards

        if (openedCards.length === 2) {
          deck.removeEventListener('click', clicksListener);          //Clicking is disabled while Comparision

          if (openedCards[0] === openedCards[1]) {                   // Matching cards conditions
            setTimeout(_ => {
              match++;                                                //Match incerement to keep the track of match progess

              openedCards = [];                                      //Temporary array is cleared to play more matches

              pairOfCard.forEach(c => {                             // Making the cards open going through classes
                c.classList.add('match');
                c.classList.remove('open', 'show');
              });
              pairOfCard = [];                                  //Temporary array is cleared to make the game continue

              /*
              * Conditional Statements for card matched and game completion conditions
              */

              if (countOfCard === match) {

                //Make a delay to show the last card

                setTimeout(_ => {
                  // Modal display when the whole game is completeds

                  message.innerHTML = (`Total Moves: ${(movingCount / 2)}
                       . Total Time: ${minutes} minutes : ${((seconds < 10) ? "0"+seconds : seconds )} seconds.
                       Rating: ${rating.length} ${((rating.length===1) ? " star. " : "stars. ")}  `);

                  modal.classList.add('modal-show');

                // Play again function when play again button is clicked

                  play();

                  //Star Rating function to reset star
                  scoreReset();

                  //Stop the timer
                  stopTime();
                }, 500);
              }
            }, 300);
          } else {

            //Conditions if cards dont match

            setTimeout(_ => {
              pairOfCard.forEach(c => {
                c.classList.remove('open', 'show');
              });

              //Empty Temporary array and allow to make new matches

              openedCards = [];
              pairOfCard = [];
            }, 500);
          }
          //Restore Event Listener which is removed in Verification

          setTimeout(_ => {
            deck.addEventListener('click', clicksListener);
          }, 600);
        }
      } else {
        //Nothing happens when open card is clicked
        undefined;
      }
    }

    /*
    * Star rating function to removes the stars.
    * 'times is the number of clicks and hence so / 2 is to be converted.
    */

    let score = times => {

      // After completing 20 moves one star is removed  41 is number of clicks

      if (times === 41) {
        stars[2].classList.remove('fa-star');
        stars[2].classList.add('fa-star-o');
      }

      // after 30 moves remove another star

      if (times === 61) {
        stars[1].classList.remove('fa-star');
        stars[1].classList.add('fa-star-o');
      }
    }
    /*
    * scoreReset() function is to reset the star rating and start a new game
    * openedCards[] is a Temporary array on Reset
    * stopTime() is for stopping the timer
    */

    let scoreReset = _ => {
      stars[1].classList.add('fa-star'); //Reset Stars
      stars[1].classList.remove('fa-star-o');
      stars[2].classList.add('fa-star');
      stars[2].classList.remove('fa-star-o');
      openedCards = [];
      pairOfCard = [];
      stopTime();
    }

    //Function That displays Time
    let time = _ => {
      seconds++;
      if (seconds < 10) {
        timer.innerHTML = ` ${minutes}:0${seconds} s`;
      } else if (seconds === 60) {
        seconds = 0;
        minutes++;
        timer.innerHTML = `${minutes}:00 s`;
      } else {
        timer.innerHTML = `m ${minutes}:${seconds} s`;
      }
    }

    /*
    * stopTime() is timer stop function
    * Times is reset to 0
    * new timer is prepared
    * timer.innerHTML is fixed in order to prevent the display of old time
    */

    let stopTime = _ => {
      clearInterval(currentTime); //Variable for setInterval
      minutes = 0;
      seconds = 0;
      timer.innerHTML = `0:00 s`;
      startTime = false; // prepare for new timer
    }

    /*
    * This fucntion Checks if time is running if it is working new timer id will not startTime
    * else it would start a new timer
    * sets boolean to stop multiple timers from running
    */

    let myTime = _ => {
      if (startTime) return;
      currentTime = setInterval(time, 1000);
      startTime = true;
    }

    //Event Listener is added to deck itself
    deck.addEventListener('click', clicksListener);

    //Event listener to restart game which is added to restart button
    document.querySelector('.restart').addEventListener('click', _ => {
      play();
      scoreReset();
      stopTime();
    });

    //Close Modal on Clicking x or button or outside messagebox
    window.onclick = e => {
      ((e.target === modal) || (e.target === close) || (e.target === button)) ? modal.classList.remove('modal-show'): undefined;
    }
  });
  //close Document.Ready

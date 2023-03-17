const hangmanDisplay = document.getElementById('hangman-display');
const wordDisplay = document.getElementById('word-display');
const letterInput = document.getElementById('letter-input');
const submitButton = document.getElementById('submit-button');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-button');
const attemptsDisplay = document.getElementById('attempts');
const guessedLettersDisplay = document.getElementById('guessed-letters');
const letterForm = document.getElementById('letter-form');
const loadingImage = document.getElementById('loading-image');


let word = '';
let attempts = 6;
let guessedLetters = [];

const hangmanStages = [
    'images/hangman-stage-0.png',
    'images/hangman-stage-1.png',
    'images/hangman-stage-2.png',
    'images/hangman-stage-3.png',
    'images/hangman-stage-4.png',
    'images/hangman-stage-5.png',
    'images/hangman-stage-6.png',
  ];

async function fetchRandomWord(lengthOption) {
  let word = '';
  let minLength, maxLength;
  switch (lengthOption) {
    case 'short':
      minLength = 1;
      maxLength = 4;
      break;
    case 'medium':
      minLength = 5;
      maxLength = 10;
      break;
    case 'long':
      minLength = 11;
      maxLength = Infinity;
      break;
    default:
      minLength = 1;
      maxLength = 10;
  }

  do {
    const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
    const words = await response.json();
    word = words[0];
  } while (word.length < minLength || word.length > maxLength);

  return word;
}

function updateHangmanDisplay() {
  hangmanDisplay.src = hangmanStages[6 - attempts];
}

function updateWordDisplay() {
  wordDisplay.textContent = word
    .split('')
    .map((letter) => (guessedLetters.includes(letter) ? letter : '_'))
    .join(' ');
}

function updateAttemptsDisplay() {
  attemptsDisplay.textContent = `Attempts remaining: ${attempts}`;
}

function updateGuessedLettersDisplay() {
    guessedLettersDisplay.textContent = `Guessed letters: ${guessedLetters.join(', ')}`;
}
  
function checkVictory() {
  const victory = word.split('').every((letter) => guessedLetters.includes(letter));
  if (victory) {
    const modal = document.getElementById('winning-modal');
    const closeButton = document.querySelector('.close');
    modal.style.display = 'block';
    closeButton.onclick = function () {
      modal.style.display = 'none';
    };
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  }
  return victory;
}

letterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const letter = letterInput.value.toLowerCase();
  if (letter && !guessedLetters.includes(letter)) {
    guessedLetters.push(letter);

    if (!word.includes(letter)) {
      attempts--;
    }

    updateHangmanDisplay();
    updateWordDisplay();
    updateAttemptsDisplay();
    updateGuessedLettersDisplay();

    if (attempts === 0) {
      message.textContent = `Game over! The word was "${word}".`;
      submitButton.disabled = true;
    } else if (checkVictory()) {
      message.textContent = 'Congratulations, you won!';
      submitButton.disabled = true;
    }
  }

  letterInput.value = '';
});
  
resetButton.addEventListener('click', () => {
  wordLengthPopup.style.display = 'block';
});

const virtualKeyboard = document.getElementById('virtual-keyboard');

function createVirtualKeyboard() {
  const keyboardLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  for (const row of keyboardLayout) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('keyboard-row');

    for (const letter of row) {
      const key = document.createElement('div');
      key.textContent = letter;
      key.classList.add('virtual-key');
      key.setAttribute('data-letter', letter);
      key.addEventListener('click', () => {
        handleLetterGuess(key.textContent, key);
      });

      rowDiv.appendChild(key);
    }
    virtualKeyboard.appendChild(rowDiv);
  }
}

function handleLetterGuess(letter, virtualKey) {
  if (letter && !guessedLetters.includes(letter)) {
    guessedLetters.push(letter);

    if (!word.includes(letter)) {
      attempts--;
    }

    updateHangmanDisplay();
    updateWordDisplay();
    updateAttemptsDisplay();
    updateGuessedLettersDisplay();

    if (virtualKey) {
      virtualKey.classList.add('disabled');
      virtualKey.disabled = true;
    }

    if (attempts === 0) {
      message.textContent = `Game over! The word was "${word}".`;
      disableVirtualKeyboard();
    } else if (checkVictory()) {
      message.textContent = 'Congratulations, you won!';
      disableVirtualKeyboard();
    }
  }
}

function disableVirtualKeyboard() {
  const keys = document.querySelectorAll('.virtual-key');
  keys.forEach((key) => {
    key.classList.add('disabled');
    key.disabled = true;
  });
}

function getVirtualKey(letter) {
  return document.querySelector(`.virtual-key:not(.disabled)[data-letter="${letter}"]`);
}

letterInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const letter = letterInput.value.toLowerCase();
    const virtualKey = getVirtualKey(letter);
    if (virtualKey) {
      handleLetterGuess(letter, virtualKey);
    }
    letterInput.value = '';
  }
});

async function startGame() {
  const wordLength = document.getElementById('word-length').value;
  // Show the loading image and hide the hangman image
  hangmanDisplay.style.display = 'none';
  loadingImage.style.display = 'block';

  word = await fetchRandomWord(wordLength);
  attempts = 6;
  guessedLetters = [];
  message.textContent = '';
  enableVirtualKeyboard();

  // Hide the loading image and show the hangman image
  loadingImage.style.display = 'none';
  hangmanDisplay.style.display = 'block';

  updateHangmanDisplay();
  updateWordDisplay();
  updateAttemptsDisplay();
  updateGuessedLettersDisplay();
}

function enableVirtualKeyboard() {
  const keys = document.querySelectorAll('.virtual-key');
  keys.forEach((key) => {
    key.classList.remove('disabled');
    key.disabled = false;
  });
}


createVirtualKeyboard();

const wordLengthPopup = document.getElementById('word-length-popup');
const startGameButton = document.getElementById('start-game');
const wordLengthSelect = document.getElementById('word-length');

wordLengthPopup.style.display = 'block';

startGameButton.addEventListener('click', () => {
  wordLengthPopup.style.display = 'none';
  startGame();
});

wordLengthSelect.addEventListener('change', () => {
  startGame();
});



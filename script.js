const hangmanDisplay = document.getElementById('hangman-display');
const wordDisplay = document.getElementById('word-display');
const letterInput = document.getElementById('letter-input');
const submitButton = document.getElementById('submit-button');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-button');
const attemptsDisplay = document.getElementById('attempts');
const guessedLettersDisplay = document.getElementById('guessed-letters');
const letterForm = document.getElementById('letter-form');

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

async function fetchWord() {
  const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
  const data = await response.json();
  return data[0];
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
    return word.split('').every((letter) => guessedLetters.includes(letter));
}
  
async function initializeGame() {
    word = await fetchWord();
    attempts = 6;
    guessedLetters = [];
    updateHangmanDisplay();
    updateWordDisplay();
    updateAttemptsDisplay();
    updateGuessedLettersDisplay();
    message.textContent = '';
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
    initializeGame();
    submitButton.disabled = false;
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

      // Updated event listener for the virtual key click event
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

createVirtualKeyboard();

  
initializeGame();

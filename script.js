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
  
initializeGame();

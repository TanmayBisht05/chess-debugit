let whiteTimer = whiteInitialTime;
let blackTimer = blackInitialTime;
let timerInterval;
let currentPlayer = 'white';

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (playerGo == 'white') {
        whiteTimer--;
        document.getElementById('white-timer').textContent = formatTime(whiteTimer);
        if (whiteTimer === 0) {
            clearInterval(timerInterval);
            alert('Time\'s up!');
        }
    } else {
        blackTimer--;
        document.getElementById('black-timer').textContent = formatTime(blackTimer);
        if (blackTimer === 0) {
            clearInterval(timerInterval);
            alert('Time\'s up!');
        }
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
}


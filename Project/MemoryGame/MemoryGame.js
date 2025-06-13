const get = id => document.getElementById(id);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const startBtn = get("gameStart");

const colors = ["green", "red", "yellow", "blue"];
let pattern = [];
let playerInput = [];
let round = 0;

const buttons = {
    green: get("greenBtn"),
    red: get("redBtn"),
    yellow: get("yellowBtn"),
    blue: get("blueBtn"),
};

const sounds = {
    green: new Audio("audio/btn/green.mp3"),
    red: new Audio("audio/btn/red.mp3"),
    yellow: new Audio("audio/btn/yellow.mp3"),
    blue: new Audio("audio/btn/blue.mp3"),
}

const gameOverSound = new Audio("audio/gameOver.mp3");
gameOverSound.volume = 0.5;

const roundDisplay = get("round");
const turnDisplay = get("turnDisplay")

async function playSound(sound) {
    return new Promise(resolve => {
        sound.addEventListener("ended", resolve);
        sound.play();
    });
}

startBtn.addEventListener("click", async event => {
    startBtn.style.display = "none";
    resetGame();
    for (let i = 0; i < 12; i++) {
        roundDisplay.textContent = `Round: ${round}/12`;
        await delay(1500);
        const result = await newRound();
        if (!result) break;
        round++; 
    }
});

function resetGame() {
    pattern = [];
    round = 1;
    turnDisplay.textContent = "Game Starting"
}

async function newRound() { 
    pattern.push(pickNewColor());
    console.log(pattern);
    // change round number text and bot turn text
    await playPattern();
    turnDisplay.textContent = "Your turn";
    // change bot turn to your turn
    return await awaitPlayerInput();
}

function pickNewColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

async function playPattern() {
    turnDisplay.textContent = "Bot's turn";
    for (const color of pattern) {
        await lightUpButton(color);
        await delay(500);
    }
}

function lightUpButton(color) {
    return new Promise(resolve => {
        const btn = buttons[color];
        const originalId = btn.id;
        const litId = originalId + "Lit";

        btn.id = litId;
        sounds[color].play();

        setTimeout(() => {
            btn.id = originalId;
            resolve(); // finish this color
        }, 1000);
    });
}

function awaitPlayerInput() {
    return new Promise(resolve => {
        let currentStep = 0;

        const handleClick = (color) => {
            if (color !== pattern[currentStep]) {
                cleanup();
                gameOver();
                return resolve(false);
            }

            sounds[color].play();
            currentStep++;

            if (currentStep === pattern.length) {
                cleanup();
                return resolve(true);
            }
        };

        const cleanup = () => {
            for (const color of Object.keys(buttons)) {
                buttons[color].removeEventListener("click", listeners[color]);
            }
        };

        const listeners = {};
        for (const color of Object.keys(buttons)) {
            listeners[color] = () => handleClick(color);
            buttons[color].addEventListener("click", listeners[color]);
        }
    });
}

function isValid(index) {    

}

async function gameOver() {
    // display game over text 
    turnDisplay.textContent = "Incorrect sequence. You lost!";
    // play game over sound
    await playSound(gameOverSound);
    // show start game button
    startBtn.style.display = "block";
}
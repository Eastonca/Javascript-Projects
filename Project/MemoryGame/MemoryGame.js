const get = id => document.getElementById(id);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const startBtn = get("gameStart");

const colors = ["green", "red", "yellow", "blue"];
let pattern = [];

const buttons = {
    green: get("greenBtn"),
    red: get("redBtn"),
    yellow: get("yellowBtn"),
    blue: get("blueBtn"),
};

const roundDisplay = get("round");

gameStart.addEventListener("click", async event => {
    resetGame();
    for (let i = 0; i < 12; i++) {
        roundDisplay.textContent = `Round: ${i + 1}/12`;
        await delay(1500);
        await newRound();
        round++; 
    }
});

function resetGame() {
    pattern = [];
}

async function newRound() { 
    pattern.push(pickNewColor());
    console.log(pattern);
    // change round number text and bot turn text
    await playPattern();
    // change bot turn to your turn
    awaitPlayerInput();
}

function pickNewColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

async function playPattern() {
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

        setTimeout(() => {
            btn.id = originalId;
            resolve(); // finish this color
        }, 1500);
    });
}

function awaitPlayerInput() {
    isValid(); // for each input
}

function isValid() {    

}

function gameOver() {
    // display game over text 
    // play game over sound
    // show start game button
}
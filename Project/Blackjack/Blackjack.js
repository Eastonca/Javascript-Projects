// ====== 1. DOM CACHE ======
const get = id => document.getElementById(id);

const startBtn = get("startBtn");
const menuPage = get("menuPage");
const gamePage = get("gamePage");
const loadingPage = get("loadingPage");
const progressBar = get("progressBar");

// actions buttons
const hitBtn = get("hitBtn");
const standBtn = get("standBtn");
const doubleBtn = get("doubleBtn");

// bet buttons
const plus10Btn = get("plus10Btn");
const minus10Btn = get("minus10Btn");
const plus100Btn = get("plus100Btn");
const minus100Btn = get("minus100Btn");

// ====== 2. GAME STATE ======
const state = {
    currentPage: null,
    playerMoney: 100,
    currentBet: 10,
    gameStatus: "waiting", // "loading", "botTurn", "playerTurn", 
    playerCards: [],
    botCardsSum: 0
};

// ====== 3. EVENT LISTENERS ======
function setUpBtns() {
    startBtn.addEventListener("click", onStartClick);
    plus10Btn.addEventListener("click", () => updateBet(10));
    hitBtn.addEventListener("click", onHit);
    standBtn.addEventListener("click", onStand);
    doubleBtn.addEventListener("click", onDouble);
}

// ====== 4. GAME FLOW ======
startBtn.addEventListener("click", async event => {
    // summon loading page
    state.gameStatus = "loading";
    setPage(loadingPage);
    await startLoading();
    // summon game page
    setPage(gamePage);
    // new round
    newRound();
    // declare game over if player net worth falls below 0 
    // start a new round
})

function newRound() {
    resetGame();
    botCardsText = get("botCurrentCards");
    // bot draws cards then stop
    state.gameStatus = "botTurn";
    // play sound, wait 1 second
    botCardsText.textContent = "Bot's cards: ?"
    // play sound, wait 1 second
    botCardsText.textContent = "Bot's cards: ? ?"
    // players turn
    state.gameStatus = "playerTurn";
    // enable buttons and add listeners 
    enablePlayerInput();
    // after player finishes, determine the winner

    // update net worth and reset bet amount and cards

}

function resetGame() {

}

function enablePlayerInput() {
    setUpBtns();
}

// ====== 5. UTILITY FUNCTIONS ======
function setPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    page.classList.add("active");
    state.currentPage = page;
}

function updateBetDisplay() {
    document.getElementById("betAmount").textContent = state.currentBet;
}

async function startLoading() {
    return new Promise(resolve => {
        // Reset the progress bar
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
        void progressBar.offsetWidth;

        // Set up transition listener to resolve the promise
        const onTransitionEnd = () => {
            progressBar.removeEventListener("transitionend", onTransitionEnd);
            resolve(); // Continue after animation
        };

        progressBar.addEventListener("transitionend", onTransitionEnd);

        // Start the animation
        progressBar.style.transition = "width 2s linear";
        progressBar.style.width = "100%";
    });
}

// ====== 6. INIT ======
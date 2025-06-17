// ====== 1. DOM CACHE ======
const get = id => document.getElementById(id);
const queryGet = name => document.querySelector(name);

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
const betSubmitBtn = get("betSubmitBtn"); 

// info display
const betAmountInfo = get("betAmountInfo");
const netWorthInfo = get("netWorth");
const goalInfo = get("goal");
const annouceText = get("annouce");
const dealerCards = get("dealerCurrentCards");
const userCards = get("userCurrentCards");
const betAmount = get("betAmount");
const betTitle = get("betTitle");

// game page panels
const choicesPanel = queryGet(".playerChoices");
const betPanel = queryGet(".betPanel");
const infoPanel = queryGet(".moneyInfoPanel");

// audio
const sounds = {
    drawCard: new Audio("audio/drawCard.mp3"),
}

// utils
const deck = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
let fullDeck = [];
for (let i = 0; i < 4; i++) {
  fullDeck = fullDeck.concat(deck); 
}

import { playSoundAsync, playSound } from './utils.js';

// ====== 2. GAME STATE ======
const state = {
    currentPage: null,
    playerMoney: 100,
    currentBet: 10,
    gameStatus: "waiting", // "loading", "dealerTurn", "playerTurn", 
    playerCards: [],
    botCardsSum: 0
};

// ====== 3. EVENT LISTENERS ======
function setUpChoicesBtns() {
    hitBtn.addEventListener("click", onHit);
    standBtn.addEventListener("click", onStand);
    doubleBtn.addEventListener("click", onDouble);
}

function setUpBetBtns() {
    plus10Btn.addEventListener("click", () => increaseBet(10));
    plus100Btn.addEventListener("click", () => increaseBet(100));
    minus10Btn.addEventListener("click", () => decreaseBet(10));
    minus100Btn.addEventListener("click", () => decreaseBet(100));
}

// ====== 4. GAME FLOW ======
startBtn.addEventListener("click", async event => {
    // summon loading page
    state.gameStatus = "loading";
    setPage(loadingPage);
    resetGame();
    await startLoading();
    // summon game page
    setPage(gamePage);
    // new round
    newRound();
    // declare game over if player net worth falls below 0 
    // start a new round
})

async function newRound() {
    // player makes a bet first
    state.gameStatus = "playerBetting";
    setUpBetBtns();
    await waitForPlayerBet();
    // bot draws cards then stop
    state.gameStatus = "dealerTurn";
    annouceText.textContent = "Dealer drawing cards"
    // play sound, wait 1 second
    await playSoundAsync(sounds["drawCard"]);
    dealerCards.textContent = "Dealer's cards: ?"
    // play sound, wait 1 second
    await playSoundAsync(sounds["drawCard"]);
    dealerCards.textContent = "Dealer's cards: ? ?"

    // players drawing cards
    state.gameStatus = "playerTurn";
    annouceText.textContent = "Player drawing cards"
    // play sound, wait 1 second
    await playSoundAsync(sounds["drawCard"]);
    state.playerCards.push(drawCard());
    userCards.textContent = `Your cards: ${state.playerCards.join(" ")}`;
    // play sound, wait 1 second
    await playSoundAsync(sounds["drawCard"]);
    state.playerCards.push(drawCard());
    userCards.textContent = `Your cards: ${state.playerCards.join(" ")}`;

    annouceText.textContent = "Your turn";
    // enable buttons and add listeners 
    // after player finishes, determine the winner

    // update net worth and reset bet amount and cards

}
function waitForPlayerBet() {
    return new Promise(resolve => {

        const onClick = () => {
            betSubmitBtn.removeEventListener("click", onClick);
            betAmountInfo.textContent = `Bet Amount: $${state.currentBet}`;

            choicesPanel.classList.remove("invisible");
            infoPanel.classList.remove("invisible");
            betPanel.classList.add("invisible");

            resolve();
        };

        betSubmitBtn.addEventListener("click", onClick);
    });
}

// ====== 5. UTILITY FUNCTIONS ======
function setPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    page.classList.add("active");
    state.currentPage = page;
}

function increaseBet(amount) {
    if (amount + state.currentBet > state.playerMoney) {
        annouceText.textContent = "You don't have enough";
        setTimeout(() => {
            annouceText.textContent = "Bet making stage";
        }, 1500);
        return;
    } 
    state.currentBet += amount;
    updateBetDisplay();
}

function decreaseBet(amount) {
    if (state.currentBet - amount <= 0) {
        annouceText.textContent = "Bet can't go below 0";
        setTimeout(() => {
            annouceText.textContent = "Bet making stage";
        }, 1500);
        return;
    }
    state.currentBet -= amount;
    updateBetDisplay();
}

function updateBetDisplay() {
    document.getElementById("betAmount").textContent = `$${state.currentBet}`;
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
        progressBar.style.transition = "width 1s linear";
        progressBar.style.width = "100%";
    });
}

function resetGame() {
    state.playerMoney = 100;
    state.currentBet = 10;
    state.playerCards = [];
    state.botCardsSum = 0; 
    
    annouceText.textContent = "Bet making stage";
    netWorthInfo.textContent = "Net Worth: $100";
    goalInfo.textContent = "Goal: $500";
    betAmountInfo.textContent = "?";
    dealerCards.textContent = "Dealer's cards:";
    userCards.textContent = "Your cards:";
    betAmount.textContetn = "$10";
    
    choicesPanel.classList.add("invisible");
    infoPanel.classList.add("invisible");
    betPanel.classList.remove("invisible");
}

function enablePlayerInput() {

}

function drawCard() {
    const index = Math.floor(Math.random() * fullDeck.length);
    const card = fullDeck.splice(index, 1)[0]; // remove from deck
    return card;
}
// ====== 6. INIT ======
(() => {
    const pages = document.querySelectorAll(".page");
    pages.forEach(panel => panel.classList.remove("active"));
    menuPage.classList.add("active");
})();

// ====== 1. DOM CACHE ======
const get = id => document.getElementById(id);
const queryGet = name => document.querySelector(name);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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
    error: new Audio("audio/error.mp3"),
}

// utils
const deck = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
let fullDeck = [];
for (let i = 0; i < 4; i++) {
  fullDeck = fullDeck.concat(deck); 
}

import { playSoundAsync, playSound, setupBtnClickSFX, setupBtnHoverSFX } from './utils.js';

// ====== 2. GAME STATE ======
const state = {
    currentPage: null,
    playerMoney: 100,
    goal: 500,
    currentBet: "?",
    gameStatus: "waiting", // "loading", "dealerTurn", "playerTurn", 
    playerCards: [],
    dealerCards: [],
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
    await dealerDrawCards();

    // players drawing cards
    state.gameStatus = "playerTurn";
    annouceText.textContent = "Player drawing cards"
    // play sound, wait 1 second
    await playerDrawCard();
    // play sound, wait 1 second
    await playerDrawCard();

    annouceText.textContent = "Your turn";
    // enable buttons and add listeners 
    choicesPanel.classList.remove("invisible");
    enablePlayerInput();
    // after player finishes, determine the winner

    // update net worth and reset bet amount and cards

}
function waitForPlayerBet() {
    return new Promise(resolve => {

        const onClick = () => {
            betSubmitBtn.removeEventListener("click", onClick);
            betPanel.classList.add("invisible");
            state.playerMoney -= state.currentBet;
            updateInfoDisplay();
            resolve();
        };

        betSubmitBtn.addEventListener("click", onClick);
    });
}

function busted() {
    annouceText.textContent = "Busted!";
}
// ====== 5. UTILITY FUNCTIONS ======
function setPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    page.classList.add("active");
    state.currentPage = page;
}

function updateBetDisplay() {
    document.getElementById("betAmount").textContent = `$${state.currentBet}`;
}

function updateInfoDisplay() {
    betAmountInfo.textContent = `Bet Amount: $${state.currentBet}`;
    netWorthInfo.textContent = `Net Worth: $${state.playerMoney}`;
    goalInfo.textContent = `Goal: $${state.goal}`;
}

function updateCardsDisplay() {
    userCards.textContent = `Your cards: ${state.playerCards.join(" ")}`;
    dealerCards.textContent = `Dealer's cards: ${state.dealerCards.join(" ")}`;
    // if (state.dealerCards.length === 0) {
    //     `Dealer's cards: n/a`;
    // } else {
    //     const visibleCard = state.dealerCards[0];
    //     const hiddenCount = state.dealerCards.length - 1;
    //     const hiddenCards = Array(hiddenCount).fill("?").join(" ");
    //     dealerCards.textContent = `Dealer's cards: ${visibleCard} ${hiddenCards}`;
    // }
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
        progressBar.style.transition = "width 0.3s linear";
        progressBar.style.width = "100%";
    });
}

function resetGame() {
    state.playerMoney = 100;
    state.currentBet = 10;
    state.playerCards = [];
    state.botCardsSum = 0; 
    
    annouceText.textContent = "Bet making stage";
    updateInfoDisplay();
    updateBetDisplay();

    choicesPanel.classList.add("invisible");
    infoPanel.classList.remove("invisible");
    betPanel.classList.remove("invisible");
}

function enablePlayerInput() {
    setUpChoicesBtns();
}

function drawCard() {
    const index = Math.floor(Math.random() * fullDeck.length);
    const card = fullDeck.splice(index, 1)[0]; // remove from deck
    return card;
}

async function playerDrawCard() {
    await playSoundAsync(sounds["drawCard"]);
    state.playerCards.push(drawCard());
    updateCardsDisplay();
}

async function dealerDrawCards() {
    const getSum = () => state.dealerCards.reduce((a, b) => a + b, 0);

    const drawCardAndUpdate = async (card = null) => {
        const drawnCard = card ?? drawCard();
        state.dealerCards.push(drawnCard);
        fullDeck.splice(fullDeck.indexOf(drawnCard), 1); // remove from deck
        await playSoundAsync(sounds["drawCard"]);
        updateCardsDisplay();
    };

    const weightedAI = () => {
        const rand = Math.random();
        if (rand < 0.20) return 1;            // 20%
        else if (rand < 0.55) return 2;       // +35%
        else if (rand < 0.80) return 3;       // +25%
        else return 4;                        // +20%
    };

    const aiLevel = weightedAI();
    console.log("AI Level:", aiLevel);

    // Initial 2 cards
    await drawCardAndUpdate();
    await drawCardAndUpdate();

    let sum = getSum();

    switch (aiLevel) {
        case 1: // Random: draw randomly
            while (sum <= 18 || Math.random() < 0.5) {
                await drawCardAndUpdate();
                sum = getSum();
            }
            break;

        case 2: // Basic: draw until 16 or more
            while (sum < 16) {
                await drawCardAndUpdate();
                sum = getSum();
            }
            break;

        case 3: // Smart: aim for 18–19
            while (sum < 18) {
                const safeCard = fullDeck.find(c => sum + c <= 19);
                await drawCardAndUpdate(safeCard);
                sum = getSum();
            }
            break;

        case 4: // Cheater: aim for 20–21
            while (sum < 20) {
                const safeCard = fullDeck.find(c => sum + c <= 21);
                await drawCardAndUpdate(safeCard);
                sum = getSum();
            }
            break;

        default:
            throw new Error(`Invalid AI level: ${aiLevel}`);
    }

    console.log("Dealer cards:", state.dealerCards);
    console.log("Sum:", sum);
}

// ====== 6. BTN BEHAVIOR ======

function increaseBet(amount) {
    if (amount + state.currentBet > state.playerMoney) {
        annouceText.textContent = "You don't have enough";
        playSound(sounds["error"]);
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
        playSound(sounds["error"]);
        setTimeout(() => {
            annouceText.textContent = "Bet making stage";
        }, 1500);
        return;
    }
    state.currentBet -= amount;
    updateBetDisplay();
}

async function onHit() {
    annouceText.textContent = "Drawing card";
    choicesPanel.classList.add("invisible");
    await playerDrawCard();
    
    if (state.playerCards.reduce((sum, value) => sum + value, 0) > 21) {
        await delay(1000);
        busted();
        return;
    }

    choicesPanel.classList.remove("invisible");
    annouceText.textContent = "Your turn";
}

function onStand() {

}

function onDouble() {

}

// ====== 7. INIT ======
(() => {
    const pages = document.querySelectorAll(".page");
    pages.forEach(panel => panel.classList.remove("active"));
    menuPage.classList.add("active");
    setupBtnClickSFX("audio/btnClick.mp3");
    setupBtnHoverSFX("audio/btnHover.mp3");
})();

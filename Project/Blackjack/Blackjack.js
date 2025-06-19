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
const dealerCardsText = get("dealerCurrentCards");
const userCards = get("userCurrentCards");
const dealerSum = get("dealerSum");
const userSum = get("userSum");
const betAmount = get("betAmount");
const betTitle = get("betTitle");

// game page panels
const choicesPanel = queryGet(".playerChoices");
const betPanel = queryGet(".betPanel");
const infoPanel = queryGet(".moneyInfoPanel");
const cardsPanel = queryGet(".cardsInfoPanel");

// audio
const sounds = {
    drawCard: new Audio("audio/drawCard.mp3"),
    error: new Audio("audio/error.mp3"),
    success: new Audio("audio/success.mp3"),
    winning: new Audio("audio/winningRelax.mp3"),
    losing: new Audio("audio/losingViolin.mp3"),
    alert: new Audio("audio/alertDramatic.mp3"),
    gameOver: new Audio("audio/losingHorn.mp3"),
    bgMusic: new Audio("audio/casinoMusic.mp3"),
}

sounds["bgMusic"].volume = 0.2;
sounds["losing"].volume = 0.4;

// utils
const deck = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let fullDeck = [];
for (let i = 0; i < 4; i++) {
  fullDeck = fullDeck.concat(deck); 
}
const cardValues = {
    "A": 11,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 10,
    "Q": 10,
    "K": 10
};
let gameStarted = false;

import { playSoundAsync, playSound, stopSound, setupBtnClickSFX, setupBtnHoverSFX } from './utils.js';

// ====== 2. GAME STATE ======
const state = {
    currentPage: null,
    playerMoney: 100,
    goal: 200,
    currentBet: "?",
    gameStatus: "waiting", // "loading", "dealerTurn", "playerTurn", 
    playerCards: [],
    dealerCards: [],
};

// ====== 3. EVENT LISTENERS ======
function handleHit() { onHit(); }
function handleStand() { onStand(); }
function handleDouble() { onDouble(); }

function setUpChoicesBtns() {
    hitBtn.addEventListener("click", handleHit);
    standBtn.addEventListener("click", handleStand);
    doubleBtn.addEventListener("click", handleDouble);
}

function disableChoicesBtns() {
    hitBtn.removeEventListener("click", handleHit);
    standBtn.removeEventListener("click", handleStand);
    doubleBtn.removeEventListener("click", handleDouble);
}

// ==== Define reusable handlers ====
function handlePlus10() { increaseBet(10); }
function handlePlus100() { increaseBet(100); }
function handleMinus10() { decreaseBet(10); }
function handleMinus100() { decreaseBet(100); }

// ==== Set up listeners ====
function setUpBetBtns() {
    plus10Btn.addEventListener("click", handlePlus10);
    plus100Btn.addEventListener("click", handlePlus100);
    minus10Btn.addEventListener("click", handleMinus10);
    minus100Btn.addEventListener("click", handleMinus100);
}

// ==== Remove listeners ====
function disbaleBetBtns() {
    plus10Btn.removeEventListener("click", handlePlus10);
    plus100Btn.removeEventListener("click", handlePlus100);
    minus10Btn.removeEventListener("click", handleMinus10);
    minus100Btn.removeEventListener("click", handleMinus100);
}

// ====== 4. GAME FLOW ======
let isLoopRunning = false;

async function runGameLoop() {
    if (isLoopRunning) return;
    isLoopRunning = true;

    if (!gameStarted || state.playerMoney >= state.goal) {
        gameOver();
        isLoopRunning = false;
        return;
    }

    await newRound();

    isLoopRunning = false;

    if (gameStarted && state.playerMoney < state.goal) {
        await runGameLoop();
    }
}

async function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    startBtn.removeEventListener("click", startGame);
    // summon loading page
    playSound(sounds["bgMusic"]);
    state.gameStatus = "loading";
    setPage(loadingPage);
    resetGame();
    await startLoading();
    // summon game page
    setPage(gamePage);
    // new round
    runGameLoop();
}

async function newRound() {
    // player makes a bet first
    state.gameStatus = "playerBetting";
    setUpBetBtns();
    await waitForPlayerBet();
    showPanel(cardsPanel);
    // bot draws cards then stop
    state.gameStatus = "dealerTurn";
    await dealerDrawCards();

    // players drawing cards
    state.gameStatus = "playerTurn";
    // play sound, wait 1 second
    await playerDrawCard();
    // play sound, wait 1 second
    await playerDrawCard();

    setAnnouce("Your turn");
    // enable buttons and add listeners 
    choicesPanel.classList.remove("invisible");
    enablePlayerInput();
}

function waitForPlayerBet() {
    return new Promise(resolve => {

        const onClick = () => {
            betSubmitBtn.removeEventListener("click", onClick);
            hidePanel(betPanel);
            state.playerMoney -= state.currentBet;
            updateInfoDisplay();
            disbaleBetBtns();
            resolve();
        };

        betSubmitBtn.addEventListener("click", onClick);
    });
}

function gameOver() {
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => page.classList.remove("active"));
    menuPage.classList.add("active");
    startBtn.addEventListener("click", startGame);
}

// ====== 5. UTILITY FUNCTIONS ======
function getSum(cards) {
    let sum = 0;
    let aceCount = 0;

    for (const card of cards) {
        const value = cardValues[card]; // lookup value
        sum += value;
        if (card === "A") aceCount++;
    }

    // Adjust Aces from 11 to 1 if over 21
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount--;
    }

    return sum;
}

function hidePanel(panel) {
    panel.classList.add("invisible");
}

function showPanel(panel) {
    panel.classList.remove("invisible");
}

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
    updateDealerCardsDisplay();
    updatePlayerCardsDisplay();
}

function updateDealerCardsDisplay() {
    // dealerCardsText.textContent = `Dealer's cards: ${state.dealerCards.join(" | ")}`;
    dealerSum.textContent = `Dealer's sum: ?`;
    if (state.dealerCards.length === 0) {
        dealerCardsText.textContent = `Dealer's cards:`;
    } else {
        const visibleCard = state.dealerCards[0];
        const hiddenCount = state.dealerCards.length - 1;
        const hiddenCards = Array(hiddenCount).fill("?").join(" | ");
        dealerCardsText.textContent = `Dealer's cards: ${visibleCard} | ${hiddenCards}`;
    }
}

function updatePlayerCardsDisplay() {
    userCards.textContent = `Your cards: ${state.playerCards.join(" | ")}`;
    userSum.textContent = `Cards' sum: ${getSum(state.playerCards)}`;
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
    state.dealerCards = [];

    // Reset the deck
    fullDeck = [];
    for (let i = 0; i < 4; i++) {
        fullDeck = fullDeck.concat(deck);
    }
    
    setAnnouce("Bet making stage");
    updateInfoDisplay();
    updateCardsDisplay();
    updateBetDisplay();

    hidePanel(choicesPanel);
    hidePanel(cardsPanel);
    showPanel(infoPanel);
    showPanel(betPanel);
}

function roundReset() {
    state.currentBet = 10;
    state.playerCards = [];
    state.dealerCards = [];
    
    setAnnouce("Bet making stage");
    updateInfoDisplay();
    updateCardsDisplay();
    updateBetDisplay();

    hidePanel(choicesPanel);
    showPanel(infoPanel);
    hidePanel(cardsPanel);
    showPanel(betPanel);
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
    setAnnouce("Player drawing card");
    await playSoundAsync(sounds["drawCard"]);
    state.playerCards.push(drawCard());
    updateCardsDisplay();
}

async function dealerDrawCards() {
    function getDealerSum() {
        return getSum(state.dealerCards);
    }
    const drawCardAndUpdate = async (card = null) => {
        const drawnCard = card ?? drawCard();
        state.dealerCards.push(drawnCard);
        fullDeck.splice(fullDeck.indexOf(drawnCard), 1); // remove from deck
        setAnnouce("Dealer drawing card");
        await playSoundAsync(sounds["drawCard"]);
        updateDealerCardsDisplay();
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
    console.trace("Trace at functionX");

    // Initial 2 cards
    await drawCardAndUpdate();
    await drawCardAndUpdate();

    let sum = getDealerSum();

    switch (aiLevel) {
        case 1: // Random: draw randomly
            while (sum <= 18 && Math.random() < 0.5) {
                await drawCardAndUpdate();
                sum = getDealerSum();
            }
            break;

        case 2: // Basic: draw until 16 or more
            while (sum < 16) {
                await drawCardAndUpdate();
                sum = getDealerSum();
            }
            break;

        case 3: // Smart: aim for 18–19
            while (sum < 18) {
                const safeCard = fullDeck.find(c => sum + cardValues[c] <= 19);
                await drawCardAndUpdate(safeCard);
                sum = getDealerSum();
            }
            break;

        case 4: // Cheater: aim for 20–21
            while (sum < 20) {
                const safeCard = fullDeck.find(c => sum + cardValues[c] <= 21);
                await drawCardAndUpdate(safeCard);
                sum = getDealerSum();
            }
            break;

        default:
            throw new Error(`Invalid AI level: ${aiLevel}`);
    }
    console.log("Dealer cards:", state.dealerCards);
    console.log("Sum:", sum);
}

async function playerDoneDrawing() {
    disableChoicesBtns();
    hidePanel(choicesPanel);
    const playerSum = getSum(state.playerCards);
    const dealerSum = getSum(state.dealerCards);
    await revealDealerCards();
    if (playerSum > 21 && dealerSum > 21) {
        setAnnouce("Both busted! Nobody won!");
        playSound(sounds["losing"]);
        state.playerMoney += state.currentBet;
    } else if (playerSum === dealerSum) {
        setAnnouce("It's a tie!");
        playSound(sounds["alert"]);
        state.playerMoney += state.currentBet;
    } else if (playerSum <= 21 && dealerSum > 21) {
        setAnnouce(`Congrats! You have won and earned $${state.currentBet}`);
        playSound(sounds["success"]);
        state.playerMoney += state.currentBet * 2;
    } else if (playerSum > 21 && dealerSum <= 21) {
        setAnnouce(`You lost! $${state.currentBet} bet has been given to the dealer`);
        playSound(sounds["losing"]);
    } else if (playerSum > dealerSum) {
        setAnnouce(`Congrats! You have won and earned $${state.currentBet}`);
        playSound(sounds["success"]);
        state.playerMoney += state.currentBet * 2;
    } else if (playerSum < dealerSum) {
        setAnnouce(`You lost! $${state.currentBet} bet has been given to the dealer`);
        playSound(sounds["losing"]);
    } else {
        console.error("Unknown outcome");
    }
    updateInfoDisplay();
    await delay(3000);
    roundReset();

    if (state.playerMoney < 10) {
        hidePanel(betPanel);
        stopSound(sounds["bgMusic"]);
        setAnnouce("You went bankrupted");
        playSound(sounds["gameOver"]);
        await delay(4000);
        gameStarted = false;
        gameOver();
    } else if (state.playerMoney >= 500) {
        hidePanel(betPanel);
        stopSound(sounds["bgMusic"]);
        setAnnouce("You have reached your goal!");
        playSound(sounds["winning"]);
        await delay(3000);
        gameStarted = false;
        gameOver();
    }
}

async function revealDealerCards() {
    setAnnouce("Revealing dealer's cards...");
    dealerCardsText.textContent = "Dealer's cards: ";

    for (let i = 0; i < state.dealerCards.length; i++) {
        playSoundAsync(sounds["drawCard"]);
        await delay(1000);

        const revealed = state.dealerCards.slice(0, i + 1).join(" | ");
        dealerCardsText.textContent = `Dealer's cards: ${revealed}`;
    }

    dealerSum.textContent = `Dealer's sum: ${getSum(state.dealerCards)}`;
    await delay(1000);
}

function setAnnouce(text) {
    annouceText.textContent = text;
}

// ====== 6. BTN BEHAVIOR ======
function increaseBet(amount) {
    if (amount + state.currentBet > state.playerMoney) {
        setAnnouce("You don't have enough");
        playSound(sounds["error"]);
        setTimeout(() => {
            setAnnouce("Bet making stage");
        }, 1500);
        return;
    } 
    state.currentBet += amount;
    updateBetDisplay();
}

function decreaseBet(amount) {
    if (state.currentBet - amount <= 0) {
        setAnnouce("Bet can't go below 0");
        playSound(sounds["error"]);
        setTimeout(() => {
            setAnnouce("Bet making stage");
        }, 1500);
        return;
    }
    state.currentBet -= amount;
    updateBetDisplay();
}

async function onHit() {
    hidePanel(choicesPanel);
    await playerDrawCard();
    
    if (getSum(state.playerCards) > 21) {
        await delay(1000);
        playerDoneDrawing();
        return;
    }

    showPanel(choicesPanel);
    setAnnouce("Your turn");
}

function onStand() {
    playerDoneDrawing();
}

async function onDouble() {
    if (state.playerMoney >= state.currentBet) {
        state.playerMoney -= state.currentBet;
        state.currentBet *= 2;
        updateInfoDisplay();
        hidePanel(choicesPanel);
        await playerDrawCard();
        playerDoneDrawing();
    } else {
        setAnnouce("Not enough balance to double down");
        playSound(sounds["error"]);
        setTimeout(() => {
            setAnnouce("Your turn");
        }, 2000);
    }
}

// ====== 7. INIT ======
(() => {
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => page.classList.remove("active"));
    menuPage.classList.add("active");
    startBtn.addEventListener("click", startGame);
    setupBtnClickSFX("audio/btnClick.mp3");
    setupBtnHoverSFX("audio/btnHover.mp3");
})();
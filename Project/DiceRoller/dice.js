const get = id => document.getElementById(id);
const rollDiceBtn = get("rollDiceBtn");

function sum(numbers) {
    let result = 0;
    for (let number of numbers) {
        result += number;
    }
    return result;
}

function rollDice() {
    const numofDice = get("numOfDice").value;
    const diceResult = get("diceResult");
    const diceImages = get("diceImages");
    const diceSum = get("sum");
    const values = [];
    const images = [];

    for (let i = 0; i < numofDice; i++) {
        const value = Math.floor(Math.random() * 6) + 1;
        values.push(value);
        images.push(`<img src="images/Dice-${value}.png" alt="Dice ${value}">`);
    }

    diceResult.textContent = `dice: ${values.join(', ')}`;
    diceSum.textContent = `sum: ${sum(values)}`;
    diceImages.innerHTML = images.join('');
}

rollDiceBtn.addEventListener("click", rollDice);

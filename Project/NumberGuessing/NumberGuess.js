const minNum = 0;
const maxNum = 10;
const answer = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

let attempts = 0;
let guess;

while (true) {
    guess = prompt(`Guess a number between ${minNum} - ${maxNum}`);
    guess = Number(guess);

    if (isNaN(guess) || guess < minNum || guess > maxNum) {
        alert("Please enter a valid number");
    } else {
        attempts++;
        if (guess < answer){
            alert("TOO LOW! TRY AGAIN!");
        } else if (guess > answer){
            alert("TOO HIGH! TRY AGAIN!");
        } else {
            alert(`CORRECT! The answer was ${answer}. It took you ${attempts} attempts.`);
            break;
        }
    }
}
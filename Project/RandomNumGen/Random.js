const myButton = document.getElementById("myButton");
const label1 = document.getElementById("myLabel");
const label2 = document.getElementById("myLabe2");
const label3 = document.getElementById("myLabe3");
const min = 1, max = 6;
let randomNum1;
let randomNum2;
let randomNum3;

myButton.onclick = function(){
    randomNum1 = Math.floor(Math.random() * (max - min)) + min;
    randomNum2 = Math.floor(Math.random() * (max - min)) + min;
    randomNum3 = Math.floor(Math.random() * (max - min)) + min;
    myLabel.textContent = randomNum1;
    myLabe2.textContent = randomNum2;
    myLabe3.textContent = randomNum3;
}

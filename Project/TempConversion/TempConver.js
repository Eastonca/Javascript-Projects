const get = id => document.getElementById(id);

const textBox = get("textBox");
const toF = get("toF");
const toC = get("toC");
const result = get("result");
const submit = get("submit");
let temp;

function convert() {
    if (toF.checked) {
        temp = Number(textBox.value);
        temp = temp * 9 / 5 + 32;
        result.textContent = temp.toFixed(1) + "°F";
    } else if (toC.checked) {
        temp = Number(textBox.value);
        temp = (temp - 32) * (5/9);
        result.textContent = temp.toFixed(1) + "°C";
    } else {
        result.textContent = "Select a unit";
    }
}

submit.onclick = convert;
// submit.addEventListener("click", convert);
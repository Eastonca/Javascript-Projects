const get = id => document.getElementById(id);
const generateBtn = get("generate");

function generatePassword (
) {
    const length = get("length").value;
    const includeLower = get("includeLowercaseChars").checked;
    const includeUpper = get("includeUppercaseChars").checked;
    const includeNumbers = get("includeNumbers").checked;
    const includeSymbols = get("includeSymbols").checked;
    const passwordContainer = get("password");

    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "1234567890";
    const symbolChars = "!@#$%^&*()_+{}";

    let allowedChars = "";
    let password = "";
    allowedChars += includeLower ? lowercaseChars : "";
    allowedChars += includeUpper ? uppercaseChars : "";
    allowedChars += includeNumbers ? numberChars : "";
    allowedChars += includeSymbols ? symbolChars : "";

    if (length <= 0) {
        passwordContainer.textContent = `Password length must be at least 1`;
        return;
    }
    
    if (allowedChars.length === 0) {
        passwordContainer.textContent = `At least 1 set of character needs to be selected`;
        return;
    }

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        password += allowedChars[randomIndex];
    }

   passwordContainer.textContent = password;
}

generateBtn.addEventListener("click", generatePassword);


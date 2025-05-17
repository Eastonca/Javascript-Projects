// let students = 30;

// students = students * 2;
// students = students ** 3; // to the power of 2
// students = students % 3; // modulo

// students **= 2; // to the power of 2

// console.log(students);

let username;

document.getElementById("mySubmit").onclick = function(){
    username = document.getElementById("myText").value;
    document.getElementById("myH1").textContent = `Hello ${username}`;
}
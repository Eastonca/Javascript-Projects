// .checked = property that determines the checked state of an 
//                     HTML checkbox or radio button element

/* function $(id) {
    return document.getElementById(id);
} */

const $ = id => document.getElementById(id);

const myCheckBox = $("myCheckBox");
const visaBtn = $("visaBtn");
const masterCardBtn = $("masterCardBtn");
const payPalBtn = $("payPalBtn");
const mySubmit = $("mySubmit");
const subResult = $("subResult");
const paymentResult = $("paymentResult");

mySubmit.onclick = function(){

    if(myCheckBox.checked){
        subResult.textContent = `You are subscribed!`;
    }
    else{
        subResult.textContent = `You are NOT subscribed!`;
    }

    if(visaBtn.checked){
        paymentResult.textContent = `You are paying with Visa`;
    }
    else if(masterCardBtn.checked){
        paymentResult.textContent = `You are paying with MasterCard`;
    }
    else if(payPalBtn.checked){
        paymentResult.textContent = `You are paying with PayPal`;
    }
    else{
        paymentResult.textContent = `You must select a payment type`;
    }
}
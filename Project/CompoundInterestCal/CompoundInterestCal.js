const get = id => document.getElementById(id);
const submitBtn = get("submitBtn");

function calculate() {
    const totalAmountP = get("total-amount");
    const principalInput = get("principal");
    const rateInput = get("rate");
    const yearsInput = get("years");

    let principal = Number(principalInput.value);
    let rate = Number(rateInput.value / 100);
    let years = Number(yearsInput.value);

    if (principal < 0 || isNaN(principal)) {
        principal = 0;
        principalInput.value = 0;
    } else if (rate < 0 || isNaN(rate)) {
        rate = 0;
        rateInput.value = 0;
    } else if (years < 0 || isNaN(years)){
        years = 0;
        yearsInput.value = 0;
    }

    const result = principal * Math.pow((1 + rate / 1), 1 * years);
    totalAmountP.textContent = result.toLocaleString(undefined, {style: "currency",
                                                                 currency: "USD"
    });
}

submitBtn.addEventListener("click", calculate);
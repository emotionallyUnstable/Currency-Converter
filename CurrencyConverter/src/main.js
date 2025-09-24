import './style.css'

console.log("main.js loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");

  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const select = dropdown.querySelector(".select");
    const caret = dropdown.querySelector(".caret");
    const menu = dropdown.querySelector(".menu");
    const options = dropdown.querySelectorAll(".menu li");
    const selected = dropdown.querySelector(".selected");

    if (!select || !menu || !selected) {
      console.warn("Dropdown missing pieces:", dropdown);
      return;
    }

    select.addEventListener("click", () => {
      select.classList.toggle("select-clicked");
      caret && caret.classList.toggle("caret-rotate");
      menu.classList.toggle("menu-open");
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        selected.innerText = option.innerText.trim();
        select.classList.remove("select-clicked");
        caret && caret.classList.remove("caret-rotate");
        menu.classList.remove("menu-open");

        converter(); 
      });
    });
  });

  
  let currencyData = null;

  
  const amountInput = document.querySelector("#amount");
  const resultInput = document.querySelector("#result");
  const resultInfo = document.querySelector("#currency-result");

  if (!amountInput || !resultInput) {
    console.error("Не знайдено #amount або #result у DOM — перевір HTML");
    return;
  }

  
  const symbolMap = {
    "$": "USD",
    "€": "EUR",
    "₴": "UAH",
    "¥": "JPY",
  };

  function getSelectedCurrency(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return null;
    const selectedSpan = container.querySelector(".selected");
    return selectedSpan ? selectedSpan.innerText.trim() : null;
  }

  
  function converter() {
    console.log("converter() called");
    if (!currencyData || !currencyData.rates) {
      console.warn("currencyData ще не підвантажено або без rates");
      return;
    }

    const amount = parseFloat(amountInput.value);
    if (isNaN(amount)) {
      resultInput.value = "";
      return;
    }

    const fromSymbol = getSelectedCurrency(".input__first_currency__container");
    const toSymbol = getSelectedCurrency(".input__second_currency__container");
    console.log("Selected:", { fromSymbol, toSymbol });

    const from = symbolMap[fromSymbol];
    const to = symbolMap[toSymbol];

    if (!from || !to) {
      console.warn("Невідома валюта (from/to):", { from, to });
      return;
    }

    let rate;
    if (from === to) {
      rate = 1;
    } else if (from === "USD") {
      rate = currencyData.rates[to];
    } else if (to === "USD") {
      rate = 1 / currencyData.rates[from];
    } else {
      rate = currencyData.rates[to] / currencyData.rates[from];
    }

    if (!isFinite(rate)) {
      resultInput.value = "N/A";
      return;
    }

    resultInput.value = (amount * rate).toFixed(2);
    console.log(`Converted: ${amount} ${from} -> ${resultInput.value} ${to} (rate=${rate})`);
  }

  amountInput.addEventListener("input", converter);

  
 async function getCurrencyInfo() {
  console.log("Calling getCurrencyInfo...");


  const url = "https://open.er-api.com/v6/latest/USD";

  try {
    console.log("Fetch start:", url);
    const response = await fetch(url);
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw API data:", data);

    
    currencyData = { rates: data.rates, base: data.base_code };
    console.log("currencyData set:", currencyData);

    if (resultInfo) {
      resultInfo.textContent = `Rates loaded (base ${currencyData.base})`;
    }

    converter(); 
  } catch (err) {
    console.error("getCurrencyInfo error:", err);
    if (resultInfo) resultInfo.textContent = "Не вдалося завантажити курси.";
  }
}

  getCurrencyInfo();
});

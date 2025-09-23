document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const select = dropdown.querySelector(".select");
    const caret = dropdown.querySelector(".caret");
    const menu = dropdown.querySelector(".menu");
    const options = dropdown.querySelectorAll(".menu li");
    const selected = dropdown.querySelector(".selected");

    select.addEventListener("click", () => {
      select.classList.toggle("select-clicked");
      caret.classList.toggle("caret-rotate");
      menu.classList.toggle("menu-open");
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        selected.innerText = option.innerText;

        select.classList.remove("select-clicked");
        caret.classList.remove("caret-rotate");
        menu.classList.remove("menu-open");

        converter(); 
      });
    });
  });

  let currencyData = null;

  const amountInput = document.querySelector("#amount");
  const resultInput = document.querySelector("#result");

  const symbolMap = {
    "$": "USD",
    "€": "EUR",
    "₴": "UAH",
    "¥": "JPY",
  };

  function getSelectedCurrency(container) {
    const selected = container.querySelector(".selected");
    return selected ? selected.innerText.trim() : null;
  }

  function converter() {
    if (!currencyData) return;

    const amount = parseFloat(amountInput.value);
    if (isNaN(amount)) {
      resultInput.value = "";
      return;
    }

    const fromSymbol = getSelectedCurrency(
      document.querySelector(".input__first_currency__container")
    );
    const toSymbol = getSelectedCurrency(
      document.querySelector(".input__second_currency__container")
    );

    const from = symbolMap[fromSymbol];
    const to = symbolMap[toSymbol];

    if (!from || !to) return;

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

    resultInput.value = (amount * rate).toFixed(2);
  }

  amountInput.addEventListener("input", converter);

  async function getCurrencyInfo() {
    try {
      const response = await fetch(
        "https://api.apilayer.com/exchangerates_data/latest?base=USD&symbols=EUR,UAH,JPY",
        {
          method: "GET",
          headers: {
            apikey: "0lxhT7BYO7rEMrFzSLDVTWdx9KblKEiX",
          },
        }
      );

      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      currencyData = await response.json();
      console.log("Data:", currencyData);
      console.log("Loaded rates:", currencyData);

      converter();
    } catch (error) {
      console.error(error);
    }
  }

  console.log("Calling getCurrencyInfo...");
  getCurrencyInfo();
});

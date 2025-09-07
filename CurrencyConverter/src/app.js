const dropdowns = document.querySelectorAll(".dropdown")


dropdowns.forEach(dropdown => {

    const select = dropdown.querySelector(".select");
    const caret = dropdown.querySelector(".caret");
    const menu = dropdown.querySelector(".menu");
    const options = dropdown.querySelectorAll(".menu li");
    const selected = dropdown.querySelector(".selected");

    select.addEventListener("click", () => {
        select.classList.toggle("select-clicked");
        caret.classList.toggle("caret-rotate");
        menu.classList.toggle("menu-open")
    });

    options.forEach(option => {
        option.addEventListener("click", () => {
            select.innerText  = option.innerText ;
            select.classList.remove("select-clicked");
            caret.classList.remove("caret-rotate");
            menu.classList.remove("menu-open");

        options.forEach(option => {
            option.classList.remove("active");
        });
        option.classList.add("active");

        })
    })
})

    document.addEventListener("DOMContentLoaded", () => {
    async function getCurrencyInfo() {
        try{
            const response = await fetch("https://api.apilayer.com/exchangerates_data/latest?base=USD&symbols=EUR,UAH,JPY",
                {
                    headers: {
                        apikey:"444a5601dfba32d70234f06a69c580b6",
                    },
                }
            )

            if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

          const currencyData = await response.json();
          console.log(currencyData);

          const resultElement = document.getElementById("currency-result");

            if(resultElement) {
            resultElement.innerHTML = 
            `
                1 USD = ${currencyData.rates.EUR} EUR <br>
                1 USD = ${currencyData.rates.UAH} UAH <br>
                1 USD = ${currencyData.rates.JPY} JPY
            `
            }

        } catch(error) {
            console.log(error);
        }
    }
    
  getCurrencyInfo();
   });   
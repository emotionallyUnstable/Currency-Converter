import './style.css'

document.querySelector('#app').innerHTML = `
  <h1>Currency Converter</h1>
  <input id="amount" type="number" placeholder="Amount" />
  <select id="from">
    <option value="USD">USD</option>
    <option value="EUR">EUR</option>
    <option value="UAH">UAH</option>
    <option value="JPY">JPY</option>
  </select>
  <span>→</span>
  <select id="to">
    <option value="EUR">EUR</option>
    <option value="USD">USD</option>
    <option value="UAH">UAH</option>
    <option value="JPY">JPY</option>
  </select>
  <button id="convert">Convert</button>
  <p id="result"></p>
`;

import { Widget } from './Widget.js';

export class CurrencyWidget extends Widget {
  constructor(id, collapsed = false) {
    super(id, 'currency', '💱 Курсы валют (база EUR)');
    this.collapsed = collapsed;
    this.loading = true;
    this.error = null;
    this.data = null;
    this.fetchCurrency();
  }

  async fetchCurrency() {
    this.loading = true;
    this.error = null;
    this.update();
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=USD,GBP,JPY');
      if(!res.ok) throw new Error('Ошибка запроса валют');
      this.data = await res.json();
    } catch(e) {
      this.error = e.message;
    }
    this.loading = false;
    this.update();
  }

  renderBody() {
    if(this.loading) return `<div class="loading">Загрузка курсов…</div>`;
    if(this.error) return `
      <div class="error">${this.error}</div>
      <button class="retry">Повторить</button>
    `;
    const r = this.data.rates;
    return `
      <p>1 EUR = ${r.USD} USD</p>
      <p>1 EUR = ${r.GBP} GBP</p>
      <p>1 EUR = ${r.JPY} JPY</p>
    `;
  }

  bindEvents() {
    super.bindEvents();
    const retryBtn = this.element.querySelector('.retry');
    if(retryBtn) retryBtn.onclick = ()=> this.fetchCurrency();
  }
}
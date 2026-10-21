import { Widget } from './Widget.js';

export class WeatherWidget extends Widget {
  constructor(id, collapsed = false) {
    super(id, 'weather', '🌤 Погода (Москва)');
    this.collapsed = collapsed;
    this.loading = true;
    this.error = null;
    this.data = null;
    this.fetchWeather();
  }

  async fetchWeather() {
    this.loading = true;
    this.error = null;
    this.update();
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&current=temperature_2m,weather_code');
      if(!res.ok) throw new Error('Ошибка сети');
      this.data = await res.json();
    } catch(e) {
      this.error = e.message;
    }
    this.loading = false;
    this.update();
  }

  renderBody() {
    if(this.loading) return `<div class="loading">Загрузка погоды…</div>`;
    if(this.error) return `
      <div class="error">${this.error}</div>
      <button class="retry">Повторить</button>
    `;
    const c = this.data.current;
    return `
      <p>Температура: <strong>${c.temperature_2m} °C</strong></p>
      <p>Код погоды: ${c.weather_code}</p>
    `;
  }

  bindEvents() {
    super.bindEvents();
    const retryBtn = this.element.querySelector('.retry');
    if(retryBtn) retryBtn.onclick = ()=> this.fetchWeather();
  }
}
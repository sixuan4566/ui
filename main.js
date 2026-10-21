import { TodoWidget } from './TodoWidget.js';
import { WeatherWidget } from './WeatherWidget.js';
import { CurrencyWidget } from './CurrencyWidget.js';

class Dashboard {
  constructor() {
    this.widgets = [];
    this.container = document.getElementById('dashboard');
    this.nextId = 1;
    this.loadState();
    this.bindButtons();
    this.renderAll();
  }

  bindButtons() {
    document.getElementById('addTodo').onclick = ()=> this.addWidget('todo');
    document.getElementById('addWeather').onclick = ()=> this.addWidget('weather');
    document.getElementById('addCurrency').onclick = ()=> this.addWidget('currency');
  }

  addWidget(type) {
    let w;
    const id = this.nextId++;
    if(type === 'todo') w = new TodoWidget(id, false, []);
    if(type === 'weather') w = new WeatherWidget(id, false);
    if(type === 'currency') w = new CurrencyWidget(id, false);
    this.widgets.push(w);
    this.renderAll();
    this.saveState();
  }

  removeWidget(id) {
    this.widgets = this.widgets.filter(w=>w.id !== id);
    this.renderAll();
    this.saveState();
  }

  renderAll() {
    this.container.innerHTML = '';
    this.widgets.forEach(w=>{
      this.container.appendChild(w.render());
    })
  }

  saveState() {
    const state = {
      nextId: this.nextId,
      widgets: this.widgets.map(w => w.getState())
    }
    localStorage.setItem('dashState', JSON.stringify(state));
  }

  loadState() {
    const raw = localStorage.getItem('dashState');
    if(!raw) return;
    const s = JSON.parse(raw);
    this.nextId = s.nextId ?? 1;
    s.widgets.forEach(ws=>{
      let w;
      if(ws.type === 'todo'){
        w = new TodoWidget(ws.id, ws.collapsed, ws.todos ?? []);
      }else if(ws.type === 'weather'){
        w = new WeatherWidget(ws.id, ws.collapsed);
      }else if(ws.type === 'currency'){
        w = new CurrencyWidget(ws.id, ws.collapsed);
      }
      if(w) this.widgets.push(w);
    })
  }
}

window.dashboard = new Dashboard();
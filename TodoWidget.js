import { Widget } from './Widget.js';

export class TodoWidget extends Widget {
  constructor(id, collapsed = false, todos = []) {
    super(id, 'todo', '📝 Список дел');
    this.todos = todos;
    this.collapsed = collapsed;
  }

  renderBody() {
    const itemsHtml = this.todos.map((t, idx) => `
      <div class="todo-item ${t.done ? 'done' : ''}" data-idx="${idx}">
        <span>${t.text}</span>
        <div>
          <button class="todo-toggle">✓</button>
          <button class="todo-del btn-del">×</button>
        </div>
      </div>
    `).join('');

    return `
      <form class="todo-form">
        <input type="text" placeholder="Добавить задачу" required>
        <button type="submit">Добавить</button>
      </form>
      <div class="todo-list">${itemsHtml || '<p>Задач нет</p>'}</div>
    `;
  }

  bindEvents() {
    super.bindEvents();
    const form = this.element.querySelector('.todo-form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const inp = form.querySelector('input');
      const text = inp.value.trim();
      if(text) {
        this.todos.push({text, done:false});
        inp.value = '';
        this.update();
        window.dashboard.saveState();
      }
    };

    this.element.querySelectorAll('.todo-toggle').forEach(btn=>{
      btn.onclick = (ev)=>{
        const idx = +ev.target.closest('.todo-item').dataset.idx;
        this.todos[idx].done = !this.todos[idx].done;
        this.update();
        window.dashboard.saveState();
      }
    })
    this.element.querySelectorAll('.todo-del').forEach(btn=>{
      btn.onclick = (ev)=>{
        const idx = +ev.target.closest('.todo-item').dataset.idx;
        this.todos.splice(idx,1);
        this.update();
        window.dashboard.saveState();
      }
    })
  }

  getState() {
    return {
      ...super.getState(),
      todos: this.todos
    }
  }
}

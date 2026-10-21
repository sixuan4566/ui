export class Widget {
  constructor(id, type, title) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.collapsed = false;
    this.element = null;
  }

  renderHeader() {
    return `
      <div class="widget-header">
        <strong>${this.title}</strong>
        <div class="widget-actions">
          <button class="btn-collapse">${this.collapsed ? 'Развернуть' : 'Свернуть'}</button>
          <button class="btn-del">Удалить</button>
        </div>
      </div>
    `;
  }

  renderBody() {
    return '<div>Пусто</div>';
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = `widget ${this.collapsed ? 'collapsed' : ''}`;
    this.element.innerHTML = this.renderHeader() + `<div class="widget-body">${this.renderBody()}</div>`;
    this.bindEvents();
    return this.element;
  }

  bindEvents() {
    this.element.querySelector('.btn-collapse').onclick = () => this.toggleCollapse();
    this.element.querySelector('.btn-del').onclick = () => this.onRemove();
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.update();
    window.dashboard.saveState();
  }

  update() {
    const parent = this.element.parentElement;
    const newEl = this.render();
    parent.replaceChild(newEl, this.element);
  }

  onRemove() {
    window.dashboard.removeWidget(this.id);
  }

  getState() {
    return {
      id: this.id,
      type: this.type,
      collapsed: this.collapsed
    };
  }
}
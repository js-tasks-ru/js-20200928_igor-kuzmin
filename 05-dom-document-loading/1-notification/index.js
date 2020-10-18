export default class NotificationMessage {
  static oldElement;

  constructor(inputText = '', {duration = 0, type = 'success'} = {}) {
    if (NotificationMessage.oldElement) {
      NotificationMessage.oldElement.remove();
    }
    this.inputText = inputText;
    this.duration = duration;
    this.type = type;
    this.render();
  }

  getElement() {
    return `<div class="notification ${this.type}" style="--value:${this.duration}ms">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.inputText}
      </div>
    </div>
  </div>`;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getElement();
    this.element = element.firstElementChild;
    NotificationMessage.oldElement = this.element;
  }

  show(elem = document.body) {
    elem.append(this.element);
    setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

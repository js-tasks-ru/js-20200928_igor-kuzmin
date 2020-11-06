export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;

  constructor({
    url = '',
    range = {
      from: new Date(),
      to: new Date(),
    },
    formatHeading = data => data,
    label = '',
    link = ''
  } = {}) {
    this.url = new URL('https://course-js.javascript.ru/' + url);
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();
    this.loadChartData(range.from, range.to);
  }

  getColumnBody(data) {
    const maxValue = Math.max(...data);
    return data
      .map(item => {
        const scale = this.chartHeight / maxValue;
        const percent = (item / maxValue * 100).toFixed(0);
        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  get getElement() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
          </div>
          <div data-element="body" class="column-chart__chart">
          </div>
        </div>
      </div>
    `;
  }

  async loadChartData(dateFrom, dateTo) {
    this.element.classList.add('column-chart_loading');
    this.subElements.header.textContent = '';
    this.subElements.body.innerHTML = '';
    this.url.searchParams.set('from', dateFrom.toString());
    this.url.searchParams.set('to', dateTo.toString());
    const response = await fetch(this.url.toString());
    if (response.ok) {
      const jsonData = await response.json();
      this.subElements.header.textContent = this.formatHeading(
        Object.values(jsonData).reduce((accum, item) => (accum + item), 0));
      this.subElements.body.innerHTML = this.getColumnBody(Object.values(jsonData));

      this.element.classList.remove('column-chart_loading');
    }
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getElement;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  async update(dateFrom, dateTo) {
    await this.loadChartData(dateFrom, dateTo);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}

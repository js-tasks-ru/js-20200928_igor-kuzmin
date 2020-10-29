export default class SortableTable {
  element;
  subElements;
  header;
  data;
  sorted = {};

  constructor(header = [], {data = [],
    sorted = {
      id: header.find(item => item.sortable).id,
      order: 'asc'
    }} = {}) {
    this.header = header;
    this.data = data;
    this.sorted = sorted;
    this.render();
  }

  getTableElement() {
    return `<div data-element="productsContainer" class="products-list__container">
                <div class="sortable-table">
                    ${this.getHeaderRowElement()}
                    ${this.getDataBody()}
                </div>
            </div>`;
  }

  getHeaderRowElement() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.header.map(item => {
      return this.getHeaderColumnElement(item);
    }).join('')}
            </div>`;
  }

  getHeaderColumnElement({id = '', title = '', sortable = false} = {}) {
    const order = this.sorted.id === id ? this.sorted.order : 'asc';
    return `<div class="sortable-table__cell" data-id=${id} data-sortable=${sortable} data-order=${order}>
                <span>${title}</span>
                ${this.getSortArrowSpan(sortable)}
            </div>`;
  }

  getSortArrowSpan(sortable) {
    return sortable ?
      `<span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
       </span>`
      : ``;
  }

  getDataBody() {
    return `
        <div data-element="body" class="sortable-table__body">
            ${this.getDataRows(this.data)}
        </div>`;
  }

  getDataRows(data) {
    return data.map(item => {
      return `
                <a href="/products/${item.id}" class="sortable-table__row">
                    ${this.getDataRow(item)}
                </a>`;}).join('');
  }

  getDataRow(data) {
    const cellsMap = this.header.map(({id, template}) => {
      return {id, template};
    });
    return cellsMap.map(({id, template}) => {
      return template ? template(data[id]) :
        `<div class="sortable-table__cell">${data[id]}</div>`;
    }).join('');
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  render() {
    const tableElement = document.createElement('div');
    tableElement.innerHTML = this.getTableElement();
    this.element = tableElement.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.addEventListeners();
  }

  addEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.headerColumnClick);
  }

  headerColumnClick = event => {
    const column = event.target.closest('[data-sortable="true"]');
    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };
      return orders[order];
    };

    if (column) {
      const { id, order } = column.dataset;
      const sortedData = this.sortData(id, toggleOrder(order));
      const arrow = column.querySelector('.sortable-table__sort-arrow');
      column.dataset.order = toggleOrder(order);
      if (!arrow) {
        column.append(this.subElements.arrow);
      }
      this.subElements.body.innerHTML = this.getDataRows(sortedData);
    }
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll(`.sortable-table__cell[data-id]`);
    allColumns.forEach(col => {
      if (col.dataset.id === field) {
        col.dataset.order = order;
      } else {
        col.dataset.order = '';
      }
    });
    this.subElements.body.innerHTML = this.getDataRows(sortedData);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const sortType = this.header.find(value => value.id === field).sortType;
    const direction = order === 'asc' ? 1 : -1;
    return arr.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return (a[field] - b[field]) * direction;
      case 'string':
        return a[field].localeCompare(b[field], ['ru', 'en']) * direction;
      default:
        return (a[field] - b[field]) * direction;
      }
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

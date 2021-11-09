import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  /**
   * This is way of writing Documentation .This format is called JSDoc (@refer https://jsdoc.app/)
   * See last video for more info
   * @param {*} data
   * @param {*} render
   * @returns
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkUp();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkUp();
    //Logic is comparing oldMarkup with newMarkup but to do this we need to compare  String(MarkUp is in String) .To do this we use dom node Object
    const newDom = document.createRange().createContextualFragment(newMarkup);
    //Now newDom will become a new virtual DOM object that doesn't live on page but on memory(like avariable)
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //nice method
      //console.log(curEl, newEl.isEqualNode(curEl));

      //update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      //update changed Attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  //Render a spinner
  renderSpinner() {
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
        <div>
          <svg>
            <use href="${icons}.svg#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="message">
        <div>
          <svg>
            <use href="${icons}.svg#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

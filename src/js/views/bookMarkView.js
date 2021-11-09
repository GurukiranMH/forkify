import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';
class BookMarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No BookMarks yet! Find a nice recipie and bookmark it :)`;
  _message = ``;

  addHAndlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkUp() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookMarksView();

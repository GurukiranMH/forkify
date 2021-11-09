import View from './view';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipies! found for your query!please try again :)`;
  _message = ``;

  _generateMarkUp() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new ResultsView();

// https://forkify-api.herokuapp.com/v2
//API_KEY:7f8a2446-09be-46d3-9d63-d4809377c230

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import 'core-js/stable'; //polyfilling evrything else
import 'regenerator-runtime/runtime'; //polyfilling async-await
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookMarkView from './views/bookMarkView.js';
import addRecipeView from './views/addRecipeView.js';

import { MODAL_CLOSE_SEC } from './config.js';
/* if (module.hot) {
  module.hot.accept();
} */

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //0) Update resultsView to mark selected  search result
    resultsView.update(model.getSearchResultsPage());

    //1)Updating bookmarks view
    bookMarkView.update(model.state.bookmarks);
    //2.Loading recipe

    //using await bcz every async function alway returns a promise and we are not storing even though we are using await bcz it doesn't return anything but it'll update the state variable
    await model.loadRecipe(id);

    //3.Rendering recipie
    recipeView.render(model.state.recipe);
    /* we can do like this also
    const recipeView = new recipeView(model.state.recipe); */
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1)Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2)Load Search results
    //we are not storing even though we are using await bcz it doesn't return anything but it'll update the state variable.
    await model.loadSearchResults(query);

    //3)Render Results

    /* resultsView.render(model.state.search.results); */
    resultsView.render(model.getSearchResultsPage());

    //4)Render inital Pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  //1)Render New Results

  resultsView.render(model.getSearchResultsPage(goToPage));

  //2)Render new Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings(in state)
  model.updateServings(newServings);

  //update the recipe view
  /* recipeView.render(model.state.recipe); */
  //update method only update text and number in the DOM without having to re-render the page agian
  recipeView.update(model.state.recipe);
};

const contolAddBookmark = function () {
  //1) add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2)update recipeView
  recipeView.update(model.state.recipe);
  //3)render bookmarks
  bookMarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookMarkView.render(model.state.bookmarks);
};

const controlAddRecipie = async function (newRecipie) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //upload the new recipie data
    await model.uploadRecipe(newRecipie);
    //render recipe
    recipeView.render(model.state.recipe);

    //sucess message
    addRecipeView.renderMessage();

    //Render bookmarkview
    bookMarkView.render(model.state.bookmarks);

    //change id in the Url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(`${error} 😏😏`);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookMarkView.addHAndlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(contolAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipie);
};
init();

import { combineReducers } from "redux";
import collection_reducer from "./collection_reducer";
import sortBy_reducer from "./sortBy_reducer";
import filterBy_reducer from "./filterBy_reducer";
import isLoggedIn_reducer from "./isLoggedIn_reducer";
import years_reducer from "./years_reducer";
import yearsAdded_reducer from "./yearsAdded_reducer";
import genres_reducer from "./genres_reducer";
import styles_reducer from "./styles_reducer";
import cardsPerPage_reducer from "./cardsPerPage_reducer";

export const initState = {
  collection: null,
  sortBy: { sortName: "Artist A-Z" },
  filterBy:'', 
  isLoggedIn:false,
  years:null,
  yearsAdded:null,
  genres:null,
  styles:null,
  cardsPerPage:50
};

const rootReducer = combineReducers({
  collection: collection_reducer,
  years:years_reducer,
  yearsAdded:yearsAdded_reducer,
  genres:genres_reducer,
  styles:styles_reducer,
  sortBy: sortBy_reducer,
  filterBy:filterBy_reducer,
  isLoggedIn:isLoggedIn_reducer,
  cardsPerPage:cardsPerPage_reducer
});

export default rootReducer;

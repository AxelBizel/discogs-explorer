import { initState } from "./index";

export default function genres_reducer(state = initState.genres, action) {
  switch (action.type) {
    case "GET_GENRES":
      return action.payload;
    default:
      return state;
  }
}

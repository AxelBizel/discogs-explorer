import { initState } from "./index";

export default function cardsPerPage_reducer(
  state = initState.cardsPerPage,
  action
) {
  switch (action.type) {
    case "DISPLAY_COLLECTION":
      return {
        cardsPerPage: action.payload
      };
    default:
      return state;
  }
}

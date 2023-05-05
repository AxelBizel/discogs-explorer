import { initState } from "./index";

export default function filterBy_reducer(state = initState.filterBy, action) {
  switch (action.type) {
    case "FILTER_COLLECTION":
      return {
        filterBy: action.payload
      };
    default:
      return state;
  }
}

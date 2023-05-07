import { initState } from "./index";

export default function collection_count_reducer(state = initState.collection_count, action) {
  switch (action.type) {
    case "GET_COLLECTION_COUNT":
      return action.payload;
    default:
      return state;
  }
}


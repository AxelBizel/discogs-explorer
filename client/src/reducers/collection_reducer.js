import { initState } from "./index";

export default function collection_reducer(
  state = initState.collection,
  action
) {
  switch (action.type) {
    case "GET_COLLECTION":
      return action.payload;
    default:
      return state;
  }
}

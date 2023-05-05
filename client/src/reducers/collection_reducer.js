import { initState } from "./index";

export default function collection_reducer(state = initState, action) {
  switch (action.type) {
    case "GET_COLLECTION":
      return { ...state,  collection:action.payload };
    default:
      return state;
  }
}

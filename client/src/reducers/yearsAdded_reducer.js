import { initState } from "./index";

export default function yearsAdded_reducer(state = initState.yearsAdded, action) {
  switch (action.type) {
    case "GET_YEARSADDED":
      return { yearsAdded:action.payload };
    default:
      return state;
  }
}

import { initState } from "./index";

export default function years_reducer(state = initState.years, action) {
  switch (action.type) {
    case "GET_YEARS":
      return { years:action.payload };
    default:
      return state;
  }
}

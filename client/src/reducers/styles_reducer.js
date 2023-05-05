import { initState } from "./index";

export default function styles_reducer(state = initState.styles, action) {
  switch (action.type) {
    case "GET_STYLES":
      return { styles:action.payload };
    default:
      return state;
  }
}

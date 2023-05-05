import { initState } from "./index";

export default function isLoggedIn_reducer(state = initState.isLoggedIn, action) {
  switch (action.type) {
    case "RESET_LOGGED_IN":
      return {
        isLoggedIn: action.payload
      };
    default:
      return state;
  }
}

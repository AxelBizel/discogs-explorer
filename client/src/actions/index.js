import axios from "axios";

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin' : '*',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjgzMjk1MTQ5LCJleHAiOjE2ODMyOTg3NDl9.CaAFtLdwCN2058I4ka_Ru8e8SR8_knrWYCSc_dL1Wg4'
}
// axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';

export const getReleases = () => {
  return dispatch => {
    axios.post("http://127.0.0.1:8080/api/collection", null,  {
      headers: headers
    }).then(res => {
      console.log("res.data", res.data.userReleases)
      dispatch({
        type: "GET_COLLECTION",
        payload: res.data.userReleases
      });
    });
  };
};

export const getYears = () => {
  return dispatch => {
    axios.get("http://localhost:8080/api/years/").then(res => {
      dispatch({
        type: "GET_YEARS",
        payload: res.data
      });
    });
  };
};

export const getYearsAdded = () => {
  return dispatch => {
    axios.get("http://localhost:8080/api/yearsAdded/").then(res => {
      dispatch({
        type: "GET_YEARSADDED",
        payload: res.data
      });
    });
  };
};


export const getGenres = () => {
  return dispatch => {
    axios.get("http://localhost:8080/api/genres/").then(res => {
      dispatch({
        type: "GET_GENRES",
        payload: res.data
      });
    });
  };
};

export const getStyles = () => {
  return dispatch => {
    axios.get("http://localhost:8080/api/styles/").then(res => {
      dispatch({
        type: "GET_STYLES",
        payload: res.data
      });
    });
  };
};


export const sortReleases = sortBy => {
  return {
    type: "SORT_COLLECTION",
    payload: sortBy
  };
};

export const filterReleases = filterBy => {
  return {
    type: "FILTER_COLLECTION",
    payload: filterBy
  };
};


export const isLoggedIn = loggedIn => {
  return {
    type: "RESET_LOGGED_IN",
    payload: !loggedIn
  };
}



// export const getCardsPerPage = cardsPerPage => {
//   return {
//     type: "DISPLAY_COLLECTION",
//     payload: cardsPerPage
//   };
// };
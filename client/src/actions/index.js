import axios from "axios";

const token = localStorage.getItem("token");

const instance = axios.create({
  baseURL: "http://127.0.0.1:8080/api/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${token}`,
  },
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.assign("/login");
      }
      return Promise.reject(error);
    }
  }
);

export const getReleases = (page) => {
  return (dispatch) => {
    instance.post(`collection?page=${page}`).then((res) => {
      dispatch({
        type: "GET_COLLECTION",
        payload: res.data.userReleases,
      });
    });
  };
};

export const getCollectionCount = () => {
  return (dispatch) => {
    instance.post("collection-count").then((res) => {
      console.log("res.data.itemNumber", res.data.itemNumber);
      dispatch({
        type: "GET_COLLECTION_COUNT",
        payload: res.data.itemNumber,
      });
    });
  };
};

export const getYears = () => {
  return (dispatch) => {
    instance.post("collection-by-year/").then((res) => {
      dispatch({
        type: "GET_YEARS",
        payload: res.data.parsedYears,
      });
    });
  };
};

export const getYearsAdded = () => {
  return (dispatch) => {
    instance.post("collection-by-date-added/").then((res) => {
      console.log(res.data);
      dispatch({
        type: "GET_YEARSADDED",
        payload: res.data,
      });
    });
  };
};

export const getGenres = () => {
  return (dispatch) => {
    instance.post("collection-by-genres/").then((res) => {
      dispatch({
        type: "GET_GENRES",
        payload: res.data.result,
      });
    });
  };
};

export const getStyles = () => {
  return (dispatch) => {
    instance.post("collection-by-styles/").then((res) => {
      console.log("styles", res.data);
      dispatch({
        type: "GET_STYLES",
        payload: res.data,
      });
    });
  };
};

export const sortReleases = (sortBy) => {
  return {
    type: "SORT_COLLECTION",
    payload: sortBy,
  };
};

export const filterReleases = (filterBy) => {
  return {
    type: "FILTER_COLLECTION",
    payload: filterBy,
  };
};

export const isLoggedIn = (loggedIn) => {
  return {
    type: "RESET_LOGGED_IN",
    payload: !loggedIn,
  };
};

// export const getCardsPerPage = cardsPerPage => {
//   return {
//     type: "DISPLAY_COLLECTION",
//     payload: cardsPerPage
//   };
// };

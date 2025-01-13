import axios from "axios";
import { api } from "../config";

// default
axios.defaults.withCredentials = true;

axios.defaults.baseURL = api.API_URL;
// axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

console.log(
  "LOCAL STORAGE TOKEN ->",
  JSON.parse(localStorage.getItem("authUser"))
);

// content type
const token = JSON.parse(localStorage.getItem("authUser"))
  ? JSON.parse(localStorage.getItem("authUser")).token
  : null;

if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  // get = (url, params) => {
  //   let response;

  //   let paramKeys = [];

  //   if (params) {
  //     Object.keys(params).map((key) => {
  //       paramKeys.push(key + "=" + params[key]);
  //       return paramKeys;
  //     });

  //     const queryString =
  //       paramKeys && paramKeys.length ? paramKeys.join("&") : "";
  //     response = axios.get(`${url}?${queryString}`, params);
  //   } else {
  //     response = axios.get(`${url}`, params);
  //   }

  //   return response;
  // };
  /**
   * post given data to url
   */

  // get = (url) => {
  //   return axios.get(url, { withCredentials: true });
  // };

  get = (url, params) => {
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, { withCredentials: true });
    }

    return response;
  };

  create = (url, data, headers) => {
    console.log("TOKEN FOR CREATING WORKSPACE ->", token);

    return axios.post(url, data, {
      withCredentials: true,
      Authorization: token,
      headers,
    });
  };
  /**
   * Updates data
   */
  update = (url, data, headers) => {
    return axios.patch(url, data, {
      withCredentials: true,
      headers,
    });
  };

  put = (url, data) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url) => {
    return axios.delete(url, { withCredentials: true });
  };
}
const getLoggedinUser = () => {
  // const user = sessionStorage.getItem("authUser");
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser };
